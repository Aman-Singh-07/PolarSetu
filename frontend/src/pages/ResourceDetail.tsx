import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Resource } from '../types';
import { ArrowLeft, Sparkles, Edit3, Calendar, MapPin, CheckCircle2, Tag } from 'lucide-react';

export default function ResourceDetail() {
  const { id } = useParams();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchResource = async (resId: string) => {
    setLoading(true);
    const data = await api.getResource(resId);
    if (data) setResource(data);
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchResource(id);
  }, [id]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DATASET': return 'text-secondary bg-surface-container-high';
      case 'PUBLICATION': return 'text-azure-accent bg-surface-container-high';
      default: return 'text-aurora-emerald bg-surface-container-high';
    }
  };

  if (loading) return <div className="py-12 text-center text-on-surface-variant font-body-md">Loading resource details...</div>;
  if (!resource) return <div className="py-12 text-center text-on-surface-variant font-body-md">Resource not found.</div>;

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="w-full bg-ice-white py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <Link to="/explore" className="inline-flex items-center gap-1 text-secondary font-label-sm text-label-sm hover:text-polar-midnight-deep transition-colors self-start">
            <ArrowLeft className="w-4 h-4" /> Back to Repository
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded font-code-sm text-code-sm font-semibold ${getTypeColor(resource.type)}`}>{resource.type}</span>
            {resource.status === 'PUBLISHED' && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            )}
            <span className="font-code-sm text-code-sm text-outline">{resource.id}</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep tracking-tight">{resource.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-4 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-pure-white p-6 rounded-xl shadow-sm flex flex-col gap-4">
              <h2 className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep">Description</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{resource.description}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Link to={`/ai?resourceId=${resource.id}`} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-polar-midnight-deep text-on-primary font-title-md text-title-md hover:bg-polar-navy-surface transition-colors shadow-sm">
                <Sparkles className="w-5 h-5 text-glacial-sky" /> Ask AI About This
              </Link>
              <Link to={`/outreach?sourceId=${resource.id}`} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-surface-container-low text-secondary font-title-md text-title-md hover:bg-surface-container transition-colors">
                <Edit3 className="w-5 h-5" /> Generate Outreach
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="bg-pure-white rounded-xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="font-title-md text-title-md font-semibold text-polar-midnight-deep border-b border-slate-border pb-2">Metadata</h3>
              <dl className="flex flex-col gap-3">
                {resource.author && (
                  <div>
                    <dt className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-0.5">Author / Institution</dt>
                    <dd className="font-body-md text-body-md text-on-surface">{resource.author} {resource.institution && `• ${resource.institution}`}</dd>
                  </div>
                )}
                <div>
                  <dt className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-0.5">Year</dt>
                  <dd className="font-body-md text-body-md text-on-surface flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-on-surface-variant" /> {resource.year}
                  </dd>
                </div>
                <div>
                  <dt className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-0.5">Region</dt>
                  <dd className="font-body-md text-body-md text-on-surface flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-on-surface-variant" /> {resource.region}
                  </dd>
                </div>
                {resource.researchArea && (
                  <div>
                    <dt className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-0.5">Research Area</dt>
                    <dd className="font-body-md text-body-md text-on-surface">{resource.researchArea}</dd>
                  </div>
                )}
                {resource.expeditionId && (
                  <div>
                    <dt className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-0.5">Related Expedition</dt>
                    <dd>
                      <Link to={`/expeditions/${resource.expeditionId}`} className="inline-flex items-center gap-1 text-secondary font-label-md text-label-md font-semibold hover:underline">
                        {resource.expeditionId}
                      </Link>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {resource.keywords && resource.keywords.length > 0 && (
              <div className="bg-pure-white rounded-xl p-6 shadow-sm flex flex-col gap-3">
                <h3 className="font-title-md text-title-md font-semibold text-polar-midnight-deep flex items-center gap-2">
                  <Tag className="w-4 h-4 text-secondary" /> Keywords
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {resource.keywords.map(kw => (
                    <span key={kw} className="px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">{kw}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
