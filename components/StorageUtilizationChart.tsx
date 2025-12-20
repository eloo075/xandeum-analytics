'use client';

import { PNode } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Gauge } from 'lucide-react';
import { useMemo } from 'react';

interface StorageUtilizationChartProps {
  pnodes: PNode[];
}

type Bucket = { label: string; count: number };

function getUtilPercent(n: PNode): number | null {
  if (typeof n.storageUsagePercent === 'number') return n.storageUsagePercent;
  if (typeof n.storageCapacity === 'number' && n.storageCapacity > 0) {
    const used = typeof n.storageUsed === 'number' ? n.storageUsed : 0;
    return (used / n.storageCapacity) * 100;
  }
  return null;
}

export function StorageUtilizationChart({ pnodes }: StorageUtilizationChartProps) {
  const data = useMemo(() => {
    const buckets: Bucket[] = [
      { label: '0%', count: 0 },
      { label: '0–1%', count: 0 },
      { label: '1–10%', count: 0 },
      { label: '10–50%', count: 0 },
      { label: '50%+', count: 0 },
      { label: 'Unknown', count: 0 },
    ];

    for (const n of pnodes) {
      const pct = getUtilPercent(n);
      if (pct === null || Number.isNaN(pct)) {
        buckets[5].count++;
        continue;
      }

      if (pct === 0) buckets[0].count++;
      else if (pct < 1) buckets[1].count++;
      else if (pct < 10) buckets[2].count++;
      else if (pct < 50) buckets[3].count++;
      else buckets[4].count++;
    }

    return buckets;
  }, [pnodes]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="w-5 h-5 text-primary-600" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Storage Utilization</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
          <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
          <Bar dataKey="count" fill="#14B8A6" name="Nodes" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
