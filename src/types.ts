export type BucketType = 'core' | 'ai' | 'customer';

export interface StudyLink {
  url: string;
  label: string;
  kind: 'docs' | 'practice' | 'tool' | 'read';
}

export interface SyllabusItem {
  t: string;
  sub?: string[];
  link?: StudyLink;
  m?: boolean; // Milestone item
}

export interface Phase {
  id: string;
  index: string;
  title: string;
  bucket: BucketType;
  desc: string;
  items: SyllabusItem[];
}

export interface ItemProgress {
  checked: boolean;
  note: string;
  redo: boolean;
  blocked: boolean;
  bookmarked?: boolean;
}

export type ProgressMap = Record<string, ItemProgress>;

export type TrackType = 'foundation' | 'advanced';

export type TabType = 'syllabus' | 'flashcards' | 'notes' | 'sprint' | 'profile' | 'timeline' | 'balance' | 'portfolio';

export interface UserProfile {
  name: string;
  email: string;
  targetRole: string;
  targetCompany: string;
  targetDate: string;
  targetWeeklyHours: number;
  currentLevel: string;
  bio: string;
  githubUrl: string;
  linkedinUrl: string;
  isPinLocked: boolean;
  pinHash: string; // 4-digit code
  securityQuestion: string;
  securityAnswer: string;
}

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  category: 'architecture' | 'ai-rag' | 'client-meeting' | 'interview-prep' | 'general';
  tags: string[];
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  category: 'core' | 'ai' | 'customer';
  question: string;
  answer: string;
  keyTakeaway: string;
  codeSnippet?: string;
  difficulty: 'intermediate' | 'advanced';
}

export interface CaseStudy {
  id: string;
  tag: string;
  title: string;
  objective: string;
  stack: string;
  brief: string;
  requirements: string[];
  schema?: string;
  pipeline?: string;
  phases: string[];
}
