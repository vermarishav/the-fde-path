import React, { useState, useMemo } from 'react';
import { FLASHCARDS } from '../data/flashcards';
import { Flashcard, BucketType } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { playTick, playChime } from '../utils/audio';
import {
  RotateCw,
  CheckCircle2,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Sparkles,
  BookOpen,
} from 'lucide-react';

const STORAGE_CARDS_KEY = 'fde-flashcard-mastery-v1';

interface FlashcardsViewProps {
  soundEnabled: boolean;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ soundEnabled }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterMastery, setFilterMastery] = useState<'all' | 'needs-review' | 'mastered'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Mastery state: map of cardId -> boolean (true = mastered, false = needs review)
  const [mastery, setMastery] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_CARDS_KEY) || '{}');
    } catch {
      return {};
    }
  });

  const saveMastery = (updated: Record<string, boolean>) => {
    setMastery(updated);
    localStorage.setItem(STORAGE_CARDS_KEY, JSON.stringify(updated));
  };

  const filteredCards = useMemo(() => {
    return FLASHCARDS.filter((card) => {
      if (selectedCategory !== 'all' && card.category !== selectedCategory) {
        return false;
      }
      const isMastered = !!mastery[card.id];
      if (filterMastery === 'mastered' && !isMastered) return false;
      if (filterMastery === 'needs-review' && isMastered) return false;
      return true;
    });
  }, [selectedCategory, filterMastery, mastery]);

  const activeCard: Flashcard | undefined = filteredCards[currentIndex];

  const handleNext = () => {
    triggerHaptic('light');
    if (soundEnabled) playTick();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    triggerHaptic('light');
    if (soundEnabled) playTick();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleFlip = () => {
    triggerHaptic('light');
    if (soundEnabled) playTick();
    setIsFlipped((prev) => !prev);
  };

  const handleMark = (isMastered: boolean) => {
    if (!activeCard) return;
    triggerHaptic(isMastered ? 'success' : 'medium');
    if (soundEnabled) {
      if (isMastered) playChime();
      else playTick();
    }
    const updated = { ...mastery, [activeCard.id]: isMastered };
    saveMastery(updated);

    // Auto advance to next card
    setTimeout(() => {
      if (filteredCards.length > 1) {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
      }
    }, 300);
  };

  const handleShuffle = () => {
    triggerHaptic('medium');
    if (soundEnabled) playTick();
    setIsFlipped(false);
    setCurrentIndex(Math.floor(Math.random() * filteredCards.length));
  };

  const totalMastered = Object.values(mastery).filter(Boolean).length;
  const masteryPct = Math.round((totalMastered / FLASHCARDS.length) * 100);

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#F2EFE6] border border-[#E3DED0] rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#B8863A]" />
              <h2 className="font-serif text-2xl font-bold text-[#1C1B19]">
                Active Recall Cards
              </h2>
            </div>
            <p className="text-xs text-[#55524A] font-mono mt-1">
              High-yield technical interview & enterprise scenario flashcards
            </p>
          </div>
          <div className="flex items-center gap-3 bg-[#FAF8F3] border border-[#E3DED0] px-4 py-2 rounded-2xl">
            <BookOpen className="w-4 h-4 text-[#2954A6]" />
            <div>
              <span className="text-[10px] font-mono text-[#948E7E] block uppercase">
                Overall Mastery
              </span>
              <span className="font-serif text-base font-bold text-[#1C1B19]">
                {totalMastered} / {FLASHCARDS.length} ({masteryPct}%)
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-[#E3DED0]">
          {/* Category Chips */}
          {(['all', 'core', 'ai', 'customer'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                triggerHaptic('light');
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 text-xs font-mono rounded-full transition-all ${
                selectedCategory === cat
                  ? 'bg-[#2954A6] text-white shadow-sm'
                  : 'bg-[#FAF8F3] border border-[#E3DED0] text-[#55524A] hover:text-[#1C1B19]'
              }`}
            >
              {cat === 'all'
                ? 'All Domains'
                : cat === 'core'
                ? 'Core Systems'
                : cat === 'ai'
                ? 'Applied AI'
                : 'Customer Delivery'}
            </button>
          ))}

          <div className="h-4 w-[1px] bg-[#E3DED0] mx-1 hidden sm:block" />

          {/* Mastery Filter */}
          {(['all', 'needs-review', 'mastered'] as const).map((mf) => (
            <button
              key={mf}
              onClick={() => {
                triggerHaptic('light');
                setFilterMastery(mf);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 text-xs font-mono rounded-full transition-all ${
                filterMastery === mf
                  ? 'bg-[#1C1B19] text-white shadow-sm'
                  : 'bg-[#FAF8F3] border border-[#E3DED0] text-[#55524A] hover:text-[#1C1B19]'
              }`}
            >
              {mf === 'all'
                ? 'All Status'
                : mf === 'needs-review'
                ? 'Review Needed'
                : 'Mastered'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flashcard Card */}
      {activeCard ? (
        <div className="space-y-4">
          <div
            onClick={handleFlip}
            className="cursor-pointer min-h-[320px] sm:min-h-[360px] bg-[#FAF8F3] border-2 border-[#1C1B19] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[4px_4px_0px_#1C1B19] transition-all hover:translate-y-[-2px] active:translate-y-[1px]"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold ${
                    activeCard.category === 'core'
                      ? 'bg-[#DCE5F3] text-[#2954A6]'
                      : activeCard.category === 'ai'
                      ? 'bg-[#E1E8D9] text-[#71875F]'
                      : 'bg-[#F1E4CB] text-[#B8863A]'
                  }`}
                >
                  {activeCard.category === 'core'
                    ? 'Distributed Core'
                    : activeCard.category === 'ai'
                    ? 'Applied AI & RAG'
                    : 'Customer Crucible'}
                </span>
                <span className="text-[10px] font-mono text-[#948E7E] uppercase">
                  {activeCard.difficulty}
                </span>
              </div>
              <span className="text-xs font-mono text-[#948E7E]">
                {currentIndex + 1} / {filteredCards.length}
              </span>
            </div>

            {/* Card Content (Question or Answer) */}
            <div className="my-auto py-6">
              {!isFlipped ? (
                <div className="space-y-3 animate-fadeIn">
                  <span className="text-[11px] font-mono text-[#71875F] tracking-wider uppercase block">
                    QUESTION / ARCHITECTURAL SCENARIO
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1B19] leading-snug">
                    {activeCard.question}
                  </h3>
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <span className="text-[11px] font-mono text-[#2954A6] tracking-wider uppercase block">
                    EXPLANATION & ARCHITECTURAL VERDICT
                  </span>
                  <p className="text-sm sm:text-base text-[#1C1B19] leading-relaxed">
                    {activeCard.answer}
                  </p>

                  {activeCard.codeSnippet && (
                    <div className="bg-[#1C1B19] text-[#FAF8F3] p-3 rounded-xl font-mono text-xs overflow-x-auto">
                      <pre>{activeCard.codeSnippet}</pre>
                    </div>
                  )}

                  <div className="bg-[#F2EFE6] border border-[#E3DED0] rounded-xl p-3.5 mt-3">
                    <span className="text-[10px] font-mono text-[#B8863A] uppercase font-bold block">
                      KEY TAKEAWAY FOR INTERVIEWS
                    </span>
                    <p className="text-xs text-[#55524A] font-medium mt-1">
                      {activeCard.keyTakeaway}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E3DED0]">
              <span className="text-[11px] font-mono text-[#948E7E] flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5" />
                {isFlipped ? 'Tap to view Question' : 'Tap to reveal Answer'}
              </span>

              {mastery[activeCard.id] && (
                <span className="text-xs font-mono text-[#71875F] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                </span>
              )}
            </div>
          </div>

          {/* Action & Evaluation Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleMark(false)}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#FAF8F3] border border-[#E3DED0] hover:border-[#B5453E] text-[#B5453E] font-mono text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
            >
              <HelpCircle className="w-4 h-4" /> Needs Review
            </button>

            <button
              onClick={() => handleMark(true)}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#71875F] hover:bg-[#5E724E] text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" /> Got It / Mastered
            </button>
          </div>

          {/* Card Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 text-xs font-mono text-[#55524A] hover:text-[#1C1B19] px-3 py-1.5 rounded-lg border border-[#E3DED0]"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <button
              onClick={handleShuffle}
              className="flex items-center gap-1.5 text-xs font-mono text-[#55524A] hover:text-[#1C1B19] px-3 py-1.5 rounded-lg border border-[#E3DED0]"
            >
              <Shuffle className="w-3.5 h-3.5" /> Shuffle
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 text-xs font-mono text-[#55524A] hover:text-[#1C1B19] px-3 py-1.5 rounded-lg border border-[#E3DED0]"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#FAF8F3] border border-[#E3DED0] rounded-3xl p-12 text-center space-y-4">
          <BookOpen className="w-10 h-10 text-[#948E7E] mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#1C1B19]">
            No cards match the selected filter
          </h3>
          <p className="text-xs text-[#55524A]">
            Try switching back to "All Domains" or "All Status"
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setFilterMastery('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#2954A6] text-white text-xs font-mono font-medium"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
