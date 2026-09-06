import React from 'react';
import { CASE_STUDIES } from '../data/syllabus';
import { triggerHaptic } from '../utils/haptics';
import { X, Layers, Database, GitPullRequest, Code2 } from 'lucide-react';

interface CaseStudyModalProps {
  caseStudyId: string | null;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ caseStudyId, onClose }) => {
  if (!caseStudyId) return null;
  const data = CASE_STUDIES[caseStudyId];
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1B19]/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center p-0 sm:p-4 overflow-y-auto">
      <div
        className="bg-[#FAF8F3] w-full max-w-3xl sm:rounded-xl rounded-t-2xl border border-[#E3DED0] max-h-[90vh] flex flex-col shadow-2xl mx-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Android drag bar indicator */}
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#E3DED0]" />
        </div>

        {/* Modal Top Bar */}
        <div className="sticky top-0 bg-[#FAF8F3] border-b border-[#E3DED0] px-5 py-3.5 flex items-center justify-between z-10">
          <div>
            <span className="font-mono text-xs text-[#2954A6] uppercase tracking-wider block">
              {data.tag}
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#1C1B19]">
              {data.title}
            </h3>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-[#F2EFE6] text-[#55524A] hover:text-[#1C1B19] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-5 sm:p-8 space-y-6 overflow-y-auto pb-safe">
          {/* Objective and Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#E3DED0]">
            <div className="bg-[#F2EFE6] p-3.5 rounded-lg">
              <div className="text-[10px] font-mono text-[#948E7E] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#2954A6]" /> Core Objective
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#1C1B19]">{data.objective}</div>
            </div>
            <div className="bg-[#F2EFE6] p-3.5 rounded-lg">
              <div className="text-[10px] font-mono text-[#948E7E] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#71875F]" /> Tech Stack
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#1C1B19]">{data.stack}</div>
            </div>
          </div>

          {/* Project Brief */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#1C1B19] mb-2">Project Brief</h4>
            <p className="text-xs sm:text-sm text-[#55524A] leading-relaxed">{data.brief}</p>
          </div>

          {/* Core Requirements */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#1C1B19] mb-2">
              Core Requirements
            </h4>
            <ul className="space-y-2">
              {data.requirements.map((req, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-[#55524A] flex items-start gap-2.5">
                  <span className="text-[#2954A6] font-mono font-bold mt-0.5">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Model Schema or Pipeline */}
          {data.schema && (
            <div>
              <h4 className="font-serif text-base font-semibold text-[#1C1B19] mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-[#B8863A]" />
                <span>Architecture & Data Schema</span>
              </h4>
              <pre className="bg-[#1C1B19] text-[#E3DED0] p-4 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed border border-[#363430]">
                {data.schema}
              </pre>
            </div>
          )}

          {data.pipeline && (
            <div>
              <h4 className="font-serif text-base font-semibold text-[#1C1B19] mb-2 flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-[#2954A6]" />
                <span>Data Pipeline Flow</span>
              </h4>
              <pre className="bg-[#1C1B19] text-[#E3DED0] p-4 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed border border-[#363430]">
                {data.pipeline}
              </pre>
            </div>
          )}

          {/* Implementation Phases */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#1C1B19] mb-2">
              Implementation Roadmap
            </h4>
            <div className="space-y-2">
              {data.phases.map((ph, idx) => (
                <div
                  key={idx}
                  className="bg-[#F2EFE6] border border-[#E3DED0] p-3 rounded-md text-xs sm:text-sm text-[#55524A] leading-relaxed flex items-baseline gap-2"
                >
                  <span className="font-mono text-[#948E7E] text-xs font-semibold">0{idx + 1}</span>
                  <span>{ph}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#F2EFE6] border-t border-[#E3DED0] px-5 py-3 flex justify-end">
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="px-5 py-1.5 bg-[#1C1B19] text-[#FAF8F3] hover:bg-[#363430] rounded-full text-xs font-mono transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
