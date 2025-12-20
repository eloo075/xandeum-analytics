'use client';

import { PNode } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldCheck } from 'lucide-react';
import { useMemo } from 'react';

interface PublicPrivateDistributionProps {
  pnodes: PNode[];
}

const COLORS = ['#14B8A6', '#64748b'];

export function PublicPrivateDistribution({ pnodes }: PublicPrivateDistributionProps) {
  const { data, total } = useMemo(() => {
    let pub = 0;
    let priv = 0;
    let unknown = 0;

    for (const n of pnodes) {
      if (typeof n.isPublic === 'boolean') {
        if (n.isPublic) pub++;
        else priv++;
      } else {
        unknown++;
      }
    }

    const rows = [
      { name: 'Public', value: pub },
      { name: 'Private', value: priv },
    ];

    if (unknown > 0) rows.push({ name: 'Unknown', value: unknown });

    const totalCount = rows.reduce((sum, x) => sum + x.value, 0);
    return { data: rows, total: totalCount };
  }, [pnodes]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-primary-600" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Public vs Private Nodes</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip
            formatter={(value: number, name: string) => {
              const pct = total > 0 ? (value / total) * 100 : 0;
              return [`${value} (${pct.toFixed(1)}%)`, name];
            }}
          />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
