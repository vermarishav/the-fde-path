import React from 'react';
import { TrackType, TabType } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { triggerHaptic } from '../utils/haptics';
import { Search, Flame, Download, Check, Moon, Sun } from 'lucide-react';

interface AndroidTopBarProps {
  currentTrack: TrackType;
  onSelectTrack: (track: TrackType) => void;
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenCommandPalette: () => void;
  onOpenCrucible: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const AndroidTopBar: React.FC<AndroidTopBarProps> = ({
  currentTrack,
  onSelectTrack,
  onOpenCommandPalette,
  onOpenCrucible,
  theme = 'light',
  onToggleTheme,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();


  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F3]/95 backdrop-blur-md border-b-[1.4px] border-[#1C1B19] pt-safe">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 34 34" fill="none">
              <circle cx="17" cy="17" r="15.5" stroke="#1C1B19" strokeWidth="1.4" />
              <path d="M17 6 L17 28 M6 17 L28 17" stroke="#2954A6" strokeWidth="1.4" />
              <circle cx="17" cy="17" r="3.2" fill="#2954A6" />
            </svg>
          </div>
          <div>
            <p className="font-mono text-[10px] sm:text-[11px] text-[#948E7E] leading-tight tracking-wider uppercase">
              a field manual
            </p>
            <h1 className="font-serif text-[18px] sm:text-[21px] font-semibold text-[#1C1B19] leading-tight">
              The FDE Path
            </h1>
          </div>
        </div>

        {/* Track Switcher */}
        <div className="flex items-center bg-[#F2EFE6] p-1 rounded-full border border-[#E3DED0]">
          <button
            onClick={() => {
              triggerHaptic('light');
              onSelectTrack('foundation');
            }}
            className={`px-3 py-1 text-xs font-mono rounded-full transition-all duration-150 ${
              currentTrack === 'foundation'
                ? 'bg-[#2954A6] text-[#FAF8F3] font-medium shadow-sm'
                : 'text-[#55524A] hover:text-[#1C1B19]'
            }`}
          >
            Foundation
          </button>
          <button
            onClick={() => {
              triggerHaptic('light');
              onSelectTrack('advanced');
            }}
            className={`px-3 py-1 text-xs font-mono rounded-full transition-all duration-150 ${
              currentTrack === 'advanced'
                ? 'bg-[#2954A6] text-[#FAF8F3] font-medium shadow-sm'
                : 'text-[#55524A] hover:text-[#1C1B19]'
            }`}
          >
            Advanced
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* PWA Install Button for Android */}
          {isInstallable && !isInstalled && (
            <button
              onClick={() => {
                triggerHaptic('medium');
                install();
              }}
              className="flex items-center gap-1.5 bg-[#71875F] text-[#FAF8F3] text-xs font-mono px-3 py-1.5 rounded-full border border-[#71875F] active:scale-95 transition-transform"
              title="Install on Android"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Install Android App</span>
              <span className="md:hidden">Install</span>
            </button>
          )}

          {isInstalled && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#71875F] bg-[#E1E8D9] px-2.5 py-1 rounded-full">
              <Check className="w-3 h-3" /> App Installed
            </span>
          )}

          {/* Crucible trigger */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenCrucible();
            }}
            className="flex items-center gap-1 text-xs font-mono text-[#2954A6] hover:bg-[#DCE5F3] px-2.5 py-1.5 rounded-full border border-transparent hover:border-[#2954A6]/20 transition-all active:scale-95"
            title="Open Sunday Crucible"
          >
            <Flame className="w-3.5 h-3.5 text-[#B8863A]" />
            <span className="hidden lg:inline font-medium">Crucible</span>
          </button>

          {/* Theme Night Mode Toggle */}
          {onToggleTheme && (
            <button
              onClick={() => {
                triggerHaptic('light');
                onToggleTheme();
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F2EFE6] hover:bg-[#E3DED0] text-[#55524A] hover:text-[#1C1B19] border border-[#E3DED0] transition-colors active:scale-95"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Night Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#E2AC54]" />
              ) : (
                <Moon className="w-4 h-4 text-[#55524A]" />
              )}
            </button>
          )}

          {/* Command Palette Trigger */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenCommandPalette();
            }}
            className="flex items-center gap-1 text-xs font-mono bg-[#F2EFE6] hover:bg-[#E3DED0] text-[#55524A] hover:text-[#1C1B19] px-2.5 py-1.5 rounded-full border border-[#E3DED0] transition-colors active:scale-95"
            title="Search Syllabus (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px] text-[#948E7E]">⌘K</span>
          </button>
        </div>
      </div>
    </header>
  );
};
