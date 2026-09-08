export type FileType = 'word' | 'hwp' | 'pdf';

export interface DocumentItem {
  id: string;
  title: string;
  fileType: FileType;
  categoryId: string;
  saveDate: string; // YYYY-MM-DD
  version: string; // e.g. v1.0, v1.1
  author: string;
  content: string;
  memo: string;
  fileSize?: string;
  aiAnalysis?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface DiffResult {
  summary: string;
  similarityScore: number;
  additions: string[];
  deletions: string[];
  modifications: {
    section: string;
    oldText: string;
    newText: string;
    changeType: 'added' | 'deleted' | 'modified';
  }[];
}
