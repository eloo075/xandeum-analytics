'use client';

import { PNode } from '@/lib/types';
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useMemo } from 'react';

interface NetworkHealthProps {
  pnodes: PNode[];
}

export function NetworkHealth({ pnodes }: NetworkHealthProps) {
  const healthMetrics = useMemo(() => {
    const total = pnodes.length;
    const online = pnodes.filter(n => n.status === 'online').length;
    const offline = pnodes.filter(n => n.status === 'offline').length;
    const syncing = pnodes.filter(n => n.status === 'syncing').length;
    
    const uptimeAvg = pnodes.reduce((sum, n) => sum + (n.uptime || 0), 0) / total || 0;
    const reputationAvg = pnodes.reduce((sum, n) => sum + (n.reputation || 0), 0) / total || 0;
    
    const healthScore = total > 0 
      ? ((online / total) * 0.5 + (reputationAvg / 100) * 0.3 + Math.min(uptimeAvg / 86400, 1) * 0.2) * 100
      : 0;

    return {
      total,
      online,
      offline,
      syncing,
      uptimeAvg,
      reputationAvg,
      healthScore: Math.round(healthScore),
    };
  }, [pnodes]);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20';
  };

  const getHealthIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5" />;
    if (score >= 60) return <Clock className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Network Health
        </h3>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getHealthColor(healthMetrics.healthScore)}`}>
          {getHealthIcon(healthMetrics.healthScore)}
          <span className="font-bold">{healthMetrics.healthScore}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {healthMetrics.online}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Online</p>
        </div>

        <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {healthMetrics.offline}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Offline</p>
        </div>

        <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {healthMetrics.syncing}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Syncing</p>
        </div>

        <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {healthMetrics.total}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Total Nodes</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">Avg Reputation</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {healthMetrics.reputationAvg.toFixed(1)}
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${healthMetrics.reputationAvg}%` }}
          />
        </div>
      </div>
    </div>
  );
}



