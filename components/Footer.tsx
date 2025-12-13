'use client';

import { MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <p className="mt-1">Powered by <a href="https://www.xandeum.network/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Xandeum Network</a></p>
          </div>
          
          <div className="flex items-center gap-3">
            <a
              href="https://discord.gg/uqRSmmM5m"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Join Xandeum Discord"
            >
              <MessageCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

