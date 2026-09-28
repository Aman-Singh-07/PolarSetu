import type { Expedition, Resource, MediaItem, Station, AIResponse, OutreachDraft, Activity } from '../types';
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

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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

  if (!response.ok) {
    let message = 'An unexpected error occurred';
    let code = 'UNKNOWN_ERROR';
    try {
      const errData = await response.json();
      if (errData?.error) {
        message = errData.error.message || message;
        code = errData.error.code || code;
      }
    } catch {
      // If parsing fails, fall back to default error text
      message = response.statusText || message;
    }
    if (response.status === 401) {
      // Clear token and redirect to login if unauthorized
      auth.clearToken();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    throw new ApiError(response.status, message, code);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // --- AUTH ---
  login: async (email: string, password: string): Promise<{ token: string; user: any }> => {
    return fetchClient('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // --- EXPEDITIONS (Integrated with backend) ---
  getExpeditions: async (): Promise<Expedition[]> => {
    return fetchClient<Expedition[]>('/api/expeditions');
  },

  getExpedition: async (id: string): Promise<Expedition & { resources?: Resource[] }> => {
    return fetchClient<Expedition & { resources?: Resource[] }>(`/api/expeditions/${id}`);
  },

  // --- RESOURCES (Integrated with backend) ---
  getResources: async (filters?: { type?: string; region?: string }): Promise<Resource[]> => {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.region) params.append('region', filters.region);

    return fetchClient<Resource[]>(`/api/resources?${params.toString()}`);
  },

  createResource: async (data: {
    title: string;
    type: string;
    description?: string;
    year?: number;
    region?: string;
    sourceUrl?: string;
    license?: string;
  }): Promise<Resource> => {
    // Generate an ID if the backend expects the frontend to provide it
    const id = crypto.randomUUID ? crypto.randomUUID() : `res-${Date.now()}`;
    
    return fetchClient<Resource>('/api/resources', {
      method: 'POST',
      body: JSON.stringify({
        id,
        ...data,
      }),
    });
  },

  uploadResourceFile: async (id: string, file: File): Promise<{ status: string; message: string; url: string }> => {
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
      throw { status: 401, message: 'Unauthorized' };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.error?.message || errorData.message || 'API request failed',
        code: errorData.error?.code,
      };
    }

    return response.json();
  },

  getResource: async (id: string): Promise<Resource | undefined> => {
    try {
      const detail = await fetchClient<{ resource: Resource; expeditions: Expedition[] }>(`/api/resources/${id}`);
      // Based on models.ResourceDetail which embeds Resource and has Expeditions
      // The Go backend struct embeds Resource directly, so fields are flattened.
      // E.g., { id, title, expeditions: [...] }
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

    // search returns { query: string, results: Resource[] }
    const res = await fetchClient<{ query: string; results: Resource[] }>(`/api/search?${params.toString()}`, { signal });
    return res.results || [];
  },

  getResourceRelations: async (id: string): Promise<{ fromResourceId: string; toResourceId: string; relationType: string }[]> => {
    return fetchClient(`/api/resources/${id}/relations`);
  },

  // --- OTHERS (Prototype / To Be Integrated) ---


  getMedia: async (): Promise<MediaItem[]> => {
    try {
      return await fetchClient<MediaItem[]>('/api/media');
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return [];
      throw error;
    }
  },

  getActivities: async (): Promise<Activity[]> => {
    try {
      return await fetchClient<Activity[]>('/api/activities');
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return [];
      throw error;
    }
  },

  getStations: async (): Promise<Station[]> => {
    return mockStations; // Hardcoded prototype stations
  },

  askPolarAI: async (request: { question: string; resourceId?: string }): Promise<AIResponse> => {
    try {
      return fetchClient<AIResponse>('/api/ai/ask', {
        method: 'POST',
        body: JSON.stringify({ question: request.question, resource_ids: request.resourceId ? [request.resourceId] : undefined })
      });
    } catch {
      return { answer: "AI service currently unreachable.", sources: [], evidenceStatus: "Error" };
    }
  },

  generateOutreach: async (request: { sourceId: string; audience: string; format: string }): Promise<OutreachDraft> => {
    return fetchClient<OutreachDraft>('/api/ai/outreach', {
      method: 'POST',
      body: JSON.stringify(request)
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
