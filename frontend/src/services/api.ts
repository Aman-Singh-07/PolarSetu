import type { Expedition, Resource, MediaItem, Station, AIResponse, OutreachDraft } from '../types';
import { mockStations, mockDrafts } from '../data/mockData';

export const api = {
  getExpeditions: async (): Promise<Expedition[]> => {
    const res = await fetch('/api/expeditions');
    if (!res.ok) throw new Error('Failed to fetch expeditions');
    return res.json();
  },
  getExpedition: async (id: string): Promise<Expedition | undefined> => {
    const res = await fetch(`/api/expeditions/${id}`);
    if (!res.ok) {
      if (res.status === 404) return undefined;
      throw new Error(`Failed to fetch expedition ${id}`);
    }
    // Backend wraps this in { expedition, resources }
    const data = await res.json();
    return data.Expedition; // assuming frontend expects pure Expedition or does it expect resources array mapped into it? Let's assume frontend takes returned structure. Wait, our Go backend returns models.ExpeditionDetail which embeds Expedition + Resources. Actually, JS receives { id, name, ... resources: [...] }.
  },
  getResources: async (filters?: { type?: string, region?: string }): Promise<Resource[]> => {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.region) params.append('region', filters.region);
    
    const res = await fetch(`/api/resources?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch resources');
    return res.json();
  },
  getResource: async (id: string): Promise<Resource | undefined> => {
    const res = await fetch(`/api/resources/${id}`);
    if (!res.ok) {
      if (res.status === 404) return undefined;
      throw new Error(`Failed to fetch resource ${id}`);
    }
    const data = await res.json();
    return data; // Usually frontend uses the aggregated response 
  },
  searchResources: async (query: string): Promise<Resource[]> => {
    // Falls back to basic DB query until Phase 4 search is fully established
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    const res = await fetch(`/api/search?${params.toString()}`);
    // if search isn't ready, let's gracefully fail over for now
    if (!res.ok) {
      if (res.status === 404) {
         // fallback to normal resource fetch if search endpoint not mounted yet
         return api.getResources();
      }
      return [];
    }
    const data = await res.json();
    return data.results || data;
  },
  getMedia: async (): Promise<MediaItem[]> => {
    const res = await fetch('/api/media');
    if (!res.ok) {
      // Return empty gracefully if API isn't built yet
      if (res.status === 404) return []; 
      throw new Error('Failed to fetch media');
    }
    return res.json();
  },
  getStations: async (): Promise<Station[]> => {
    return mockStations; // Hardcoded stations
  },
  askPolarAI: async (request: { question: string, resourceId?: string }): Promise<AIResponse> => {
    const res = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: request.question, resource_ids: request.resourceId ? [request.resourceId] : undefined })
    });
    if (!res.ok) {
      return { answer: "AI service currently unreachable.", sources: [], evidenceStatus: "Error" };
    }
    return res.json();
  },
  generateOutreach: async (request: { sourceId: string, audience: string, format: string }): Promise<OutreachDraft> => {
    const res = await fetch('/api/ai/outreach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (!res.ok) { throw new Error('AI generation failed'); }
    return res.json();
  },
  getReviewQueue: async (): Promise<OutreachDraft[]> => {
    const res = await fetch('/api/review/queue');
    if (!res.ok) {
      if (res.status === 404) return mockDrafts; // fallback if not done
      throw new Error("Failed to fetch queue");
    }
    return res.json();
  },
  approveDraft: async (id: string): Promise<void> => {
    await fetch(`/api/review/${id}/approve`, { method: 'POST' });
  }
};