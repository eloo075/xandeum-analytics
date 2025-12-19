import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PNode, PNodeStats } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format seconds to human readable duration
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

/**
 * Format timestamp to relative time
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

/**
 * Calculate statistics from pNodes array
 */
export function calculateStats(pnodes: PNode[]): PNodeStats {
  if (pnodes.length === 0) {
    return {
      totalNodes: 0,
      onlineNodes: 0,
      offlineNodes: 0,
      totalStorage: 0,
      usedStorage: 0,
      averageReputation: 0,
      averageUptime: 0,
    };
  }

  const onlineNodes = pnodes.filter(n => n.status === 'online').length;
  const offlineNodes = pnodes.filter(n => n.status === 'offline').length;
  
  const totalStorage = pnodes.reduce((sum, n) => sum + (n.storageCapacity || 0), 0);
  const usedStorage = pnodes.reduce((sum, n) => sum + (n.storageUsed || 0), 0);
  
  const avgReputation = pnodes.reduce((sum, n) => sum + (n.reputation || 0), 0) / pnodes.length;
  const avgUptime = pnodes.reduce((sum, n) => sum + (n.uptime || 0), 0) / pnodes.length;

  return {
    totalNodes: pnodes.length,
    onlineNodes,
    offlineNodes,
    totalStorage,
    usedStorage,
    averageReputation: avgReputation,
    averageUptime: avgUptime,
  };
}

/**
 * Truncate public key for display
 */
export function truncatePubkey(pubkey: string, start: number = 8, end: number = 8): string {
  if (pubkey.length <= start + end) return pubkey;
  return `${pubkey.substring(0, start)}...${pubkey.substring(pubkey.length - end)}`;
}



