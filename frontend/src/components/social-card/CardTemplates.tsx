import type { CardTemplate } from '../../types';

export interface TemplateDimensions {
  width: number;
  height: number;
  aspectClass: string;
  maxPreviewWidth: number;
  scaleForPreview: number; // e.g. 540 / 1080 = 0.5
}

export const TEMPLATE_CONFIGS: Record<CardTemplate, TemplateDimensions> = {
  '1:1': {
    width: 1080,
    height: 1080,
    aspectClass: 'aspect-square',
    maxPreviewWidth: 540,
    scaleForPreview: 0.5,
  },
  '16:9': {
    width: 1920,
    height: 1080,
    aspectClass: 'aspect-video',
    maxPreviewWidth: 640,
    scaleForPreview: 0.333333,
  },
  '9:16': {
    width: 1080,
    height: 1920,
    aspectClass: 'aspect-[9/16]',
    maxPreviewWidth: 360,
    scaleForPreview: 0.333333,
  },
};

export default TEMPLATE_CONFIGS;
