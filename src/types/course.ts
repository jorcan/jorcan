export interface VideoFragment {
  id: string;
  title: string;
  duration: number;
  status: 'pending' | 'generating' | 'ready' | 'failed';
  downloadUrl?: string;
}

export interface CourseTopic {
  id: string;
  title: string;
  summary: string;
  objective: string;
  status: 'pending' | 'generating' | 'ready' | 'failed';
  fragments: VideoFragment[];
}

export interface CourseOutline {
  courseTitle: string;
  topics: CourseTopic[];
}

export type ProjectMode = 'interactive' | 'fast';

export interface BrandingConfig {
  logoBase64?: string;
  watermarkText?: string;
  watermarkOpacity?: number;
}

export interface CourseProject {
  id: string;
  topic: string;
  mode: ProjectMode;
  createdAt: string;
  status: 'draft' | 'outlined' | 'generating' | 'compiled';
  outline?: CourseOutline | null;
  branding?: BrandingConfig;
  apiKeySource: 'studio' | 'manual';
  manualApiKey?: string | null;
  videoSummary?: string;
  combinedVideoUrl?: string | null;
}

export interface GenerationLog {
  level: 'info' | 'error' | 'success';
  message: string;
  timestamp: string;
}

export interface SessionSettings {
  apiKeySource: 'studio' | 'manual';
  manualApiKey?: string;
  lastProjectId?: string;
}
