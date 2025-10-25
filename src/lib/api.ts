import type { CourseProject } from '../types/course.ts';

type CreateProjectPayload = {
  topic: string;
  mode: 'interactive' | 'fast';
  apiKeySource: 'studio' | 'manual';
  manualApiKey?: string;
  branding?: {
    logoBase64?: string;
    watermarkText?: string;
    watermarkOpacity?: number;
  };
};

type GenerateVideosPayload = {
  mode: 'topic' | 'all';
  topicIndex?: number;
};

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Error en la solicitud al servidor');
  }

  return response.json() as Promise<T>;
}

export const api = {
  listProjects: () => request<CourseProject[]>('/api/projects'),
  createProject: (payload: CreateProjectPayload) =>
    request<CourseProject>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  generateOutline: (projectId: string) =>
    request<CourseProject>(`/api/projects/${projectId}/outline`, {
      method: 'POST'
    }),
  generateVideos: (projectId: string, payload: GenerateVideosPayload) =>
    request<CourseProject>(`/api/projects/${projectId}/videos`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  compileCourse: (projectId: string) =>
    request<CourseProject>(`/api/projects/${projectId}/compile`, {
      method: 'POST'
    })
};

export type { CreateProjectPayload, GenerateVideosPayload };
