import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Compass, Sparkles, ArrowRight, AlertTriangle, PlayCircle } from 'lucide-react';
import { api } from '../services/api';
import type { Resource, Expedition, MediaItem } from '../types';
import { Button, Card, CardContent, Skeleton } from '../components/ui';

export default function Home() {
  const navigate = useNavigate();

  const [resources, setResources] = useState<Resource[]>([]);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [resError, setResError] = useState(false);
  const [expError, setExpError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setResError(false);
    setExpError(false);

    Promise.all([
      api.getResources().catch(() => { setResError(true); return null; }),
      api.getExpeditions().catch(() => { setExpError(true); return null; }),
      api.getMedia().catch(() => null)
    ])
      .then(([resData, expData, mediaData]) => {
        if (!isMounted) return;
        setResources(resData || []);
        setExpeditions(expData || []);
        setMedia(mediaData || []);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const featuredExpedition = expeditions.length > 0 ? expeditions[0] : null;
  const recentResources = resources.slice(0, 3);
  const featuredMedia = media.slice(0, 3);

  return (
    <div className="flex flex-col w-full bg-snow">

      {/* ─── 1. HERO ─── */}
      <section className="relative w-full h-[550px] md:h-[640px] flex items-center bg-deep-ocean overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/polar/hero-rothera.webp"
            alt="Rothera research station in Antarctica"
            className="w-full h-full object-cover object-[center_30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-ocean via-deep-ocean/80 to-transparent" />
          <div className="absolute inset-0 bg-deep-ocean/40 md:bg-deep-ocean/20" />
        </div>

        <div className="relative z-10 container-standard flex flex-col justify-center h-full">
          <div className="max-w-[650px] flex flex-col items-start text-left gap-6">
            <span className="text-[12px] md:text-[13px] font-semibold tracking-[0.2em] uppercase text-ice-blue">
              Polar Science Knowledge Platform
            </span>
            
            <h1 className="font-display text-[36px] sm:text-[40px] md:text-[56px] font-bold leading-[1.05] text-white tracking-tight">
              India's Polar Science, Connected.
            </h1>
            
            <p className="text-[16px] text-white/90 leading-[1.6] font-light max-w-[580px]">
              Discover polar research, explore expedition records, and ask source-grounded questions across the Antarctic, Arctic, and Himalayas.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 mt-2 w-full sm:w-auto">
              <Button size="lg" className="min-h-[48px] justify-center !bg-white !text-deep-ocean hover:!bg-ice-blue border-transparent font-semibold rounded-[10px]" onClick={() => navigate('/explore')}>
                Explore Research
              </Button>
              <Button size="lg" variant="secondary" className="min-h-[48px] justify-center bg-white/10 border-white/20 !text-white hover:!bg-white hover:!text-deep-ocean backdrop-blur-sm font-semibold rounded-[10px]" onClick={() => navigate('/ai')}>
                Ask AI
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. START WITH ─── */}
      <section className="w-full bg-snow py-16 md:py-24">
        <div className="container-standard flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted">Start here</span>
            <h2 className="font-display text-[28px] md:text-[32px] font-bold text-deep-ocean tracking-tight">
              Start with what you're looking for.
            </h2>
            <p className="text-muted text-[16px]">Explore the repository, follow India's polar expeditions, or ask a question grounded in available sources.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link to="/explore" className="block outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent focus-visible:ring-offset-2 rounded-[12px]">
              <div className="h-full flex flex-col gap-4 bg-white rounded-[12px] p-6 border border-border-ice hover:border-glacial-blue/40 hover:shadow-sm transition-all duration-200 cursor-pointer group">
                <div className="flex flex-row items-start justify-between">
                  <div className="w-10 h-10 rounded-[10px] bg-ice-blue/40 flex items-center justify-center text-glacial-blue">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[12px] font-semibold text-muted/60 tracking-widest">01</span>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-[18px] font-bold text-deep-ocean font-display group-hover:text-glacial-blue transition-colors">Research</h3>
                  <p className="text-[14px] leading-relaxed text-ink/60">
                    Discover available scientific resources and research material.
                  </p>
                </div>
                <div className="mt-auto pt-1 flex items-center text-glacial-blue font-semibold text-[13px]">
                  Explore Archive <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link to="/expeditions" className="block outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent focus-visible:ring-offset-2 rounded-[12px]">
              <div className="h-full flex flex-col gap-4 bg-white rounded-[12px] p-6 border border-border-ice hover:border-glacial-blue/40 hover:shadow-sm transition-all duration-200 cursor-pointer group">
                <div className="flex flex-row items-start justify-between">
                  <div className="w-10 h-10 rounded-[10px] bg-ice-blue/40 flex items-center justify-center text-glacial-blue">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="text-[12px] font-semibold text-muted/60 tracking-widest">02</span>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-[18px] font-bold text-deep-ocean font-display group-hover:text-glacial-blue transition-colors">Expeditions</h3>
                  <p className="text-[14px] leading-relaxed text-ink/60">
                    Explore documented polar field expeditions and their context.
                  </p>
                </div>
                <div className="mt-auto pt-1 flex items-center text-glacial-blue font-semibold text-[13px]">
                  View Records <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link to="/ai" className="block outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent focus-visible:ring-offset-2 rounded-[12px]">
              <div className="h-full flex flex-col gap-4 bg-white rounded-[12px] p-6 border border-border-ice hover:border-glacial-blue/40 hover:shadow-sm transition-all duration-200 cursor-pointer group">
                <div className="flex flex-row items-start justify-between">
                  <div className="w-10 h-10 rounded-[10px] bg-ice-blue/40 flex items-center justify-center text-glacial-blue">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[12px] font-semibold text-muted/60 tracking-widest">03</span>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-[18px] font-bold text-deep-ocean font-display group-hover:text-glacial-blue transition-colors">Ask AI</h3>
                  <p className="text-[14px] leading-relaxed text-ink/60">
                    Ask questions grounded in the available research repository.
                  </p>
                </div>
                <div className="mt-auto pt-1 flex items-center text-glacial-blue font-semibold text-[13px]">
                  Open Assistant <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 3. FEATURED RESEARCH ─── */}
      <section className="w-full bg-frost py-16 md:py-24 border-y border-border-ice">
        <div className="container-standard flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted">Research Repository</span>
              <h2 className="font-display text-[28px] md:text-[32px] font-bold text-deep-ocean tracking-tight">
                Explore the repository
              </h2>
            </div>
            <Button variant="secondary" className="gap-2 shrink-0 bg-white" onClick={() => navigate('/explore')}>
              Explore all <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {resError ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-white rounded-[12px] border border-border-ice">
              <AlertTriangle className="w-6 h-6 text-muted mb-3" />
              <p className="text-[15px] text-ink font-medium">Research could not be loaded.</p>
              <Button variant="secondary" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-[220px] w-full rounded-[12px]" />)}
            </div>
          ) : recentResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentResources.map((r) => (
                <Link key={r.id} to={`/research/${r.id}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent focus-visible:ring-offset-2 rounded-[12px]">
                  <div className="h-full flex flex-col gap-3 rounded-[12px] border border-border-ice hover:border-glacial-blue/40 hover:shadow-sm cursor-pointer group p-5 bg-white transition-all duration-200">
                    <div className="flex flex-row items-center justify-between gap-3 text-[12px] text-muted">
                      <span className="px-2 py-1 rounded bg-frost text-ocean-navy font-semibold uppercase tracking-widest text-[10px]">
                        {r.type}
                      </span>
                      {r.year && (
                        <span className="font-medium text-ink/50">{r.year}</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <h3 className="group-hover:text-glacial-blue transition-colors text-[18px] leading-[1.3] line-clamp-2 text-ink font-bold">
                        {r.title}
                      </h3>
                      {r.description && (
                        <p className="line-clamp-2 text-[14px] text-ink/50 leading-relaxed">
                          {r.description}
                        </p>
                      )}
                      
                      <div className="mt-auto pt-4 flex items-center text-[13px] font-semibold text-glacial-blue group-hover:text-cyan-accent transition-colors">
                        View Resource <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-white rounded-[12px] border border-border-ice border-dashed">
              <BookOpen className="w-6 h-6 text-muted mb-3 opacity-50" />
              <p className="text-[15px] text-ink font-medium">No research resources are available yet.</p>
              <p className="text-[14px] text-muted mt-1">Resources will appear here when they are added to the repository.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── 4. FEATURED EXPEDITION ─── */}
      <section className="w-full bg-snow py-16 md:py-24">
        <div className="container-standard flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted">Field Expedition</span>
            <h2 className="font-display text-[28px] md:text-[32px] font-bold text-deep-ocean tracking-tight">
              Featured Expedition
            </h2>
          </div>

          {expError ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-white rounded-[12px] border border-border-ice">
              <AlertTriangle className="w-6 h-6 text-muted mb-3" />
              <p className="text-[15px] text-ink font-medium">The featured expedition could not be loaded.</p>
              <Button variant="secondary" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : loading ? (
            <Skeleton className="h-[400px] w-full rounded-[12px]" />
          ) : featuredExpedition ? (
            <div className="w-full rounded-[12px] border border-border-ice bg-white overflow-hidden flex flex-col lg:flex-row group">
              <div className="w-full lg:w-[55%] h-[300px] lg:h-auto relative overflow-hidden bg-deep-ocean shrink-0">
                <img
                  src="/images/polar/feature-maitri.webp"
                  alt={featuredExpedition.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full lg:w-[45%] p-8 md:p-10 flex flex-col justify-center gap-5 bg-white">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-frost text-ocean-navy font-semibold uppercase tracking-widest text-[10px]">
                    {featuredExpedition.region}
                  </span>
                  <span className="font-medium text-ink/50 text-[13px]">
                    {featuredExpedition.year}
                  </span>
                </div>
                
                <h3 className="font-display text-[28px] md:text-[32px] font-bold text-deep-ocean leading-[1.15]">
                  {featuredExpedition.name}
                </h3>
                
                {featuredExpedition.objective && (
                  <p className="text-[15px] text-ink/60 leading-relaxed line-clamp-4">
                    {featuredExpedition.objective}
                  </p>
                )}
                
                <div className="pt-2 mt-auto">
                  <Button className="gap-2 bg-deep-ocean text-white hover:bg-glacial-blue border-transparent rounded-[10px]" onClick={() => navigate(`/expeditions/${featuredExpedition.id}`)}>
                    View Expedition <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-white rounded-[12px] border border-border-ice">
              <Compass className="w-6 h-6 text-muted mb-3 opacity-50" />
              <p className="text-[15px] text-ink font-medium">No expeditions are available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── 5. STORIES FROM THE FIELD — only if real media exists ─── */}
      {!loading && featuredMedia.length > 0 && (
        <section className="w-full bg-frost py-16 md:py-24 border-t border-border-ice">
          <div className="container-standard flex flex-col gap-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted">Media</span>
                <h2 className="font-display text-[28px] md:text-[32px] font-bold text-deep-ocean tracking-tight">
                  Stories from the field
                </h2>
              </div>
              <Button variant="secondary" className="gap-2 shrink-0 bg-white" onClick={() => navigate('/media')}>
                Explore Media <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {featuredMedia.map((m) => (
                <Card key={m.id} className="overflow-hidden border-border-ice flex flex-col group cursor-pointer rounded-[12px]" onClick={() => navigate('/media')}>
                  <div className="relative w-full h-[180px] bg-deep-ocean overflow-hidden shrink-0">
                    <img src={(m as any).url || m.sourceUrl || m.thumbnailUrl || m.storagePath} alt={(m as any).caption || m.title} className="w-full h-full object-cover" />
                    {((m as any).mediaType || m.type) === 'VIDEO' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-deep-ocean/20">
                        <PlayCircle className="w-10 h-10 text-white/90" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5 flex flex-col gap-2 flex-1">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">{(m as any).mediaType || m.type || 'MEDIA'}</span>
                    <h3 className="font-display text-[16px] font-bold text-ink leading-tight line-clamp-2 group-hover:text-glacial-blue transition-colors">{(m as any).caption || m.title || 'Untitled Media'}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}




    </div>
  );
}
