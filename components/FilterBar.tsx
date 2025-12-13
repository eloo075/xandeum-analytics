import { ChevronDown, ArrowUp, ArrowDown, Star, Clock, HardDrive, Database, Activity, MapPin } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface FilterBarProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

export function FilterBar({
  statusFilter,
  onStatusChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}: FilterBarProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setShowStatusMenu(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'online', label: 'Online' },
    { value: 'offline', label: 'Offline' },
    { value: 'syncing', label: 'Syncing' },
  ];

  const sortOptions = [
    { value: 'reputation', label: 'Reputation' },
    { value: 'uptime', label: 'Uptime' },
    { value: 'storageCapacity', label: 'Storage Capacity' },
    { value: 'storageUsed', label: 'Storage Used' },
    { value: 'latency', label: 'Latency' },
    { value: 'region', label: 'Region' },
  ];

  // Helper to render a colored status dot
  const renderStatusDot = (value: string) => {
    const color =
      value === 'online'
        ? 'bg-green-500'
        : value === 'offline'
        ? 'bg-red-500'
        : value === 'syncing'
        ? 'bg-orange-500'
        : 'bg-slate-400'; // for 'all' and any fallback
    return <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} />;
  };

  // Helper to render an icon for sort option
  const renderSortIcon = (value?: string) => {
    const size = 'w-4 h-4';
    switch (value) {
      case 'reputation':
        return <Star className={size} />;
      case 'uptime':
        return <Clock className={size} />;
      case 'storageCapacity':
        return <HardDrive className={size} />;
      case 'storageUsed':
        return <Database className={size} />;
      case 'latency':
        return <Activity className={size} />;
      case 'region':
        return <MapPin className={size} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-2">
      {/* Status Filter */}
      <div className="relative" ref={statusRef}>
        <button
          onClick={() => setShowStatusMenu(!showStatusMenu)}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm">
            {renderStatusDot(statusFilter || 'all')}
            {statusOptions.find((opt) => opt.value === statusFilter)?.label || 'All Status'}
          </span>
          <ChevronDown className="w-4 h-4" />
        </button>
        {showStatusMenu && (
          <div className="absolute top-full mt-1 left-0 z-10 w-40 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onStatusChange(option.value);
                  setShowStatusMenu(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-600 first:rounded-t-lg last:rounded-b-lg ${
                  statusFilter === option.value
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  {renderStatusDot(option.value)}
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sort By */}
      <div className="relative" ref={sortRef}>
        <button
          onClick={() => setShowSortMenu(!showSortMenu)}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
        >
          <span className="flex items-center gap-1.5 text-sm">
            {renderSortIcon(sortBy)}
            Sort: {sortOptions.find((opt) => opt.value === sortBy)?.label || 'Reputation'}
            {sortOrder === 'asc' ? (
              <ArrowUp className="w-3.5 h-3.5 text-primary-600" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5 text-primary-600" />
            )}
          </span>
          <ChevronDown className="w-4 h-4" />
        </button>
        {showSortMenu && (
          <div className="absolute top-full mt-1 right-0 z-10 w-48 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSortByChange(option.value);
                  setShowSortMenu(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-600 first:rounded-t-lg ${
                  sortBy === option.value
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {renderSortIcon(option.value)}
                  {option.label}
                </span>
              </button>
            ))}
            <div className="border-t border-slate-300 dark:border-slate-600 mt-1 pt-1">
              <button
                onClick={() => {
                  onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
                  setShowSortMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-900 dark:text-white"
              >
                Order: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

