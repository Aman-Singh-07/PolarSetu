import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Resource } from '../types';
import { ArrowRight, ExternalLink, Sparkles, Send, ChevronRight } from 'lucide-react';
import { Button, Skeleton } from '../components/ui';

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
      setResource(null); setRelations([]);
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
  if (notFound || !resource) return (
    <div className="flex flex-col items-center justify-center text-center px-5 bg-snow min-h-[calc(100vh-72px)] py-32">
      <h2 className="font-display text-[24px] font-bold text-deep-ocean mb-2">Resource not found</h2>
      <p className="text-[15px] text-ink/60 mb-8">The requested resource could not be found in the current repository.</p>
      <Link to="/explore">
        <Button>Back to Research</Button>
      </Link>
    </div>
  );

  // ── Error ──
  if (error) return (
    <div className="flex flex-col items-center justify-center text-center px-5 bg-snow min-h-[calc(100vh-72px)] py-32">
      <p className="text-[15px] text-ink font-medium mb-2">{error}</p>
      <p className="text-[14px] text-muted mb-6">Please try again.</p>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => window.location.reload()}>Retry</Button>
        <Link to="/explore"><Button>Back to Research</Button></Link>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-snow">

      {/* ─── HEADER ─── */}
      <section className="w-full bg-snow pt-8 md:pt-12 pb-8">
        <div className="container-standard flex flex-col gap-5">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[13px] text-muted">
            <Link to="/explore" className="hover:text-glacial-blue transition-colors font-medium">Research</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink/40 truncate max-w-[300px]">{resource.title}</span>
          </nav>

          {/* Type */}
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-glacial-blue">
            {resource.type || 'RESOURCE'}
          </span>

          {/* Title */}
          <h1 className="font-display text-[32px] md:text-[40px] font-bold text-ink tracking-tight leading-[1.15]">
            {resource.title}
          </h1>

          {/* Core metadata row */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-muted font-medium">
            {resource.region && <span>{resource.region}</span>}
            {resource.region && resource.year && <span>·</span>}
            {resource.year && <span>{resource.year}</span>}
            {(resource.region || resource.year) && resource.author && <span>·</span>}
            {resource.author && <span>{resource.author}</span>}
          </div>
        </div>
      </section>

      {/* ─── CONTENT + SIDEBAR ─── */}
      <section className="w-full pb-24">
        <div className="container-standard grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Content */}
          <div className="lg:col-span-8 flex flex-col gap-8">

            {/* Description */}
            {resource.description && (
              <div className="bg-white rounded-[12px] border border-border-ice p-6 md:p-8">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-4">Description</h2>
                <p className="text-[16px] text-ink/80 leading-[1.7] whitespace-pre-line">
                  {resource.description}
                </p>
              </div>
            )}

            {/* Source access */}
            {resource.sourceUrl && (
              <div className="bg-white rounded-[12px] border border-border-ice p-6">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-4">Source</h2>
                <a
                  href={resource.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[14px] font-semibold text-glacial-blue hover:text-cyan-accent transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Access primary source
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-[12px] border border-border-ice p-6">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-4">Explore this resource</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/ai?resourceId=${resource.id}`}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-[10px] bg-deep-ocean text-white hover:bg-glacial-blue transition-colors font-semibold text-[14px]"
                >
                  <Sparkles className="w-4 h-4" />
                  Ask AI
                </Link>
                <Link
                  to={`/outreach?sourceId=${resource.id}`}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-[10px] bg-white border border-border-ice text-deep-ocean hover:border-glacial-blue/40 transition-colors font-semibold text-[14px]"
                >
                  <Send className="w-4 h-4 text-glacial-blue" />
                  Create Outreach Draft
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-[12px] border border-border-ice p-6 flex flex-col gap-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted border-b border-border-ice pb-3">Resource Information</h3>

              <dl className="flex flex-col gap-4 text-[14px]">
                <div className="flex flex-col gap-1">
                  <dt className="text-[11px] text-muted uppercase tracking-[0.12em] font-semibold">Type</dt>
                  <dd className="text-ink font-medium">{resource.type || 'Resource'}</dd>
                </div>

                {resource.year && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] text-muted uppercase tracking-[0.12em] font-semibold">Year</dt>
                    <dd className="text-ink font-medium">{resource.year}</dd>
                  </div>
                )}

                {resource.region && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] text-muted uppercase tracking-[0.12em] font-semibold">Region</dt>
                    <dd className="text-ink font-medium">{resource.region}</dd>
                  </div>
                )}

                {resource.author && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] text-muted uppercase tracking-[0.12em] font-semibold">Author</dt>
                    <dd className="text-ink font-medium">
                      {resource.author}
                      {resource.institution && <span className="text-muted font-normal"> · {resource.institution}</span>}
                    </dd>
                  </div>
                )}

                {resource.researchArea && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] text-muted uppercase tracking-[0.12em] font-semibold">Research Area</dt>
                    <dd className="text-ink font-medium">{resource.researchArea}</dd>
                  </div>
                )}

                {resource.expeditionId && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] text-muted uppercase tracking-[0.12em] font-semibold">Expedition</dt>
                    <dd>
                      <Link to={`/expeditions/${resource.expeditionId}`} className="text-glacial-blue font-medium hover:text-cyan-accent transition-colors inline-flex items-center gap-1">
                        View expedition <ArrowRight className="w-3 h-3" />
                      </Link>
                    </dd>
                  </div>
                )}

                {resource.license && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] text-muted uppercase tracking-[0.12em] font-semibold">License</dt>
                    <dd className="text-ink font-medium">{resource.license}</dd>
                  </div>
                )}

                {resource.storagePath && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] text-muted uppercase tracking-[0.12em] font-semibold">File</dt>
                    <dd className="text-ink/60 text-[13px]">File available in storage</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Keywords — only if actual data */}
            {resource.keywords && resource.keywords.length > 0 && (
              <div className="bg-white rounded-[12px] border border-border-ice p-6 flex flex-col gap-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {resource.keywords.map(kw => (
                    <span key={kw} className="px-2.5 py-1 rounded-md bg-frost text-[11px] font-medium text-ink/60 border border-border-ice">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Resources */}
            {relations.length > 0 && (
              <div className="bg-white rounded-[12px] border border-border-ice p-6 flex flex-col gap-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">Related Resources</h3>
                <ul className="flex flex-col gap-3">
                  {relations.map((rel, i) => {
                    const rid = rel.fromResourceId === resource.id ? rel.toResourceId : rel.fromResourceId;
                    return (
                      <li key={i}>
                        <span className="text-[10px] text-muted uppercase tracking-[0.1em] font-semibold block mb-1">{rel.relationType}</span>
                        <Link to={`/research/${rid}`} className="text-[13px] font-medium text-glacial-blue hover:text-cyan-accent transition-colors inline-flex items-center gap-1">
                          {rid} <ArrowRight className="w-3 h-3" />
                        </Link>
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
