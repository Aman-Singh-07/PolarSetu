import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Expedition, Resource } from '../types';
import { ArrowRight, ExternalLink, Sparkles, ChevronRight } from 'lucide-react';
import { Button, Skeleton } from '../components/ui';

export default function ExpeditionDetail() {
  const { id } = useParams();
  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true); setError(false); setNotFound(false);
    
    setExpedition(null);
    setResources([]);
    
    api.getExpedition(id)
      .then(exp => { 
        if (exp) { 
          setExpedition(exp); 
          setResources(exp.resources || []); 
          
          // Trigger AI summary generation if resources exist
          if (exp.resources && exp.resources.length > 0) {
             setLoadingSummary(true);
             const resourceIds = exp.resources.map((r: any) => r.id);
             
             const baseUrl = import.meta.env.VITE_API_URL || '';
             fetch(`${baseUrl}/api/ai/ask`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                 question: `Based solely on these resources, write a professional, compelling, and concise 2-paragraph summary of the ${exp.name} (${exp.year}). Focus on the main scientific activities, discoveries, and their significance. Do not include citations like [Source: X].`,
                 resource_ids: resourceIds
               })
             })
             .then(res => res.json())
             .then(data => {
                if (data && data.answer) {
                  let cleaned = data.answer.replace(/\[Source:.*?\]/g, '').trim();
                  setSummary(cleaned);
                }
             })
             .catch(err => console.error("Summary AI failed:", err))
             .finally(() => setLoadingSummary(false));
          }
        } else {
          setNotFound(true);
        }
      })
      .catch((err: any) => err.status === 404 ? setNotFound(true) : setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Loading ──
  if (loading) return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-snow">
      <section className="w-full bg-snow pt-10 md:pt-16 pb-8">
        <div className="container-standard">
          <Skeleton className="h-4 w-[180px] rounded mb-6" />
          <Skeleton className="h-5 w-[80px] rounded mb-4" />
          <Skeleton className="h-10 w-[70%] rounded mb-3" />
          <Skeleton className="h-10 w-[50%] rounded mb-4" />
          <Skeleton className="h-4 w-[240px] rounded" />
        </div>
      </section>
      <section className="w-full pb-24">
        <div className="container-standard grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Skeleton className="h-[300px] w-full rounded-[12px]" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-[260px] w-full rounded-[12px]" />
          </div>
        </div>
      </section>
    </div>
  );

  // ── Not Found ──
  if (notFound || !expedition) return (
    <div className="flex flex-col items-center justify-center text-center px-5 bg-snow min-h-[calc(100vh-72px)] py-32">
      <h2 className="font-display text-[24px] font-bold text-deep-ocean mb-2">Expedition not found</h2>
      <p className="text-[15px] text-ink/60 mb-8">The requested expedition could not be found in the current repository.</p>
      <Link to="/expeditions">
        <Button>Back to Expeditions</Button>
      </Link>
    </div>
  );

  // ── Error ──
  if (error) return (
    <div className="flex flex-col items-center justify-center text-center px-5 bg-snow min-h-[calc(100vh-72px)] py-32">
      <p className="text-[15px] text-ink font-medium mb-2">Unable to load this expedition.</p>
      <p className="text-[14px] text-muted mb-6">Please try again.</p>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => window.location.reload()}>Retry</Button>
        <Link to="/expeditions"><Button>Back to Expeditions</Button></Link>
      </div>
    </div>
  );

  const actualImageUrl = (expedition as any).imageUrl;

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-snow">
      
      {/* ─── HEADER ─── */}
      <section className="w-full bg-snow pt-8 md:pt-12 pb-8">
        <div className="container-standard flex flex-col gap-5">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[13px] text-muted">
            <Link to="/expeditions" className="hover:text-glacial-blue transition-colors font-medium">Expeditions</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink/40 truncate max-w-[300px]">{expedition.name}</span>
          </nav>
          
          {/* Type */}
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-glacial-blue">
            Field Expedition
          </span>

          {/* Title */}
          <h1 className="font-display text-[32px] md:text-[40px] font-bold text-ink tracking-tight leading-[1.15]">
            {expedition.name}
          </h1>
          
          {/* Core metadata row */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-muted font-medium">
            {expedition.region && <span>{expedition.region}</span>}
            {expedition.region && expedition.year && <span>·</span>}
            {expedition.year && <span>{expedition.year}</span>}
          </div>
        </div>
      </section>

      {/* ─── CONTENT + SIDEBAR ─── */}
      <section className="w-full pb-24">
        <div className="container-standard grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {actualImageUrl && (
              <div className="w-full rounded-[12px] overflow-hidden border border-border-ice">
                <img src={actualImageUrl} alt={expedition.name} className="w-full h-auto max-h-[500px] object-cover" />
              </div>
            )}

            {expedition.objective && (
              <div className="bg-white rounded-[12px] border border-border-ice p-6 md:p-8">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-4">Expedition Overview</h2>
                <p className="text-[16px] text-ink/80 leading-[1.7] whitespace-pre-line">
                  {expedition.objective}
                </p>
              </div>
            )}

            {/* AI Summary Block */}
            {resources.length > 0 && (
              <div className="bg-white rounded-[12px] border border-border-ice p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-accent to-glacial-blue" />
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-cyan-accent" />
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-deep-ocean">AI SYNTHESIZED EXPEDITION SUMMARY</h2>
                </div>
                
                {loadingSummary ? (
                  <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-[90%] rounded" />
                    <Skeleton className="h-4 w-[95%] rounded" />
                    <Skeleton className="h-4 w-[60%] rounded mt-2" />
                  </div>
                ) : summary ? (
                  <div className="text-[15.5px] text-ink/80 leading-[1.8] whitespace-pre-line font-medium text-justify">
                    {summary}
                  </div>
                ) : (
                  <p className="text-sm text-muted">Summary unavailable.</p>
                )}
              </div>
            )}

            <div className="bg-white rounded-[12px] border border-border-ice p-6">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-4">Explore this expedition</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/ai?expeditionId=${expedition.id}`}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-[10px] bg-deep-ocean text-white hover:bg-glacial-blue transition-colors font-semibold text-[14px]"
                >
                  <Sparkles className="w-4 h-4" />
                  Ask AI
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
            
            {/* Information Panel */}
            <div className="bg-white rounded-[12px] border border-border-ice p-6 flex flex-col gap-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted border-b border-border-ice pb-3">Expedition Information</h3>
              <dl className="flex flex-col gap-4 text-[14px]">
                
                {expedition.startDate && expedition.endDate && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] text-muted uppercase tracking-[0.12em] font-semibold">Duration</dt>
                    <dd className="text-ink font-medium">{new Date(expedition.startDate).toLocaleDateString()} – {new Date(expedition.endDate).toLocaleDateString()}</dd>
                  </div>
                )}
                
                {expedition.region && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] text-muted uppercase tracking-[0.12em] font-semibold">Region</dt>
                    <dd className="text-ink font-medium">{expedition.region}</dd>
                  </div>
                )}
                
                {expedition.year && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] text-muted uppercase tracking-[0.12em] font-semibold">Year</dt>
                    <dd className="text-ink font-medium">{expedition.year}</dd>
                  </div>
                )}

                {expedition.latitude && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] text-muted uppercase tracking-[0.12em] font-semibold">Coordinates</dt>
                    <dd className="text-ink font-medium mt-0.5">
                      {expedition.latitude}°, {expedition.longitude}°
                    </dd>
                  </div>
                )}
                
                {expedition.sourceUrl && (
                  <div className="flex flex-col gap-1 mt-2">
                    <a href={expedition.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-glacial-blue hover:text-cyan-accent transition-colors w-fit">
                      <ExternalLink className="w-3.5 h-3.5" /> External Source
                    </a>
                  </div>
                )}
                
              </dl>
            </div>

            {/* Related Research */}
            {resources.length > 0 && (
              <div className="bg-white rounded-[12px] border border-border-ice p-6 flex flex-col gap-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">Related Research</h3>
                <ul className="flex flex-col gap-3 pt-1">
                  {resources.map((r, i) => (
                    <li key={i}>
                      <span className="text-[10px] text-muted uppercase tracking-[0.1em] font-semibold block mb-1">{(r as any).type || 'Resource'}</span>
                      <Link to={`/research/${r.id}`} className="text-[13px] font-medium text-glacial-blue hover:text-cyan-accent transition-colors inline-flex flex-col gap-1">
                        <span>{r.title}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted group-hover:text-cyan-accent/80 transition-colors font-bold mt-1">
                          View Record <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
