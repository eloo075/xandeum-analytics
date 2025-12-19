'use client';

import { PNode } from '@/lib/types';
import { formatBytes, formatDuration, formatRelativeTime, truncatePubkey } from '@/lib/utils';
import { X, Server, HardDrive, Clock, MapPin, Activity, TrendingUp, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NodeDetailModalProps {
  node: PNode | null;
  onClose: () => void;
}

export function NodeDetailModal({ node, onClose }: NodeDetailModalProps) {
  if (!node) return null;

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
  };  const storageUtilization = (
    node.storageUsagePercent ??
    (node.storageCapacity ? ((node.storageUsed || 0) / node.storageCapacity) * 100 : 0)
  ).toFixed(1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Node Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Status</label>
              <div className="mt-1">
                <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-sm font-medium', getStatusColor(node.status))}>
                  {node.status || 'unknown'}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Node ID</label>
              <p className="mt-1 text-slate-900 dark:text-white font-mono text-sm">{node.id}</p>
            </div>
          </div>

          {/* Public Key */}
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Public Key</label>
            <p className="mt-1 text-slate-900 dark:text-white font-mono text-sm break-all">{node.pubkey}</p>
          </div>

          {/* Address and Region */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Address
              </label>
              <p className="mt-1 text-slate-900 dark:text-white">{node.address || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Region
              </label>
              <p className="mt-1 text-slate-900 dark:text-white">{node.region || 'N/A'}</p>
            </div>
          </div>

          {/* Storage Information */}
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 mb-3">
              <HardDrive className="w-4 h-4" />
              Storage
            </label>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Used</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatBytes(node.storageUsed || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Capacity</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatBytes(node.storageCapacity || 0)}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3 mt-2">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all"
                  style={{ width: `${storageUtilization}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500 text-right">
                {storageUtilization}% utilized
              </p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4" />
                Reputation
              </label>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {(node.reputation || 0).toFixed(1)}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4" />
                Uptime
              </label>
              <p className="text-2xl font-bold text-time">
                {formatDuration(node.uptime || 0)}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4" />
                Latency
              </label>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {node.latency ? `${node.latency}ms` : 'N/A'}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Version</label>
              <p className="mt-1 text-slate-900 dark:text-white">{node.version || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Last Seen</label>
              <p className="mt-1 text-time">
                {node.lastSeen ? formatRelativeTime(node.lastSeen) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





