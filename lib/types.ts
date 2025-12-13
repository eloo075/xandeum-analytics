// Type definitions for Xandeum pNode data

export interface PNode {
  id: string;
  pubkey: string;
  address?: string;
  version?: string;
  uptime?: number;
  storageCapacity?: number;
  storageUsed?: number;
  reputation?: number;
  status?: 'online' | 'offline' | 'syncing';
  lastSeen?: number;
  region?: string;
  latency?: number;
  [key: string]: any; // Allow for additional fields from RPC
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

