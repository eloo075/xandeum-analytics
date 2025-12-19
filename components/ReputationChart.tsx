'use client';

import { PNode } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReputationChartProps {
  pnodes: PNode[];
}

export function ReputationChart({ pnodes }: ReputationChartProps) {
  // Create reputation distribution
  const reputationRanges = [
    { range: '0-20', count: 0, label: '0-20' },
    { range: '21-40', count: 0, label: '21-40' },
    { range: '41-60', count: 0, label: '41-60' },
    { range: '61-80', count: 0, label: '61-80' },
    { range: '81-100', count: 0, label: '81-100' },
  ];

  pnodes.forEach(node => {
    const rep = node.reputation || 0;
    if (rep <= 20) reputationRanges[0].count++;
    else if (rep <= 40) reputationRanges[1].count++;
    else if (rep <= 60) reputationRanges[2].count++;
    else if (rep <= 80) reputationRanges[3].count++;
    else reputationRanges[4].count++;
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
        Reputation Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={reputationRanges}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="label" 
            stroke="#64748b"
            fontSize={12}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#14B8A6" 
            strokeWidth={3}
            name="Number of Nodes"
            dot={{ fill: '#14B8A6', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}



