import express from 'express';
import axios from 'axios';

const app = express();

const PORT = Number(process.env.PORT || 3000);
const DEFAULT_PRPC_PORT = Number(process.env.XANDEUM_PRPC_PORT || 6000);

function parseSeeds(input) {
  if (!input) return [];
  return String(input)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function prpcUrlForSeed(seedIp) {
  return `http://${seedIp}:${DEFAULT_PRPC_PORT}/rpc`;
}

function toMillisMaybe(ts) {
  // Accept both seconds and milliseconds.
  // - seconds since epoch: ~1.7e9
  // - milliseconds since epoch: ~1.7e12
  return ts > 10_000_000_000 ? ts : ts * 1000;
}

function deriveStatus(lastSeenMs, nowMs) {
  const ageMs = nowMs - lastSeenMs;
  if (ageMs <= 2 * 60 * 1000) return 'online';
  if (ageMs <= 10 * 60 * 1000) return 'syncing';
  return 'offline';
}

async function prpcCall(seedIp, method, timeoutMs) {
  const request = { jsonrpc: '2.0', method, id: 1 };

  const res = await axios.post(prpcUrlForSeed(seedIp), request, {
    headers: { 'Content-Type': 'application/json' },
    timeout: timeoutMs,
    validateStatus: () => true,
  });

  if (res.status < 200 || res.status >= 300) {
    throw new Error(`HTTP ${res.status} from seed ${seedIp}`);
  }

  const json = res.data;
  if (json?.error) throw new Error(`pRPC error from seed ${seedIp}: ${json.error.message || 'unknown error'}`);
  if (json?.result === undefined) throw new Error(`No result from seed ${seedIp} (${method})`);
  return json.result;
}

async function getPods(seedIp, timeoutMs, withStats) {
  return prpcCall(seedIp, withStats ? 'get-pods-with-stats' : 'get-pods', timeoutMs);
}

let lastGood = { fetchedAt: 0, pnodes: [], meta: { source: 'empty' } };
const CACHE_MS = Number(process.env.CACHE_MS || 60_000);

app.get('/health', (_req, res) => {
  const seedsFromEnv = parseSeeds(process.env.XANDEUM_PRPC_SEEDS);
  res.json({
    ok: true,
    now: Date.now(),
    seedsConfigured: seedsFromEnv.length,
    cacheAgeMs: lastGood.fetchedAt ? Date.now() - lastGood.fetchedAt : null,
  });
});

app.get('/pnodes', async (req, res) => {
  const withStats = req.query.withStats === '1' || req.query.withStats === 'true';
  const timeoutMs = Math.min(Math.max(Number(req.query.timeoutMs || 5000), 1000), 30_000);

  const seedsFromQuery = parseSeeds(req.query.seeds);
  const seedsFromEnv = parseSeeds(process.env.XANDEUM_PRPC_SEEDS);
  const seeds = (seedsFromQuery.length ? seedsFromQuery : seedsFromEnv).slice(0, 12);

  if (!seeds.length) {
    return res.status(500).json({
      pnodes: [],
      error: 'No seeds configured',
      details: 'Set XANDEUM_PRPC_SEEDS on the proxy service',
    });
  }

  const now = Date.now();

  if (lastGood.pnodes.length && now - lastGood.fetchedAt < CACHE_MS) {
    return res.json({
      pnodes: lastGood.pnodes,
      meta: { ...lastGood.meta, source: 'cache', cacheAgeMs: now - lastGood.fetchedAt },
    });
  }

  try {
    const results = await Promise.allSettled(
      seeds.map(async (seedIp) => {
        const podsResponse = await getPods(seedIp, timeoutMs, withStats);
        return { seedIp, podsResponse };
      })
    );

    const ok = [];
    const errors = [];

    for (const r of results) {
      if (r.status === 'fulfilled') ok.push(r.value);
      else errors.push({ seedIp: 'unknown', error: r.reason?.message || String(r.reason) });
    }

    const byPubkey = new Map();

    for (const { podsResponse } of ok) {
      for (const pod of podsResponse?.pods || []) {
        const pubkey = pod.pubkey || '';
        if (!pubkey) continue;
        const lastSeenMs = toMillisMaybe(Number(pod.last_seen_timestamp || 0));
        const status = deriveStatus(lastSeenMs, now);

        const existing = byPubkey.get(pubkey);
        if (!existing || (existing.lastSeen || 0) < (lastSeenMs || 0)) {
          byPubkey.set(pubkey, {
            id: pubkey,
            pubkey,
            address: pod.address,
            version: pod.version,
            uptime: pod.uptime,
            storageCapacity: pod.storage_committed,
            storageUsed: pod.storage_used,
            lastSeen: lastSeenMs,
            status,
            rpcPort: pod.rpc_port,
            isPublic: pod.is_public,
            storageUsagePercent: pod.storage_usage_percent,
            raw: pod,
          });
        }
      }
    }

    const pnodes = Array.from(byPubkey.values()).sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0));

    lastGood = {
      fetchedAt: now,
      pnodes,
      meta: {
        fetchedAt: now,
        withStats,
        timeoutMs,
        seedsQueried: seeds,
        seedsOk: ok.map((x) => x.seedIp),
        errors: errors.slice(0, 20),
      },
    };

    return res.json({ pnodes: lastGood.pnodes, meta: { ...lastGood.meta, source: 'live' } });
  } catch (e) {
    if (lastGood.pnodes.length) {
      return res.json({
        pnodes: lastGood.pnodes,
        meta: { ...lastGood.meta, source: 'cache_on_error', cacheAgeMs: now - lastGood.fetchedAt },
      });
    }

    return res.status(500).json({ pnodes: [], error: 'Error loading pNodes', details: String(e?.message || e) });
  }
});

app.listen(PORT, () => {
  console.log(`xandeum-pnode-proxy listening on :${PORT}`);
});
