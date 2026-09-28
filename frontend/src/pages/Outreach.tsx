import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Edit3, Loader2, ArrowRight, Beaker, School, Globe2, Newspaper, Scale, CheckCircle2, AlertCircle, ArrowUpRight, Copy, Share2, Download, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import type { Resource, OutreachDraft } from '../types';

const AUDIENCES = [
  { id: 'Researcher', label: 'Researcher', icon: Beaker, desc: 'Technical & precise' },
  { id: 'Student / Educator', label: 'Student / Educator', icon: School, desc: 'Explanatory' },
  { id: 'General Public', label: 'General Public', icon: Globe2, desc: 'Accessible' },
  { id: 'Media', label: 'Media', icon: Newspaper, desc: 'Headline-ready' },
  { id: 'Policy', label: 'Policy', icon: Scale, desc: 'Implication-oriented' },
];

const FORMATS = [
  'Scientific Summary', 'Website Article', 'Social Media Post',
  'Educational Explanation', 'Press Note', 'Short Video Script'
];

export default function Outreach() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialSourceId = searchParams.get('sourceId') || location.state?.sourceId || '';

  const [sourceId, setSourceId] = useState(initialSourceId);
  const [resource, setResource] = useState<Resource | null>(null);
  
  const [audience, setAudience] = useState('');
  const [format, setFormat] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<OutreachDraft | null>(null);
  
  const [reviewNotes, setReviewNotes] = useState('');
  const [approvalState, setApprovalState] = useState<'PENDING' | 'APPROVED' | 'REVISION_REQUESTED'>('PENDING');

  useEffect(() => {
    if (sourceId) {
      api.getResource(sourceId).then(res => {
        if (res) setResource(res);
      });
    } else {
      setResource(null);
    }
  }, [sourceId]);

  const handleGenerate = async () => {
    if (!sourceId || !audience || !format) return;
    setLoading(true);
    setDraft(null);
    setApprovalState('PENDING');
    setReviewNotes('');
    
    try {
      const newDraft = await api.generateOutreach({ sourceId, audience, format });
      setDraft(newDraft);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isReadyToGenerate = !!sourceId && !!audience && !!format;

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-surface">
      {/* Header */}
      <section className="w-full bg-surface-container-low py-6 px-4 lg:px-8 border-b border-slate-border/50">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep uppercase tracking-tight">Polar Outreach Studio</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
              Turn research-backed polar knowledge into clear communication for different audiences.
            </p>
          </div>

          {/* Workflow Indicator */}
          <div className="flex flex-wrap items-center gap-2 mt-2 font-label-sm text-[11px] font-bold uppercase tracking-wider text-outline">
            <span className={sourceId ? "text-polar-midnight-deep" : ""}>Source</span>
            <ArrowRight className="w-3 h-3" />
            <span className={audience ? "text-polar-midnight-deep" : ""}>Audience</span>
            <ArrowRight className="w-3 h-3" />
            <span className={format ? "text-polar-midnight-deep" : ""}>Format</span>
            <ArrowRight className="w-3 h-3" />
            <span className={draft ? "text-polar-midnight-deep" : ""}>Draft</span>
            <ArrowRight className="w-3 h-3" />
            <span className={approvalState !== 'PENDING' ? "text-polar-midnight-deep" : ""}>Review</span>
            <ArrowRight className="w-3 h-3" />
            <span className={approvalState === 'APPROVED' ? "text-polar-midnight-deep" : ""}>Approve</span>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <section className="w-full px-4 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Context & Config */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* SOURCE SELECTION */}
            <div className="bg-pure-white rounded-xl shadow-sm border border-slate-border/50 overflow-hidden flex flex-col">
              <div className="bg-surface-container-low px-5 py-4 border-b border-slate-border/50">
                <h2 className="font-label-md text-label-md font-bold text-polar-midnight-deep uppercase tracking-wider">Research Source</h2>
              </div>
              <div className="p-5 flex flex-col gap-4">
                {!sourceId ? (
                  <div className="flex flex-col gap-3 items-start">
                    <div className="flex items-center gap-2 text-draft-amber-text">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-label-md font-bold uppercase tracking-wider">Source Required</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Outreach drafts should be connected to repository evidence before generation.</p>
                    <Link to="/explore" className="inline-flex items-center gap-1.5 px-4 py-2 bg-polar-midnight-deep hover:bg-polar-navy-surface text-pure-white font-label-md text-label-md rounded-lg transition-colors">
                      Explore Repository <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-aurora-emerald">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-label-md font-bold uppercase tracking-wider">Current Research Source</span>
                    </div>
                    {resource ? (
                      <div className="flex flex-col gap-1 p-3 rounded-lg bg-surface-container-low border border-slate-border/50">
                        <span className="font-title-md text-title-md font-semibold text-polar-midnight-deep">{resource.title}</span>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="px-2 py-0.5 bg-pure-white border border-slate-border/50 rounded font-code-sm text-code-sm font-semibold">{resource.type}</span>
                          <span className="font-code-sm text-code-sm text-on-surface-variant">{resource.region}</span>
                          <span className="font-code-sm text-code-sm text-on-surface-variant">• {resource.year}</span>
                          <span className="font-code-sm text-[10px] text-outline uppercase ml-auto">{resource.id}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 text-sm text-outline flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Loading resource details...</div>
                    )}
                    <button onClick={() => {setSourceId(''); setDraft(null); navigate('/outreach');}} className="self-start text-secondary font-label-sm hover:underline">
                      Change Source
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* AUDIENCE SELECTION */}
            <div className={`bg-pure-white rounded-xl shadow-sm border border-slate-border/50 overflow-hidden flex flex-col transition-opacity ${!sourceId ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="bg-surface-container-low px-5 py-4 border-b border-slate-border/50">
                <h2 className="font-label-md text-label-md font-bold text-polar-midnight-deep uppercase tracking-wider">Audience</h2>
              </div>
              <div className="p-5 flex flex-col gap-2">
                {AUDIENCES.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAudience(a.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                      audience === a.id 
                        ? 'bg-polar-midnight-deep border-polar-midnight-deep text-pure-white' 
                        : 'bg-pure-white border-slate-border/50 text-on-surface hover:border-secondary/30 hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <a.icon className={`w-5 h-5 ${audience === a.id ? 'text-glacial-sky' : 'text-secondary'}`} />
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md font-semibold">{a.label}</span>
                        <span className={`font-code-sm text-code-sm ${audience === a.id ? 'text-pure-white/80' : 'text-on-surface-variant'}`}>{a.desc}</span>
                      </div>
                    </div>
                    {audience === a.id && <CheckCircle2 className="w-5 h-5 text-glacial-sky" />}
                  </button>
                ))}
              </div>
            </div>

            {/* FORMAT SELECTION */}
            <div className={`bg-pure-white rounded-xl shadow-sm border border-slate-border/50 overflow-hidden flex flex-col transition-opacity ${!audience ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="bg-surface-container-low px-5 py-4 border-b border-slate-border/50">
                <h2 className="font-label-md text-label-md font-bold text-polar-midnight-deep uppercase tracking-wider">Format</h2>
              </div>
              <div className="p-5 flex flex-wrap gap-2">
                {FORMATS.map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`px-3 py-2 rounded-lg font-label-md text-label-md border transition-all ${
                      format === f
                        ? 'bg-polar-midnight-deep border-polar-midnight-deep text-pure-white'
                        : 'bg-pure-white border-slate-border/50 text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!isReadyToGenerate || loading}
              className="w-full py-4 rounded-xl font-label-md text-label-md font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all bg-secondary text-on-secondary hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Preparing source-grounded draft...
                </>
              ) : (
                <>
                  <Edit3 className="w-5 h-5" />
                  Generate Draft
                </>
              )}
            </button>

          </div>

          {/* Right Column: Draft & Workflow */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {!draft && !loading ? (
              <div className="bg-pure-white rounded-xl shadow-sm border border-slate-border/50 flex flex-col items-center justify-center p-16 text-center min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
                  <Edit3 className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep mb-2">Create Research-Based Outreach</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                  Select a repository resource, audience, and format to begin generating an evidence-backed communication draft.
                </p>
              </div>
            ) : draft ? (
              <>
                {/* Generated Draft Workspace */}
                <div className="bg-pure-white rounded-xl shadow-sm border border-slate-border/50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-surface-container-low px-6 py-4 border-b border-slate-border/50 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="font-label-md text-label-md font-bold text-polar-midnight-deep uppercase tracking-wider">Outreach Draft</h2>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-pure-white border border-slate-border/50 font-code-sm text-code-sm font-semibold">{draft.audience}</span>
                      <span className="px-2 py-0.5 rounded bg-pure-white border border-slate-border/50 font-code-sm text-code-sm font-semibold text-secondary">{draft.outputType}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <textarea
                      value={draft.content}
                      onChange={(e) => setDraft({...draft, content: e.target.value})}
                      className="w-full min-h-[300px] resize-y focus:outline-none focus:ring-2 focus:ring-secondary/20 rounded-lg p-2 -m-2 font-body-md text-body-md text-on-surface leading-relaxed bg-transparent"
                    />
                  </div>
                  <div className="bg-surface-container-low px-6 py-3 border-t border-slate-border/50 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-draft-amber-text font-label-sm font-bold uppercase tracking-wider">
                      <AlertCircle className="w-4 h-4" />
                      Source-Grounded Draft
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Review the source evidence before approving content for publication.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Source Evidence Panel */}
                  <div className="bg-pure-white rounded-xl shadow-sm border border-slate-border/50 overflow-hidden flex flex-col">
                    <div className="bg-surface-container-low px-5 py-4 border-b border-slate-border/50">
                      <h3 className="font-label-md text-label-md font-bold text-polar-midnight-deep uppercase tracking-wider">Source Evidence</h3>
                      <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">Based on repository resources</p>
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                      {resource && (
                        <div className="p-4 rounded-lg border border-slate-border/50 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 bg-surface-container font-code-sm text-[10px] font-bold uppercase">{resource.type}</span>
                            <span className="font-code-sm text-[10px] text-outline uppercase">{resource.id}</span>
                          </div>
                          <h4 className="font-title-md text-title-md font-semibold text-polar-midnight-deep leading-tight">{resource.title}</h4>
                          <span className="font-code-sm text-code-sm text-on-surface-variant">{resource.region} • {resource.year}</span>
                          <div className="mt-2 pt-3 border-t border-slate-border/50">
                            <Link to={`/research/${resource.id}`} target="_blank" className="inline-flex items-center gap-1 text-secondary font-label-sm hover:underline">
                              View source <ArrowUpRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Human Review Panel */}
                  <div className="bg-pure-white rounded-xl shadow-sm border border-slate-border/50 overflow-hidden flex flex-col">
                    <div className="bg-surface-container-low px-5 py-4 border-b border-slate-border/50">
                      <h3 className="font-label-md text-label-md font-bold text-polar-midnight-deep uppercase tracking-wider">Human Review</h3>
                      <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">
                        {approvalState === 'PENDING' ? 'Pending Review' : approvalState === 'REVISION_REQUESTED' ? 'Revision Requested' : 'Reviewer Action Recorded'}
                      </p>
                    </div>
                    <div className="p-5 flex flex-col gap-4">
                      {approvalState === 'APPROVED' ? (
                        <div className="flex flex-col items-center justify-center text-center gap-3 py-4">
                          <CheckCircle2 className="w-12 h-12 text-aurora-emerald" />
                          <div className="flex flex-col gap-1">
                            <span className="font-label-md font-bold text-aurora-emerald uppercase tracking-wider">Approved for Publication</span>
                            <span className="font-body-sm text-on-surface-variant">Draft has been approved based on prototype demonstration data.</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <textarea
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                            placeholder="Add review notes..."
                            className="w-full min-h-[100px] resize-none bg-surface-container-low rounded-lg p-3 font-body-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
                          />
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => setApprovalState('REVISION_REQUESTED')}
                              className="flex-1 py-2 rounded-lg border border-slate-border font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors"
                            >
                              Request Revision
                            </button>
                            <button 
                              onClick={() => setApprovalState('APPROVED')}
                              className="flex-1 py-2 rounded-lg bg-polar-midnight-deep font-label-md text-label-md text-pure-white hover:bg-polar-navy-surface transition-colors"
                            >
                              Approve Draft
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dissemination Actions */}
                {approvalState === 'APPROVED' && (
                  <div className="bg-pure-white rounded-xl shadow-sm border border-aurora-emerald overflow-hidden flex flex-col animate-in fade-in duration-500">
                     <div className="bg-aurora-emerald/10 px-5 py-4 border-b border-aurora-emerald/20">
                      <h3 className="font-label-md text-label-md font-bold text-polar-midnight-deep uppercase tracking-wider">Ready for Dissemination</h3>
                      <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">Approved draft can now be prepared for the selected channel.</p>
                    </div>
                    <div className="p-5 flex flex-wrap gap-4">
                      <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container font-label-md text-label-md transition-colors border border-slate-border">
                        <Globe2 className="w-5 h-5 text-secondary" /> Prepare for Website
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container font-label-md text-label-md transition-colors border border-slate-border">
                        <Share2 className="w-5 h-5 text-secondary" /> Prepare Social Post
                      </button>
                      <div className="flex-1"></div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(draft.content);
                          alert('Draft copied to clipboard');
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-secondary hover:bg-surface-container-low font-label-md text-label-md transition-colors"
                      >
                        <Copy className="w-5 h-5" /> Copy Content
                      </button>
                      <button disabled className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-secondary hover:bg-surface-container-low font-label-md text-label-md transition-colors opacity-50">
                        <Download className="w-5 h-5" /> Export Draft (Demo)
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-pure-white rounded-xl shadow-sm border border-slate-border/50 flex flex-col items-center justify-center p-16 text-center min-h-[400px]">
                 <Loader2 className="w-8 h-8 text-secondary animate-spin" />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
