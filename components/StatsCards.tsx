import { PNode } from '@/lib/types';
import { calculateStats, formatBytes, formatDuration } from '@/lib/utils';
import { Server, HardDrive, TrendingUp, Activity } from 'lucide-react';

interface StatsCardsProps {
  pnodes: PNode[];
}

export function StatsCards({ pnodes }: StatsCardsProps) {
  const stats = calculateStats(pnodes);

  const cards = [
    {
      title: 'Total Nodes',
      value: stats.totalNodes.toString(),
      subtitle: `${stats.onlineNodes} online`,
      icon: Server,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Total Storage',
      value: formatBytes(stats.totalStorage),
      subtitle: `${formatBytes(stats.usedStorage)} used`,
      icon: HardDrive,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Avg Reputation',
      value: stats.averageReputation.toFixed(1),
      subtitle: 'Network score',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Avg Uptime',
      value: formatDuration(stats.averageUptime),
      subtitle: 'Per node',
      icon: Activity,
      color: 'text-time',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`${card.bgColor} rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {card.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  {card.subtitle}
                </p>
              </div>
              <Icon className={`w-8 h-8 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}



