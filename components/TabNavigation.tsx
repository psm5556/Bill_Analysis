'use client';
import type { Tab, TabId } from '@/types';

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
}

export default function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="bg-slate-900 border-b border-slate-700 overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-0 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400 bg-slate-800/50'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
