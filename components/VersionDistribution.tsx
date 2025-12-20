'use client';

import { PNode } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Layers } from 'lucide-react';
import { useMemo } from 'react';

interface VersionDistributionProps {
  pnodes: PNode[];
}

export function VersionDistribution({ pnodes }: VersionDistributionProps) {
  const data = useMemo(() => {
    const map = new Map<string, number>();

    for (const n of pnodes) {
      const raw = (n.version || '').trim();
      const v = raw ? normalizeVersionLabel(raw) : 'Unknown';
      map.set(v, (map.get(v) || 0) + 1);
    }

    return Array.from(map.entries())
      .map(([version, count]) => ({ version, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  }, [pnodes]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-primary-600" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Version Distribution</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="version" stroke="#64748b" fontSize={12} angle={-30} textAnchor="end" height={60} />
          <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
          <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
          <Bar dataKey="count" fill="#5b2c55" name="Nodes" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function normalizeVersionLabel(version: string): string {
  const v = version.trim();
  if (!v) return 'Unknown';

  // Example:
  //  0.8.0-trynet.20251217111503.7a5b024  ->  0.8.0-trynet
  const tryNetMatch = v.match(/^([0-9]+\.[0-9]+\.[0-9]+)-trynet(?:\..*)?$/i);
  if (tryNetMatch) return `${tryNetMatch[1]}-trynet`;

  // If there are multiple dashes, keep only the first suffix for readability
  // e.g. 0.8.0-something-extra -> 0.8.0-something
  const parts = v.split('-');
  if (parts.length >= 3) return `${parts[0]}-${parts[1]}`;

  return v;
}
