import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SYLLABUS } from '../data/syllabus';
import { triggerHaptic } from '../utils/haptics';
import { Search, X, Play, Flame, Calendar, Printer, ArrowRight } from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string, payload?: any) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const staticCommands = [
    {
      id: 'start-sprint',
      title: 'Start Focus Sprint',
      category: 'Protocol',
      icon: <Play className="w-3.5 h-3.5 text-[#2954A6]" />,
      action: () => onSelectAction('start-sprint'),
    },
    {
      id: 'open-crucible',
      title: 'Launch Sunday Crucible',
      category: 'Review',
      icon: <Flame className="w-3.5 h-3.5 text-[#B8863A]" />,
      action: () => onSelectAction('open-crucible'),
    },
    {
      id: 'view-timeline',
      title: 'Open Master Timeline',
      category: 'Roadmap',
      icon: <Calendar className="w-3.5 h-3.5 text-[#71875F]" />,
      action: () => onSelectAction('view-timeline'),
    },
    {
      id: 'export-summary',
      title: 'Export Technical Summary',
      category: 'Export',
      icon: <Printer className="w-3.5 h-3.5 text-[#55524A]" />,
      action: () => onSelectAction('export-summary'),
    },
  ];

  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    const actions = staticCommands.filter(
      (c) => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );

    const syllabusMatches: {
      id: string;
      title: string;
      phase: string;
      track: 'foundation' | 'advanced';
    }[] = [];

    if (q.length >= 2) {
      (['foundation', 'advanced'] as const).forEach((tk) => {
        SYLLABUS[tk].forEach((phase) => {
          phase.items.forEach((item, idx) => {
            if (item.t.toLowerCase().includes(q)) {
              syllabusMatches.push({
                id: `${phase.id}::${idx}`,
                title: item.t,
                phase: `${phase.index} — ${phase.title}`,
                track: tk,
              });
            }
          });
        });
      });
    }

    return { actions, syllabusMatches: syllabusMatches.slice(0, 8) };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#1C1B19]/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-20"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF8F3] w-full max-w-lg rounded-xl border border-[#E3DED0] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Box */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E3DED0] bg-[#FAF8F3]">
          <Search className="w-5 h-5 text-[#948E7E] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search 23 months of syllabus..."
            className="flex-1 bg-transparent text-sm text-[#1C1B19] placeholder-[#948E7E] outline-none font-sans"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#948E7E] hover:text-[#1C1B19] p-1">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Stream */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-[#E3DED0]/50">
          {/* Action Commands */}
          {filteredResults.actions.length > 0 && (
            <div className="pb-2 space-y-1">
              <span className="text-[10px] font-mono text-[#948E7E] uppercase px-3 py-1 block">
                Actions
              </span>
              {filteredResults.actions.map((act) => (
                <button
                  key={act.id}
                  onClick={() => {
                    triggerHaptic('light');
                    act.action();
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F2EFE6] flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    {act.icon}
                    <span className="text-xs sm:text-sm text-[#1C1B19] font-medium">{act.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#948E7E] group-hover:text-[#55524A]">
                    {act.category}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Syllabus Items */}
          {filteredResults.syllabusMatches.length > 0 && (
            <div className="pt-2 space-y-1">
              <span className="text-[10px] font-mono text-[#948E7E] uppercase px-3 py-1 block">
                Syllabus Items
              </span>
              {filteredResults.syllabusMatches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    triggerHaptic('light');
                    onSelectAction('jump-item', { track: m.track, key: m.id });
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F2EFE6] flex flex-col gap-0.5 transition-colors group"
                >
                  <span className="text-xs text-[#1C1B19] leading-snug line-clamp-1">{m.title}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#948E7E]">{m.phase}</span>
                    <ArrowRight className="w-3 h-3 text-[#948E7E] group-hover:text-[#2954A6] transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {filteredResults.actions.length === 0 && filteredResults.syllabusMatches.length === 0 && (
            <div className="py-8 text-center text-xs font-mono text-[#948E7E]">
              No commands or syllabus matches found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
