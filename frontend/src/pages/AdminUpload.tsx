import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UploadCloud, CheckCircle2, ArrowLeft, Shield, FileText, Database, 
  FileUp, AlertCircle, Loader2, X, AlertTriangle, ArrowRight
} from 'lucide-react';

export default function AdminUpload() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const [file, setFile] = useState<{name: string, size: string, type: string} | null>(null);
  
  const [metadata, setMetadata] = useState({
    title: '',
    resourceType: '',
    domain: '',
    description: '',
    authors: '',
    year: new Date().getFullYear().toString(),
    keywords: '',
    expedition: ''
  });

  const [status, setStatus] = useState<'idle' | 'preparing' | 'success'>('idle');

  const isValid = file && metadata.title && metadata.resourceType && metadata.domain && metadata.description;

  const handleSimulateFileDrop = () => {
    if (!file) {
      setFile({
        name: 'atmospheric_data_q3.csv',
        size: '14.2 MB',
        type: 'CSV Dataset'
      });
    }
  };

  const handleClearFile = () => {
    setFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    setStatus('preparing');
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  const handleReset = () => {
    setFile(null);
    setMetadata({
      title: '',
      resourceType: '',
      domain: '',
      description: '',
      authors: '',
      year: new Date().getFullYear().toString(),
      keywords: '',
      expedition: ''
    });
    setStatus('idle');
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col w-full min-h-[calc(100vh-80px)] pt-20 bg-surface">
        <section className="w-full bg-surface-container-low py-6 px-4 lg:px-8 border-b border-slate-border/50">
           <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 text-secondary mb-2">
                 <Shield className="w-4 h-4" />
                 <span className="font-label-sm text-[10px] font-bold uppercase tracking-wider">Administration Workspace</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep uppercase tracking-tight">Content Management</h1>
           </div>
        </section>
        <section className="w-full px-4 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto bg-pure-white rounded-xl p-8 border border-slate-border/50 shadow-sm text-center animate-in fade-in duration-500">
            <CheckCircle2 className="w-16 h-16 text-aurora-emerald mx-auto mb-6" />
            <h2 className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep mb-2 uppercase tracking-wide">Resource Prepared</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-md mx-auto">
              The resource package is ready for backend ingestion. Storage, checksum calculation, and indexing will occur in the backend pipeline.
            </p>
            
            <div className="bg-surface-container-low rounded-lg p-5 flex flex-col gap-3 text-left mb-8 border border-slate-border/50 mx-auto max-w-lg">
               <div className="flex items-start justify-between border-b border-slate-border/50 pb-3">
                 <div className="flex flex-col gap-1">
                    <span className="font-label-sm text-[10px] text-outline uppercase font-bold tracking-wider">Resource Title</span>
                    <span className="font-title-md font-semibold text-polar-midnight-deep">{metadata.title}</span>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-sm text-[10px] text-outline uppercase font-bold tracking-wider">Type</span>
                    <span className="font-body-sm font-medium text-on-surface">{metadata.resourceType}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-sm text-[10px] text-outline uppercase font-bold tracking-wider">Domain</span>
                    <span className="font-body-sm font-medium text-on-surface">{metadata.domain}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-sm text-[10px] text-outline uppercase font-bold tracking-wider">File</span>
                    <span className="font-body-sm font-medium text-on-surface truncate">{file?.name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-sm text-[10px] text-outline uppercase font-bold tracking-wider">Status</span>
                    <span className="font-body-sm font-bold text-aurora-emerald">Ready for Backend</span>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-lg border border-slate-border bg-pure-white text-polar-midnight-deep font-label-md text-label-md hover:bg-surface-container-low transition-colors"
              >
                Upload Another
              </button>
              <Link
                to="/explore"
                className="px-6 py-3 rounded-lg bg-polar-midnight-deep text-pure-white font-label-md text-label-md hover:bg-polar-navy-surface transition-colors"
              >
                View Repository
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] pt-20 bg-surface">
      {/* Header */}
      <section className="w-full bg-surface-container-low py-6 px-4 lg:px-8 border-b border-slate-border/50">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex flex-col gap-1">
             <Link to="/admin" className="inline-flex items-center gap-1.5 text-secondary font-label-sm text-label-sm hover:underline mb-2 self-start">
               <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
             </Link>
             <div className="flex items-center gap-2 text-secondary mb-1">
                <Shield className="w-4 h-4" />
                <span className="font-label-sm text-[10px] font-bold uppercase tracking-wider">Administration Workspace</span>
             </div>
             <h1 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep uppercase tracking-tight">Content Management</h1>
             <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
               Add, validate, and prepare research resources for the POLARSETU repository.
             </p>
          </div>

          {/* Workflow Indicator */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 font-label-sm text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-outline">
            <span className="text-polar-midnight-deep">Upload</span>
            <ArrowRight className="w-3 h-3" />
            <span className={file ? "text-polar-midnight-deep" : ""}>Metadata</span>
            <ArrowRight className="w-3 h-3" />
            <span className={isValid ? "text-polar-midnight-deep" : ""}>Validate</span>
            <ArrowRight className="w-3 h-3" />
            <span>Checksum</span>
            <ArrowRight className="w-3 h-3" />
            <span>Store</span>
            <ArrowRight className="w-3 h-3" />
            <span>Index</span>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <section className="w-full px-4 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Upload & Metadata) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Upload Zone */}
            <div className="bg-pure-white rounded-xl shadow-sm border border-slate-border/50 overflow-hidden flex flex-col">
               <div className="bg-surface-container-low px-5 py-4 border-b border-slate-border/50 flex items-center justify-between">
                 <h2 className="font-label-md text-label-md font-bold text-polar-midnight-deep uppercase tracking-wider flex items-center gap-2">
                   <FileUp className="w-5 h-5 text-secondary" /> Resource File
                 </h2>
                 {!file && <span className="font-code-sm text-[10px] uppercase tracking-wider text-draft-amber-text bg-draft-amber-bg border border-draft-amber-border/50 px-2 py-0.5 rounded">Required</span>}
               </div>
               
               <div className="p-6">
                 {!file ? (
                   <button 
                     type="button"
                     onClick={handleSimulateFileDrop}
                     className="w-full border-2 border-dashed border-slate-border rounded-xl p-10 flex flex-col items-center justify-center text-center bg-surface-container-low hover:bg-surface-container hover:border-secondary/50 transition-colors group"
                   >
                     <div className="w-12 h-12 bg-pure-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                        <UploadCloud className="w-6 h-6 text-secondary" />
                     </div>
                     <span className="font-title-md font-semibold text-polar-midnight-deep mb-1">Click or drag file to upload</span>
                     <span className="font-body-sm text-on-surface-variant">Supported prototype formats: PDF, CSV, JSON, Parquet, Images</span>
                   </button>
                 ) : (
                   <div className="flex items-center justify-between p-4 bg-surface-container-low border border-slate-border/50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-pure-white rounded-lg flex items-center justify-center shadow-sm border border-slate-border/50">
                           <FileText className="w-6 h-6 text-secondary" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                           <span className="font-label-md font-bold text-polar-midnight-deep truncate max-w-[200px] sm:max-w-md">{file.name}</span>
                           <div className="flex items-center gap-2 font-code-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                              <span>{file.type}</span> • <span>{file.size}</span>
                           </div>
                        </div>
                      </div>
                      <button 
                        onClick={handleClearFile} 
                        className="p-2 hover:bg-surface-container rounded-lg text-outline hover:text-draft-amber-text transition-colors"
                        aria-label="Remove file"
                      >
                        <X className="w-5 h-5" />
                      </button>
                   </div>
                 )}
               </div>
            </div>

            {/* Metadata Form */}
            <div className={`bg-pure-white rounded-xl shadow-sm border border-slate-border/50 overflow-hidden flex flex-col transition-opacity duration-300 ${!file ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
               <div className="bg-surface-container-low px-5 py-4 border-b border-slate-border/50 flex items-center justify-between">
                 <h2 className="font-label-md text-label-md font-bold text-polar-midnight-deep uppercase tracking-wider flex items-center gap-2">
                   <Database className="w-5 h-5 text-secondary" /> Resource Metadata
                 </h2>
                 {file && !isValid && (
                   <div className="flex items-center gap-1.5 text-draft-amber-text bg-draft-amber-bg border border-draft-amber-border/50 px-2 py-0.5 rounded">
                     <AlertCircle className="w-3.5 h-3.5" />
                     <span className="font-code-sm text-[10px] uppercase tracking-wider font-bold">Incomplete</span>
                   </div>
                 )}
               </div>

               <div className="p-6 flex flex-col gap-6">
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Required Column */}
                    <div className="flex flex-col gap-5">
                       <div className="flex flex-col gap-1.5">
                          <label className="font-label-sm text-[11px] font-bold text-polar-midnight-deep uppercase tracking-wider flex items-center gap-1">
                            Title <span className="text-draft-amber-text">*</span>
                          </label>
                          <input 
                            type="text"
                            required
                            value={metadata.title}
                            onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                            placeholder="Descriptive title..."
                            className="w-full bg-surface-container-low border border-slate-border rounded-lg p-2.5 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-shadow"
                          />
                       </div>

                       <div className="flex flex-col gap-1.5">
                          <label className="font-label-sm text-[11px] font-bold text-polar-midnight-deep uppercase tracking-wider flex items-center gap-1">
                            Resource Type <span className="text-draft-amber-text">*</span>
                          </label>
                          <select 
                            required
                            value={metadata.resourceType}
                            onChange={(e) => setMetadata({...metadata, resourceType: e.target.value})}
                            className="w-full bg-surface-container-low border border-slate-border rounded-lg p-2.5 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-shadow"
                          >
                             <option value="" disabled>Select primary type...</option>
                             <option value="Research Paper">Research Paper</option>
                             <option value="Dataset">Dataset</option>
                             <option value="Technical Report">Technical Report</option>
                             <option value="Expedition Resource">Expedition Resource</option>
                             <option value="Media">Media</option>
                          </select>
                       </div>

                       <div className="flex flex-col gap-1.5">
                          <label className="font-label-sm text-[11px] font-bold text-polar-midnight-deep uppercase tracking-wider flex items-center gap-1">
                            Domain <span className="text-draft-amber-text">*</span>
                          </label>
                          <select 
                            required
                            value={metadata.domain}
                            onChange={(e) => setMetadata({...metadata, domain: e.target.value})}
                            className="w-full bg-surface-container-low border border-slate-border rounded-lg p-2.5 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-shadow"
                          >
                             <option value="" disabled>Select regional domain...</option>
                             <option value="Antarctica">Antarctica</option>
                             <option value="Arctic">Arctic</option>
                             <option value="Himalaya">Himalaya</option>
                             <option value="Southern Ocean">Southern Ocean</option>
                          </select>
                       </div>
                    </div>

                    {/* Optional Column */}
                    <div className="flex flex-col gap-5">
                       <div className="flex flex-col gap-1.5">
                          <label className="font-label-sm text-[11px] font-bold text-polar-midnight-deep uppercase tracking-wider">
                            Authors / Contributors
                          </label>
                          <input 
                            type="text"
                            value={metadata.authors}
                            onChange={(e) => setMetadata({...metadata, authors: e.target.value})}
                            placeholder="e.g. Dr. A. Sharma, NCPOR"
                            className="w-full bg-surface-container-low border border-slate-border rounded-lg p-2.5 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-shadow"
                          />
                       </div>

                       <div className="flex flex-col gap-1.5">
                          <label className="font-label-sm text-[11px] font-bold text-polar-midnight-deep uppercase tracking-wider">
                            Associated Expedition
                          </label>
                          <select 
                            value={metadata.expedition}
                            onChange={(e) => setMetadata({...metadata, expedition: e.target.value})}
                            className="w-full bg-surface-container-low border border-slate-border rounded-lg p-2.5 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-shadow"
                          >
                             <option value="">Unassociated</option>
                             <option value="EXP-43">43rd Indian Antarctic Expedition</option>
                             <option value="EXP-ARC-16">16th Indian Arctic Expedition</option>
                             <option value="EXP-SO-2024">Southern Ocean Cruise 2024</option>
                          </select>
                       </div>

                       <div className="flex flex-col gap-1.5">
                          <label className="font-label-sm text-[11px] font-bold text-polar-midnight-deep uppercase tracking-wider">
                            Keywords (Comma separated)
                          </label>
                          <input 
                            type="text"
                            value={metadata.keywords}
                            onChange={(e) => setMetadata({...metadata, keywords: e.target.value})}
                            placeholder="climate, sea ice, ozone..."
                            className="w-full bg-surface-container-low border border-slate-border rounded-lg p-2.5 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-shadow"
                          />
                       </div>
                    </div>
                 </div>

                 {/* Full width */}
                 <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-[11px] font-bold text-polar-midnight-deep uppercase tracking-wider flex items-center gap-1">
                      Description <span className="text-draft-amber-text">*</span>
                    </label>
                    <textarea 
                      required
                      value={metadata.description}
                      onChange={(e) => setMetadata({...metadata, description: e.target.value})}
                      placeholder="Scientific abstract or general description..."
                      className="w-full min-h-[100px] resize-none bg-surface-container-low border border-slate-border rounded-lg p-3 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-shadow"
                    />
                 </div>
               </div>
            </div>
          </div>

          {/* Right Column (Validation & Submit) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
             
             {/* Validation Summary */}
             <div className="bg-pure-white rounded-xl shadow-sm border border-slate-border/50 overflow-hidden flex flex-col sticky top-28">
               <div className="bg-surface-container-low px-5 py-4 border-b border-slate-border/50 flex items-center justify-between">
                 <h3 className="font-label-md text-label-md font-bold text-polar-midnight-deep uppercase tracking-wider">Ingestion Pipeline</h3>
                 <span className="font-code-sm text-[10px] uppercase tracking-wider text-outline">Pre-Flight</span>
               </div>
               
               <div className="p-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-2.5">
                     <div className="flex items-center gap-3">
                        {file ? <CheckCircle2 className="w-4 h-4 text-aurora-emerald" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-border" />}
                        <span className={`font-body-sm text-sm ${file ? 'text-polar-midnight-deep font-semibold' : 'text-on-surface-variant'}`}>File selected</span>
                     </div>
                     <div className="flex items-center gap-3">
                        {metadata.title ? <CheckCircle2 className="w-4 h-4 text-aurora-emerald" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-border" />}
                        <span className={`font-body-sm text-sm ${metadata.title ? 'text-polar-midnight-deep font-semibold' : 'text-on-surface-variant'}`}>Title provided</span>
                     </div>
                     <div className="flex items-center gap-3">
                        {metadata.resourceType && metadata.domain ? <CheckCircle2 className="w-4 h-4 text-aurora-emerald" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-border" />}
                        <span className={`font-body-sm text-sm ${metadata.resourceType && metadata.domain ? 'text-polar-midnight-deep font-semibold' : 'text-on-surface-variant'}`}>Categorization complete</span>
                     </div>
                     <div className="flex items-center gap-3">
                        {metadata.description ? <CheckCircle2 className="w-4 h-4 text-aurora-emerald" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-border" />}
                        <span className={`font-body-sm text-sm ${metadata.description ? 'text-polar-midnight-deep font-semibold' : 'text-on-surface-variant'}`}>Description provided</span>
                     </div>
                  </div>
                  
                  <div className="h-px bg-slate-border/50 my-1 w-full" />
                  
                  <div className="flex flex-col gap-3">
                     <div className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-border/50 shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                           <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-outline">SHA-256 Integrity</span>
                           <span className="font-body-sm text-xs text-on-surface-variant">Pending backend processing</span>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-border/50 shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                           <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-outline">Supabase Storage</span>
                           <span className="font-body-sm text-xs text-on-surface-variant">Pending backend integration</span>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-border/50 shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                           <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-outline">Repository Indexing</span>
                           <span className="font-body-sm text-xs text-on-surface-variant">Pending backend integration</span>
                        </div>
                     </div>
                  </div>

                  {!isValid && file && (
                    <div className="mt-2 p-3 bg-draft-amber-bg/50 border border-draft-amber-border/50 rounded-lg flex gap-2">
                       <AlertTriangle className="w-4 h-4 text-draft-amber-text shrink-0 mt-0.5" />
                       <div className="flex flex-col">
                          <span className="font-label-sm text-[11px] font-bold text-draft-amber-text uppercase tracking-wider">Metadata Incomplete</span>
                          <span className="font-body-sm text-[11px] text-on-surface-variant">Fill all required fields to submit.</span>
                       </div>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!isValid || status === 'preparing'}
                    className="w-full py-3.5 mt-2 rounded-xl font-label-md text-label-md font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all bg-secondary text-on-secondary hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {status === 'preparing' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Preparing...
                      </>
                    ) : (
                      'Prepare Resource'
                    )}
                  </button>
               </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
