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
      answer: "Average fast-ice thickness in Prydz Bay exhibited a 14.2% seasonal thinning between November 2023 and February 2024. This change is strongly attributed to intensified oceanic heat flux from modified Circumpolar Deep Water.\n\nSimultaneously, subglacial hydrological networks and permafrost depths near Schirmacher Oasis have shown correlated instability metrics.",
      sources: [
        { id: "RES-001", title: "Antarctic Sea Ice Thickness & Albedo Dynamics in Prydz Bay (2024)", type: "DATASET" },
        { id: "RES-003", title: "Glacial Bed Topography and Sub-ice Topography near Schirmacher Oasis", type: "REPORT", pageOrSection: "Section 4.2" }
      ],
      evidenceStatus: "SUPPORTED BY REPOSITORY SOURCES"
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
