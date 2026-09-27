import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { MediaItem } from '../types';
import { Image as ImageIcon, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Media() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    const data = await api.getMedia();
    setMediaItems(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">Media Explorer</h1>
        <p className="text-slate-500">Official photographs and videos from polar expeditions.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading media...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map(item => (
            <div key={item.id} className="bg-white border border-border rounded-lg overflow-hidden flex flex-col group">
              <div className="aspect-[4/3] bg-slate-100 relative flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-slate-300" />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                  {item.type}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-primary mb-1 text-sm line-clamp-1">{item.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">{item.caption || item.description}</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" /> {item.region}
                  </span>
                  <Link to={`/research/${item.id}`} className="text-secondary hover:text-accent text-xs font-medium flex items-center">
                    Details <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
