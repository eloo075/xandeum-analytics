'use client';

import Image from 'next/image';
import { Server } from 'lucide-react';
import { useState } from 'react';

export function DashboardHeader() {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="w-full">
      {/* Xandeum Banner */}
      <div className="p-6 mb-6 flex items-center gap-6">
        <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
          {!logoError ? (
            <Image
              src="/logo.png"
              alt="Xandeum Logo"
              width={64}
              height={64}
              className="object-contain"
              priority
              onError={() => setLogoError(true)}
            />
          ) : (
            <Server className="w-16 h-16 text-primary-600" />
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            XANDEUM
          </h1>
          <p className="text-xl font-medium mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#FF6B35' }}>
            Exabytes for Solana Programs
          </p>
        </div>
      </div>
      
      {/* Analytics Title */}
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          pNode Analytics
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Real-time analytics and monitoring for Xandeum storage provider nodes
        </p>
      </div>
    </div>
  );
}

