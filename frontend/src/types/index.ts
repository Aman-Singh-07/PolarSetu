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
  thumbnailUrl?: string;
  attribution?: string;
}

export interface Station {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  type: string;
  lastVerifiedAt?: string;
  observations?: {
    temperature: string;
    wind: string;
    humidity: string;
  };
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
  metadata?: {
    template?: string;
    media_id?: number;
    stat_text?: string;
    caption?: string;
    resource_url?: string;
    citation_valid?: boolean;
    lang?: string;
    rendered_image_path?: string;
    class?: number;
    subject?: string;
    concept_id?: number;
    concept?: string;
    warnings?: string[];
    [key: string]: any;
  };
}

export interface Activity {
  id: string;
  title: string;
  date: string;
  description: string;
  sourceUrl?: string;
  mediaUrl?: string;
  createdAt?: string;
}

export type CardTemplate = '1:1' | '16:9' | '9:16';

export interface SocialCardGeneration {
  id: number;
  stat_text: string;
  caption: string;
  source_ids: string[];
  citation_valid: boolean;
  status: ResourceStatus;
}

export interface CardConfig {
  template: CardTemplate;
  media: MediaItem;
  statText: string;
  caption: string;
  resourceUrl: string;
  lang: string;
}

// ─── Curriculum & Lesson Plan Types ───────────────────────────────────

export interface CurriculumConcept {
  id: string;
  class: number;
  subject: string;
  concept: string;
  nepTags: string[];
  description: string;
}

export interface PlanSource {
  id: string;
  title: string;
}

export interface TeacherBrief {
  content: string;
  duration_minutes: number;
  sources: PlanSource[];
}

export interface DiscussionQuestion {
  question: string;
  answer: string;
  sources: PlanSource[];
}

export interface Experiment {
  title: string;
  materials: string[];
  steps: string[];
  connection: string;
  sources: PlanSource[];
}

export interface LessonPlanStructure {
  teacher_brief: TeacherBrief;
  discussion_questions: DiscussionQuestion[];
  experiment: Experiment;
}

export type LessonPlan = LessonPlanStructure;

export interface LessonPlanGeneration {
  id: number;
  plan: LessonPlanStructure;
  citation_valid: boolean;
  status: ResourceStatus;
  warnings?: string[];
}

export interface LessonPlanParams {
  concept_id: number;
  resource_ids: string[];
  lang?: string;
}

export interface SavedLessonPlan {
  id: number | string;
  userId?: number | null;
  sourceIds: string[];
  audience: string;
  outputType: string;
  content: string;
  status: ResourceStatus;
  createdAt: string;
  metadata?: {
    class?: number;
    subject?: string;
    concept_id?: number;
    concept?: string;
    lang?: string;
    citation_valid?: boolean;
    warnings?: string[];
    [key: string]: any;
  };
}
