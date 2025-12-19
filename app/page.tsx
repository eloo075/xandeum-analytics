'use client';

import { useQuery } from '@tanstack/react-query';
import { rpcClient } from '@/lib/rpc';
import { PNode } from '@/lib/types';
import { useState, useMemo } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { StatsCards } from '@/components/StatsCards';
import { PNodeTable } from '@/components/PNodeTable';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar } from '@/components/FilterBar';
import { RefreshButton } from '@/components/RefreshButton';
import { NetworkHealth } from '@/components/NetworkHealth';
import { StorageChart } from '@/components/StorageChart';
import { ReputationChart } from '@/components/ReputationChart';
import { RegionDistribution } from '@/components/RegionDistribution';
import { ExportButton } from '@/components/ExportButton';
import { NodeDetailModal } from '@/components/NodeDetailModal';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('reputation');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedNode, setSelectedNode] = useState<PNode | null>(null);
  const [showVisualizations, setShowVisualizations] = useState(true);

  const { data: pnodes = [], isLoading, error, refetch } = useQuery<PNode[]>({
    queryKey: ['pnodes'],
    queryFn: () => rpcClient.getPNodes(),
  });

  const filteredAndSortedPNodes = useMemo(() => {
    let filtered = [...pnodes];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (node) =>
          node.pubkey.toLowerCase().includes(query) ||
          node.id.toLowerCase().includes(query) ||
          node.address?.toLowerCase().includes(query) ||
          node.region?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((node) => node.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy as keyof PNode] || 0;
      let bVal: any = b[sortBy as keyof PNode] || 0;

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [pnodes, searchQuery, statusFilter, sortBy, sortOrder]);

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />
        
        <div className="mt-8 space-y-6">
          <StatsCards pnodes={pnodes} />
          
          <NetworkHealth pnodes={pnodes} />

          {showVisualizations && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StorageChart pnodes={pnodes} />
              <ReputationChart pnodes={pnodes} />
              <div className="lg:col-span-2">
                <RegionDistribution pnodes={pnodes} />
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
              <div className="flex-1 w-full sm:w-auto">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search by pubkey, ID, address, or region..."
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                <FilterBar
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                  sortBy={sortBy}
                  onSortByChange={setSortBy}
                  sortOrder={sortOrder}
                  onSortOrderChange={setSortOrder}
                />
                <ExportButton pnodes={filteredAndSortedPNodes} />
                <button
                  onClick={() => setShowVisualizations(!showVisualizations)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors text-sm"
                >
                  {showVisualizations ? 'Hide Charts' : 'Show Charts'}
                </button>
                <RefreshButton onRefresh={() => refetch()} isLoading={isLoading} />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200">
                  Error loading pNodes: {error instanceof Error ? error.message : 'Unknown error'}
                </p>
                <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                  The dashboard fetches pNodes from pRPC gossip via server-side seeds. If you self-host, set XANDEUM_PRPC_SEEDS (optional) and retry.
                </p>
              </div>
            )}

            <PNodeTable
              pnodes={filteredAndSortedPNodes}
              isLoading={isLoading}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onNodeClick={setSelectedNode}
            />
          </div>
        </div>

        <NodeDetailModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
        
        <Footer />
      </div>
    </main>
  );
}



