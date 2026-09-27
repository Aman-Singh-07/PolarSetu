import type { Expedition, Resource, MediaItem, Station, AIResponse, OutreachDraft } from '../types';
import { mockExpeditions, mockResources, mockMedia, mockStations, mockDrafts } from '../data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getExpeditions: async (): Promise<Expedition[]> => {
    await delay(500);
    return mockExpeditions;
  },
  getExpedition: async (id: string): Promise<Expedition | undefined> => {
    await delay(500);
    return mockExpeditions.find(e => e.id === id);
  },
  getResources: async (filters?: { type?: string, region?: string }): Promise<Resource[]> => {
    await delay(500);
    let res = mockResources;
    if (filters?.type) res = res.filter(r => r.type === filters.type);
    if (filters?.region) res = res.filter(r => r.region === filters.region);
    return res;
  },
  getResource: async (id: string): Promise<Resource | undefined> => {
    await delay(500);
    return mockResources.find(r => r.id === id);
  },
  searchResources: async (query: string): Promise<Resource[]> => {
    await delay(500);
    const q = query.toLowerCase();
    return mockResources.filter(r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || (r.keywords && r.keywords.some(k => k.toLowerCase().includes(q))));
  },
  getMedia: async (): Promise<MediaItem[]> => {
    await delay(500);
    return mockMedia;
  },
  getStations: async (): Promise<Station[]> => {
    await delay(500);
    return mockStations;
  },
  askPolarAI: async (request: { question: string, resourceId?: string }): Promise<AIResponse> => {
    await delay(1500);
    if (request.question.toLowerCase().includes("unsupported")) {
      return {
        answer: "The available sources do not provide enough evidence.",
        sources: [],
        evidenceStatus: "Insufficient evidence in repository."
      }
    }
    return {
      answer: "Based on the 43rd Indian Scientific Expedition report, glacial dynamics in the Larsemann Hills show significant changes.",
      sources: [
        { id: "RES-001", title: "Glacial Dynamics in the Larsemann Hills", type: "REPORT", pageOrSection: "Page 12" }
      ],
      evidenceStatus: "Supported by repository sources"
    };
  },
  generateOutreach: async (request: { sourceId: string, audience: string, format: string }): Promise<OutreachDraft> => {
    await delay(1500);
    const newDraft: OutreachDraft = {
      id: `DRF-${Date.now()}`,
      audience: request.audience,
      outputType: request.format,
      content: `[AI GENERATED DRAFT]\n\nBased on source ${request.sourceId}, this is a generated ${request.format} for ${request.audience}. Remember, this is a draft and requires human review.`,
      sourceIds: [request.sourceId],
      status: 'DRAFT',
      createdAt: new Date().toISOString()
    };
    mockDrafts.unshift(newDraft);
    return newDraft;
  },
  getReviewQueue: async (): Promise<OutreachDraft[]> => {
    await delay(500);
    return mockDrafts;
  },
  approveDraft: async (id: string): Promise<void> => {
    await delay(500);
    const draft = mockDrafts.find(d => d.id === id);
    if (draft) draft.status = 'APPROVED';
  }
};
