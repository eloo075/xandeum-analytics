import { PNode } from '@/lib/types';
import {
  formatBytes,
  formatDuration,
  formatRelativeTime,
  truncatePubkey,
  cn,
} from '@/lib/utils';
import { Server, Clock, MapPin, ArrowUp, ArrowDown } from 'lucide-react';

interface PNodeTableProps {
  pnodes: PNode[];
  isLoading?: boolean;
  onNodeClick?: (node: PNode) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function PNodeTable({ pnodes, isLoading, onNodeClick, sortBy, sortOrder }: PNodeTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-slate-600 dark:text-slate-400">Loading pNodes...</span>
      </div>
    );
  }

  if (pnodes.length === 0) {
    return (
      <div className="text-center py-12">
        <Server className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">No pNodes found</p>
      </div>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'offline':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'syncing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Status
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Public Key
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Address
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span className="inline-flex items-center gap-1">
                Region
                {sortBy === 'region' && (
                  sortOrder === 'asc' ? (
                    <ArrowUp className="w-3.5 h-3.5 text-primary-600" />
                  ) : (
                    <ArrowDown className="w-3.5 h-3.5 text-primary-600" />
                  )
                )}
              </span>
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span className="inline-flex items-center gap-1">
                Storage
                {(sortBy === 'storageCapacity' || sortBy === 'storageUsed') && (
                  <>
                    {sortOrder === 'asc' ? (
                      <ArrowUp className="w-3.5 h-3.5 text-primary-600" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5 text-primary-600" />
                    )}
                    <span className="text-[10px] uppercase tracking-wide text-slate-500 ml-0.5">
                      {sortBy === 'storageCapacity' ? 'Cap' : 'Used'}
                    </span>
                  </>
                )}
              </span>
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span className="inline-flex items-center gap-1">
                Reputation
                {sortBy === 'reputation' && (
                  sortOrder === 'asc' ? (
                    <ArrowUp className="w-3.5 h-3.5 text-primary-600" />
                  ) : (
                    <ArrowDown className="w-3.5 h-3.5 text-primary-600" />
                  )
                )}
              </span>
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span className="inline-flex items-center gap-1">
                Uptime
                {sortBy === 'uptime' && (
                  sortOrder === 'asc' ? (
                    <ArrowUp className="w-3.5 h-3.5 text-primary-600" />
                  ) : (
                    <ArrowDown className="w-3.5 h-3.5 text-primary-600" />
                  )
                )}
              </span>
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span className="inline-flex items-center gap-1">
                Latency
                {sortBy === 'latency' && (
                  sortOrder === 'asc' ? (
                    <ArrowUp className="w-3.5 h-3.5 text-primary-600" />
                  ) : (
                    <ArrowDown className="w-3.5 h-3.5 text-primary-600" />
                  )
                )}
              </span>
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Last Seen
            </th>
          </tr>
        </thead>
        <tbody>
          {pnodes.map((node, index) => (
            <tr
              key={node.id || index}
              onClick={() => onNodeClick?.(node)}
              className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                onNodeClick ? 'cursor-pointer' : ''
              }`}
            >
              <td className="py-3 px-4">
                <span
                  className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusColor(node.status)
                  )}
                >
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full mr-1.5',
                      node.status === 'online'
                        ? 'bg-green-500'
                        : node.status === 'offline'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    )}
                  />
                  {node.status || 'unknown'}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-slate-900 dark:text-white">
                    {truncatePubkey(node.pubkey)}
                  </code>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                {node.address || '-'}
              </td>
              <td className="py-3 px-4">
                {node.region ? (
                  <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4" />
                    {node.region}
                  </div>
                ) : (
                  '-'
                )}
              </td>
              <td className="py-3 px-4">
                <div className="text-sm">
                  <div className="text-slate-900 dark:text-white font-medium">
                    {formatBytes((node.storageUsed || 0) * 1024 * 1024 * 1024 * 1024)} /{' '}
                    {formatBytes((node.storageCapacity || 0) * 1024 * 1024 * 1024 * 1024)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {node.storageCapacity
                      ? (
                          ((node.storageUsed || 0) / node.storageCapacity) *
                          100
                        ).toFixed(1)
                      : 0}
                    % used
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {(node.reputation || 0).toFixed(1)}
                  </span>
                  <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600 rounded-full"
                      style={{ width: `${Math.min((node.reputation || 0), 100)}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-1 text-sm text-time">
                  <Clock className="w-4 h-4" />
                  {formatDuration(node.uptime || 0)}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {node.latency ? `${node.latency}ms` : '-'}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-time">
                  {node.lastSeen ? formatRelativeTime(node.lastSeen) : '-'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

