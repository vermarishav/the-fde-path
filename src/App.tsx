import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SYLLABUS } from './data/syllabus';
import { TrackType, TabType, ProgressMap, BucketType } from './types';
import { AndroidTopBar } from './components/AndroidTopBar';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { SyllabusView } from './components/SyllabusView';
import { TimelineView } from './components/TimelineView';
import { BalanceView } from './components/BalanceView';
import { SprintTimerView } from './components/SprintTimerView';
import { PortfolioView } from './components/PortfolioView';
import { CaseStudyModal } from './components/CaseStudyModal';
import { CrucibleModal } from './components/CrucibleModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { ConfirmModal } from './components/ConfirmModal';

const STORAGE_PROGRESS_KEY = 'fde-path-progress-v4';
const STORAGE_START_KEY = 'fde-path-start-v4';
const STORAGE_SPRINT_KEY = 'fde-path-sprint-hist-v4';
const STORAGE_TRACK_KEY = 'fde-current-track';

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
        const current = prev[key] || { checked: false, note: '', redo: false, blocked: false };
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

  // Export JSON Backup
  const handleExportProgress = () => {
    const data = {
      progress,
      startDate,
      sprintHistory,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fde-path-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
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

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#1C1B19] relative flex flex-col selection:bg-[#2954A6] selection:text-[#FAF8F3]">
      <div className="grain" />

      {/* Android Optimized Top Bar */}
      <AndroidTopBar
        currentTrack={currentTrack}
        onSelectTrack={handleSelectTrack}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenCrucible={() => setIsCrucibleOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1180px] w-full mx-auto px-4 sm:px-8 py-6 mb-16">
        {activeTab === 'syllabus' && (
          <SyllabusView
            currentTrack={currentTrack}
            phases={SYLLABUS[currentTrack]}
            progress={progress}
            onToggleItem={handleToggleItem}
            onToggleRedo={handleToggleRedo}
            onToggleBlocked={handleToggleBlocked}
            onUpdateNote={handleUpdateNote}
            stats={stats}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView progress={progress} startDate={startDate} />
        )}

        {activeTab === 'balance' && <BalanceView stats={stats} />}

        {activeTab === 'sprint' && (
          <SprintTimerView
            onSprintCompleted={handleSprintCompleted}
            sprintHistory={sprintHistory}
          />
        )}

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
