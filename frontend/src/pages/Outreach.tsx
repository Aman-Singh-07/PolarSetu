import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Edit3, FileText, Loader2, CheckCircle2, ArrowRight, Beaker, School, Globe2, Newspaper, Scale } from 'lucide-react';
import { api } from '../services/api';
import type { Resource, OutreachDraft } from '../types';

const AUDIENCES = [
  { id: 'Researcher', label: 'Researcher', icon: Beaker },
  { id: 'Student / Educator', label: 'Student / Educator', icon: School },
  { id: 'General Public', label: 'General Public', icon: Globe2 },
  { id: 'Media', label: 'Media', icon: Newspaper },
  { id: 'Policy', label: 'Policy', icon: Scale },
];

const FORMATS = [
  'Scientific Summary', 'Website Article', 'Social Media Post',
  'Educational Explanation', 'Press Note', 'Short Video Script'
];

export default function Outreach() {
  const [searchParams] = useSearchParams();
  const initialSourceId = searchParams.get('sourceId') || '';

  const [resources, setResources] = useState<Resource[]>([]);
  const [sourceId, setSourceId] = useState(initialSourceId);
  const [audience, setAudience] = useState('Researcher');
  const [format, setFormat] = useState('Educational Explanation');
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<OutreachDraft | null>(null);

  useEffect(() => {
    api.getResources().then(setResources);
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId) return;
    setLoading(true);
    const newDraft = await api.generateOutreach({ sourceId, audience, format });
    setDraft(newDraft);
    setLoading(false);
  };

  const selectedResource = resources.find(r => r.id === sourceId);

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="w-full py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-surface-container-high text-secondary">
                <Edit3 className="w-4 h-4" />
              </span>
              <span className="font-code-sm text-code-sm text-secondary tracking-widest uppercase">SIH26063 Engine • Outreach Studio</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-aurora-emerald animate-ping"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Model: CryoSynth-MoES v3.1 (Grounded / RAG Verified)</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep tracking-tight">Polar Outreach Studio</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
                Transform verified polar research into responsible, audience-ready science communication through governed LLM synthesis and mandatory institutional sign-off.
              </p>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-low p-1.5 rounded-lg">
              <span className="font-label-sm text-label-sm text-secondary font-semibold px-1">Active Session:</span>
              <span className="font-code-sm text-code-sm bg-pure-white text-polar-midnight-deep px-2 py-0.5 rounded shadow-sm">SESSION_OUTREACH</span>
            </div>
          </div>

          {/* Pipeline Stepper */}
          <div className="mt-2 p-3 rounded-xl bg-pure-white shadow-sm overflow-x-auto">
            <div className="flex items-center justify-between min-w-[720px]">
              {[
                { n: '1', label: 'Source', sub: 'Verified', color: 'bg-polar-midnight-deep', textColor: 'text-aurora-emerald' },
                { n: '2', label: 'AI Generation', sub: 'RAG Grounded', color: 'bg-secondary', textColor: 'text-on-surface-variant' },
                { n: '3', label: 'Generated Draft', sub: 'Synthesized', color: 'bg-secondary', textColor: 'text-secondary' },
                { n: '4', label: 'Human Review', sub: 'Mandatory', color: 'bg-draft-amber-border', textColor: 'text-draft-amber-text' },
                { n: '5', label: 'Approved', sub: 'Ready', color: 'bg-tertiary-fixed', textColor: 'text-aurora-emerald' },
                { n: '6', label: 'Published', sub: 'Syndicated', color: 'bg-surface-container-high', textColor: 'text-on-surface-variant' },
              ].map((step, i) => (
                <div key={step.n} className="flex items-center gap-1 flex-1">
                  <div className={`w-7 h-7 rounded-full ${step.color} text-pure-white flex items-center justify-center font-code-sm text-code-sm font-bold`}>{step.n}</div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm font-semibold uppercase">{step.label}</span>
                    <span className={`font-code-sm text-[10px] ${step.textColor} font-medium`}>{step.sub}</span>
                  </div>
                  {i < 5 && <ArrowRight className="w-4 h-4 text-outline-variant mx-1" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <section className="w-full px-4 lg:px-8 pb-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Config */}
          <aside className="lg:col-span-4 flex flex-col gap-4">
            {/* Step 1: Source */}
            <div className="bg-pure-white rounded-xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-surface-container-high font-code-sm text-code-sm font-semibold text-secondary">STEP 01</span>
                  <span className="font-title-md text-title-md text-polar-midnight-deep">Primary Evidence</span>
                </div>
              </div>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="w-full bg-surface-container-low rounded-lg p-3 font-label-md text-label-md text-on-surface focus:outline-none focus:ring-2 focus:ring-azure-accent"
              >
                <option value="">Select a verified resource...</option>
                {resources.map(r => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
              {selectedResource && (
                <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm font-bold text-polar-midnight-deep truncate">{selectedResource.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-code-sm text-code-sm text-on-surface-variant">{selectedResource.id}</span>
                    <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-code-sm text-[10px] font-semibold">VERIFIED</span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Audience */}
            <div className="bg-pure-white rounded-xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-surface-container-high font-code-sm text-code-sm font-semibold text-secondary">STEP 02</span>
                <span className="font-title-md text-title-md text-polar-midnight-deep">Target Audience</span>
              </div>
              <div className="flex flex-col gap-1">
                {AUDIENCES.map(a => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAudience(a.id)}
                    className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${
                      audience === a.id
                        ? 'bg-surface-container text-polar-midnight-deep font-semibold'
                        : 'bg-ice-white hover:bg-surface-container-low text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <a.icon className={`w-4 h-4 ${audience === a.id ? 'text-secondary' : 'text-on-surface-variant'}`} />
                      <span className="font-label-md text-label-md">{a.label}</span>
                    </div>
                    {audience === a.id ? (
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-surface-container"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Format */}
            <div className="bg-pure-white rounded-xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-surface-container-high font-code-sm text-code-sm font-semibold text-secondary">STEP 03</span>
                <span className="font-title-md text-title-md text-polar-midnight-deep">Deliverable Format</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {FORMATS.map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormat(f)}
                    className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                      format === f
                        ? 'bg-polar-midnight-deep text-pure-white'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !sourceId}
              className="w-full bg-secondary hover:bg-on-secondary-container text-on-secondary font-title-md text-title-md py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Edit3 className="w-5 h-5" />}
              {loading ? 'Synthesizing Draft...' : 'Generate Outreach Draft'}
            </button>
          </aside>

          {/* Right Column: Draft Output */}
          <div className="lg:col-span-8">
            {draft ? (
              <div className="bg-pure-white rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="bg-draft-amber-bg border-b border-draft-amber-border px-6 py-3 flex items-center justify-between">
                  <span className="font-bold text-draft-amber-text font-label-sm text-label-sm tracking-wide uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-draft-amber-border animate-pulse" />
                    DRAFT — human review required
                  </span>
                  <span className="font-code-sm text-code-sm text-draft-amber-text font-medium">{draft.id}</span>
                </div>
                
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary font-code-sm text-code-sm font-semibold">{draft.audience}</span>
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-code-sm text-code-sm">{draft.outputType}</span>
                  </div>
                  <textarea
                    className="w-full min-h-[300px] resize-none focus:outline-none font-body-md text-body-md text-on-surface leading-relaxed bg-transparent"
                    defaultValue={draft.content}
                  />
                </div>

                <div className="bg-surface-container-low p-4 border-t border-slate-border flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center font-code-sm text-code-sm font-semibold text-on-surface-variant bg-pure-white px-3 py-1.5 rounded-lg border border-slate-border shadow-sm gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-secondary" />
                    Source: {draft.sourceIds.join(', ')}
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 font-label-md text-label-md font-medium text-on-surface-variant bg-pure-white border border-slate-border-strong rounded-lg hover:bg-surface-container-low transition-colors">
                      Save Edits
                    </button>
                    <button className="px-4 py-2 font-label-md text-label-md font-medium text-on-secondary bg-aurora-emerald border border-aurora-emerald rounded-lg hover:bg-aurora-emerald/90 transition-colors flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Submit to Review
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="min-h-[500px] border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center text-center p-8">
                <Edit3 className="w-12 h-12 text-outline-variant mb-4" />
                <h3 className="font-headline-sm text-headline-sm font-semibold text-polar-midnight-deep mb-2">No active draft</h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                  Select a scientific source, target audience, and deliverable format to generate a governed outreach draft.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
