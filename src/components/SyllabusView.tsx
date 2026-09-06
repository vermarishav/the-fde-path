import React, { useState, useMemo, useRef } from 'react';
import { Phase, ProgressMap, TrackType, BucketType } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { playTick, playChime } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Search,
  X,
  Bookmark,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ArrowRight,
  Check,
  CheckCircle2,
  Sparkles,
  Star,
} from 'lucide-react';

interface SyllabusViewProps {
  currentTrack: TrackType;
  phases: Phase[];
  progress: ProgressMap;
  onToggleItem: (key: string, isMilestone?: boolean) => void;
  onToggleRedo: (key: string) => void;
  onToggleBlocked: (key: string) => void;
  onToggleBookmark?: (key: string) => void;
  onUpdateNote: (key: string, note: string) => void;
  soundEnabled?: boolean;
  stats: {
    totalItems: number;
    doneItems: number;
    progressPct: number;
    pacingEstimate: string;
  };
}

export const SyllabusView: React.FC<SyllabusViewProps> = ({
  currentTrack,
  phases,
  progress,
  onToggleItem,
  onToggleRedo,
  onToggleBlocked,
  onToggleBookmark,
  onUpdateNote,
  soundEnabled = true,
  stats,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRedo, setFilterRedo] = useState(false);
  const [filterBookmarked, setFilterBookmarked] = useState(false);
  const [filterFriction, setFilterFriction] = useState(false);
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);

  const [openPhases, setOpenPhases] = useState<Record<string, boolean>>(() => {
    // Open the first phase by default
    return { [phases[0]?.id || '']: true };
  });
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});

  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const bucketColors: Record<BucketType, { text: string; bg: string; dot: string }> = {
    core: { text: '#2954A6', bg: '#DCE5F3', dot: 'bg-[#2954A6]' },
    ai: { text: '#B8863A', bg: '#F1E4CB', dot: 'bg-[#B8863A]' },
    customer: { text: '#71875F', bg: '#E1E8D9', dot: 'bg-[#71875F]' },
  };

  const togglePhase = (phaseId: string) => {
    triggerHaptic('light');
    setOpenPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const toggleDetail = (key: string) => {
    triggerHaptic('light');
    setOpenDetails((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Jump to next unchecked item
  const handleJumpToNext = () => {
    triggerHaptic('medium');
    for (const phase of phases) {
      for (let i = 0; i < phase.items.length; i++) {
        const key = `${phase.id}::${i}`;
        const itemState = progress[key];
        if (!itemState?.checked) {
          // Open this phase
          setOpenPhases((prev) => ({ ...prev, [phase.id]: true }));
          // Open detail
          setOpenDetails((prev) => ({ ...prev, [key]: true }));
          // Scroll smoothly
          setTimeout(() => {
            const el = itemRefs.current[key];
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
          return;
        }
      }
    }
  };

  const handleCheckboxClick = (key: string, isMilestone?: boolean) => {
    triggerHaptic(isMilestone ? 'heavy' : 'light');
    const wasChecked = progress[key]?.checked;
    onToggleItem(key, isMilestone);

    if (soundEnabled) {
      if (!wasChecked && isMilestone) {
        playChime();
      } else {
        playTick();
      }
    }

    if (!wasChecked && isMilestone) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#2954A6', '#71875F', '#B8863A'],
        });
      } catch {
        // Ignore if confetti fails
      }
    }
  };

  // Filter items based on active criteria
  const filteredPhases = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return phases
      .map((phase) => {
        const filteredItems = phase.items
          .map((item, index) => {
            const key = `${phase.id}::${index}`;
            const state = progress[key] || { checked: false, note: '', redo: false, blocked: false, bookmarked: false };
            const matchesQuery =
              q === '' ||
              item.t.toLowerCase().includes(q) ||
              state.note.toLowerCase().includes(q) ||
              (item.sub && item.sub.some((s) => s.toLowerCase().includes(q)));

            if (!matchesQuery) return null;
            if (filterBookmarked && !state.bookmarked) return null;
            if (filterRedo && !state.redo) return null;
            if (filterFriction && !(state.redo || state.blocked || state.note.trim().length > 0)) return null;
            if (filterCompleted === true && !state.checked) return null;
            if (filterCompleted === false && state.checked) return null;

            return { item, index, key, state };
          })
          .filter(Boolean) as { item: any; index: number; key: string; state: any }[];

        return {
          ...phase,
          filteredItems,
        };
      })
      .filter((p) => p.filteredItems.length > 0);
  }, [phases, progress, searchQuery, filterRedo, filterFriction, filterCompleted]);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <section className="pt-2 sm:pt-4">
        <div className="max-w-[760px]">
          <p className="font-mono text-xs text-[#2954A6] mb-3 tracking-wide">
            Zero coding experience → Forward Deployed Engineer
          </p>
          <h2 className="font-serif text-3xl sm:text-[44px] font-semibold text-[#1C1B19] leading-[1.18] tracking-tight mb-4">
            Fifteen months of foundation.<br className="hidden sm:inline" />
            Eight months of depth.<br className="hidden sm:inline" />
            One engineer who can ship.
          </h2>
          <p className="text-[#55524A] text-sm sm:text-base leading-relaxed mb-6">
            This is a working syllabus, not a reading list. Three skill buckets, month by month, sprint by
            sprint, with an operating system built to prevent tutorial hell.
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            <div className="inline-flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-full border border-[#E3DED0] bg-[#F2EFE6]">
              <span className="w-2 h-2 rounded-full bg-[#2954A6]" /> Core engineering
            </div>
            <div className="inline-flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-full border border-[#E3DED0] bg-[#F2EFE6]">
              <span className="w-2 h-2 rounded-full bg-[#B8863A]" /> Applied AI
            </div>
            <div className="inline-flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-full border border-[#E3DED0] bg-[#F2EFE6]">
              <span className="w-2 h-2 rounded-full bg-[#71875F]" /> Customer-facing
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="border-t-[1.4px] border-[#1C1B19] border-b border-[#E3DED0] grid grid-cols-2 sm:grid-cols-5 py-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E3DED0]">
          <div className="py-2 sm:py-0 px-3">
            <span className="block font-serif text-2xl sm:text-3xl font-semibold text-[#1C1B19]">
              {stats.totalItems}
            </span>
            <span className="block font-mono text-[11px] text-[#948E7E] mt-0.5">checklist items</span>
          </div>
          <div className="py-2 sm:py-0 px-3">
            <span className="block font-serif text-2xl sm:text-3xl font-semibold text-[#1C1B19]">
              23
            </span>
            <span className="block font-mono text-[11px] text-[#948E7E] mt-0.5">months, two tracks</span>
          </div>
          <div className="py-2 sm:py-0 px-3">
            <span className="block font-serif text-2xl sm:text-3xl font-semibold text-[#1C1B19]">
              4
            </span>
            <span className="block font-mono text-[11px] text-[#948E7E] mt-0.5">portfolio systems</span>
          </div>
          <div className="py-2 sm:py-0 px-3">
            <span className="block font-serif text-2xl sm:text-3xl font-semibold text-[#71875F]">
              {stats.progressPct}%
            </span>
            <span className="block font-mono text-[11px] text-[#948E7E] mt-0.5">your progress</span>
          </div>
          <div className="py-2 sm:py-0 px-3 col-span-2 sm:col-span-1">
            <span className="block font-serif text-2xl sm:text-3xl font-semibold text-[#2954A6]">
              {stats.pacingEstimate}
            </span>
            <span className="block font-mono text-[11px] text-[#948E7E] mt-0.5">pacing estimate</span>
          </div>
        </div>
      </section>

      {/* Track Title & Search Toolbar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E3DED0] pb-3">
          <div>
            <p className="font-mono text-xs text-[#2954A6]">
              {currentTrack === 'foundation' ? '03 — the foundation track' : '03 — the advanced track'}
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1B19]">
              {currentTrack === 'foundation' ? 'Zero to junior-ready' : 'Junior-ready to mid-level'}
            </h3>
          </div>
          <p className="font-mono text-xs text-[#948E7E]">
            {currentTrack === 'foundation' ? '15 months · 3 real projects' : '8 months · production-grade depth'}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Search Bar */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-[420px] bg-[#F2EFE6] border border-[#E3DED0] focus-within:border-[#2954A6] focus-within:bg-[#FAF8F3] rounded-full px-3.5 py-2 transition-colors">
            <Search className="w-4 h-4 text-[#948E7E] flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search syllabus or notes..."
              className="bg-transparent text-xs sm:text-sm text-[#1C1B19] placeholder-[#948E7E] outline-none flex-1 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#948E7E] hover:text-[#1C1B19] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <button
            onClick={() => {
              triggerHaptic('light');
              setFilterBookmarked((prev) => !prev);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono border transition-all ${
              filterBookmarked
                ? 'bg-[#F1E4CB] border-[#B8863A] text-[#B8863A] font-semibold'
                : 'bg-[#FAF8F3] border-[#E3DED0] text-[#55524A] hover:border-[#948E7E]'
            }`}
          >
            <Star className={`w-3 h-3 ${filterBookmarked ? 'fill-current' : ''}`} />
            <span>Bookmarked</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setFilterRedo((prev) => !prev);
              if (!filterRedo) setFilterFriction(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono border transition-all ${
              filterRedo
                ? 'bg-[#F1E4CB] border-[#B8863A] text-[#B8863A] font-semibold'
                : 'bg-[#FAF8F3] border-[#E3DED0] text-[#55524A] hover:border-[#948E7E]'
            }`}
          >
            <Bookmark className="w-3 h-3" />
            <span>Redos</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setFilterFriction((prev) => !prev);
              if (!filterFriction) setFilterRedo(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono border transition-all ${
              filterFriction
                ? 'bg-[#EBE1EC] border-[#6B4A75] text-[#6B4A75] font-semibold'
                : 'bg-[#FAF8F3] border-[#E3DED0] text-[#55524A] hover:border-[#948E7E]'
            }`}
          >
            <AlertCircle className="w-3 h-3" />
            <span>Friction Log</span>
          </button>

          {/* Jump to next button */}
          <button
            onClick={handleJumpToNext}
            className="ml-auto flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono bg-[#FAF8F3] hover:bg-[#DCE5F3] text-[#2954A6] border border-[#2954A6]/30 hover:border-[#2954A6] transition-all active:scale-95 shadow-xs"
          >
            <span>Jump to next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Spine Checklist Layout */}
      <section className="relative pl-6 sm:pl-8 before:content-[''] before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-[1.4px] before:bg-[#E3DED0] space-y-8">
        {filteredPhases.length === 0 ? (
          <div className="py-12 text-center text-[#948E7E] font-mono text-sm">
            No matching items found for your filters.
          </div>
        ) : (
          filteredPhases.map((phase) => {
            const total = phase.items.length;
            const done = phase.items.filter((_, i) => progress[`${phase.id}::${i}`]?.checked).length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const isOpen = openPhases[phase.id] || searchQuery !== '' || filterRedo || filterFriction;
            const isComplete = pct === 100;
            const isPartial = pct > 0 && !isComplete;

            return (
              <div key={phase.id} className="relative group">
                {/* Marker Dot */}
                <div
                  className={`absolute -left-[27px] sm:-left-[35px] top-1 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                    isComplete
                      ? 'bg-[#71875F] border-[#71875F]'
                      : isPartial
                      ? 'bg-[#FAF8F3] border-[#2954A6]'
                      : 'bg-[#FAF8F3] border-[#948E7E]'
                  }`}
                />

                {/* Phase Header Card */}
                <div
                  onClick={() => togglePhase(phase.id)}
                  className="cursor-pointer bg-[#F2EFE6]/50 hover:bg-[#F2EFE6] border border-[#E3DED0] rounded-lg p-3 sm:p-4 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
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
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium text-[#55524A]">
                        {done}/{total}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#948E7E] transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>

                  <h4 className="font-serif text-lg sm:text-xl font-semibold text-[#1C1B19] mt-1">
                    {phase.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#55524A] mt-1 line-clamp-2">{phase.desc}</p>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#E3DED0] h-1 rounded-full overflow-hidden mt-3">
                    <div
                      className="bg-[#71875F] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Items Container */}
                {isOpen && (
                  <ul className="mt-3 space-y-1.5">
                    {phase.filteredItems.map(({ item, key, state }) => {
                      const isDetailOpen = openDetails[key] || searchQuery !== '' || filterRedo || filterFriction;

                      return (
                        <li
                          key={key}
                          ref={(el) => {
                            itemRefs.current[key] = el;
                          }}
                          className={`rounded-md border transition-all ${
                            state.checked
                              ? 'bg-[#FAF8F3]/60 border-transparent opacity-85'
                              : item.m
                              ? 'bg-[#DCE5F3]/40 border-[#2954A6]/30'
                              : 'bg-[#FAF8F3] hover:bg-[#F2EFE6]/60 border-[#E3DED0]/60'
                          }`}
                        >
                          {/* Main Row */}
                          <div className="flex items-start gap-3 p-3 select-none">
                            {/* Checkbox Touch Target */}
                            <button
                              type="button"
                              onClick={() => handleCheckboxClick(key, item.m)}
                              className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-[1.4px] flex items-center justify-center transition-all active:scale-90 ${
                                state.checked
                                  ? 'bg-[#71875F] border-[#71875F] text-white'
                                  : item.m
                                  ? 'border-[#2954A6] bg-white'
                                  : 'border-[#948E7E] bg-white hover:border-[#1C1B19]'
                              }`}
                              title={state.checked ? 'Mark uncompleted' : 'Mark completed'}
                            >
                              {state.checked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                            </button>

                            {/* Item Text */}
                            <div
                              onClick={() => handleCheckboxClick(key, item.m)}
                              className="flex-1 cursor-pointer"
                            >
                              <div
                                className={`text-xs sm:text-sm leading-relaxed transition-colors ${
                                  state.checked
                                    ? 'text-[#948E7E] line-through'
                                    : item.m
                                    ? 'font-semibold text-[#2954A6]'
                                    : 'text-[#1C1B19]'
                                }`}
                              >
                                {item.m && (
                                  <span className="inline-flex items-center gap-1 mr-1.5 text-[10px] font-mono uppercase bg-[#2954A6] text-white px-1.5 py-0.5 rounded">
                                    <Sparkles className="w-2.5 h-2.5" /> Milestone
                                  </span>
                                )}
                                {item.t}
                              </div>

                              {/* Flag indicators */}
                              {(state.redo || state.blocked) && (
                                <div className="flex items-center gap-1.5 mt-1.5">
                                  {state.redo && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#B8863A] bg-[#F1E4CB] px-2 py-0.5 rounded-full">
                                      <Bookmark className="w-2.5 h-2.5" /> Redo
                                    </span>
                                  )}
                                  {state.blocked && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#6B4A75] bg-[#EBE1EC] px-2 py-0.5 rounded-full">
                                      <AlertCircle className="w-2.5 h-2.5" /> Blocked
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Bookmark Star Toggle */}
                            {onToggleBookmark && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  triggerHaptic('light');
                                  if (soundEnabled) playTick();
                                  onToggleBookmark(key);
                                }}
                                className={`p-1 rounded transition-colors ${
                                  state.bookmarked
                                    ? 'text-[#B8863A]'
                                    : 'text-[#948E7E] hover:text-[#B8863A]'
                                }`}
                                title={state.bookmarked ? 'Remove Bookmark' : 'Bookmark Topic'}
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    state.bookmarked ? 'fill-current text-[#B8863A]' : ''
                                  }`}
                                />
                              </button>
                            )}

                            {/* Expand Detail Toggle */}
                            <button
                              type="button"
                              onClick={() => toggleDetail(key)}
                              className={`p-1 text-[#948E7E] hover:text-[#1C1B19] rounded transition-transform ${
                                isDetailOpen ? 'rotate-180 text-[#1C1B19]' : ''
                              }`}
                              title="Toggle details & notes"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Expanded Detail Panel */}
                          {isDetailOpen && (
                            <div className="px-3 pb-3 pt-1 ml-8 space-y-3 border-t border-[#E3DED0]/50 mt-1">
                              {/* Sub-steps */}
                              {item.sub && item.sub.length > 0 && (
                                <ul className="space-y-1">
                                  {item.sub.map((subText: string, sIdx: number) => (
                                    <li
                                      key={sIdx}
                                      className="text-xs text-[#55524A] flex items-baseline gap-2"
                                    >
                                      <span className="text-[#948E7E] font-mono">—</span>
                                      <span>{subText}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}

                              {/* Study Link */}
                              {item.link && (
                                <div>
                                  <a
                                    href={item.link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full border border-[#E3DED0] bg-[#F2EFE6] hover:border-[#2954A6] hover:text-[#2954A6] transition-colors"
                                  >
                                    <span className="text-[10px] uppercase font-semibold text-[#2954A6]">
                                      {item.link.kind}
                                    </span>
                                    <span className="text-[#1C1B19]">{item.link.label}</span>
                                    <ExternalLink className="w-3 h-3 text-[#948E7E]" />
                                  </a>
                                </div>
                              )}

                              {/* Flag Actions */}
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    triggerHaptic('light');
                                    onToggleRedo(key);
                                  }}
                                  className={`flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded border transition-colors ${
                                    state.redo
                                      ? 'bg-[#F1E4CB] text-[#B8863A] border-[#B8863A]'
                                      : 'bg-white text-[#55524A] border-[#E3DED0] hover:border-[#948E7E]'
                                  }`}
                                >
                                  <Bookmark className="w-3 h-3" />
                                  <span>{state.redo ? 'Flagged Redo' : 'Flag Redo'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    triggerHaptic('light');
                                    onToggleBlocked(key);
                                  }}
                                  className={`flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded border transition-colors ${
                                    state.blocked
                                      ? 'bg-[#EBE1EC] text-[#6B4A75] border-[#6B4A75]'
                                      : 'bg-white text-[#55524A] border-[#E3DED0] hover:border-[#948E7E]'
                                  }`}
                                >
                                  <AlertCircle className="w-3 h-3" />
                                  <span>{state.blocked ? 'Marked Blocked' : 'Mark Blocked'}</span>
                                </button>
                              </div>

                              {/* Private Notes Field */}
                              <div>
                                <textarea
                                  value={state.note}
                                  onChange={(e) => onUpdateNote(key, e.target.value)}
                                  placeholder="Private friction log / implementation notes..."
                                  rows={2}
                                  className="w-full text-xs font-sans p-2.5 bg-[#F2EFE6] border border-[#E3DED0] focus:border-[#2954A6] focus:bg-[#FAF8F3] rounded outline-none transition-colors resize-y text-[#1C1B19]"
                                />
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};
