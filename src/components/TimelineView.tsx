import React, { useState, useMemo } from 'react';
import { SYLLABUS } from '../data/syllabus';
import { ProgressMap, BucketType } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { Flag, Check, Calendar, ChevronRight } from 'lucide-react';

interface TimelineViewProps {
  progress: ProgressMap;
  startDate: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ progress, startDate }) => {
  const [density, setDensity] = useState<'collapsed' | 'expanded'>('collapsed');
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);

  const portfolioPhases = ['f-p3b', 'f-p5b', 'a-m5'];

  const bucketColors: Record<BucketType, { text: string; bg: string }> = {
    core: { text: '#2954A6', bg: '#DCE5F3' },
    ai: { text: '#B8863A', bg: '#F1E4CB' },
    customer: { text: '#71875F', bg: '#E1E8D9' },
  };

  // Calculate velocity and timeline projections
  const timelineData = useMemo(() => {
    let totalDoneGlobally = 0;
    ['foundation', 'advanced'].forEach((tk) => {
      SYLLABUS[tk as 'foundation' | 'advanced'].forEach((p) => {
        p.items.forEach((_, i) => {
          if (progress[`${p.id}::${i}`]?.checked) totalDoneGlobally++;
        });
      });
    });

    // Default velocity: ~3 items per week = 3/7 per day
    let velocity = 3 / 7;
    if (startDate && totalDoneGlobally > 0) {
      const daysSinceStart = Math.max(1, (Date.now() - new Date(startDate).getTime()) / 86400000);
      velocity = totalDoneGlobally / daysSinceStart;
    }
    if (velocity > 2) velocity = 2; // Cap max velocity

    const runningDate = new Date();
    let foundActive = false;

    const tracks = (['foundation', 'advanced'] as const).map((tk) => {
      const trackTitle = tk === 'foundation' ? 'Track 1: Foundation (0–9)' : 'Track 2: Advanced (1–8)';
      const phases = SYLLABUS[tk].map((phase) => {
        const total = phase.items.length;
        const done = phase.items.filter((_, i) => progress[`${phase.id}::${i}`]?.checked).length;
        const isPortfolio = portfolioPhases.includes(phase.id);

        let status: 'done' | 'active' | 'pending' = 'pending';
        if (done === total && total > 0) {
          status = 'done';
        } else if (!foundActive) {
          status = 'active';
          foundActive = true;
        }

        let forecast = '';
        const daysToComplete = (total - done) / velocity;
        if (status === 'done') {
          forecast = 'Completed';
        } else {
          runningDate.setDate(runningDate.getDate() + daysToComplete);
          const month = runningDate.toLocaleString('default', { month: 'short' });
          const year = runningDate.getFullYear();
          forecast = `${status === 'active' ? 'Target: ' : 'Proj: '}${month} ${year}`;
        }

        const milestoneItem = phase.items.find((i) => i.m) || phase.items[phase.items.length - 1];

        return {
          ...phase,
          total,
          done,
          isPortfolio,
          status,
          forecast,
          milestoneItem,
        };
      });

      return { trackTitle, tk, phases };
    });

    return tracks;
  }, [progress, startDate]);

  const scrollToNode = (id: string) => {
    triggerHaptic('light');
    setSelectedPhaseId(id);
    const el = document.getElementById(`timeline-node-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-6 pt-2 sm:pt-4 max-w-[1100px] mx-auto pb-16">
      {/* Header */}
      <div className="border-b border-[#E3DED0] pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-[#2954A6]">Strategic Overview</p>
          <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1B19]">
            The Master Timeline
          </h3>
          <p className="text-xs sm:text-sm text-[#55524A] mt-1 max-w-[700px] leading-relaxed">
            A macroscopic roadmap across the full 23-month Forward Deployed Engineering path. Pacing
            estimates adapt to your real velocity.
          </p>
        </div>

        {/* Density Toolbar */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#F2EFE6] p-1 rounded-full border border-[#E3DED0]">
          <button
            onClick={() => {
              triggerHaptic('light');
              setDensity('expanded');
            }}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
              density === 'expanded'
                ? 'bg-[#2954A6] text-[#FAF8F3] font-medium shadow-xs'
                : 'text-[#55524A] hover:text-[#1C1B19]'
            }`}
          >
            Expand All
          </button>
          <button
            onClick={() => {
              triggerHaptic('light');
              setDensity('collapsed');
            }}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
              density === 'collapsed'
                ? 'bg-[#2954A6] text-[#FAF8F3] font-medium shadow-xs'
                : 'text-[#55524A] hover:text-[#1C1B19]'
            }`}
          >
            Milestones
          </button>
        </div>
      </div>

      {/* Horizontal Phase Picker on Mobile */}
      <div className="md:hidden overflow-x-auto pb-2 -mx-4 px-4 flex gap-1.5 no-scrollbar">
        {timelineData.flatMap((t) => t.phases).map((p) => (
          <button
            key={p.id}
            onClick={() => scrollToNode(p.id)}
            className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all ${
              p.status === 'done'
                ? 'bg-[#E1E8D9] text-[#71875F] border-[#71875F]/30'
                : p.status === 'active'
                ? 'bg-[#DCE5F3] text-[#2954A6] border-[#2954A6] font-semibold'
                : 'bg-[#F2EFE6] text-[#948E7E] border-[#E3DED0]'
            }`}
          >
            {p.index.split('·')[0].trim()}
          </button>
        ))}
      </div>

      {/* Tracks & Nodes */}
      <div className="flex gap-8 items-start">
        {/* Desktop Sidebar Navigation */}
        <div className="hidden md:flex flex-col gap-1 w-52 sticky top-20 border-r border-[#E3DED0] pr-3 max-h-[calc(100vh-140px)] overflow-y-auto">
          {timelineData.map((t) => (
            <div key={t.tk} className="mb-3">
              <span className="text-[10px] font-mono uppercase text-[#948E7E] tracking-wider block mb-1">
                {t.trackTitle}
              </span>
              <div className="space-y-0.5">
                {t.phases.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => scrollToNode(p.id)}
                    className={`w-full text-left text-xs font-mono px-2.5 py-1.5 rounded transition-all flex items-center justify-between ${
                      selectedPhaseId === p.id
                        ? 'bg-[#DCE5F3] text-[#2954A6] font-semibold'
                        : p.status === 'done'
                        ? 'text-[#71875F] hover:bg-[#E1E8D9]/50'
                        : p.status === 'active'
                        ? 'text-[#2954A6] font-medium'
                        : 'text-[#55524A] hover:bg-[#F2EFE6]'
                    }`}
                  >
                    <span className="truncate">{p.index}</span>
                    {p.status === 'done' && <Check className="w-3 h-3 text-[#71875F]" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Content Stream */}
        <div className="flex-1 space-y-12">
          {timelineData.map((t) => (
            <div key={t.tk} className="space-y-6">
              <h4 className="font-serif text-xl font-semibold text-[#1C1B19] border-b-[1.4px] border-[#1C1B19] pb-2">
                {t.trackTitle}
              </h4>

              <div className="relative pl-6 sm:pl-8 before:content-[''] before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-0 before:w-[2px] before:bg-[#E3DED0] space-y-6">
                {t.phases.map((phase) => {
                  const isDone = phase.status === 'done';
                  const isActive = phase.status === 'active';

                  return (
                    <div
                      key={phase.id}
                      id={`timeline-node-${phase.id}`}
                      className="relative scroll-mt-24 group"
                    >
                      {/* Node Dot */}
                      <div
                        className={`absolute -left-[27px] sm:-left-[35px] top-3 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                          isDone
                            ? 'bg-[#71875F] border-[#71875F]'
                            : isActive
                            ? 'bg-[#FAF8F3] border-[#2954A6] ring-4 ring-[#DCE5F3]'
                            : 'bg-[#FAF8F3] border-[#948E7E]'
                        }`}
                      />

                      {/* Card */}
                      <div
                        className={`p-4 sm:p-5 rounded-lg border transition-all ${
                          phase.isPortfolio
                            ? 'bg-[#FAF8F3] border-[#B8863A] shadow-xs'
                            : isActive
                            ? 'bg-[#FAF8F3] border-[#2954A6] shadow-xs'
                            : 'bg-[#F2EFE6]/60 border-[#E3DED0]'
                        }`}
                      >
                        {/* Card Header */}
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs text-[#948E7E]">{phase.index}</span>
                              <span
                                className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: bucketColors[phase.bucket].bg,
                                  color: bucketColors[phase.bucket].text,
                                }}
                              >
                                {phase.bucket}
                              </span>
                              {phase.isPortfolio && (
                                <span className="font-mono text-[10px] uppercase bg-[#B8863A] text-white px-2 py-0.5 rounded-full font-medium">
                                  Portfolio Project
                                </span>
                              )}
                            </div>
                            <h5 className="font-serif text-base sm:text-lg font-semibold text-[#1C1B19] mt-1">
                              {phase.title}
                            </h5>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-xs">
                            <span
                              className={`px-2 py-0.5 rounded border text-[11px] ${
                                isDone
                                  ? 'bg-[#E1E8D9] border-[#71875F] text-[#71875F]'
                                  : isActive
                                  ? 'bg-[#DCE5F3] border-[#2954A6] text-[#2954A6] font-medium'
                                  : 'bg-[#FAF8F3] border-[#E3DED0] text-[#55524A]'
                              }`}
                            >
                              {phase.forecast}
                            </span>
                            <span className="bg-[#FAF8F3] border border-[#E3DED0] px-2 py-0.5 rounded text-[11px] text-[#55524A]">
                              {phase.done}/{phase.total}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-[#55524A] mb-3 leading-relaxed">
                          {phase.desc}
                        </p>

                        {/* Core Outcome box */}
                        <div
                          className={`p-2.5 sm:p-3 rounded-md flex items-start gap-2.5 text-xs ${
                            phase.isPortfolio
                              ? 'bg-[#F1E4CB] text-[#B8863A]'
                              : 'bg-[#DCE5F3] text-[#2954A6]'
                          }`}
                        >
                          <Flag className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <div className="font-medium leading-relaxed">
                            <span className="font-bold">Core Outcome:</span> {phase.milestoneItem.t}
                          </div>
                        </div>

                        {/* Expanded Items */}
                        {density === 'expanded' && (
                          <div className="mt-4 pt-3 border-t border-[#E3DED0]/60 space-y-1.5">
                            {phase.items.map((item, idx) => {
                              const checked = progress[`${phase.id}::${idx}`]?.checked;
                              return (
                                <div
                                  key={idx}
                                  className={`text-xs flex items-baseline gap-2 ${
                                    checked ? 'text-[#948E7E] line-through' : 'text-[#55524A]'
                                  }`}
                                >
                                  <span className="font-mono text-[10px]">
                                    {checked ? '✓' : '→'}
                                  </span>
                                  <span>{item.t}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
