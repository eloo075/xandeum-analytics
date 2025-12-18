import { NextResponse } from 'next/server';
import { DEFAULT_SEED_IPS, getPods, parseSeeds, toMillisMaybe, type Pod } from '@/lib/prpc';
import type { PNode } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function normalizePodToNode(pod: Pod): PNode {
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
    lastSeen,
    rpcPort: pod.rpc_port,
    isPublic: pod.is_public,
    storageUsagePercent: pod.storage_usage_percent,
    raw: pod,
  };
}

export async function GET(req: Request, { params }: { params: { pubkey: string } }) {
  const url = new URL(req.url);
  const pubkey = params.pubkey;

  const timeoutMs = Math.min(Math.max(Number(url.searchParams.get('timeoutMs') || 5000), 1000), 30_000);

  const seedsFromQuery = parseSeeds(url.searchParams.get('seeds'));
  const seedsFromEnv = parseSeeds(process.env.XANDEUM_PRPC_SEEDS);
  const seeds = (seedsFromQuery.length ? seedsFromQuery : seedsFromEnv.length ? seedsFromEnv : DEFAULT_SEED_IPS).slice(0, 12);

  for (const seedIp of seeds) {
    try {
      const res = await getPods(seedIp, timeoutMs);
      const found = res.pods.find((p) => p.pubkey === pubkey);
      if (found) {
        return NextResponse.json({ pnode: normalizePodToNode(found), meta: { seedIp } });
      }
    } catch {
      // ignore and continue
    }
  }

  return NextResponse.json({ error: `pNode not found in gossip: ${pubkey}` }, { status: 404 });
}
