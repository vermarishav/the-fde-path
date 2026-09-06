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
}

export type ProgressMap = Record<string, ItemProgress>;

export type TrackType = 'foundation' | 'advanced';

export type TabType = 'syllabus' | 'timeline' | 'balance' | 'sprint' | 'portfolio';

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
