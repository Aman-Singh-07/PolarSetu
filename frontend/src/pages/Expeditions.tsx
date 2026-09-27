import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import type { Expedition } from '../types';

const EXPEDITION_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDZlU0zKQ2fFmf3pyyxCzDmnJXg5L2Xj5SFAtHGSFS24kA0Gy58tAoWbTbUXqoGsekW5ZGVs6dqXXl-slkh9BnQJrowMjTnI9nnGQRWqDnG5dNYMPMEn_sLqSiNuzu-5lmTWUBYAQp6sygCs2C6UWIy4P03eL-w0hWfXwd3WJQ8kwAFp1kB-SnFBBPtQBDHatOHRxJKYaehqvpc6OmwpbpKPRQdMGzgI3cP85LtHag7OJP7QoCs2NerDA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDB96sKfj2s1GP-c4K4liF32nJk6pqICs30jsSS1NnNd5dzn4ykdY0PyEOGQGyci-tWIbPkpGZNDPBgTXzxXGGr3elVT4A7ujheEbfdvpBDzu13jOxlU0GSgwsnizLarYDOymKsDbyYWRzYSAMiCXID7VzCUsIEIQ1znRyY9FIyODNc14oNsWRL17GHi2WhyUnLpa-j40NYGS0pB8F7qsL4sbyO-IoSP2c8FRtD1Dsp3c5de68u1EvlYw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBV_C6b5zrKkQSFIhMOvZZn6R1_m0viH4zJ6telQyT419UgjW68niXGtanxETA0KhUkk7u7ZDCRoo8G_3TX4uRj7IjyjCh1KhhfLBb7VNFm0b5XBUenvylXHIxgPQW5bL-mL8EWZ5H1IoPPjf8WVP4Gg8OLjhDrnAplWyW9F1Fqxewx6cTtETEK9t63P0vpIAzj9pOGuAUmkp_145lHVXmNB39MGwf1_-kTM_ja55If4ejn8Uw_t6rMIw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCoh_p2zMxwZwU_Tz-12xqiAZAyn2SGIt01c1Hw3MNhXKESF8DCd1BaJot_jsT0LzOFYzVlA3Hez-MLsuhb_wY8ShfUEDvzvq91fuHEdW1i83wF-d43RhGObbdOOmaYKL7W3E-V6ai2p_IP8ZdEU48cTzcKUuCi6k2mMvaumxoZ3bjmef4tDLaXiP4XAoMcZXGwZJf-_x802BVm6_SnwoCVeo9KQIdjR-mmGrjZxZYxR6Q82lDbi31x6Q',
];

export default function Expeditions() {
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getExpeditions().then(data => {
      setExpeditions(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="w-full bg-ice-white py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-label-sm uppercase tracking-wider font-semibold">Active & Archived Missions</span>
            <span className="font-code-sm text-code-sm text-outline">MoES Polar Science Division</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="flex flex-col gap-1 max-w-2xl">
              <h1 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep">Expedition Explorer</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Browse detailed field documentation, logistical reports, and scientific dossiers from India's polar expeditions spanning Antarctica, the Arctic, and the Himalayas.
              </p>
            </div>
            <div className="flex items-center gap-1 bg-pure-white p-1 rounded-xl shadow-sm self-start">
              <span className="px-3 py-1.5 rounded-lg bg-surface-container-low text-polar-midnight-deep font-code-sm text-code-sm font-semibold">
                {expeditions.length} Missions Loaded
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="w-full px-4 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12 text-on-surface-variant font-body-md">Loading expeditions...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expeditions.map((exp, i) => (
                <article key={exp.id} className="flex flex-col rounded-xl bg-pure-white shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      alt={exp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={EXPEDITION_IMAGES[i % EXPEDITION_IMAGES.length]}
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded bg-polar-midnight-deep/90 text-pure-white font-label-sm text-label-sm uppercase tracking-wide">{exp.region}</span>
                      <span className="px-2 py-0.5 rounded bg-pure-white/90 text-on-surface font-label-sm text-label-sm font-semibold">{exp.id}</span>
                    </div>
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-surface-container-lowest/90 text-polar-midnight-deep font-code-sm text-code-sm">
                      {exp.year}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                        <MapPin className="w-4 h-4 text-secondary" />
                        <span>{exp.latitude.toFixed(2)}°, {exp.longitude.toFixed(2)}°</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep group-hover:text-secondary transition-colors">
                        {exp.name}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                        {exp.objective}
                      </p>
                    </div>
                    <div className="pt-2 flex flex-col gap-2">
                      <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-surface-container-low">
                        <Calendar className="w-4 h-4 text-on-surface-variant" />
                        <span className="font-code-sm text-code-sm text-on-surface-variant">{exp.startDate} — {exp.endDate}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-label-sm text-label-sm text-aurora-emerald font-semibold uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Archived
                        </span>
                        <Link to={`/expeditions/${exp.id}`} className="inline-flex items-center gap-1 text-secondary font-label-md text-label-md font-semibold hover:underline">
                          Dossier & Data <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
