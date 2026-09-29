import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Resource } from '../types';
import { ArrowLeft, ArrowRight, ExternalLink, Sparkles, Send } from 'lucide-react';

export default function ResourceDetail() {
  const { id } = useParams();
  const [resource, setResource] = useState<Resource | null>(null);
  const [relations, setRelations] = useState<{ fromResourceId: string; toResourceId: string; relationType: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async (resId: string) => {
      setLoading(true); setError(null); setNotFound(false);
      try {
        const data = await api.getResource(resId);
        if (!data) { setNotFound(true); return; }
        setResource(data);
        try { setRelations((await api.getResourceRelations(resId)) || []); } catch {}
      } catch { setError('Unable to load this resource.'); }
      finally { setLoading(false); }
    };
    if (id) load(id);
  }, [id]);

  if (loading) return (
    <div className="py-32 flex flex-col items-center justify-center bg-snow min-h-[calc(100vh-64px)]">
      <div className="w-8 h-8 rounded-full border-2 border-border-ice border-t-glacial-blue animate-spin mb-4" />
      <span className="text-xs uppercase tracking-widest font-semibold text-muted">Loading Record</span>
    </div>
  );

  if (notFound || !resource) return (
    <div className="py-32 flex flex-col items-center justify-center text-center px-4 bg-snow min-h-[calc(100vh-64px)]">
      <h2 className="font-display text-2xl font-bold text-deep-ocean mb-2">Record Not Found</h2>
      <p className="text-sm text-ink/70 mb-8 font-light">The requested resource does not exist or has been removed from the archive.</p>
      <Link to="/explore" className="px-6 py-3 bg-deep-ocean text-white text-sm font-semibold rounded-lg hover:bg-ocean-navy transition-colors">Return to Archive</Link>
    </div>
  );

  if (error) return (
    <div className="py-32 flex flex-col items-center justify-center text-center px-4 bg-snow min-h-[calc(100vh-64px)]">
      <p className="text-sm text-error font-medium mb-6">{error}</p>
      <div className="flex gap-4">
        <button onClick={() => window.location.reload()} className="px-6 py-3 border border-border-ice bg-white text-deep-ocean font-semibold text-sm rounded-lg hover:bg-frost transition-colors">Retry</button>
        <Link to="/explore" className="px-6 py-3 bg-deep-ocean text-white font-semibold text-sm rounded-lg hover:bg-ocean-navy transition-colors">Return to Archive</Link>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full bg-snow min-h-[calc(100vh-64px)]">
      {/* ─── HEADER ─── */}
      <section className="w-full pt-12 pb-16 px-4 lg:px-8 bg-white border-b border-border-ice/50">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
          <nav className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted">
            <Link to="/explore" className="hover:text-deep-ocean transition-colors flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Archive</Link>
            <span className="text-border-ice">/</span>
            <span className="text-deep-ocean">{resource.type}</span>
          </nav>
          
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-deep-ocean leading-[1.1] tracking-tight">{resource.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-ink font-medium">
              {resource.region && <span className="px-3 py-1 bg-frost rounded-full border border-border-ice/50">{resource.region}</span>}
              {resource.year && <span className="text-muted">{resource.year}</span>}
              {resource.author && <span className="text-muted font-light pl-2 border-l border-border-ice">{resource.author}</span>}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <section className="w-full px-4 lg:px-8 py-16">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Main Description */}
          <div className="md:col-span-8 flex flex-col gap-10">
            <div className="prose prose-sm md:prose-base max-w-none">
              <p className="text-[15px] text-ink/80 leading-loose whitespace-pre-line font-light">
                {resource.description}
              </p>
            </div>

            {/* Source Access */}
            {resource.sourceUrl && (
              <div className="pt-6 border-t border-border-ice/50">
                <a href={resource.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-border-ice bg-white text-sm font-semibold text-deep-ocean hover:text-cyan-accent hover:border-cyan-accent/30 transition-all shadow-soft group">
                  <ExternalLink className="w-4 h-4 text-muted group-hover:text-cyan-accent transition-colors" /> Access Primary Source
                </a>
              </div>
            )}

            {/* Contextual Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-10 mt-2">
              <Link to={`/ai?resourceId=${resource.id}`} className="flex-1 flex justify-center items-center gap-2 px-6 py-4 rounded-xl bg-deep-ocean text-white text-sm font-bold hover:bg-ocean-navy transition-colors shadow-elevated group">
                <Sparkles className="w-4 h-4 text-cyan-accent" /> Ask AI about this <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to={`/outreach?sourceId=${resource.id}`} className="flex-1 flex justify-center items-center gap-2 px-6 py-4 rounded-xl border border-border-ice bg-white text-sm font-bold text-deep-ocean hover:bg-frost transition-colors shadow-soft group">
                <Send className="w-4 h-4 text-muted group-hover:text-deep-ocean transition-colors" /> Create Outreach Draft
              </Link>
            </div>
          </div>

          {/* Sidebar Metadata (Open Layout, no heavy cards) */}
          <aside className="md:col-span-4 flex flex-col gap-12">
            
            <div className="flex flex-col gap-5">
              <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border-ice pb-2">Technical Metadata</h3>
              <dl className="flex flex-col gap-4 text-sm font-light">
                {resource.author && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] text-muted uppercase tracking-wider font-semibold">Author / Institution</dt>
                    <dd className="text-ink">{resource.author}{resource.institution && <span className="text-muted"> · {resource.institution}</span>}</dd>
                  </div>
                )}
                {resource.researchArea && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] text-muted uppercase tracking-wider font-semibold">Research Area</dt>
                    <dd className="text-ink">{resource.researchArea}</dd>
                  </div>
                )}
                {resource.expeditionId && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] text-muted uppercase tracking-wider font-semibold">Associated Expedition</dt>
                    <dd><Link to={`/expeditions/${resource.expeditionId}`} className="text-glacial-blue font-medium hover:underline">{resource.expeditionId}</Link></dd>
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <dt className="text-[11px] text-muted uppercase tracking-wider font-semibold">Status</dt>
                  <dd className="text-ink capitalize">{resource.status}</dd>
                </div>
              </dl>
            </div>

            {resource.keywords && resource.keywords.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border-ice pb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {resource.keywords.map(kw => (
                    <span key={kw} className="px-3 py-1.5 rounded-full bg-white text-xs font-medium text-ink border border-border-ice shadow-sm">{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {relations.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border-ice pb-2">Related Resources</h3>
                <ul className="flex flex-col gap-3">
                  {relations.map((rel, i) => {
                    const rid = rel.fromResourceId === resource.id ? rel.toResourceId : rel.fromResourceId;
                    return (
                      <li key={i} className="flex flex-col gap-1">
                        <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">{rel.relationType}</span>
                        <Link to={`/research/${rid}`} className="text-sm font-medium text-glacial-blue hover:text-deep-ocean transition-colors break-all leading-snug">{rid}</Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

          </aside>
        </div>
      </section>
    </div>
  );
}
