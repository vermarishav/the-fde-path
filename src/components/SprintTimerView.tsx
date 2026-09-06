import React, { useState, useEffect, useRef } from 'react';
import { triggerHaptic } from '../utils/haptics';
import confetti from 'canvas-confetti';
import { Play, Square, Flame, RotateCcw } from 'lucide-react';

interface SprintTimerViewProps {
  onSprintCompleted: () => void;
  sprintHistory: Record<string, number>;
}

export const SprintTimerView: React.FC<SprintTimerViewProps> = ({
  onSprintCompleted,
  sprintHistory,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(25); // minutes
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            triggerHaptic('heavy');
            onSprintCompleted();

            try {
              confetti({
                particleCount: 60,
                spread: 70,
                origin: { y: 0.6 },
              });
            } catch {
              // ignore
            }

            return selectedDuration * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, selectedDuration, onSprintCompleted]);

  const selectDuration = (mins: number) => {
    if (isRunning) return;
    triggerHaptic('light');
    setSelectedDuration(mins);
    setTimeLeft(mins * 60);
  };

  const toggleTimer = () => {
    triggerHaptic(isRunning ? 'medium' : 'heavy');
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    triggerHaptic('light');
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // 7-day sprint history bars
  const historyDays = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const count = sprintHistory[ds] || 0;
    const height = Math.max(3, Math.min(32, (count / 6) * 32));
    historyDays.push({ date: ds, dayLabel, count, height, isToday: i === 0 });
  }

  return (
    <div className="space-y-8 pt-2 sm:pt-4 max-w-[800px] mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-[#E3DED0] pb-3">
        <p className="font-mono text-xs text-[#2954A6]">04 — avoiding tutorial hell</p>
        <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1B19]">
          Study Discipline & Sprint Engine
        </h3>
      </div>

      {/* Focus Timer Card */}
      <div className="bg-[#1C1B19] text-[#FAF8F3] rounded-xl p-6 sm:p-8 shadow-lg space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#363430] pb-4">
          <div>
            <span className="text-[10px] font-mono text-[#948E7E] uppercase tracking-wider block">
              execution protocol
            </span>
            <h4 className="font-serif text-xl sm:text-2xl font-semibold mt-0.5">Focus Sprint</h4>
          </div>

          {/* 7-day history */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-mono text-[#948E7E] uppercase tracking-wider">
              Last 7 Days (Volume)
            </span>
            <div className="flex items-end gap-1.5 h-8 pt-1">
              {historyDays.map((d) => (
                <div key={d.date} className="flex flex-col items-center gap-1">
                  <div
                    style={{ height: d.height }}
                    className={`w-3 rounded-xs transition-all ${
                      d.isToday
                        ? 'bg-[#71875F]'
                        : d.count > 0
                        ? 'bg-[#2954A6]'
                        : 'bg-white/15'
                    }`}
                    title={`${d.date}: ${d.count} sprints completed`}
                  />
                  <span className="text-[9px] font-mono text-[#948E7E]">{d.dayLabel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
          {/* Big Time Display */}
          <div className="font-mono text-5xl sm:text-6xl font-semibold tracking-wider text-[#FAF8F3]">
            {timeFormatted}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Presets */}
            <div className="flex items-center gap-1.5 bg-[#2B2926] p-1 rounded-full border border-[#454138]">
              {[15, 25, 45].map((mins) => (
                <button
                  key={mins}
                  disabled={isRunning}
                  onClick={() => selectDuration(mins)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-full transition-colors ${
                    selectedDuration === mins
                      ? 'bg-[#FAF8F3] text-[#1C1B19] font-medium'
                      : 'text-[#948E7E] hover:text-[#FAF8F3] disabled:opacity-50'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>

            {/* Play/Stop and Reset */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTimer}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                  isRunning
                    ? 'bg-[#B5453E] hover:bg-[#9B3932] text-white shadow-sm'
                    : 'bg-[#2954A6] hover:bg-[#214486] text-white shadow-sm'
                }`}
              >
                {isRunning ? (
                  <>
                    <Square className="w-4 h-4 fill-current" />
                    <span>Stop sprint</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start sprint</span>
                  </>
                )}
              </button>

              {timeLeft !== selectedDuration * 60 && (
                <button
                  onClick={resetTimer}
                  className="p-2.5 rounded-full bg-[#2B2926] hover:bg-[#3B3833] text-[#948E7E] hover:text-[#FAF8F3] transition-colors active:scale-95 border border-[#454138]"
                  title="Reset timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-[#948E7E] font-mono">
          {isRunning
            ? 'Deep focus in progress. Phone away. One task. Ship.'
            : 'Phone away. One tab. Go.'}
        </p>
      </div>

      {/* 3 Discipline Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#F2EFE6] border border-[#E3DED0] rounded-lg p-5 space-y-2">
          <span className="font-serif text-2xl font-bold text-[#2954A6]">1</span>
          <h4 className="font-serif text-base font-semibold text-[#1C1B19]">
            Build first, look up only when stuck
          </h4>
          <p className="text-xs text-[#55524A] leading-relaxed">
            Try from what you know. Get stuck. Search that one specific thing. Apply it immediately.
            Close the tab.
          </p>
        </div>

        <div className="bg-[#F2EFE6] border border-[#E3DED0] rounded-lg p-5 space-y-2">
          <span className="font-serif text-2xl font-bold text-[#2954A6]">2</span>
          <h4 className="font-serif text-base font-semibold text-[#1C1B19]">The Friction Log</h4>
          <p className="text-xs text-[#55524A] leading-relaxed">
            When you get stuck, open the item notes. Write one precise sentence about what is blocking
            you. If you can't articulate it, you aren't stuck, you're avoiding work.
          </p>
        </div>

        <div className="bg-[#F2EFE6] border border-[#E3DED0] rounded-lg p-5 space-y-2">
          <span className="font-serif text-2xl font-bold text-[#2954A6]">3</span>
          <h4 className="font-serif text-base font-semibold text-[#1C1B19]">The Redo Rule</h4>
          <p className="text-xs text-[#55524A] leading-relaxed">
            If you referenced how someone else solved an exact problem, flag it for Redo. Redo it once
            from memory later before checking it off.
          </p>
        </div>
      </div>
    </div>
  );
};
