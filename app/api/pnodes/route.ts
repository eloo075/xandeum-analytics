import { NextResponse } from 'next/server';
import geoip from 'geoip-lite';
import { DEFAULT_SEED_IPS, getPods, getPodsWithStats, parseSeeds, toMillisMaybe, type Pod } from '@/lib/prpc';
import type { PNode } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function extractHost(address?: string): string | null {
  if (!address) return null;

  if (address.includes('://')) {
    try {
      return new URL(address).hostname;
    } catch {
      // fallthrough
    }
  }

  const noPath = address.split('/')[0];

  if (noPath.startsWith('[')) {
    const end = noPath.indexOf(']');
    if (end > 1) return noPath.slice(1, end);
  }

  const parts = noPath.split(':');
  return parts[0] || null;
}

function geoRegionFromAddress(address?: string): string | undefined {
  const host = extractHost(address);
  if (!host) return undefined;

  // geoip-lite only works with IPs (not domains). If it's a domain, skip.
  if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return undefined;

  const geo = geoip.lookup(host);
  if (!geo) return undefined;

  return geo.region ? `${geo.country}-${geo.region}` : geo.country;
}

function deriveStatus(pod: Pod, nowMs: number): PNode['status'] {
  const lastSeenMs = toMillisMaybe(pod.last_seen_timestamp);
  const ageMs = nowMs - lastSeenMs;

  if (ageMs <= 2 * 60 * 1000) return 'online';
  if (ageMs <= 10 * 60 * 1000) return 'syncing';
  return 'offline';
}

function normalizePod(pod: Pod, nowMs: number): PNode {
  const pubkey = pod.pubkey || '';
  const lastSeen = toMillisMaybe(pod.last_seen_timestamp);

  return {
    id: pubkey || `unknown-${lastSeen}`,
    pubkey,
    address: pod.address,
    version: pod.version,
    uptime: pod.uptime,
    storageCapacity: pod.storage_committed,
    storageUsed: pod.storage_used,
    status: deriveStatus(pod, nowMs),
    lastSeen,
    region: geoRegionFromAddress(pod.address),
    rpcPort: pod.rpc_port,
    isPublic: pod.is_public,
    storageUsagePercent: pod.storage_usage_percent,
    raw: pod,
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const withStats = url.searchParams.get('withStats') === '1' || url.searchParams.get('withStats') === 'true';
  const timeoutMs = Math.min(Math.max(Number(url.searchParams.get('timeoutMs') || 5000), 1000), 30_000);

  const seedsFromQuery = parseSeeds(url.searchParams.get('seeds'));
  const seedsFromEnv = parseSeeds(process.env.XANDEUM_PRPC_SEEDS);
  const seeds = (seedsFromQuery.length ? seedsFromQuery : seedsFromEnv.length ? seedsFromEnv : DEFAULT_SEED_IPS).slice(0, 12);

  const nowMs = Date.now();

  const results = await Promise.allSettled(
    seeds.map(async (seedIp) => {
      const res = withStats ? await getPodsWithStats(seedIp, timeoutMs) : await getPods(seedIp, timeoutMs);
      return { seedIp, res };
    })
  );

  const ok: Array<{ seedIp: string; res: { pods: Pod[] } }> = [];
  const errors: Array<{ seedIp: string; error: string }> = [];

  for (const r of results) {
    if (r.status === 'fulfilled') ok.push(r.value);
    else errors.push({ seedIp: 'unknown', error: r.reason?.message || String(r.reason) });
  }

  const byPubkey = new Map<string, PNode>();
  for (const { res } of ok) {
    for (const pod of res.pods || []) {
      const node = normalizePod(pod, nowMs);
      if (!node.pubkey) continue;

      const existing = byPubkey.get(node.pubkey);
      if (!existing || (existing.lastSeen || 0) < (node.lastSeen || 0)) {
        byPubkey.set(node.pubkey, node);
      }
    }
  }

  const pnodes = Array.from(byPubkey.values()).sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0));

  return NextResponse.json({
    pnodes,
    meta: {
      fetchedAt: nowMs,
      withStats,
      timeoutMs,
      seedsQueried: seeds,
      seedsOk: ok.map((x) => x.seedIp),
      errors: errors.slice(0, 20),
    },
  });
}
