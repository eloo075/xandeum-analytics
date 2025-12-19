'use client';

import { PNode } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MapPin } from 'lucide-react';
import { useMemo } from 'react';

interface RegionDistributionProps {
  pnodes: PNode[];
}

const COLORS = ['#14B8A6', '#FF6B35', '#8B5CF6', '#0EA5E9', '#F59E0B', '#EF4444', '#10B981'];

export function RegionDistribution({ pnodes }: RegionDistributionProps) {
  const { regionData, total } = useMemo(() => {
    const regionMap = new Map<string, number>();

    pnodes.forEach((node) => {
      const region = node.region || 'Unknown';
      regionMap.set(region, (regionMap.get(region) || 0) + 1);
    });

    const all = Array.from(regionMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const totalCount = all.reduce((sum, x) => sum + x.value, 0);
    const TOP_N = 6;
    const top = all.slice(0, TOP_N);
    const rest = all.slice(TOP_N);
    const otherValue = rest.reduce((sum, x) => sum + x.value, 0);

    const data = otherValue > 0 ? [...top, { name: 'Other', value: otherValue }] : top;

    return { regionData: data, total: totalCount };
  }, [pnodes]);

  const legendRows = useMemo(() => {
    return regionData.map((x, index) => {
      const percent = total > 0 ? (x.value / total) * 100 : 0;
      return {
        ...x,
        percent,
        color: COLORS[index % COLORS.length],
      };
    });
  }, [regionData, total]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary-600" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Geographic Distribution
        </h3>
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
            data={regionData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {regionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {legendRows.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {legendRows.map((row) => (
              <div key={row.name} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: row.color }} />
                  <span className="text-slate-600 dark:text-slate-400 truncate">{row.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{row.value}</span>
                  <span className="text-slate-500 dark:text-slate-400 tabular-nums">({row.percent.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}






