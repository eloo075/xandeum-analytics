// Xandeum pNode "client" used by the UI.
//
// Important: We do NOT call pRPC from the browser (mixed-content/CORS issues).
// Instead, we call our own Next.js API routes which query pRPC seeds server-side.

import { PNode } from './types';

type PNodesApiResponse = { pnodes: PNode[] };
type PNodeApiResponse = { pnode: PNode };

class XandeumRPC {
  async getPNodes(): Promise<PNode[]> {
    const res = await fetch('/api/pnodes?withStats=1', { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load pNodes (HTTP ${res.status})`);
    const json = (await res.json()) as PNodesApiResponse;
    return Array.isArray(json.pnodes) ? json.pnodes : [];
  }

  async getPNodeInfo(pubkey: string): Promise<PNode | null> {
    const res = await fetch(`/api/pnodes/${encodeURIComponent(pubkey)}`, { cache: 'no-store' });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to load pNode info (HTTP ${res.status})`);
    const json = (await res.json()) as PNodeApiResponse;
    return json.pnode || null;
  }
}

export const rpcClient = new XandeumRPC();
