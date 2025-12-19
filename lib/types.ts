// Type definitions for Xandeum pNode data

export interface PNode {
  id: string;
  pubkey: string;
  address?: string;
  version?: string;
  uptime?: number;
  /**
   * Storage capacity in BYTES (as returned by pRPC, e.g. `storage_committed`)
   */
  storageCapacity?: number;
  /**
   * Storage used in BYTES (as returned by pRPC, e.g. `storage_used`)
   */
  storageUsed?: number;
  reputation?: number;
  status?: 'online' | 'offline' | 'syncing';
  lastSeen?: number;
  region?: string;
  latency?: number;
  rpcPort?: number;
  isPublic?: boolean;
  storageUsagePercent?: number;
  raw?: unknown;
  [key: string]: any; // Allow for additional fields
}

export interface PNodeStats {
  totalNodes: number;
  onlineNodes: number;
  offlineNodes: number;
  totalStorage: number;
  usedStorage: number;
  averageReputation: number;
  averageUptime: number;
}

export interface RPCResponse<T> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
  };
}
