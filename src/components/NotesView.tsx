import React, { useState, useMemo } from 'react';
import { StudyNote } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { playTick } from '../utils/audio';
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Copy,
  Check,
  Tag,
  Save,
  Clock,
  BookOpen,
} from 'lucide-react';

const STORAGE_NOTES_KEY = 'fde-study-notes-v1';

const INITIAL_NOTES: StudyNote[] = [
  {
    id: 'note-template-1',
    title: 'FDE 45-Minute Enterprise System Design Blueprint',
    category: 'architecture',
    tags: ['system-design', 'interview', 'enterprise'],
    content: `1. Clarify Requirements (5m):
- Ingestion SLA (Latency target, throughput e.g. 50k events/sec)
- Enterprise constraints (Air-gapped, HIPAA/SOC2, multi-tenant RBAC)
- Read vs Write ratio

2. High-Level Architecture (15m):
- Ingestion (CDC via Debezium -> Kafka broker -> Flink stream processing)
- Storage (Hot OLTP Postgres + Cold Columnar ClickHouse/Iceberg)
- Query Layer (GraphQL / gRPC gateway with cached Redis indexes)

3. Deep Dive Enterprise Bottlenecks (15m):
- Schema evolution (Avro with Schema Registry)
- Backpressure & Dead Letter Queues (DLQ)
- Data isolation (Row-level tenant encryption)

4. Failure Modes & Mitigations (10m):
- Network partitions, idempotent consumers, outbox pattern.`,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-template-2',
    title: 'Client Scoping & POC Delivery Checklist',
    category: 'client-meeting',
    tags: ['client-delivery', 'poc', 'scoping'],
    content: `Before accepting a 2-week Client Proof of Concept (POC):
- [ ] Define the 1 single measurable success metric (e.g., "Cut invoice verification time from 4 hrs to 2 mins").
- [ ] Verify client access to sample datasets and test IAM credentials upfront.
- [ ] Explicitly state what is OUT of scope (e.g. legacy ERP migrations, mobile web views).
- [ ] Schedule daily 15-minute async standup via Slack/Teams.
- [ ] Have rollback and cleanup scripts tested before Friday deployment.`,
    updatedAt: new Date().toISOString(),
  },
];

interface NotesViewProps {
  soundEnabled: boolean;
}

export const NotesView: React.FC<NotesViewProps> = ({ soundEnabled }) => {
  const [notes, setNotes] = useState<StudyNote[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_NOTES_KEY);
      return stored ? JSON.parse(stored) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Active note in editor
  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === activeNoteId) || notes[0];
  }, [notes, activeNoteId]);

  const saveNotes = (updated: StudyNote[]) => {
    setNotes(updated);
    localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(updated));
  };

  const handleCreateNote = () => {
    triggerHaptic('medium');
    if (soundEnabled) playTick();
    const newNote: StudyNote = {
      id: `note-${Date.now()}`,
      title: 'Untitled Engineering Note',
      category: 'general',
      tags: ['notes'],
      content: '',
      updatedAt: new Date().toISOString(),
    };
    const updated = [newNote, ...notes];
    saveNotes(updated);
    setActiveNoteId(newNote.id);
  };

  const handleUpdateActiveNote = (field: keyof StudyNote, val: any) => {
    if (!activeNote) return;
    const updated = notes.map((n) => {
      if (n.id === activeNote.id) {
        return { ...n, [field]: val, updatedAt: new Date().toISOString() };
      }
      return n;
    });
    saveNotes(updated);
  };

  const handleDeleteNote = (id: string) => {
    triggerHaptic('error');
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated);
    if (activeNoteId === id && updated.length > 0) {
      setActiveNoteId(updated[0].id);
    }
  };

  const handleCopy = (content: string, id: string) => {
    triggerHaptic('light');
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (selectedCategory !== 'all' && n.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [notes, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Search */}
      <div className="bg-[#F2EFE6] border border-[#E3DED0] rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#2954A6]" />
              <h2 className="font-serif text-2xl font-bold text-[#1C1B19]">
                Engineering Study Journal
              </h2>
            </div>
            <p className="text-xs text-[#55524A] font-mono mt-1">
              Field notes, architecture blueprints, and interview thoughts
            </p>
          </div>

          <button
            onClick={handleCreateNote}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2954A6] text-white text-xs font-mono font-medium shadow-sm hover:bg-[#1E4085] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> New Study Note
          </button>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5 pt-4 border-t border-[#E3DED0]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#948E7E] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, architecture tags, keywords..."
              className="w-full bg-[#FAF8F3] border border-[#E3DED0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1C1B19] focus:outline-none focus:border-[#2954A6]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(
              [
                'all',
                'architecture',
                'ai-rag',
                'client-meeting',
                'interview-prep',
              ] as const
            ).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-2 text-[11px] font-mono whitespace-nowrap rounded-xl transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#2954A6] text-white'
                    : 'bg-[#FAF8F3] border border-[#E3DED0] text-[#55524A] hover:text-[#1C1B19]'
                }`}
              >
                {cat === 'all'
                  ? 'All Notes'
                  : cat === 'architecture'
                  ? 'Architecture'
                  : cat === 'ai-rag'
                  ? 'AI & RAG'
                  : cat === 'client-meeting'
                  ? 'Client Scenarios'
                  : 'Interview Prep'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Dual-Pane or Stacked Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List Column */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredNotes.map((note) => {
            const isSelected = activeNote?.id === note.id;
            return (
              <div
                key={note.id}
                onClick={() => {
                  triggerHaptic('light');
                  if (soundEnabled) playTick();
                  setActiveNoteId(note.id);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#FAF8F3] border-[#2954A6] shadow-sm'
                    : 'bg-[#F2EFE6] border-[#E3DED0] hover:bg-[#FAF8F3]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-serif text-sm font-bold text-[#1C1B19] line-clamp-1">
                    {note.title || 'Untitled Note'}
                  </h4>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-medium flex-shrink-0 ${
                      note.category === 'architecture'
                        ? 'bg-[#DCE5F3] text-[#2954A6]'
                        : note.category === 'ai-rag'
                        ? 'bg-[#E1E8D9] text-[#71875F]'
                        : 'bg-[#F1E4CB] text-[#B8863A]'
                    }`}
                  >
                    {note.category}
                  </span>
                </div>
                <p className="text-xs text-[#55524A] line-clamp-2 mt-2 leading-relaxed">
                  {note.content || 'Empty note content...'}
                </p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E3DED0]/60 text-[10px] font-mono text-[#948E7E]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(note.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  {note.tags.length > 0 && (
                    <span className="text-[#71875F]">#{note.tags[0]}</span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredNotes.length === 0 && (
            <div className="p-8 text-center bg-[#FAF8F3] border border-[#E3DED0] rounded-2xl">
              <BookOpen className="w-8 h-8 text-[#948E7E] mx-auto mb-2" />
              <p className="text-xs text-[#55524A] font-mono">
                No matching study notes found.
              </p>
            </div>
          )}
        </div>

        {/* Note Editor Column (Takes 2 cols on desktop) */}
        {activeNote ? (
          <div className="lg:col-span-2 bg-[#FAF8F3] border border-[#E3DED0] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              {/* Title & Category Selector */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E3DED0]">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => handleUpdateActiveNote('title', e.target.value)}
                  placeholder="Note Title..."
                  className="font-serif text-xl sm:text-2xl font-bold text-[#1C1B19] bg-transparent border-none focus:outline-none w-full"
                />
                <select
                  value={activeNote.category}
                  onChange={(e) =>
                    handleUpdateActiveNote('category', e.target.value)
                  }
                  className="bg-[#F2EFE6] border border-[#E3DED0] rounded-xl px-3 py-1.5 text-xs font-mono text-[#55524A] focus:outline-none flex-shrink-0"
                >
                  <option value="architecture">Architecture</option>
                  <option value="ai-rag">AI & RAG</option>
                  <option value="client-meeting">Client Scenarios</option>
                  <option value="interview-prep">Interview Prep</option>
                  <option value="general">General</option>
                </select>
              </div>

              {/* Tags Editor */}
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-[#948E7E]" />
                <input
                  type="text"
                  value={activeNote.tags.join(', ')}
                  onChange={(e) =>
                    handleUpdateActiveNote(
                      'tags',
                      e.target.value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="Tags (comma separated e.g. kafka, rbac, caching)"
                  className="w-full bg-transparent text-xs font-mono text-[#55524A] placeholder:text-[#948E7E] focus:outline-none"
                />
              </div>

              {/* Content Textarea */}
              <textarea
                rows={14}
                value={activeNote.content}
                onChange={(e) => handleUpdateActiveNote('content', e.target.value)}
                placeholder="Write technical insights, system tradeoffs, interview questions, or architecture details..."
                className="w-full bg-[#F2EFE6]/60 border border-[#E3DED0] rounded-2xl p-4 text-sm font-sans text-[#1C1B19] leading-relaxed focus:outline-none focus:border-[#2954A6] focus:bg-[#FAF8F3] transition-colors resize-y"
              />
            </div>

            {/* Note Editor Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E3DED0]">
              <span className="text-[11px] font-mono text-[#71875F] flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5" /> Auto-saved locally
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(activeNote.content, activeNote.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F2EFE6] hover:bg-[#E3DED0] text-xs font-mono text-[#55524A] transition-all"
                >
                  {copiedId === activeNote.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#71875F]" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Text
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDeleteNote(activeNote.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FBE8E7] hover:bg-[#B5453E] hover:text-white text-xs font-mono text-[#B5453E] transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-[#FAF8F3] border border-[#E3DED0] rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3">
            <FileText className="w-12 h-12 text-[#948E7E]" />
            <h3 className="font-serif text-lg font-bold text-[#1C1B19]">
              No Note Selected
            </h3>
            <p className="text-xs text-[#55524A] font-mono max-w-sm">
              Create a new note or select one from the left to start drafting technical field blueprints.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
