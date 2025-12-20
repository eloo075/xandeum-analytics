'use client';

import { PNode } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldCheck } from 'lucide-react';
import { useMemo } from 'react';

interface PublicPrivateDistributionProps {
  pnodes: PNode[];
}

const COLORS = ['#418276', '#5b2c55', '#eda746'];

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

  const summaryRows = useMemo(() => {
    return data.map((x, index) => {
      const percent = total > 0 ? (x.value / total) * 100 : 0;
      return {
        ...x,
        percent,
        color: COLORS[index % COLORS.length],
      };
    });
  }, [data, total]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-primary-600" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Public vs Private Nodes</h3>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <div className="sm:w-56">
          <div className="space-y-2">
            {summaryRows.map((row) => (
              <div key={row.name} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: row.color }} />
                  <span className="text-slate-700 dark:text-slate-300 truncate">{row.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{row.value}</span>
                  <span className="text-slate-500 dark:text-slate-400 tabular-nums">({row.percent.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
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
      </div>
    </div>
  );
}
