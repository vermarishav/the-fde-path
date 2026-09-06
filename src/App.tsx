import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SYLLABUS } from './data/syllabus';
import { TrackType, TabType, ProgressMap, BucketType, UserProfile } from './types';
import { AndroidTopBar } from './components/AndroidTopBar';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { SyllabusView } from './components/SyllabusView';
import { FlashcardsView } from './components/FlashcardsView';
import { NotesView } from './components/NotesView';
import { ProfileView } from './components/ProfileView';
import { TimelineView } from './components/TimelineView';
import { BalanceView } from './components/BalanceView';
import { SprintTimerView } from './components/SprintTimerView';
import { PortfolioView } from './components/PortfolioView';
import { CaseStudyModal } from './components/CaseStudyModal';
import { CrucibleModal } from './components/CrucibleModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { ConfirmModal } from './components/ConfirmModal';
import { PinLockModal } from './components/PinLockModal';
import { triggerHaptic } from './utils/haptics';
import { playTick, playChime } from './utils/audio';

const STORAGE_PROGRESS_KEY = 'fde-path-progress-v4';
const STORAGE_START_KEY = 'fde-path-start-v4';
const STORAGE_SPRINT_KEY = 'fde-path-sprint-hist-v4';
const STORAGE_TRACK_KEY = 'fde-current-track';
const STORAGE_PROFILE_KEY = 'fde-user-profile-v1';
const STORAGE_THEME_KEY = 'fde-theme-v1';
const STORAGE_SOUND_KEY = 'fde-sound-enabled-v1';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Rishabh Verma',
  email: 'vermarishabh031@gmail.com',
  targetRole: 'Forward Deployed Engineer',
  targetCompany: 'Palantir / Scale AI',
  targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  targetWeeklyHours: 15,
  currentLevel: 'Mid-Level SWE',
  bio: 'Deploying robust data pipelines, edge AI solutions, and high-impact technical architecture directly into client environments.',
  githubUrl: 'https://github.com/vermarishav',
  linkedinUrl: '',
  isPinLocked: false,
  pinHash: '',
  securityQuestion: 'Favorite distributed systems broker?',
  securityAnswer: 'kafka',
};

export default function App() {
  const [currentTrack, setCurrentTrack] = useState<TrackType>(() => {
    return (localStorage.getItem(STORAGE_TRACK_KEY) as TrackType) || 'foundation';
  });
  const [activeTab, setActiveTab] = useState<TabType>('syllabus');
  const [progress, setProgress] = useState<ProgressMap>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_PROGRESS_KEY) || '{}');
    } catch {
      return {};
    }
  });
  const [startDate, setStartDate] = useState<string>(() => {
    return localStorage.getItem(STORAGE_START_KEY) || '';
  });
  const [sprintHistory, setSprintHistory] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_SPRINT_KEY) || '{}');
    } catch {
      return {};
    }
  });

  // User Profile state
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PROFILE_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Theme Night Mode state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem(STORAGE_THEME_KEY) as 'light' | 'dark') || 'light';
  });

  // Audio Sound state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const raw = localStorage.getItem(STORAGE_SOUND_KEY);
    return raw === null ? true : raw === 'true';
  });

  // PIN Lock state: locked initially if pin is configured
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        return !!(p.isPinLocked && p.pinHash);
      }
    } catch {}
    return false;
  });


  // Modals state
  const [activeCaseStudy, setActiveCaseStudy] = useState<string | null>(null);
  const [isCrucibleOpen, setIsCrucibleOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Sync theme class to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Persist profile
  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(updated));
  };

  // Toggle theme
  const handleToggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem(STORAGE_THEME_KEY, next);
  };

  // Toggle sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem(STORAGE_SOUND_KEY, String(next));
  };

  // Persist track
  const handleSelectTrack = (track: TrackType) => {
    setCurrentTrack(track);
    localStorage.setItem(STORAGE_TRACK_KEY, track);
  };

  // Persist progress
  const saveProgressState = (newProg: ProgressMap) => {
    setProgress(newProg);
    localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(newProg));
  };

  const handleToggleItem = useCallback(
    (key: string) => {
      setProgress((prev) => {
        const current = prev[key] || { checked: false, note: '', redo: false, blocked: false, bookmarked: false };
        const updated = { ...current, checked: !current.checked };
        const newProg = { ...prev, [key]: updated };
        localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(newProg));

        // Start tracking date on first check
        if (!startDate && updated.checked) {
          const today = new Date().toISOString().split('T')[0];
          setStartDate(today);
          localStorage.setItem(STORAGE_START_KEY, today);
        }

        return newProg;
      });
    },
    [startDate]
  );

  const handleToggleBookmark = useCallback((key: string) => {
    setProgress((prev) => {
      const current = prev[key] || { checked: false, note: '', redo: false, blocked: false, bookmarked: false };
      const updated = { ...current, bookmarked: !current.bookmarked };
      const newProg = { ...prev, [key]: updated };
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(newProg));
      return newProg;
    });
  }, []);


  const handleToggleRedo = useCallback((key: string) => {
    setProgress((prev) => {
      const current = prev[key] || { checked: false, note: '', redo: false, blocked: false };
      const updated = { ...current, redo: !current.redo };
      const newProg = { ...prev, [key]: updated };
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(newProg));
      return newProg;
    });
  }, []);

  const handleToggleBlocked = useCallback((key: string) => {
    setProgress((prev) => {
      const current = prev[key] || { checked: false, note: '', redo: false, blocked: false };
      const updated = { ...current, blocked: !current.blocked };
      const newProg = { ...prev, [key]: updated };
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(newProg));
      return newProg;
    });
  }, []);

  const handleUpdateNote = useCallback((key: string, note: string) => {
    setProgress((prev) => {
      const current = prev[key] || { checked: false, note: '', redo: false, blocked: false };
      const updated = { ...current, note };
      const newProg = { ...prev, [key]: updated };
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(newProg));
      return newProg;
    });
  }, []);

  // Record completed sprint
  const handleSprintCompleted = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setSprintHistory((prev) => {
      const count = (prev[today] || 0) + 1;
      const updated = { ...prev, [today]: count };
      localStorage.setItem(STORAGE_SPRINT_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Global Keyboard Shortcuts (⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute Overall Statistics
  const stats = useMemo(() => {
    let totalItems = 0;
    let doneItems = 0;
    const bucketTotals: Record<BucketType, number> = { core: 0, ai: 0, customer: 0 };
    const bucketDone: Record<BucketType, number> = { core: 0, ai: 0, customer: 0 };

    (['foundation', 'advanced'] as const).forEach((tk) => {
      SYLLABUS[tk].forEach((phase) => {
        const b = phase.bucket;
        phase.items.forEach((_, i) => {
          totalItems++;
          bucketTotals[b] = (bucketTotals[b] || 0) + 1;
          const key = `${phase.id}::${i}`;
          if (progress[key]?.checked) {
            doneItems++;
            bucketDone[b] = (bucketDone[b] || 0) + 1;
          }
        });
      });
    });

    const progressPct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;

    let pacingEstimate = '—';
    if (startDate && doneItems > 0) {
      const days = Math.max(1, Math.round((Date.now() - new Date(startDate).getTime()) / 86400000));
      const vel = doneItems / days;
      if (vel > 0) {
        const leftDays = Math.ceil((totalItems - doneItems) / vel);
        const estDate = new Date();
        estDate.setDate(estDate.getDate() + leftDays);
        pacingEstimate = estDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      }
    }

    return {
      totalItems,
      doneItems,
      progressPct,
      pacingEstimate,
      bucketTotals,
      bucketDone,
    };
  }, [progress, startDate]);

  // Export Printable Technical Summary
  const handleExportSummary = () => {
    let itemsHtml = '';
    (['foundation', 'advanced'] as const).forEach((tk) => {
      SYLLABUS[tk].forEach((p) => {
        p.items.forEach((it, i) => {
          const st = progress[`${p.id}::${i}`];
          if (st?.checked) {
            itemsHtml += `
              <li style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #E3DED0;">
                <span style="font-family: monospace; font-size: 11px; color: #71875F;">${p.index}</span>
                <div style="font-size: 15px; font-weight: 600; margin-top: 2px;">${it.t}</div>
                ${st.note ? `<div style="font-size: 13px; color: #55524A; margin-top: 4px; background: #F2EFE6; padding: 6px 10px; border-radius: 4px;"><em>Friction / Notes:</em> ${st.note}</div>` : ''}
              </li>
            `;
          }
        });
      });
    });

    if (!itemsHtml) {
      itemsHtml = '<p style="color: #948E7E;">No milestones completed yet.</p>';
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>The FDE Path — Technical Field Summary</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 24px; color: #1C1B19; background: #FAF8F3; line-height: 1.6; }
          h1 { font-family: Georgia, serif; font-size: 28px; border-bottom: 2px solid #1C1B19; padding-bottom: 8px; margin-bottom: 4px; }
          .sub { color: #55524A; font-size: 14px; margin-bottom: 24px; }
          .stats { display: flex; gap: 24px; background: #F2EFE6; border: 1px solid #E3DED0; padding: 16px; border-radius: 6px; margin-bottom: 32px; font-family: monospace; font-size: 13px; }
          ul { list-style: none; padding: 0; }
        </style>
      </head>
      <body>
        <h1>The FDE Path — Technical Field Summary</h1>
        <p class="sub">Generated candidate portfolio record for Forward Deployed Engineering verification.</p>
        <div class="stats">
          <div><strong>Total Completed:</strong> ${stats.doneItems} of ${stats.totalItems} (${stats.progressPct}%)</div>
          <div><strong>Core:</strong> ${stats.bucketDone.core}</div>
          <div><strong>Applied AI:</strong> ${stats.bucketDone.ai}</div>
          <div><strong>Customer:</strong> ${stats.bucketDone.customer}</div>
        </div>
        <h2>Completed Engineering Milestones & Modules</h2>
        <ul>${itemsHtml}</ul>
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(html);
      printWin.document.close();
      setTimeout(() => printWin.print(), 350);
    }
  };

  // Full JSON Backup Export
  const handleExportProgress = () => {
    const data = {
      profile,
      progress,
      startDate,
      sprintHistory,
      theme,
      exportedAt: new Date().toISOString(),
      version: 5,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fde-path-candidate-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // JSON Backup Import
  const handleImportBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.progress) {
          setProgress(data.progress);
          localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(data.progress));
        }
        if (data.profile) {
          setProfile(data.profile);
          localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(data.profile));
        }
        if (data.sprintHistory) {
          setSprintHistory(data.sprintHistory);
          localStorage.setItem(STORAGE_SPRINT_KEY, JSON.stringify(data.sprintHistory));
        }
        if (data.startDate) {
          setStartDate(data.startDate);
          localStorage.setItem(STORAGE_START_KEY, data.startDate);
        }
        triggerHaptic('success');
        if (soundEnabled) playChime();
        alert('Backup successfully restored!');
      } catch {
        triggerHaptic('error');
        alert('Failed to parse backup file. Please select a valid JSON backup.');
      }
    };
    reader.readAsText(file);
  };

  // Reset Progress Confirmation
  const handleConfirmReset = () => {
    setConfirmModalState({
      isOpen: true,
      title: 'Reset all progress?',
      message: 'This will permanently delete all checked syllabus milestones, private notes, and focus sprint records.',
      onConfirm: () => {
        localStorage.removeItem(STORAGE_PROGRESS_KEY);
        localStorage.removeItem(STORAGE_START_KEY);
        localStorage.removeItem(STORAGE_SPRINT_KEY);
        setProgress({});
        setStartDate('');
        setSprintHistory({});
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Command palette action dispatcher
  const handleCommandPaletteAction = (action: string, payload?: any) => {
    if (action === 'start-sprint') {
      setActiveTab('sprint');
    } else if (action === 'open-crucible') {
      setIsCrucibleOpen(true);
    } else if (action === 'view-timeline') {
      setActiveTab('timeline');
    } else if (action === 'export-summary') {
      handleExportSummary();
    } else if (action === 'jump-item') {
      if (payload?.track) {
        handleSelectTrack(payload.track);
      }
      setActiveTab('syllabus');
    }
  };

  // Secondary subtabs navigation
  const allSubTabs: { id: TabType; label: string }[] = [
    { id: 'syllabus', label: 'Syllabus' },
    { id: 'flashcards', label: 'Active Recall' },
    { id: 'notes', label: 'Study Journal' },
    { id: 'sprint', label: 'Focus Sprint' },
    { id: 'profile', label: 'Candidate Profile' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'balance', label: 'Skill Balance' },
    { id: 'portfolio', label: 'Portfolio' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#1C1B19] relative flex flex-col selection:bg-[#2954A6] selection:text-[#FAF8F3] transition-colors duration-200">
      <div className="grain" />

      {/* Security PIN Lock Modal */}
      {isLocked && profile.isPinLocked && profile.pinHash && (
        <PinLockModal
          correctPin={profile.pinHash}
          securityQuestion={profile.securityQuestion}
          securityAnswer={profile.securityAnswer}
          onUnlock={() => setIsLocked(false)}
          onResetPin={() => {
            const updated = { ...profile, isPinLocked: false, pinHash: '' };
            handleUpdateProfile(updated);
            setIsLocked(false);
          }}
        />
      )}

      {/* Android Optimized Top Bar */}
      <AndroidTopBar
        currentTrack={currentTrack}
        onSelectTrack={handleSelectTrack}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenCrucible={() => setIsCrucibleOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Desktop / Tablet Sub-Navigation Pills */}
      <div className="hidden md:block border-b border-[#E3DED0] bg-[#F2EFE6]/70 backdrop-blur-xs sticky top-[57px] z-30">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8 flex items-center gap-1 overflow-x-auto py-2">
          {allSubTabs.map((st) => (
            <button
              key={st.id}
              onClick={() => {
                triggerHaptic('light');
                if (soundEnabled) playTick();
                setActiveTab(st.id);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-150 whitespace-nowrap ${
                activeTab === st.id
                  ? 'bg-[#2954A6] text-white font-medium shadow-xs'
                  : 'text-[#55524A] hover:bg-[#FAF8F3] hover:text-[#1C1B19]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-[1180px] w-full mx-auto px-4 sm:px-8 py-6 mb-20">
        {activeTab === 'syllabus' && (
          <SyllabusView
            currentTrack={currentTrack}
            phases={SYLLABUS[currentTrack]}
            progress={progress}
            onToggleItem={handleToggleItem}
            onToggleRedo={handleToggleRedo}
            onToggleBlocked={handleToggleBlocked}
            onToggleBookmark={handleToggleBookmark}
            onUpdateNote={handleUpdateNote}
            soundEnabled={soundEnabled}
            stats={stats}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardsView soundEnabled={soundEnabled} />
        )}

        {activeTab === 'notes' && (
          <NotesView soundEnabled={soundEnabled} />
        )}

        {activeTab === 'sprint' && (
          <SprintTimerView
            onSprintCompleted={handleSprintCompleted}
            sprintHistory={sprintHistory}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            stats={stats}
            progress={progress}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onExportBackup={handleExportProgress}
            onImportBackup={handleImportBackup}
            onExportDossier={handleExportSummary}
            onConfirmReset={handleConfirmReset}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView progress={progress} startDate={startDate} />
        )}

        {activeTab === 'balance' && <BalanceView stats={stats} />}

        {activeTab === 'portfolio' && (
          <PortfolioView
            onOpenCaseStudy={(id) => setActiveCaseStudy(id)}
            onOpenCrucible={() => setIsCrucibleOpen(true)}
            onExportSummary={handleExportSummary}
            onExportProgress={handleExportProgress}
            onConfirmReset={handleConfirmReset}
          />
        )}
      </main>

      {/* Android Bottom Navigation */}
      <AndroidBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        completedCount={stats.doneItems}
        totalCount={stats.totalItems}
      />

      {/* Modals & Overlays */}
      <CaseStudyModal
        caseStudyId={activeCaseStudy}
        onClose={() => setActiveCaseStudy(null)}
      />

      <CrucibleModal
        isOpen={isCrucibleOpen}
        onClose={() => setIsCrucibleOpen(false)}
        progress={progress}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={handleCommandPaletteAction}
      />

      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        message={confirmModalState.message}
        confirmLabel="Reset All"
        isDestructive={true}
        onConfirm={confirmModalState.onConfirm}
        onCancel={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

