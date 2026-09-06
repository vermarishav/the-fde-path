import React from 'react';
import { TabType } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { CheckSquare, Calendar, PieChart, Timer, Briefcase } from 'lucide-react';

interface AndroidBottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  completedCount: number;
  totalCount: number;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeTab,
  onSelectTab,
  completedCount,
  totalCount,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'syllabus',
      label: 'Syllabus',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: `${completedCount}/${totalCount}`,
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'balance',
      label: 'Balance',
      icon: <PieChart className="w-5 h-5" />,
    },
    {
      id: 'sprint',
      label: 'Sprint',
      icon: <Timer className="w-5 h-5" />,
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: <Briefcase className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F3]/95 backdrop-blur-md border-t border-[#E3DED0] pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
      <div className="max-w-[800px] mx-auto flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('light');
                onSelectTab(tab.id);
              }}
              className="flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 active:scale-95 group"
            >
              {/* Pill Container */}
              <div
                className={`relative px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                  isActive
                    ? 'bg-[#2954A6] text-[#FAF8F3] shadow-sm'
                    : 'text-[#55524A] hover:bg-[#F2EFE6]'
                }`}
              >
                {tab.icon}
                {tab.badge && !isActive && (
                  <span className="absolute -top-1 -right-1 text-[9px] font-mono bg-[#71875F] text-[#FAF8F3] px-1 py-0.2 rounded-full">
                    {completedCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] font-sans font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-[#2954A6] font-semibold' : 'text-[#948E7E] group-hover:text-[#55524A]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
