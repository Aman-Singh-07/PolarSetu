import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Expedition, Resource } from '../types';
import { Calendar, MapPin, ArrowLeft, Sparkles, ArrowRight, Database, FileText, BookOpen, AlertCircle } from 'lucide-react';

const EXPEDITION_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDZlU0zKQ2fFmf3pyyxCzDmnJXg5L2Xj5SFAtHGSFS24kA0Gy58tAoWbTbUXqoGsekW5ZGVs6dqXXl-slkh9BnQJrowMjTnI9nnGQRWqDnG5dNYMPMEn_sLqSiNuzu-5lmTWUBYAQp6sygCs2C6UWIy4P03eL-w0hWfXwd3WJQ8kwAFp1kB-SnFBBPtQBDHatOHRxJKYaehqvpc6OmwpbpKPRQdMGzgI3cP85LtHag7OJP7QoCs2NerDA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDB96sKfj2s1GP-c4K4liF32nJk6pqICs30jsSS1NnNd5dzn4ykdY0PyEOGQGyci-tWIbPkpGZNDPBgTXzxXGGr3elVT4A7ujheEbfdvpBDzu13jOxlU0GSgwsnizLarYDOymKsDbyYWRzYSAMiCXID7VzCUsIEIQ1znRyY9FIyODNc14oNsWRL17GHi2WhyUnLpa-j40NYGS0pB8F7qsL4sbyO-IoSP2c8FRtD1Dsp3c5de68u1EvlYw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBV_C6b5zrKkQSFIhMOvZZn6R1_m0viH4zJ6telQyT419UgjW68niXGtanxETA0KhUkk7u7ZDCRoo8G_3TX4uRj7IjyjCh1KhhfLBb7VNFm0b5XBUenvylXHIxgPQW5bL-mL8EWZ5H1IoPPjf8WVP4Gg8OLjhDrnAplWyW9F1Fqxewx6cTtETEK9t63P0vpIAzj9pOGuAUmkp_145lHVXmNB39MGwf1_-kTM_ja55If4ejn8Uw_t6rMIw',
];

export default function ExpeditionDetail() {
  const { id } = useParams();
  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchDetails = async (expId: string) => {
    setLoading(true);
    setError(false);
    setNotFound(false);
    try {
      const exp = await api.getExpedition(expId);
      if (exp) {
        setExpedition(exp);
        setResources(exp.resources || []);
      }
    } catch (err: any) {
      if (err.status === 404) {
        setNotFound(true);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetails(id);
  }, [id]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DATASET': return <Database className="w-5 h-5" />;
      case 'PUBLICATION': return <BookOpen className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  if (loading) return (
    <div className="py-20 flex justify-center w-full">
      <div className="w-10 h-10 border-4 border-surface-container-high border-t-secondary rounded-full animate-spin"></div>
    </div>
  );

  if (notFound || !expedition) return (
    <div className="w-full flex flex-col items-center justify-center py-20 bg-surface">
      <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center mb-4">
        <MapPin className="w-8 h-8 text-on-surface-variant" />
      </div>
      <h2 className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep mb-2">Expedition Not Found</h2>
      <p className="font-body-md text-body-md text-on-surface-variant mb-6 text-center">We couldn't find the expedition you were looking for.</p>
      <Link to="/expeditions" className="px-6 py-3 rounded-lg bg-polar-midnight-deep text-pure-white font-label-md font-bold uppercase tracking-wider hover:bg-polar-navy-surface transition-colors">
        Back to Expeditions
      </Link>
    </div>
  );

  if (error) return (
    <div className="w-full flex flex-col items-center justify-center py-20 bg-surface">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-error" />
      </div>
      <h2 className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep mb-2">Unable to load this expedition.</h2>
      <p className="font-body-md text-body-md text-on-surface-variant mb-6 text-center">There was a problem connecting to the server.</p>
      <div className="flex gap-4">
        <button onClick={() => id && fetchDetails(id)} className="px-6 py-3 rounded-lg bg-polar-midnight-deep text-pure-white font-label-md font-bold uppercase tracking-wider hover:bg-polar-navy-surface transition-colors">
          Retry
        </button>
        <Link to="/expeditions" className="px-6 py-3 rounded-lg border border-surface-variant bg-pure-white text-polar-midnight-deep font-label-md font-bold uppercase tracking-wider hover:bg-surface-container-low transition-colors">
          Back to Expeditions
        </Link>
      </div>
    </div>
  );

  const imgIndex = parseInt(expedition.id.replace(/\D/g, '')) % EXPEDITION_IMAGES.length;

  return (
    <div className="flex flex-col w-full">
      {/* Hero Banner */}
      <section className="relative w-full h-72 overflow-hidden bg-polar-midnight-deep">
        <img src={EXPEDITION_IMAGES[imgIndex]} alt={expedition.name} className="w-full h-full object-cover brightness-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-polar-midnight-deep via-polar-midnight-deep/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-4 lg:px-8 pb-8 max-w-7xl mx-auto w-full">
          <Link to="/expeditions" className="inline-flex items-center gap-1 text-glacial-sky font-label-sm text-label-sm hover:text-pure-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Expeditions
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-pure-white/20 backdrop-blur-sm text-pure-white font-label-sm text-label-sm uppercase tracking-wide">{expedition.region}</span>
            <span className="px-2 py-0.5 rounded bg-pure-white/20 backdrop-blur-sm text-glacial-sky font-code-sm text-code-sm">{expedition.id}</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-pure-white tracking-tight">{expedition.name}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-4 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-pure-white p-6 rounded-xl shadow-sm flex flex-col gap-4">
              <h2 className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep">Mission Overview</h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{expedition.objective}</p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span>{expedition.startDate} — {expedition.endDate}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span>{expedition.latitude.toFixed(4)}°, {expedition.longitude.toFixed(4)}°</span>
                </div>
              </div>
            </div>

            {/* Related Resources */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep">Related Resources</h2>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary font-code-sm text-code-sm font-semibold">{resources.length} items</span>
              </div>
              {resources.length > 0 ? resources.map(res => (
                <Link key={res.id} to={`/research/${res.id}`} className="p-4 rounded-xl bg-pure-white shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
                    {getTypeIcon(res.type)}
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary font-code-sm text-code-sm font-semibold">{res.type}</span>
                      <span className="font-code-sm text-code-sm text-outline">{res.id}</span>
                    </div>
                    <h3 className="font-title-md text-title-md font-semibold text-polar-midnight-deep group-hover:text-secondary transition-colors">{res.title}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">{res.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-outline group-hover:text-secondary transition-colors shrink-0 mt-2" />
                </Link>
              )) : (
                <p className="font-body-sm text-body-sm text-on-surface-variant">No resources linked to this expedition.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="bg-pure-white rounded-xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="font-title-md text-title-md font-semibold text-polar-midnight-deep">Mission Metadata</h3>
              <dl className="flex flex-col gap-3">
                <div>
                  <dt className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-0.5">Year</dt>
                  <dd className="font-body-md text-body-md text-on-surface">{expedition.year}</dd>
                </div>
                <div>
                  <dt className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-0.5">Region</dt>
                  <dd className="font-body-md text-body-md text-on-surface">{expedition.region}</dd>
                </div>
                <div>
                  <dt className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-0.5">Coordinates</dt>
                  <dd className="font-code-sm text-code-sm text-on-surface">{expedition.latitude.toFixed(4)}°, {expedition.longitude.toFixed(4)}°</dd>
                </div>
                <div>
                  <dt className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-0.5">Duration</dt>
                  <dd className="font-body-md text-body-md text-on-surface">{expedition.startDate} — {expedition.endDate}</dd>
                </div>
              </dl>
            </div>

            <Link to={`/ai?q=Tell me about expedition ${expedition.id}`} className="p-4 rounded-xl bg-polar-midnight-deep text-pure-white flex items-center gap-3 hover:bg-polar-navy-surface transition-colors shadow-sm">
              <Sparkles className="w-5 h-5 text-glacial-sky" />
              <div className="flex flex-col">
                <span className="font-title-md text-title-md font-semibold">Ask Polar AI</span>
                <span className="font-body-sm text-body-sm text-pure-white/80">Query this expedition's data</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
