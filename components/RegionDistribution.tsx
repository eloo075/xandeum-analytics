'use client';

import { PNode } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer , Legend } from 'recharts';
import { MapPin } from 'lucide-react';
import { useMemo } from 'react';

interface RegionDistributionProps {
  pnodes: PNode[];
}

const COLORS = ['#14B8A6', '#FF6B35', '#8B5CF6', '#0EA5E9', '#F59E0B', '#EF4444', '#10B981'];

export function RegionDistribution({ pnodes }: RegionDistributionProps) {
  const regionData = useMemo(() => {
    const regionMap = new Map<string, number>();
    
    pnodes.forEach(node => {
      const region = node.region || 'Unknown';
      regionMap.set(region, (regionMap.get(region) || 0) + 1);
    });

    return Array.from(regionMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [pnodes]);

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
          </Pie><Legend />
        </PieChart>
      </ResponsiveContainer>
      
      {regionData.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {regionData.map((region, index) => (
            <div key={region.name} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-slate-600 dark:text-slate-400">{region.name}:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{region.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}






