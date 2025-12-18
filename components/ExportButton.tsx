'use client';

import { PNode } from '@/lib/types';
import { Download } from 'lucide-react';
import { useMemo } from 'react';

interface ExportButtonProps {
  pnodes: PNode[];
}

export function ExportButton({ pnodes }: ExportButtonProps) {
  const exportToCSV = () => {
    const headers = ['ID', 'Public Key', 'Address', 'Status', 'Region', 'Storage Capacity (TB)', 'Storage Used (TB)', 'Reputation', 'Uptime (seconds)', 'Latency (ms)', 'Last Seen', 'Version'];
    
    const rows = pnodes.map(node => [
      node.id,
      node.pubkey,
      node.address || '',
      node.status || '',
      node.region || '',
      (node.storageCapacity || 0).toFixed(2),
      (node.storageUsed || 0).toFixed(2),
      (node.reputation || 0).toFixed(2),
      node.uptime || 0,
      node.latency || '',
      node.lastSeen ? new Date(node.lastSeen).toISOString() : '',
      node.version || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `xandeum-pnodes-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(pnodes, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `xandeum-pnodes-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={exportToCSV}
        className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm">Export CSV</span>
      </button>
      <button
        onClick={exportToJSON}
        className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm">Export JSON</span>
      </button>
    </div>
  );
}



