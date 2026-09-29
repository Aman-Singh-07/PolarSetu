import React from 'react';
import { ImageIcon } from 'lucide-react';
import type { MediaItem } from '../../types';
import { EmptyState } from '../ui/EmptyState';
import { useNavigate } from 'react-router-dom';

interface PhotoPickerProps {
  photos: MediaItem[];
  selectedId: string | null;
  onSelect: (photo: MediaItem) => void;
  loading?: boolean;
  disabled?: boolean;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = ({
  photos,
  selectedId,
  onSelect,
  loading = false,
  disabled = false,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square bg-frost rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="p-4 bg-frost/50 border border-border-ice rounded-xl">
        <EmptyState
          icon={ImageIcon}
          title="No photos available"
          description="No photos catalogued for this expedition. Upload photos in Admin → Upload."
          actionLabel="Upload Photos"
          onAction={() => navigate('/admin/upload')}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-2.5 max-h-[260px] overflow-y-auto p-1 custom-scrollbar">
        {photos.map((photo) => {
          const isSelected = selectedId === photo.id;
          const displayUrl = photo.thumbnailUrl || photo.sourceUrl || '';

          return (
            <button
              key={photo.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(photo)}
              aria-label={photo.title || photo.caption || `Photo ${photo.id}`}
              className={`relative aspect-square rounded-xl overflow-hidden group transition-all text-left focus:outline-none ${
                isSelected
                  ? 'ring-3 ring-cyan-accent shadow-md scale-[0.98]'
                  : 'hover:opacity-90 ring-1 ring-border-ice hover:ring-cyan-accent/50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {displayUrl ? (
                <img
                  src={displayUrl}
                  alt={photo.caption || photo.title || 'Expedition photo'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback visual on thumbnail load failure
                    (e.target as HTMLElement).style.display = 'none';
                    const parent = (e.target as HTMLElement).parentElement;
                    if (parent) {
                      parent.classList.add('bg-deep-ocean', 'flex', 'items-center', 'justify-center');
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full bg-deep-ocean/80 flex items-center justify-center p-2 text-white/40">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}

              {/* Selection overlay pill */}
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-cyan-accent text-deep-ocean flex items-center justify-center font-bold text-xs shadow-sm">
                  ✓
                </div>
              )}

              {/* Caption tooltip on hover */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep-ocean/90 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] text-white font-medium truncate">
                  {photo.caption || photo.title || `Photo #${photo.id}`}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PhotoPicker;
