import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle2, ArrowLeft, Loader2, X, AlertTriangle, FileText, Type } from 'lucide-react';
import { auth } from '../services/auth';
import { api } from '../services/api';

export default function AdminUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!auth.isAuthenticated()) navigate('/login'); }, [navigate]);

  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [metadata, setMetadata] = useState({
    title: '', resourceType: '', domain: '', description: '', authors: '',
    year: new Date().getFullYear().toString(), keywords: '', expedition: ''
  });
  const [status, setStatus] = useState<'idle' | 'preparing' | 'uploading' | 'success' | 'error' | 'upload_error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [createdResourceId, setCreatedResourceId] = useState('');

  const isValid = file && metadata.title && metadata.resourceType && metadata.domain && metadata.description;

  const formatSize = (b: number) => b < 1024 ? b + ' B' : b < 1024 * 1024 ? (b / 1024).toFixed(1) + ' KB' : (b / (1024 * 1024)).toFixed(1) + ' MB';

  const handleFileSelect = (f: File) => setFile(f);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]); };
  const handleClearFile = () => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setStatus('preparing'); setErrorMessage('');
    const typeMap: Record<string, string> = { 'Research Paper': 'PUBLICATION', 'Dataset': 'DATASET', 'Technical Report': 'REPORT', 'Expedition Resource': 'EXPEDITION', 'Media': 'OTHER' };
    const backendType = typeMap[metadata.resourceType] || 'OTHER';
    let newId = createdResourceId;
    if (!newId) {
      try {
        const res = await api.createResource({ title: metadata.title, type: backendType, description: metadata.description, region: metadata.domain, year: parseInt(metadata.year, 10) || new Date().getFullYear() });
        newId = res.id; setCreatedResourceId(res.id);
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.status === 401 ? 'Session expired. Please sign in again.' : 'Unable to create resource.');
        return;
      }
    }
    if (file && newId) {
      setStatus('uploading');
      try { await api.uploadResourceFile(newId, file); setStatus('success'); }
      catch (err: any) { setStatus('upload_error'); setErrorMessage(err.message || 'File upload failed.'); }
    } else { setStatus('success'); }
  };

  const handleReset = () => {
    setFile(null); setMetadata({ title: '', resourceType: '', domain: '', description: '', authors: '', year: new Date().getFullYear().toString(), keywords: '', expedition: '' });
    setStatus('idle'); setErrorMessage(''); setCreatedResourceId('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (status === 'success' || status === 'upload_error') {
    return (
      <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-snow relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-snow to-frost opacity-80" />
        </div>
        <section className="w-full px-4 lg:px-8 py-20 relative z-10 flex items-center justify-center flex-1">
          <div className="w-full max-w-[540px] bg-white rounded-[24px] p-10 border border-white shadow-[0_20px_50px_rgba(7,20,38,0.06)] text-center animate-fade-up relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-[3px] ${status === 'success' ? 'bg-[#10B981]' : 'bg-amber-warn'}`} />
            
            <div className={`w-20 h-20 rounded-[20px] flex items-center justify-center mx-auto mb-8 shadow-sm ${status === 'success' ? 'bg-[#10B981]/10 border border-[#10B981]/20' : 'bg-amber-bg border border-amber-warn/20'}`}>
              {status === 'success' ? <CheckCircle2 className="w-10 h-10 text-[#10B981]" /> : <AlertTriangle className="w-10 h-10 text-amber-warn" />}
            </div>
            
            <h2 className="font-display text-2xl font-extrabold text-deep-ocean mb-3">{status === 'success' ? 'Resource Created Successfully' : 'Upload Incomplete'}</h2>
            <p className="text-[15px] text-muted mb-8 font-medium">
              {status === 'success' ? 'The scientific data has been successfully ingested into the global repository.' : 'Metadata was saved, but the file upload encountered an error.'}
            </p>
            
            {status === 'upload_error' && errorMessage && (
              <div className="bg-error/5 border border-error/20 text-error p-4 rounded-[16px] text-[13px] mb-8 text-left font-bold shadow-sm">
                {errorMessage}
              </div>
            )}
            
            <div className="bg-frost p-6 rounded-[20px] text-left text-[14px] text-deep-ocean mb-10 flex flex-col gap-4 border border-border-ice shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
              <div className="flex items-start gap-4">
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted w-16 mt-1">Title</span>
                <span className="font-bold text-deep-ocean flex-1 leading-snug">{metadata.title}</span>
              </div>
              <div className="h-px bg-border-ice/60" />
              <div className="flex items-start gap-4">
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted w-16 mt-1">Type</span>
                <span className="font-semibold">{metadata.resourceType}</span>
              </div>
              <div className="h-px bg-border-ice/60" />
              <div className="flex items-start gap-4">
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-muted w-16 mt-1">Status</span>
                <span className={`font-bold px-3 py-1 rounded-[8px] text-[12px] uppercase tracking-[0.1em] ${status === 'success' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-error/10 text-error'}`}>{status === 'success' ? 'Fully Synced' : 'File Pending'}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleReset} className="px-6 py-3.5 bg-deep-ocean text-white font-bold text-[14px] rounded-[14px] hover:bg-cyan-accent hover:text-deep-ocean transition-all shadow-[0_8px_20px_rgba(7,20,38,0.1)] hover:-translate-y-0.5">
                Upload New Data
              </button>
              <Link to="/admin" className="px-6 py-3.5 bg-white text-deep-ocean font-bold text-[14px] rounded-[14px] hover:bg-frost transition-all border border-border-ice shadow-sm flex items-center justify-center">
                Return to Dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-snow relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-snow to-frost opacity-80" />
      </div>

      <div className="relative z-10 w-full flex flex-col flex-1">
        {/* ─── HEADER ─── */}
        <section className="w-full border-b border-border-ice pt-10 pb-8 px-4 lg:px-8 bg-white/60 backdrop-blur-md">
          <div className="max-w-[1100px] mx-auto flex items-end justify-between">
            <div className="flex flex-col gap-2">
              <Link to="/admin" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-accent uppercase tracking-[0.2em] hover:text-deep-ocean transition-colors w-fit mb-3 bg-white px-3 py-1.5 rounded-lg border border-border-ice shadow-sm">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </Link>
              <h1 className="font-display text-4xl font-extrabold text-deep-ocean tracking-tight">Upload Resource</h1>
              <p className="text-[15px] text-muted font-medium">Inject raw scientific data into the main repository.</p>
            </div>
          </div>
        </section>

        {/* ─── FORM ─── */}
        <section className="w-full px-4 lg:px-8 py-12 flex-1">
          <form onSubmit={handleSubmit} className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 xl:gap-12">
            
            {/* Left: File Uploader */}
            <div className="flex flex-col gap-6">
              <div
                className={`border-[2px] border-dashed rounded-[24px] p-10 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[340px] group ${isDragOver ? 'border-cyan-accent bg-cyan-accent/5 shadow-[0_0_40px_rgba(56,189,248,0.15)] scale-[1.02]' : 'border-border-ice hover:border-cyan-accent/40 bg-white shadow-[0_8px_30px_rgba(7,20,38,0.02)]'}`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
              >
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
                <div className={`w-20 h-20 rounded-[20px] flex items-center justify-center mb-6 transition-colors shadow-sm ${isDragOver ? 'bg-cyan-accent text-white shadow-[0_8px_20px_rgba(56,189,248,0.3)]' : 'bg-frost border border-border-ice group-hover:bg-cyan-accent/10 group-hover:border-cyan-accent/20'}`}>
                  <UploadCloud className={`w-8 h-8 transition-colors ${isDragOver ? 'text-white' : 'text-cyan-accent'}`} />
                </div>
                <p className="text-[18px] font-extrabold text-deep-ocean mb-2">Drag & Drop Payload</p>
                <p className="text-[14px] text-muted font-medium">or click to browse local files</p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {['PDF', 'CSV', 'JSON', 'ZIP'].map(t => (
                    <span key={t} className="px-3 py-1.5 rounded-[8px] bg-frost border border-border-ice text-[10px] text-muted font-bold uppercase tracking-wider">{t}</span>
                  ))}
                </div>
              </div>

              {file && (
                <div className="bg-white rounded-[20px] p-5 border border-cyan-accent/40 flex items-center justify-between shadow-[0_8px_30px_rgba(56,189,248,0.1)] animate-fade-up">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[12px] bg-cyan-accent/10 flex items-center justify-center border border-cyan-accent/20">
                      <FileText className="w-6 h-6 text-cyan-accent" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-deep-ocean max-w-[200px] truncate">{file.name}</p>
                      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted mt-1">{formatSize(file.size)}</p>
                    </div>
                  </div>
                  <button type="button" onClick={handleClearFile} className="p-2.5 hover:bg-error/10 hover:text-error rounded-[10px] text-muted transition-colors"><X className="w-5 h-5" /></button>
                </div>
              )}
            </div>

            {/* Right: Metadata */}
            <div className="flex flex-col gap-6 bg-white rounded-[32px] p-10 border border-white shadow-[0_20px_50px_rgba(7,20,38,0.06)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-cyan-accent/5 rounded-full blur-[80px] pointer-events-none" />
              
              <h3 className="text-[16px] font-extrabold text-deep-ocean flex items-center gap-2 mb-2 pb-5 border-b border-border-ice">
                <Type className="w-5 h-5 text-cyan-accent" /> Metadata Definition
              </h3>
              
              <div className="flex flex-col gap-2 relative z-10">
                <label htmlFor="meta-title" className="text-[11px] text-muted uppercase tracking-[0.2em] font-bold ml-1">Title *</label>
                <input id="meta-title" value={metadata.title} onChange={e => setMetadata({ ...metadata, title: e.target.value })} className="w-full px-5 py-4 bg-snow border border-border-ice rounded-[16px] text-[15px] text-ink focus:outline-none focus:border-cyan-accent/50 focus:bg-white focus:ring-4 focus:ring-cyan-accent/10 transition-all font-semibold placeholder:text-muted/40 placeholder:font-medium shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" placeholder="E.g., Antarctic Ice Core Sample Data" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
                <div className="flex flex-col gap-2">
                  <label htmlFor="meta-type" className="text-[11px] text-muted uppercase tracking-[0.2em] font-bold ml-1">Classification *</label>
                  <select id="meta-type" value={metadata.resourceType} onChange={e => setMetadata({ ...metadata, resourceType: e.target.value })} className="w-full px-5 py-4 bg-snow border border-border-ice rounded-[16px] text-[15px] text-ink focus:outline-none focus:border-cyan-accent/50 focus:bg-white focus:ring-4 focus:ring-cyan-accent/10 transition-all font-semibold appearance-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] cursor-pointer">
                    <option value="" disabled className="text-muted/50">Select Classification</option>
                    <option>Research Paper</option><option>Dataset</option><option>Technical Report</option><option>Expedition Resource</option><option>Media</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="meta-region" className="text-[11px] text-muted uppercase tracking-[0.2em] font-bold ml-1">Target Region *</label>
                  <select id="meta-region" value={metadata.domain} onChange={e => setMetadata({ ...metadata, domain: e.target.value })} className="w-full px-5 py-4 bg-snow border border-border-ice rounded-[16px] text-[15px] text-ink focus:outline-none focus:border-cyan-accent/50 focus:bg-white focus:ring-4 focus:ring-cyan-accent/10 transition-all font-semibold appearance-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] cursor-pointer">
                    <option value="" disabled className="text-muted/50">Select Region</option>
                    <option>Antarctica</option><option>Arctic</option><option>Himalayas</option><option>Southern Ocean</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 relative z-10">
                <label htmlFor="meta-desc" className="text-[11px] text-muted uppercase tracking-[0.2em] font-bold ml-1">Detailed Synopsis *</label>
                <textarea id="meta-desc" value={metadata.description} onChange={e => setMetadata({ ...metadata, description: e.target.value })} rows={5} className="w-full px-5 py-4 bg-snow border border-border-ice rounded-[16px] text-[15px] text-ink focus:outline-none focus:border-cyan-accent/50 focus:bg-white focus:ring-4 focus:ring-cyan-accent/10 transition-all font-semibold shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] resize-none placeholder:text-muted/40 placeholder:font-medium" placeholder="Provide a comprehensive abstract or description..." />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
                <div className="flex flex-col gap-2">
                  <label htmlFor="meta-year" className="text-[11px] text-muted uppercase tracking-[0.2em] font-bold ml-1">Collection Year</label>
                  <input id="meta-year" type="number" value={metadata.year} onChange={e => setMetadata({ ...metadata, year: e.target.value })} className="w-full px-5 py-4 bg-snow border border-border-ice rounded-[16px] text-[15px] text-ink focus:outline-none focus:border-cyan-accent/50 focus:bg-white focus:ring-4 focus:ring-cyan-accent/10 transition-all font-semibold shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="meta-authors" className="text-[11px] text-muted uppercase tracking-[0.2em] font-bold ml-1">Primary Authors</label>
                  <input id="meta-authors" value={metadata.authors} onChange={e => setMetadata({ ...metadata, authors: e.target.value })} className="w-full px-5 py-4 bg-snow border border-border-ice rounded-[16px] text-[15px] text-ink focus:outline-none focus:border-cyan-accent/50 focus:bg-white focus:ring-4 focus:ring-cyan-accent/10 transition-all font-semibold placeholder:text-muted/40 placeholder:font-medium shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" placeholder="E.g., Dr. Sharma, Dr. Rao" />
                </div>
              </div>

              {(status === 'error') && errorMessage && (
                <div className="bg-error/5 border border-error/20 text-error p-4 rounded-[14px] text-[13px] font-bold flex items-center gap-2 animate-fade-in shadow-sm relative z-10 mt-2">
                  <AlertTriangle className="w-5 h-5 shrink-0" /> {errorMessage}
                </div>
              )}

              <button 
                type="submit" 
                disabled={!isValid || status === 'preparing' || status === 'uploading'} 
                className="w-full py-4 bg-deep-ocean hover:bg-cyan-accent disabled:opacity-40 disabled:hover:bg-deep-ocean text-white hover:text-deep-ocean font-extrabold text-[15px] rounded-[16px] transition-all duration-300 shadow-[0_8px_20px_rgba(7,20,38,0.15)] hover:shadow-[0_12px_25px_rgba(56,189,248,0.3)] flex items-center justify-center gap-2 mt-6 hover:-translate-y-1 active:translate-y-0 disabled:transform-none cursor-pointer disabled:cursor-not-allowed relative z-10 group/btn"
              >
                {status === 'preparing' || status === 'uploading' ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> {status === 'preparing' ? 'Initializing Ingestion...' : 'Uploading Payload...'}</>
                ) : (
                  'Ingest Resource to Repository'
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
