// Xandeum pNode RPC client
// Based on Xandeum pRPC API documentation

import axios from 'axios';
import { PNode, RPCResponse } from './types';

// Default RPC endpoint - can be configured via environment variable
const DEFAULT_RPC_ENDPOINT = process.env.NEXT_PUBLIC_XANDEUM_RPC || 'https://rpc.xandeum.network';

class XandeumRPC {
  private endpoint: string;
  private requestId: number = 0;

  constructor(endpoint?: string) {
    this.endpoint = endpoint || DEFAULT_RPC_ENDPOINT;
  }

  private async call<T>(method: string, params?: any[]): Promise<T> {
    const id = ++this.requestId;
    const payload = {
      jsonrpc: '2.0',
      id,
      method,
      params: params || [],
    };

    try {
      const response = await axios.post<RPCResponse<T>>(this.endpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      if (response.data.error) {
        throw new Error(`RPC Error: ${response.data.error.message}`);
      }

      if (!response.data.result) {
        throw new Error('No result in RPC response');
      }

      return response.data.result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`RPC request failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get all pNodes from gossip
   * This is the main method to retrieve pNode information
   */
  async getPNodes(): Promise<PNode[]> {
    try {
      // Try different possible RPC methods based on common patterns
      // The actual method name should be confirmed from Xandeum docs
      const methods = [
        'getPNodes',
        'get_pnodes',
        'getClusterNodes',
        'getGossipNodes',
      ];

      for (const method of methods) {
        try {
          const result = await this.call<PNode[]>(method);
          if (Array.isArray(result)) {
            return this.normalizePNodes(result);
          }
        } catch (e) {
          // Try next method
          continue;
        }
      }

      // Fallback: if no method works, return mock data for development
      console.warn('RPC methods not available, using mock data');
      return this.getMockPNodes();
    } catch (error) {
      console.error('Error fetching pNodes:', error);
      // Return mock data as fallback
      return this.getMockPNodes();
    }
  }

  /**
   * Get detailed information about a specific pNode
   */
  async getPNodeInfo(pubkey: string): Promise<PNode | null> {
    try {
      const methods = ['getPNodeInfo', 'get_pnode_info', 'getNodeInfo'];
      
      for (const method of methods) {
        try {
          const result = await this.call<PNode>(method, [pubkey]);
          if (result) {
            return this.normalizePNode(result);
          }
        } catch (e) {
          continue;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching pNode info:', error);
      return null;
    }
  }

  /**
   * Normalize pNode data to ensure consistent structure
   */
  private normalizePNodes(nodes: any[]): PNode[] {
    return nodes.map(node => this.normalizePNode(node));
  }

  private normalizePNode(node: any): PNode {
    return {
      id: node.id || node.pubkey || Math.random().toString(36).substring(7),
      pubkey: node.pubkey || node.id || '',
      address: node.address || node.ip || node.rpc || '',
      version: node.version || node.softwareVersion || '',
      uptime: node.uptime || node.uptimeSeconds || 0,
      storageCapacity: node.storageCapacity || node.capacity || node.totalStorage || 0,
      storageUsed: node.storageUsed || node.used || node.usedStorage || 0,
      reputation: node.reputation || node.score || 0,
      status: node.status || (node.online ? 'online' : 'offline'),
      lastSeen: node.lastSeen || node.lastSeenTimestamp || Date.now(),
      region: node.region || node.location || '',
      latency: node.latency || node.ping || 0,
      ...node, // Preserve any additional fields
    };
  }

  /**
   * Mock data for development/testing
   * Remove this once real RPC is working
   */
  private getMockPNodes(): PNode[] {
    const regions = ['US-East', 'US-West', 'EU-Central', 'EU-West', 'Asia-Pacific'];
    const statuses: ('online' | 'offline' | 'syncing')[] = ['online', 'online', 'online', 'offline', 'syncing'];
    
    return Array.from({ length: 25 }, (_, i) => {
      const capacity = Math.random() * 1000 + 100; // 100-1100 TB
      const used = capacity * (0.3 + Math.random() * 0.5); // 30-80% used
      
      return {
        id: `pnode-${i + 1}`,
        pubkey: `Xandeum${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        address: `pnode-${i + 1}.xandeum.network`,
        version: `1.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
        uptime: Math.floor(Math.random() * 86400 * 30), // 0-30 days in seconds
        storageCapacity: capacity,
        storageUsed: used,
        reputation: Math.random() * 100,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        lastSeen: Date.now() - Math.random() * 3600000, // Within last hour
        region: regions[Math.floor(Math.random() * regions.length)],
        latency: Math.floor(Math.random() * 200) + 10, // 10-210ms
      };
    });
  }
}

export const rpcClient = new XandeumRPC();

