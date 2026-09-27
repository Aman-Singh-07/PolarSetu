export type ResourceStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'REJECTED';
export type ResourceType = 'REPORT' | 'PUBLICATION' | 'DATASET' | 'PHOTO' | 'VIDEO' | 'ACTIVITY' | 'EXPEDITION' | 'OTHER';

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface Expedition {
  id: string;
  name: string;
  region: string;
  year: number;
  startDate: string;
  endDate: string;
  objective: string;
  latitude: number;
  longitude: number;
  sourceUrl?: string;
}

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  year: number;
  region: string;
  sourceUrl?: string;
  storagePath?: string;
  license?: string;
  status: ResourceStatus;
  createdAt: string;
  expeditionId?: string;
  author?: string;
  institution?: string;
  researchArea?: string;
  keywords?: string[];
}

export interface MediaItem extends Resource {
  type: 'PHOTO' | 'VIDEO';
  caption?: string;
  location?: string;
}

export interface Station {
  id: string;
  name: string;
  region: 'ANTARCTICA' | 'ARCTIC' | 'HIMALAYA';
  latitude: number;
  longitude: number;
  type: string;
  lastVerifiedAt?: string;
  observations?: {
    temperature: string;
    wind: string;
    humidity: string;
  }
}

export interface SourceCitation {
  id: string;
  title: string;
  type: string;
  pageOrSection?: string;
  url?: string;
}

export interface AIResponse {
  answer: string;
  sources: SourceCitation[];
  evidenceStatus: string;
}

export interface OutreachDraft {
  id: string;
  audience: string;
  outputType: string;
  content: string;
  sourceIds: string[];
  status: ResourceStatus;
  createdAt: string;
}
