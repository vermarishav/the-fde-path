import React from 'react';
import { CASE_STUDIES } from '../data/syllabus';
import { triggerHaptic } from '../utils/haptics';
import { Download, Printer, RotateCcw, Flame, ArrowUpRight } from 'lucide-react';

interface PortfolioViewProps {
  onOpenCaseStudy: (id: string) => void;
  onOpenCrucible: () => void;
  onExportSummary: () => void;
  onExportProgress: () => void;
  onConfirmReset: () => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  onOpenCaseStudy,
  onOpenCrucible,
  onExportSummary,
  onExportProgress,
  onConfirmReset,
}) => {
  const projects = [
    {
      id: 'expense',
      tag: 'Month 3 · Foundation',
      title: 'Expense Tracker CLI',
      desc: 'Command-line Python app transitioning into a REST API. Focuses on data models, JSON/SQLite persistence, and rigorous error handling.',
      actionText: 'View Specs',
      isFeatured: false,
    },
    {
      id: 'booking',
      tag: 'Month 7 · Foundation',
      title: 'Booking System Backend',
      desc: 'Full API with SQLite/Postgres, JWT Auth, and tested endpoints. Containerized and deployed live on AWS Beanstalk.',
      actionText: 'View Specs',
      isFeatured: false,
    },
    {
      id: 'rag',
      tag: 'Month 11 · Foundation',
      title: 'RAG Document Assistant',
      desc: 'Chat with your own notes. Involves text chunking strategies, embeddings, vector search, and a working agent loop.',
      actionText: 'View Specs',
      isFeatured: false,
    },
    {
      id: 'agent',
      tag: 'Month 5–6 · Advanced',
      title: 'Evaluated Multi-Agent System',
      desc: 'Planner-executor-critic with state persistence, human-in-the-loop escalation, LangSmith tracing, and a real automated eval suite.',
      actionText: 'View Case Study',
      isFeatured: true,
    },
  ];

  return (
    <div className="space-y-8 pt-2 sm:pt-4 max-w-[1000px] mx-auto pb-16">
      {/* Header */}
      <div className="border-b border-[#E3DED0] pb-3">
        <p className="font-mono text-xs text-[#2954A6]">05 — what you'll have shipped</p>
        <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1B19]">
          Engineering Portfolio
        </h3>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {projects.map((p) => {
          return (
            <div
              key={p.id}
              className={`rounded-lg border p-5 flex flex-col justify-between transition-all ${
                p.isFeatured
                  ? 'bg-[#2954A6] text-[#FAF8F3] border-[#2954A6] shadow-sm'
                  : 'bg-[#FAF8F3] border-[#E3DED0] hover:border-[#948E7E]'
              }`}
            >
              <div>
                <span
                  className={`text-[10px] font-mono block mb-2 ${
                    p.isFeatured ? 'text-[#C7D4EC]' : 'text-[#948E7E]'
                  }`}
                >
                  {p.tag}
                </span>
                <h4 className="font-serif text-lg font-semibold mb-2 leading-snug">{p.title}</h4>
                <p
                  className={`text-xs leading-relaxed mb-6 ${
                    p.isFeatured ? 'text-[#E4EAF6]' : 'text-[#55524A]'
                  }`}
                >
                  {p.desc}
                </p>
              </div>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  onOpenCaseStudy(p.id);
                }}
                className={`w-full py-2 px-3 rounded-full text-xs font-mono flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                  p.isFeatured
                    ? 'bg-[#FAF8F3] text-[#2954A6] font-semibold hover:bg-white'
                    : 'bg-[#F2EFE6] text-[#1C1B19] hover:bg-[#E3DED0] border border-[#E3DED0]'
                }`}
              >
                <span>{p.actionText}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Sunday Crucible Trigger Banner */}
      <div className="bg-[#F2EFE6] border border-[#E3DED0] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#B8863A]" />
            <span className="font-mono text-xs text-[#B8863A] font-semibold uppercase tracking-wider">
              The Sunday Crucible
            </span>
          </div>
          <h4 className="font-serif text-lg font-semibold text-[#1C1B19]">
            Active Recall from Memory
          </h4>
          <p className="text-xs text-[#55524A] max-w-[540px]">
            Pulls 3 concepts you recently checked off. Prove you retained them without looking at
            notes or documentation.
          </p>
        </div>

        <button
          onClick={() => {
            triggerHaptic('medium');
            onOpenCrucible();
          }}
          className="px-4 py-2 bg-[#2954A6] text-[#FAF8F3] hover:bg-[#214486] rounded-full text-xs font-mono font-medium transition-all active:scale-95 self-stretch sm:self-auto flex items-center justify-center gap-2"
        >
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>Launch Crucible</span>
        </button>
      </div>

      {/* Data and Export Management */}
      <div className="border-t border-[#E3DED0] pt-6 space-y-3">
        <h4 className="font-serif text-base font-semibold text-[#1C1B19]">
          Data Management & Verification
        </h4>
        <p className="text-xs text-[#55524A]">
          Your syllabus progress and private friction logs are preserved automatically in browser
          storage. You can export a printable technical summary, backup your raw data, or reset.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => {
              triggerHaptic('light');
              onExportSummary();
            }}
            className="flex items-center gap-2 text-xs font-mono px-3.5 py-2 rounded-full border border-[#E3DED0] bg-[#FAF8F3] hover:border-[#2954A6] hover:text-[#2954A6] transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export Technical Summary</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              onExportProgress();
            }}
            className="flex items-center gap-2 text-xs font-mono px-3.5 py-2 rounded-full border border-[#E3DED0] bg-[#FAF8F3] hover:border-[#2954A6] hover:text-[#2954A6] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Progress JSON</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('heavy');
              onConfirmReset();
            }}
            className="flex items-center gap-2 text-xs font-mono px-3.5 py-2 rounded-full border border-[#E3DED0] text-[#B5453E] hover:border-[#B5453E] hover:bg-[#B5453E]/5 transition-colors ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
