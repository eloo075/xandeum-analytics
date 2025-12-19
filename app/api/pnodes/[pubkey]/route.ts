import { NextResponse } from 'next/server';
import geoip from 'geoip-lite';
import { DEFAULT_SEED_IPS, getPods, parseSeeds, toMillisMaybe, type Pod } from '@/lib/prpc';
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

  if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return undefined;

  const geo = geoip.lookup(host);
  if (!geo) return undefined;

  return geo.region ? `${geo.country}-${geo.region}` : geo.country;
}

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
    region: geoRegionFromAddress(pod.address),
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
