import type {
  Expedition,
  Resource,
  MediaItem,
  Station,
  AIResponse,
  OutreachDraft,
  Activity,
  CardTemplate,
  SocialCardGeneration,
  CurriculumConcept,
  LessonPlanGeneration,
  LessonPlanParams,
} from '../types';
import { mockStations } from '../data/mockData';

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, message: string, code: string = 'UNKNOWN_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'ApiError';
  }
}

const BASE_URL = import.meta.env.VITE_API_URL || '';

import { auth } from './auth';

async function fetchClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = auth.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    auth.clearToken();
    window.location.href = '/login';
    throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.error?.message || errorData.message || 'API request failed',
      errorData.error?.code || 'API_ERROR'
    );
  }

  return response.json();
}

export const api = {
  login: async (email: string, password: string): Promise<{ token: string; user: { id: string; email: string; role: string } }> => {
    const res = await fetchClient<{ token: string; user: { id: string; email: string; role: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    auth.setToken(res.token);
    return res;
  },

  getExpeditions: async (): Promise<Expedition[]> => {
    return fetchClient<Expedition[]>('/api/expeditions');
  },

  getExpedition: async (id: string): Promise<Expedition & { resources?: Resource[] }> => {
    return fetchClient<Expedition & { resources?: Resource[] }>(`/api/expeditions/${id}`);
  },

  getResources: async (params?: {
    type?: string;
    region?: string;
    year?: number;
    status?: string;
    expeditionId?: string;
  }): Promise<Resource[]> => {
    const query = new URLSearchParams();
    if (params?.type) query.append('type', params.type);
    if (params?.region) query.append('region', params.region);
    if (params?.year) query.append('year', params.year.toString());
    if (params?.status) query.append('status', params.status);
    if (params?.expeditionId) query.append('expeditionId', params.expeditionId);

    const queryString = query.toString();
    const endpoint = queryString ? `/api/resources?${queryString}` : '/api/resources';
    return fetchClient<Resource[]>(endpoint);
  },

  createResource: async (resource: any): Promise<Resource> => {
    return fetchClient<Resource>('/api/resources', {
      method: 'POST',
      body: JSON.stringify(resource),
    });
  },

  uploadResourceFile: async (id: string, file: File): Promise<{ storagePath: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // We intentionally don't set Content-Type here; fetch will automatically 
    // set it to multipart/form-data with the correct boundary when passing FormData.
    const token = auth.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/api/resources/${id}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (response.status === 401) {
      auth.clearToken();
      window.location.href = '/login';
      throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.error?.message || errorData.message || 'API request failed',
        errorData.error?.code || 'UPLOAD_ERROR'
      );
    }

    return response.json();
  },

  getResource: async (id: string): Promise<Resource | undefined> => {
    try {
      const detail = await fetchClient<{ resource: Resource; expeditions: Expedition[] }>(`/api/resources/${id}`);
      return detail as unknown as Resource;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return undefined;
      }
      throw error;
    }
  },

  searchResources: async (query: string, signal?: AbortSignal): Promise<Resource[]> => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);

    const res = await fetchClient<{ query: string; results: Resource[] }>(`/api/search?${params.toString()}`, { signal });
    return res.results || [];
  },

  getResourceRelations: async (id: string): Promise<{ fromResourceId: string; toResourceId: string; relationType: string }[]> => {
    return fetchClient(`/api/resources/${id}/relations`);
  },

  // --- OTHERS (Prototype / To Be Integrated) ---

  getMedia: async (): Promise<MediaItem[]> => {
    try {
      const liveMedia = await fetchClient<MediaItem[]>('/api/media');
      return liveMedia;
    } catch {
      return [];
    }
  },

  getStations: async (): Promise<Station[]> => {
    return mockStations; // Hardcoded prototype stations
  },

  getActivities: async (): Promise<Activity[]> => {
    try {
      return fetchClient<Activity[]>('/api/activities');
    } catch {
      return [];
    }
  },

  askPolarAI: async (request: { question: string; resourceId?: string }): Promise<AIResponse> => {
    try {
      return fetchClient<AIResponse>('/api/ai/ask', {
        method: 'POST',
        body: JSON.stringify({ question: request.question, resource_ids: request.resourceId ? [request.resourceId] : undefined })
      });
    } catch {
      return { answer: "AI service currently unreachable.", sources: [], evidenceStatus: "Insufficient" };
    }
  },

  generateOutreach: async (request: { sourceId: string; audience: string; format: string; lang?: string }): Promise<OutreachDraft> => {
    return fetchClient<OutreachDraft>('/api/ai/outreach', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  },

  generateSocialCard: async (request: {
    resource_ids: string[];
    media_id: number;
    template?: CardTemplate;
    lang?: string;
  }): Promise<SocialCardGeneration> => {
    return fetchClient<SocialCardGeneration>('/api/ai/social-card', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  },

  // ─── Curriculum & Lesson Plans ───────────────────────────────────

  getCurriculumConcepts: async (params?: { class?: number; subject?: string }): Promise<CurriculumConcept[]> => {
    const query = new URLSearchParams();
    if (params?.class) query.append('class', params.class.toString());
    if (params?.subject) query.append('subject', params.subject);
    const queryString = query.toString();
    const endpoint = queryString ? `/api/curriculum/concepts?${queryString}` : '/api/curriculum/concepts';
    return fetchClient<CurriculumConcept[]>(endpoint);
  },

  getCurriculumConceptResources: async (conceptId: number | string): Promise<Resource[]> => {
    return fetchClient<Resource[]>(`/api/curriculum/concepts/${conceptId}/resources`);
  },

  getLessonPlans: async (classNum?: number): Promise<OutreachDraft[]> => {
    const query = new URLSearchParams();
    if (classNum) query.append('class', classNum.toString());
    const queryString = query.toString();
    const endpoint = queryString ? `/api/curriculum/lesson-plans?${queryString}` : '/api/curriculum/lesson-plans';
    return fetchClient<OutreachDraft[]>(endpoint);
  },

  tagResourceToConcept: async (resourceId: string, conceptId: number): Promise<{ status: string; message: string }> => {
    return fetchClient<{ status: string; message: string }>('/api/curriculum/tags', {
      method: 'POST',
      body: JSON.stringify({ resource_id: resourceId, concept_id: conceptId }),
    });
  },

  untagResourceFromConcept: async (resourceId: string, conceptId: number): Promise<{ status: string; message: string }> => {
    return fetchClient<{ status: string; message: string }>(`/api/curriculum/concepts/${conceptId}/resources/${resourceId}`, {
      method: 'DELETE',
    });
  },

  generateLessonPlan: async (request: LessonPlanParams): Promise<LessonPlanGeneration> => {
    return fetchClient<LessonPlanGeneration>('/api/ai/lesson-plan', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  getReviewQueue: async (): Promise<OutreachDraft[]> => {
    return fetchClient<OutreachDraft[]>('/api/review/queue');
  },

  approveDraft: async (id: string): Promise<void> => {
    await fetchClient(`/api/review/${id}/approve`, { method: 'POST' });
  },

  rejectDraft: async (id: string, reason?: string): Promise<void> => {
    await fetchClient(`/api/review/${id}/reject`, { 
      method: 'POST',
      body: reason ? JSON.stringify({ reason }) : undefined 
    });
  }
};
