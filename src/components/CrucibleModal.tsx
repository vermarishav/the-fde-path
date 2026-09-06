import React, { useState, useEffect } from 'react';
import { SYLLABUS } from '../data/syllabus';
import { ProgressMap } from '../types';
import { triggerHaptic } from '../utils/haptics';
import confetti from 'canvas-confetti';
import { Flame, X, Check } from 'lucide-react';

interface CrucibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: ProgressMap;
}

export const CrucibleModal: React.FC<CrucibleModalProps> = ({ isOpen, onClose, progress }) => {
  const [randomItems, setRandomItems] = useState<{ phaseTitle: string; itemText: string }[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsCompleted(false);
      setAnswers({});
      // Collect all checked items
      const checked: { phaseTitle: string; itemText: string }[] = [];
      (['foundation', 'advanced'] as const).forEach((tk) => {
        SYLLABUS[tk].forEach((phase) => {
          phase.items.forEach((item, i) => {
            const key = `${phase.id}::${i}`;
            if (progress[key]?.checked) {
              checked.push({
                phaseTitle: `${phase.index} — ${phase.title}`,
                itemText: item.t,
              });
            }
          });
        });
      });

      // Pick 3 random
      const shuffled = [...checked].sort(() => 0.5 - Math.random());
      setRandomItems(shuffled.slice(0, 3));
    }
  }, [isOpen, progress]);

  if (!isOpen) return null;

  const handleFinish = () => {
    triggerHaptic('heavy');
    setIsCompleted(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1B19]/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF8F3] w-full max-w-2xl sm:rounded-xl rounded-t-2xl border border-[#E3DED0] max-h-[92vh] flex flex-col shadow-2xl mx-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#E3DED0]" />
        </div>

        {/* Header */}
        <div className="bg-[#FAF8F3] border-b border-[#E3DED0] px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#B8863A]" />
            <div>
              <span className="font-mono text-[10px] text-[#B8863A] uppercase tracking-wider block">
                Active Recall Protocol
              </span>
              <h3 className="font-serif text-lg font-semibold text-[#1C1B19]">The Sunday Crucible</h3>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-[#F2EFE6] text-[#55524A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto pb-safe">
          <p className="text-xs sm:text-sm text-[#55524A] leading-relaxed">
            Three concepts you have checked off. Prove you retained them without opening documentation
            or glancing at notes.
          </p>

          {randomItems.length === 0 ? (
            <div className="bg-[#F2EFE6] border border-[#E3DED0] p-6 rounded-lg text-center space-y-2">
              <p className="font-serif text-base font-semibold text-[#1C1B19]">
                Not enough completed milestones
              </p>
              <p className="text-xs text-[#55524A] max-w-sm mx-auto">
                Check off a few items in your syllabus first before attempting the memory crucible.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {randomItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#F2EFE6] border border-[#E3DED0] rounded-lg p-4 space-y-2"
                >
                  <span className="text-[10px] font-mono text-[#948E7E] block">
                    {item.phaseTitle}
                  </span>
                  <h4 className="font-serif text-sm sm:text-base font-semibold text-[#1C1B19]">
                    {item.itemText}
                  </h4>
                  <textarea
                    rows={3}
                    value={answers[idx] || ''}
                    onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                    placeholder="Write your explanation or mental model cold from memory..."
                    className="w-full text-xs font-sans p-2.5 bg-[#FAF8F3] border border-[#E3DED0] focus:border-[#2954A6] rounded outline-none transition-colors text-[#1C1B19]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {randomItems.length > 0 && (
          <div className="bg-[#F2EFE6] border-t border-[#E3DED0] px-5 py-3 flex justify-end gap-2">
            <button
              onClick={handleFinish}
              className="px-5 py-2 bg-[#2954A6] hover:bg-[#214486] text-[#FAF8F3] rounded-full text-xs font-mono font-medium transition-all active:scale-95 flex items-center gap-1.5"
            >
              {isCompleted ? (
                <>
                  <Check className="w-4 h-4" /> Done!
                </>
              ) : (
                'Complete Review'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
