'use client';

import { PNode } from '@/lib/types';
import { formatBytes } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface StorageChartProps {
  pnodes: PNode[];
}

export function StorageChart({ pnodes }: StorageChartProps) {
  // Get top 10 nodes by storage capacity
  const topNodes = [...pnodes]
    .sort((a, b) => (b.storageCapacity || 0) - (a.storageCapacity || 0))
    .slice(0, 10)
    .map(node => ({
      name: node.id.substring(0, 12) + '...',
      capacity: node.storageCapacity || 0,
      used: node.storageUsed || 0,
      available: (node.storageCapacity || 0) - (node.storageUsed || 0),
      utilization: node.storageCapacity 
        ? ((node.storageUsed || 0) / node.storageCapacity * 100).toFixed(1)
        : 0,
    }));

  const COLORS = ['#14B8A6', '#FF6B35', '#8B5CF6', '#0EA5E9', '#F59E0B'];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
        Top 10 Nodes by Storage Capacity
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topNodes}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            stroke="#64748b"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(value) => `${(value / 1024).toFixed(0)}TB`}
          />
          <Tooltip 
            formatter={(value: number) => formatBytes(value * 1024 * 1024 * 1024 * 1024)}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
          />
          <Legend />
          <Bar dataKey="used" stackId="a" fill="#14B8A6" name="Used Storage" />
          <Bar dataKey="available" stackId="a" fill="#cbd5e1" name="Available Storage" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

