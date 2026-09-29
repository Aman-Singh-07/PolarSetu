import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle2, ArrowLeft, Loader2, X, AlertTriangle, FileText, Globe, Database, File, Info } from 'lucide-react';
import { auth } from '../services/auth';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function AdminUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [sourceUrl, setSourceUrl] = useState('');
  const [license, setLicense] = useState('');
  
  // File State
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Workflow State
  const [status, setStatus] = useState<'idle' | 'submitting_metadata' | 'uploading_file' | 'success' | 'metadata_error' | 'upload_error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [createdId, setCreatedId] = useState('');

  // Validation
  const isValid = title.trim() !== '' && type !== '' && description.trim() !== '' && file !== null;

  const formatSize = (b: number) => {
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    return (b / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isValid && !createdId) return; // If retrying upload, isValid metadata check isn't strict required for metadata resubmit since we skip it

    setErrorMessage('');

    let resourceId = createdId;

    // STEP 1: Metadata
    if (!resourceId) {
      setStatus('submitting_metadata');
      try {
        const res = await api.createResource({
          title: title.trim(),
          type,
          description: description.trim(),
          region: region || undefined,
          year: year ? parseInt(year, 10) : undefined,
          sourceUrl: sourceUrl.trim() || undefined,
          license: license.trim() || undefined,
        });
        resourceId = res.id;
        setCreatedId(res.id);
      } catch (err: any) {
        setStatus('metadata_error');
        setErrorMessage(err.status === 401 ? 'Session expired. Please sign in again.' : (err.message || 'Failed to create resource metadata.'));
        return;
      }
    }

    // STEP 2: File Upload
    if (file && resourceId) {
      setStatus('uploading_file');
      try {
        await api.uploadResourceFile(resourceId, file);
        setStatus('success');
      } catch (err: any) {
        setStatus('upload_error');
        setErrorMessage(err.message || 'File upload failed after creating the resource.');
      }
    } else {
      // If there's no file (even though validation requires it, just in case)
      setStatus('success');
    }
  };

  const resetForm = () => {
    setTitle(''); setType(''); setDescription(''); setRegion(''); 
    setYear(new Date().getFullYear().toString()); setSourceUrl(''); setLicense('');
    setFile(null);
    setCreatedId('');
    setStatus('idle');
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col w-full min-h-full pb-12">
        <section className="w-full px-4 lg:px-8 py-20 flex items-center justify-center flex-1">
          <div className="w-full max-w-[500px] bg-deep-blue rounded-[12px] p-10 border border-emerald/20 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-emerald/10 border border-emerald/20">
              <CheckCircle2 className="w-8 h-8 text-emerald" />
            </div>
            <h2 className="font-display text-xl font-bold text-white mb-2">Resource uploaded successfully.</h2>
            <p className="text-[14px] text-white/60 mb-8 font-medium">
              The resource has been added to the repository.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate(`/research/${createdId}`)} className="w-full justify-center">
                View Resource
              </Button>
              <Button variant="secondary" onClick={resetForm} className="w-full justify-center !border-white/20 !text-white hover:!bg-white/5">
                Upload Another
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-full pb-12 relative">
      
      {/* ─── HEADER ─── */}
      <section className="w-full px-4 lg:px-8 pt-10 pb-6 border-b border-white/5">
        <div className="max-w-[1000px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50">RESEARCH REPOSITORY</span>
            <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
              Upload Resource
            </h1>
            <p className="text-[14px] text-white/60 font-medium max-w-2xl">
              Add a research resource to the polar science repository.
            </p>
          </div>
          <Link to="/admin/resources" className="inline-flex items-center gap-2 text-[13px] font-bold text-white/50 hover:text-white transition-colors shrink-0 mb-1">
            <ArrowLeft className="w-4 h-4" /> Back to Resources
          </Link>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <section className="w-full px-4 lg:px-8 py-8 flex-1">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          
          <div className="flex flex-col gap-8">
            <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-8">
              
              {/* SECTION 1: RESOURCE INFORMATION */}
              <div className="bg-deep-blue rounded-[12px] border border-white/10 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2 bg-white/5">
                  <FileText className="w-4 h-4 text-white/60" />
                  <h2 className="text-[14px] font-bold text-white uppercase tracking-[0.05em]">Resource Information</h2>
                </div>
                <div className="p-6 flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="title" className="text-[12px] font-bold text-white/70">Title <span className="text-cyan-accent">*</span></label>
                    <Input
                      id="title"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g., Arctic Sea Ice Concentration 2026"
                      className="!bg-ocean-navy !border-white/10 !text-white placeholder:!text-white/30 focus:!border-cyan-accent/50 focus:!bg-ocean-navy h-[44px]"
                      disabled={status !== 'idle' && status !== 'metadata_error'}
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="type" className="text-[12px] font-bold text-white/70">Resource Type <span className="text-cyan-accent">*</span></label>
                    <select
                      id="type"
                      value={type}
                      onChange={e => setType(e.target.value)}
                      className="w-full h-[44px] px-4 bg-ocean-navy border border-white/10 rounded-[10px] text-[14px] text-white font-medium focus:outline-none focus:border-cyan-accent/50 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={status !== 'idle' && status !== 'metadata_error'}
                      required
                    >
                      <option value="" disabled className="text-white/30">Select Type</option>
                      <option value="REPORT">Report</option>
                      <option value="PUBLICATION">Publication</option>
                      <option value="DATASET">Dataset</option>
                      <option value="PHOTO">Photo</option>
                      <option value="VIDEO">Video</option>
                      <option value="ACTIVITY">Activity</option>
                      <option value="EXPEDITION">Expedition</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="description" className="text-[12px] font-bold text-white/70">Description <span className="text-cyan-accent">*</span></label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={4}
                      placeholder="Provide a comprehensive abstract or description..."
                      className="w-full px-4 py-3 bg-ocean-navy border border-white/10 rounded-[10px] text-[14px] text-white font-medium focus:outline-none focus:border-cyan-accent/50 resize-y placeholder:text-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={status !== 'idle' && status !== 'metadata_error'}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: RESOURCE CONTEXT */}
              <div className="bg-deep-blue rounded-[12px] border border-white/10 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2 bg-white/5">
                  <Database className="w-4 h-4 text-white/60" />
                  <h2 className="text-[14px] font-bold text-white uppercase tracking-[0.05em]">Resource Context</h2>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="region" className="text-[12px] font-bold text-white/70">Region (Optional)</label>
                    <select
                      id="region"
                      value={region}
                      onChange={e => setRegion(e.target.value)}
                      className="w-full h-[44px] px-4 bg-ocean-navy border border-white/10 rounded-[10px] text-[14px] text-white font-medium focus:outline-none focus:border-cyan-accent/50 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={status !== 'idle' && status !== 'metadata_error'}
                    >
                      <option value="">No Region Specified</option>
                      <option value="Antarctica">Antarctica</option>
                      <option value="Arctic">Arctic</option>
                      <option value="Himalayas">Himalayas</option>
                      <option value="Southern Ocean">Southern Ocean</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="year" className="text-[12px] font-bold text-white/70">Year (Optional)</label>
                    <Input
                      id="year"
                      type="number"
                      value={year}
                      onChange={e => setYear(e.target.value)}
                      className="!bg-ocean-navy !border-white/10 !text-white focus:!border-cyan-accent/50 h-[44px]"
                      disabled={status !== 'idle' && status !== 'metadata_error'}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: SOURCE */}
              <div className="bg-deep-blue rounded-[12px] border border-white/10 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2 bg-white/5">
                  <Globe className="w-4 h-4 text-white/60" />
                  <h2 className="text-[14px] font-bold text-white uppercase tracking-[0.05em]">Source</h2>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="sourceUrl" className="text-[12px] font-bold text-white/70">Source URL (Optional)</label>
                    <Input
                      id="sourceUrl"
                      type="url"
                      value={sourceUrl}
                      onChange={e => setSourceUrl(e.target.value)}
                      placeholder="https://..."
                      className="!bg-ocean-navy !border-white/10 !text-white placeholder:!text-white/30 focus:!border-cyan-accent/50 h-[44px]"
                      disabled={status !== 'idle' && status !== 'metadata_error'}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="license" className="text-[12px] font-bold text-white/70">License (Optional)</label>
                    <Input
                      id="license"
                      type="text"
                      value={license}
                      onChange={e => setLicense(e.target.value)}
                      placeholder="e.g., CC BY 4.0"
                      className="!bg-ocean-navy !border-white/10 !text-white placeholder:!text-white/30 focus:!border-cyan-accent/50 h-[44px]"
                      disabled={status !== 'idle' && status !== 'metadata_error'}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: RESOURCE FILE */}
              <div className="bg-deep-blue rounded-[12px] border border-white/10 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2 bg-white/5">
                  <File className="w-4 h-4 text-white/60" />
                  <h2 className="text-[14px] font-bold text-white uppercase tracking-[0.05em]">Resource File <span className="text-cyan-accent">*</span></h2>
                </div>
                <div className="p-6 flex flex-col gap-4">
                  
                  {!file ? (
                    <div
                      className={`border border-dashed rounded-[12px] p-8 text-center transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px] ${
                        isDragOver ? 'border-cyan-accent bg-white/5' : 'border-white/20 hover:border-white/40 bg-ocean-navy/50'
                      } ${status !== 'idle' && status !== 'metadata_error' && status !== 'upload_error' ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                    >
                      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-white/5 border border-white/10">
                        <UploadCloud className="w-6 h-6 text-white/70" />
                      </div>
                      <p className="text-[14px] font-bold text-white mb-1">Click to upload or drag and drop</p>
                      <p className="text-[12px] text-white/50 font-medium">Standard file formats supported</p>
                    </div>
                  ) : (
                    <div className="bg-ocean-navy rounded-[10px] p-4 border border-white/10 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-[8px] bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                          <FileText className="w-5 h-5 text-white/70" />
                        </div>
                        <div className="min-w-0 flex flex-col">
                          <p className="text-[13px] font-bold text-white truncate">{file.name}</p>
                          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/50 mt-0.5">{formatSize(file.size)}</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={handleClearFile} 
                        disabled={status === 'uploading_file' || status === 'submitting_metadata'}
                        className="p-2 hover:bg-error/10 hover:text-error rounded-md text-white/40 transition-colors disabled:opacity-50 disabled:pointer-events-none shrink-0 ml-4"
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ERRORS */}
              {(status === 'metadata_error' || status === 'upload_error') && errorMessage && (
                <div className="bg-error/10 border border-error/20 text-error p-4 rounded-[10px] text-[13px] font-bold flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> 
                  <div className="flex flex-col gap-1">
                    <span>{status === 'upload_error' ? 'Resource record created, but file upload failed.' : 'Failed to save metadata.'}</span>
                    <span className="font-medium text-error/80">{errorMessage}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button 
                  type="submit" 
                  disabled={!isValid || status === 'submitting_metadata' || status === 'uploading_file'} 
                  className="flex-1 justify-center py-6 h-auto text-[14px]"
                >
                  {status === 'submitting_metadata' ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving metadata...</>
                  ) : status === 'uploading_file' ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Uploading resource...</>
                  ) : status === 'upload_error' ? (
                    'Retry Upload'
                  ) : (
                    'Upload Resource'
                  )}
                </Button>
                
                {status !== 'upload_error' && (
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => navigate('/admin/resources')} 
                    className="flex-1 justify-center py-6 h-auto text-[14px] !border-white/20 !text-white hover:!bg-white/5"
                    disabled={status === 'submitting_metadata' || status === 'uploading_file'}
                  >
                    Cancel
                  </Button>
                )}
              </div>

            </form>
          </div>

          {/* RIGHT PANEL: GUIDELINES */}
          <div className="hidden lg:flex flex-col gap-6">
            <div className="bg-deep-blue rounded-[12px] border border-white/10 shadow-sm p-6 flex flex-col gap-4 sticky top-[100px]">
              <h3 className="text-[13px] font-bold text-white uppercase tracking-[0.05em] flex items-center gap-2">
                <Info className="w-4 h-4 text-white/50" />
                Submission Guidelines
              </h3>
              
              <div className="flex flex-col gap-4 text-[13px] text-white/70 font-medium leading-relaxed">
                <div className="flex flex-col gap-1">
                  <span className="text-white font-bold">Metadata Requirements</span>
                  <p>Title, type, and description are strictly required by the repository schema.</p>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex flex-col gap-1">
                  <span className="text-white font-bold">File Specifications</span>
                  <p>Provide the raw asset using standard data formats (e.g., PDF, CSV, ZIP). The upload occurs securely via the multipart API.</p>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex flex-col gap-1">
                  <span className="text-white font-bold">Workflow</span>
                  <p>The system first registers the metadata record and receives a unique identifier before securely transferring the binary file payload.</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}
