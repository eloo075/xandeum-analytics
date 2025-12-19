import 'server-only';

import axios from 'axios';

/**
 * Minimal server-side pRPC (pNode RPC) client for Xandeum.
 *
 * Based on the open-source `xandeum-prpc` JS client:
 * - Default pRPC port: 6000
 * - JSON-RPC endpoint: http://<seed-ip>:6000/rpc
 * - Methods: `get-pods`, `get-pods-with-stats`, `get-stats`
 */

export interface Pod {
  address?: string;
  is_public?: boolean;
  last_seen_timestamp: number;
  pubkey?: string;
  rpc_port?: number;
  storage_committed?: number;
  storage_usage_percent?: number;
  storage_used?: number;
  uptime?: number;
  version?: string;
  // allow forwards-compatible fields
  [key: string]: unknown;
}

export interface PodsResponse {
  pods: Pod[];
  total_count: number;
}

export interface NodeStats {
  active_streams: number;
  cpu_percent: number;
  current_index: number;
  file_size: number;
  last_updated: number;
  packets_received: number;
  packets_sent: number;
  ram_total: number;
  ram_used: number;
  total_bytes: number;
  total_pages: number;
  uptime: number;
}

interface RpcRequest {
  jsonrpc: '2.0';
  method: string;
  id: number;
  params?: unknown[];
}

interface RpcResponse<T> {
  jsonrpc: '2.0';
  result?: T;
  error?: { code: number; message: string };
  id: number;
}

export class PrpcError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PrpcError';
  }
}

export const DEFAULT_PRPC_PORT = 6000;

// Taken from `xandeum-prpc` JS client defaults.
export const DEFAULT_SEED_IPS: string[] = [
  '173.212.220.65',
  '161.97.97.41',
  '192.190.136.36',
  '192.190.136.38',
  '207.244.255.1',
  '192.190.136.28',
  '192.190.136.29',
  '173.212.203.145',
];

export function parseSeeds(input?: string | null): string[] {
  if (!input) return [];
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function toMillisMaybe(ts: number): number {
  // Accept both seconds and milliseconds.
  // - seconds since epoch: ~1.7e9
  // - milliseconds since epoch: ~1.7e12
  return ts > 10_000_000_000 ? ts : ts * 1000;
}

export function prpcUrlForSeed(seedIp: string): string {
  return `http://${seedIp}:${DEFAULT_PRPC_PORT}/rpc`;
}

export async function prpcCall<T>(seedIp: string, method: string, timeoutMs: number): Promise<T> {
  const request: RpcRequest = { jsonrpc: '2.0', method, id: 1 };

  try {
    // NOTE: Node's built-in fetch() rejects port 6000 as a "bad port" (per Fetch spec).
    // We use axios (Node http/https) to allow requests to :6000.
    const res = await axios.post<RpcResponse<T>>(prpcUrlForSeed(seedIp), request, {
      headers: { 'Content-Type': 'application/json' },
      timeout: timeoutMs,
      validateStatus: () => true,
    });

    if (res.status < 200 || res.status >= 300) {
      throw new PrpcError(`HTTP ${res.status} from seed ${seedIp}`);
    }

    const json = res.data as RpcResponse<T>;
    if (json.error) throw new PrpcError(`pRPC error from seed ${seedIp}: ${json.error.message}`);
    if (json.result === undefined) throw new PrpcError(`No result from seed ${seedIp} (${method})`);
    return json.result;
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
      throw new PrpcError(`Timeout after ${timeoutMs}ms (${seedIp})`);
    }
    throw err;
  }
}

export async function getPods(seedIp: string, timeoutMs: number): Promise<PodsResponse> {
  return prpcCall<PodsResponse>(seedIp, 'get-pods', timeoutMs);
}

export async function getPodsWithStats(seedIp: string, timeoutMs: number): Promise<PodsResponse> {
  return prpcCall<PodsResponse>(seedIp, 'get-pods-with-stats', timeoutMs);
}

export async function getStats(seedIp: string, timeoutMs: number): Promise<NodeStats> {
  return prpcCall<NodeStats>(seedIp, 'get-stats', timeoutMs);
}
