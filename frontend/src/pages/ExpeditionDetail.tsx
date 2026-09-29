import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Expedition, Resource } from '../types';
import { ArrowLeft, ArrowRight, MapPin, Sparkles } from 'lucide-react';

const EXPEDITION_IMAGES: Record<string, string> = {
  'EXP-43': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZlU0zKQ2fFmf3pyyxCzDmnJXg5L2Xj5SFAtHGSFS24kA0Gy58tAoWbTbUXqoGsekW5ZGVs6dqXXl-slkh9BnQJrowMjTnI9nnGQRWqDnG5dNYMPMEn_sLqSiNuzu-5lmTWUBYAQp6sygCs2C6UWIy4P03eL-w0hWfXwd3WJQ8kwAFp1kB-SnFBBPtQBDHatOHRxJKYaehqvpc6OmwpbpKPRQdMGzgI3cP85LtHag7OJP7QoCs2NerDA',
  'EXP-ARC-15': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDB96sKfj2s1GP-c4K4liF32nJk6pqICs30jsSS1NnNd5dzn4ykdY0PyEOGQGyci-tWIbPkpGZNDPBgTXzxXGGr3elVT4A7ujheEbfdvpBDzu13jOxlU0GSgwsnizLarYDOymKsDbyYWRzYSAMiCXID7VzCUsIEIQ1znRyY9FIyODNc14oNsWRL17GHi2WhyUnLpa-j40NYGS0pB8F7qsL4sbyO-IoSP2c8FRtD1Dsp3c5de68u1EvlYw',
  'EXP-SO-2024': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV_C6b5zrKkQSFIhMOvZZn6R1_m0viH4zJ6telQyT419UgjW68niXGtanxETA0KhUkk7u7ZDCRoo8G_3TX4uRj7IjyjCh1KhhfLBb7VNFm0b5XBUenvylXHIxgPQW5bL-mL8EWZ5H1IoPPjf8WVP4Gg8OLjhDrnAplWyW9F1Fqxewx6cTtETEK9t63P0vpIAzj9pOGuAUmkp_145lHVXmNB39MGwf1_-kTM_ja55If4ejn8Uw_t6rMIw',
  'EXP-42': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoh_p2zMxwZwU_Tz-12xqiAZAyn2SGIt01c1Hw3MNhXKESF8DCd1BaJot_jsT0LzOFYzVlA3Hez-MLsuhb_wY8ShfUEDvzvq91fuHEdW1i83wF-d43RhGObbdOOmaYKL7W3E-V6ai2p_IP8ZdEU48cTzcKUuCi6k2mMvaumxoZ3bjmef4tDLaXiP4XAoMcZXGwZJf-_x802BVm6_SnwoCVeo9KQIdjR-mmGrjZxZYxR6Q82lDbi31x6Q',
  'EXP-HIM-5': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZlU0zKQ2fFmf3pyyxCzDmnJXg5L2Xj5SFAtHGSFS24kA0Gy58tAoWbTbUXqoGsekW5ZGVs6dqXXl-slkh9BnQJrowMjTnI9nnGQRWqDnG5dNYMPMEn_sLqSiNuzu-5lmTWUBYAQp6sygCs2C6UWIy4P03eL-w0hWfXwd3WJQ8kwAFp1kB-SnFBBPtQBDHatOHRxJKYaehqvpc6OmwpbpKPRQdMGzgI3cP85LtHag7OJP7QoCs2NerDA'
};

export default function ExpeditionDetail() {
  const { id } = useParams();
  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true); setError(false); setNotFound(false);
    api.getExpedition(id)
      .then(exp => { if (exp) { setExpedition(exp); setResources((exp as any).resources || []); } })
      .catch((err: any) => err.status === 404 ? setNotFound(true) : setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="py-32 flex flex-col items-center justify-center bg-snow min-h-[calc(100vh-64px)]">
      <div className="w-8 h-8 rounded-full border-2 border-border-ice border-t-glacial-blue animate-spin mb-4" />
      <span className="text-xs uppercase tracking-widest font-semibold text-muted">Loading Expedition</span>
    </div>
  );

  if (notFound || !expedition) return (
    <div className="py-32 flex flex-col items-center justify-center text-center px-4 bg-snow min-h-[calc(100vh-64px)]">
      <h2 className="font-display text-2xl font-bold text-deep-ocean mb-2">Expedition Not Found</h2>
      <p className="text-sm text-ink/70 mb-8 font-light">The requested expedition does not exist in the archive.</p>
      <Link to="/expeditions" className="px-6 py-3 bg-deep-ocean text-white text-sm font-semibold rounded-lg hover:bg-ocean-navy transition-colors">Return to Expeditions</Link>
    </div>
  );

  if (error) return (
    <div className="py-32 flex flex-col items-center justify-center text-center px-4 bg-snow min-h-[calc(100vh-64px)]">
      <p className="text-sm text-error font-medium mb-6">Unable to load this expedition.</p>
      <Link to="/expeditions" className="px-6 py-3 bg-deep-ocean text-white text-sm font-semibold rounded-lg hover:bg-ocean-navy transition-colors">Return to Expeditions</Link>
    </div>
  );

  const imgUrl = id ? EXPEDITION_IMAGES[id] : null;

  return (
    <div className="flex flex-col w-full bg-snow min-h-[calc(100vh-64px)]">
      
      {/* ─── HEADER ─── */}
      <section className="w-full">
        {imgUrl ? (
          <div className="relative w-full h-[400px] lg:h-[500px] overflow-hidden">
            <img src={imgUrl} alt={expedition.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-ocean via-deep-ocean/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-4 lg:px-8 pb-12">
              <div className="max-w-[1000px] mx-auto flex flex-col gap-4">
                <nav className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-white/70">
                  <Link to="/expeditions" className="hover:text-white transition-colors flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Expeditions</Link>
                </nav>
                <div className="flex flex-col gap-3">
                  <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">{expedition.name}</h1>
                  <div className="flex items-center gap-4 text-sm font-medium text-white/90">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur rounded-full border border-white/20 uppercase tracking-widest font-bold text-xs"><MapPin className="w-3.5 h-3.5" /> {expedition.region}</span>
                    <span>{expedition.year}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full pt-12 pb-16 px-4 lg:px-8 bg-white border-b border-border-ice/50">
            <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
              <nav className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted">
                <Link to="/expeditions" className="hover:text-deep-ocean transition-colors flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Expeditions</Link>
              </nav>
              <div className="flex flex-col gap-4">
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-deep-ocean leading-[1.1] tracking-tight">{expedition.name}</h1>
                <div className="flex items-center gap-4 text-sm font-medium text-ink">
                  <span className="px-3 py-1 bg-frost rounded-full border border-border-ice/50 uppercase tracking-widest font-bold text-[10px]">{expedition.region}</span>
                  <span className="text-muted">{expedition.year}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ─── CONTENT ─── */}
      <section className="w-full px-4 lg:px-8 py-16">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Main Description */}
          <div className="md:col-span-8 flex flex-col gap-10">
            <div className="prose prose-sm md:prose-base max-w-none">
              <h2 className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border-ice pb-2 mb-4">Expedition Objective</h2>
              <p className="text-[15px] text-ink/80 leading-loose whitespace-pre-line font-light">
                {expedition.objective}
              </p>
            </div>

            {/* Contextual Action */}
            <div className="pt-8 border-t border-border-ice/50">
              <Link to={`/ai?expeditionId=${expedition.id}`} className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-deep-ocean text-white text-sm font-bold hover:bg-ocean-navy transition-colors shadow-elevated group w-full sm:w-auto">
                <Sparkles className="w-4 h-4 text-cyan-accent" /> Ask AI about this Expedition <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Sidebar Metadata (Open Layout) */}
          <aside className="md:col-span-4 flex flex-col gap-12">
            
            <div className="flex flex-col gap-5">
              <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border-ice pb-2">Expedition Details</h3>
              <dl className="flex flex-col gap-4 text-sm font-light">
                <div className="flex flex-col gap-1">
                  <dt className="text-[11px] text-muted uppercase tracking-wider font-semibold">Region</dt>
                  <dd className="text-ink">{expedition.region}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-[11px] text-muted uppercase tracking-wider font-semibold">Year</dt>
                  <dd className="text-ink">{expedition.year}</dd>
                </div>
                {expedition.startDate && expedition.endDate && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] text-muted uppercase tracking-wider font-semibold">Duration</dt>
                    <dd className="text-ink">{new Date(expedition.startDate).toLocaleDateString()} – {new Date(expedition.endDate).toLocaleDateString()}</dd>
                  </div>
                )}
                {expedition.latitude && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] text-muted uppercase tracking-wider font-semibold">Coordinates</dt>
                    <dd className="text-ink font-mono text-[13px] bg-frost px-2 py-1 rounded inline-block self-start border border-border-ice">{expedition.latitude}°, {expedition.longitude}°</dd>
                  </div>
                )}
                {expedition.sourceUrl && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] text-muted uppercase tracking-wider font-semibold">Source</dt>
                    <dd><a href={expedition.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-glacial-blue font-medium hover:underline text-[13px] break-all">External Link</a></dd>
                  </div>
                )}
              </dl>
            </div>

            {resources.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border-ice pb-2">Related Research Outputs</h3>
                <ul className="flex flex-col gap-3">
                  {resources.map(r => (
                    <li key={r.id} className="group">
                      <Link to={`/research/${r.id}`} className="text-sm font-medium text-glacial-blue hover:text-deep-ocean transition-colors block leading-snug">
                        {r.title}
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
