import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UploadCloud, CheckCircle2, ArrowLeft, FileText, Database,
  FileUp, AlertCircle, Loader2, X, AlertTriangle, ArrowRight
} from 'lucide-react';
import { auth } from '../services/auth';
import { api } from '../services/api';

export default function AdminUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isAuthenticated = auth.isAuthenticated();
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

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

  const [status, setStatus] = useState<'idle' | 'preparing' | 'uploading' | 'success' | 'error' | 'upload_error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [createdResourceId, setCreatedResourceId] = useState('');

  const isValid = file && metadata.title && metadata.resourceType && metadata.domain && metadata.description;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileTypeLabel = (name: string): string => {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    const map: Record<string, string> = {
      pdf: 'PDF Document', csv: 'CSV Dataset', json: 'JSON Data',
      parquet: 'Parquet Dataset', png: 'Image (PNG)', jpg: 'Image (JPEG)',
      jpeg: 'Image (JPEG)', tiff: 'Image (TIFF)', xlsx: 'Excel Spreadsheet',
      docx: 'Word Document', zip: 'Archive (ZIP)'
    };
    return map[ext] || ext.toUpperCase() + ' File';
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFileSelect(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setStatus('preparing');
    setErrorMessage('');
    
    const typeMap: Record<string, string> = {
      'Research Paper': 'PUBLICATION',
      'Dataset': 'DATASET',
      'Technical Report': 'REPORT',
      'Expedition Resource': 'EXPEDITION',
      'Media': 'OTHER'
    };
    
    const backendType = typeMap[metadata.resourceType] || 'OTHER';

    let newResourceId = createdResourceId;

    if (!newResourceId) {
      try {
        const res = await api.createResource({
          title: metadata.title,
          type: backendType,
          description: metadata.description,
          region: metadata.domain,
          year: parseInt(metadata.year, 10) || new Date().getFullYear(),
        });
        newResourceId = res.id;
        setCreatedResourceId(res.id);
      } catch (err: any) {
        setStatus('error');
        if (err.status === 400) {
          setErrorMessage('Please correct the required fields.');
        } else if (err.status === 401) {
          setErrorMessage('Your session has expired. Please sign in again.');
        } else {
          setErrorMessage('Unable to connect to the POLARSETU API.');
        }
        return;
      }
    }

    // Step 2: Upload File
    if (file && newResourceId) {
      setStatus('uploading');
      try {
        await api.uploadResourceFile(newResourceId, file);
        setStatus('success');
      } catch (err: any) {
        setStatus('upload_error');
        if (err.status === 401) {
          setErrorMessage('Session expired during upload. Please sign in again.');
        } else if (err.status === 413) {
          setErrorMessage('File is too large.');
        } else {
          setErrorMessage(err.message || 'Unable to upload the resource file.');
        }
      }
    } else {
      // If no file was selected (though frontend validation requires it), just succeed
      setStatus('success');
    }
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
    setErrorMessage('');
    setCreatedResourceId('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (status === 'success' || status === 'upload_error') {
    return (
      <div className="flex flex-col w-full bg-surface">
        <section className="relative w-full overflow-hidden bg-polar-midnight-deep text-pure-white py-10 lg:py-12 px-4 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-3">
             <Link to="/admin" className="inline-flex items-center gap-1.5 text-glacial-sky font-label-sm text-sm font-bold tracking-wider hover:text-white transition-colors self-start mb-1 uppercase">
               <ArrowLeft className="w-4 h-4" /> Back to Dashboard
             </Link>
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 shadow-md">
                  <FileUp className="w-5 h-5 text-pure-white" />
                </div>
                <h1 className="font-headline-lg text-3xl lg:text-4xl font-bold tracking-tight uppercase">Content Management</h1>
             </div>
          </div>
        </section>
        <section className="w-full px-4 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto bg-pure-white rounded-2xl p-8 lg:p-10 border border-surface-variant shadow-sm text-center animate-in fade-in duration-500">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${status === 'success' ? 'bg-aurora-emerald/10' : 'bg-draft-amber-bg/40'}`}>
              {status === 'success' ? (
                <CheckCircle2 className="w-8 h-8 text-aurora-emerald" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-draft-amber-text" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-polar-midnight-deep mb-2 uppercase tracking-wide font-display">
              {status === 'success' ? 'Resource Prepared' : 'Upload Incomplete'}
            </h2>
            <p className="font-body-md text-base text-on-surface-variant mb-8 max-w-md mx-auto leading-relaxed">
              {status === 'success' 
                ? 'The resource package and file have been successfully ingested into the POLARSETU repository.' 
                : 'The resource metadata was created, but the file upload failed. You can retry the upload.'}
            </p>

            <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-3 text-left mb-8 border border-surface-variant mx-auto max-w-lg">
               <div className="flex items-start justify-between border-b border-surface-variant pb-3">
                 <div className="flex flex-col gap-1">
                    <span className="font-label-sm text-[10px] text-outline uppercase font-bold tracking-wider">Resource Title</span>
                    <span className="font-title-md font-bold text-polar-midnight-deep">{metadata.title}</span>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-sm text-[10px] text-outline uppercase font-bold tracking-wider">Type</span>
                    <span className="font-body-sm text-sm font-medium text-on-surface">{metadata.resourceType}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-sm text-[10px] text-outline uppercase font-bold tracking-wider">Domain</span>
                    <span className="font-body-sm text-sm font-medium text-on-surface">{metadata.domain}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-sm text-[10px] text-outline uppercase font-bold tracking-wider">File</span>
                    <span className="font-body-sm text-sm font-medium text-on-surface truncate">{file?.name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-sm text-[10px] text-outline uppercase font-bold tracking-wider">Status</span>
                    <span className={`font-body-sm text-sm font-bold ${status === 'success' ? 'text-aurora-emerald' : 'text-draft-amber-text'}`}>
                      {status === 'success' ? 'File Uploaded' : 'Upload Failed'}
                    </span>
                  </div>
               </div>
            </div>

            {status === 'upload_error' && errorMessage && (
              <div className="bg-error/10 border border-error/30 text-error p-4 rounded-xl text-sm mb-8 mx-auto max-w-lg text-left">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {status === 'upload_error' ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 rounded-lg bg-secondary text-pure-white font-label-md font-bold uppercase tracking-wider hover:bg-secondary-dark transition-colors"
                >
                  Retry Upload
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-lg border border-surface-variant bg-pure-white text-polar-midnight-deep font-label-md font-bold uppercase tracking-wider hover:bg-surface-container-low transition-colors"
                >
                  Upload Another
                </button>
              )}
              <Link
                to={`/research/${createdResourceId}`}
                className="px-6 py-3 rounded-lg bg-polar-midnight-deep text-pure-white font-label-md font-bold uppercase tracking-wider hover:bg-polar-navy-surface transition-colors"
              >
                View Resource
              </Link>
              <Link
                to="/admin"
                className="px-6 py-3 rounded-lg bg-surface-container-low border border-surface-variant text-polar-midnight-deep font-label-md font-bold uppercase tracking-wider hover:bg-surface-container transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* Header */}
      <section className="relative w-full overflow-hidden bg-polar-midnight-deep text-pure-white py-10 lg:py-12 px-4 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-polar-midnight-deep via-polar-midnight-deep/95 to-polar-navy-surface z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
             <Link to="/admin" className="inline-flex items-center gap-1.5 text-glacial-sky font-label-sm text-sm font-bold tracking-wider hover:text-white transition-colors self-start mb-1 uppercase">
               <ArrowLeft className="w-4 h-4" /> Back to Dashboard
             </Link>
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 shadow-md">
                  <FileUp className="w-5 h-5 text-pure-white" />
                </div>
                <h1 className="font-headline-lg text-3xl lg:text-4xl font-bold tracking-tight uppercase">Content Management</h1>
             </div>
             <p className="font-body-md text-base lg:text-lg text-pure-white/80 max-w-2xl mt-1 leading-relaxed">
               Ingest, classify, and validate scientific data and media for the central POLARSETU repository.
             </p>
          </div>

          {/* Workflow Indicator */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 font-label-sm text-xs font-bold uppercase tracking-widest text-pure-white/40 bg-pure-white/5 w-fit px-4 py-2.5 rounded-lg border border-pure-white/10 backdrop-blur-sm">
            <span className="text-pure-white flex items-center gap-1.5"><FileUp className="w-3.5 h-3.5" /> Upload</span>
            <ArrowRight className="w-3 h-3" />
            <span className={`flex items-center gap-1.5 ${file ? 'text-pure-white' : ''}`}><Database className="w-3.5 h-3.5" /> Metadata</span>
            <ArrowRight className="w-3 h-3" />
            <span className={`flex items-center gap-1.5 ${isValid ? 'text-pure-white' : ''}`}><CheckCircle2 className="w-3.5 h-3.5" /> Validate</span>
            <ArrowRight className="w-3 h-3" />
            <span>Checksum</span>
            <ArrowRight className="w-3 h-3" />
            <span>Store</span>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <section className="w-full px-4 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column (Upload & Metadata) */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Upload Zone */}
            <div className="bg-pure-white rounded-2xl shadow-sm border border-surface-variant overflow-hidden flex flex-col">
               <div className="bg-surface-container-low px-5 py-4 border-b border-surface-variant flex items-center justify-between">
                 <h2 className="font-label-md text-sm font-bold text-polar-midnight-deep uppercase tracking-widest flex items-center gap-2">
                   <FileUp className="w-5 h-5 text-secondary" /> Resource File
                 </h2>
                 {!file && <span className="font-code-sm text-[10px] uppercase tracking-wider text-draft-amber-text bg-draft-amber-bg/50 border border-draft-amber-border/40 px-2 py-0.5 rounded">Required</span>}
               </div>

               {/* Hidden file input */}
               <input
                 ref={fileInputRef}
                 type="file"
                 className="hidden"
                 onChange={handleFileInputChange}
                 accept=".pdf,.csv,.json,.parquet,.png,.jpg,.jpeg,.tiff,.xlsx,.docx,.zip"
               />

               <div className="p-6">
                 {!file ? (
                   <button
                     type="button"
                     onClick={() => fileInputRef.current?.click()}
                     onDrop={handleDrop}
                     onDragOver={handleDragOver}
                     onDragLeave={handleDragLeave}
                     className={`w-full border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all group ${
                       isDragOver
                         ? 'border-secondary bg-secondary/5 scale-[1.01]'
                         : 'border-surface-variant bg-surface-container-low hover:bg-surface-container hover:border-secondary/50'
                     }`}
                   >
                     <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform shadow-sm ${
                       isDragOver ? 'bg-secondary/10 scale-110' : 'bg-pure-white group-hover:scale-110'
                     }`}>
                        <UploadCloud className={`w-7 h-7 ${isDragOver ? 'text-secondary' : 'text-secondary'}`} />
                     </div>
                     <span className="font-title-md font-bold text-polar-midnight-deep mb-1">
                       {isDragOver ? 'Drop file here' : 'Click to browse or drag & drop'}
                     </span>
                     <span className="font-body-sm text-sm text-on-surface-variant">PDF, CSV, JSON, Parquet, Images, Excel, Archives</span>
                   </button>
                 ) : (
                   <div className="flex items-center justify-between p-4 bg-surface-container-low border border-surface-variant rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-pure-white rounded-lg flex items-center justify-center shadow-sm border border-surface-variant">
                           <FileText className="w-6 h-6 text-secondary" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                           <span className="font-label-md font-bold text-polar-midnight-deep truncate max-w-[200px] sm:max-w-md">{file.name}</span>
                           <div className="flex items-center gap-2 font-code-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                              <span>{getFileTypeLabel(file.name)}</span> • <span>{formatFileSize(file.size)}</span>
                           </div>
                        </div>
                      </div>
                      <button
                        onClick={handleClearFile}
                        className="p-2 hover:bg-surface-container rounded-lg text-outline hover:text-error transition-colors"
                        aria-label="Remove file"
                      >
                        <X className="w-5 h-5" />
                      </button>
                   </div>
                 )}
               </div>
            </div>

            {/* Metadata Form */}
            <div className={`bg-pure-white rounded-2xl shadow-sm border border-surface-variant overflow-hidden flex flex-col transition-opacity duration-300 ${!file ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
               <div className="bg-surface-container-low px-5 py-4 border-b border-surface-variant flex items-center justify-between">
                 <h2 className="font-label-md text-sm font-bold text-polar-midnight-deep uppercase tracking-widest flex items-center gap-2">
                   <Database className="w-5 h-5 text-secondary" /> Resource Metadata
                 </h2>
                 {file && !isValid && (
                   <div className="flex items-center gap-1.5 text-draft-amber-text bg-draft-amber-bg/50 border border-draft-amber-border/40 px-2 py-0.5 rounded">
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
                            className="w-full bg-surface-container-low border border-surface-variant rounded-lg p-2.5 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
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
                            className="w-full bg-surface-container-low border border-surface-variant rounded-lg p-2.5 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
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
                            className="w-full bg-surface-container-low border border-surface-variant rounded-lg p-2.5 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
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
                            className="w-full bg-surface-container-low border border-surface-variant rounded-lg p-2.5 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                          />
                       </div>

                       <div className="flex flex-col gap-1.5">
                          <label className="font-label-sm text-[11px] font-bold text-polar-midnight-deep uppercase tracking-wider">
                            Associated Expedition
                          </label>
                          <select
                            value={metadata.expedition}
                            onChange={(e) => setMetadata({...metadata, expedition: e.target.value})}
                            className="w-full bg-surface-container-low border border-surface-variant rounded-lg p-2.5 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
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
                            className="w-full bg-surface-container-low border border-surface-variant rounded-lg p-2.5 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
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
                      className="w-full min-h-[100px] resize-none bg-surface-container-low border border-surface-variant rounded-lg p-3 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                    />
                 </div>
               </div>
            </div>
          </div>

          {/* Right Column (Validation & Submit) */}
          <div className="lg:col-span-4 flex flex-col gap-6">

             {/* Validation Summary */}
             <div className="bg-pure-white rounded-2xl shadow-sm border border-surface-variant overflow-hidden flex flex-col sticky top-28">
               <div className="bg-surface-container-low px-5 py-4 border-b border-surface-variant flex items-center justify-between">
                 <h3 className="font-label-md text-sm font-bold text-polar-midnight-deep uppercase tracking-widest">Ingestion Pipeline</h3>
                 <span className="font-code-sm text-[10px] uppercase tracking-wider text-outline font-bold">Pre-Flight</span>
               </div>

               <div className="p-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                     <div className="flex items-center gap-3">
                        {file ? <CheckCircle2 className="w-5 h-5 text-aurora-emerald shrink-0" /> : <div className="w-5 h-5 rounded-full border-2 border-surface-variant shrink-0" />}
                        <span className={`font-body-sm text-sm ${file ? 'text-polar-midnight-deep font-semibold' : 'text-on-surface-variant'}`}>File selected</span>
                     </div>
                     <div className="flex items-center gap-3">
                        {metadata.title ? <CheckCircle2 className="w-5 h-5 text-aurora-emerald shrink-0" /> : <div className="w-5 h-5 rounded-full border-2 border-surface-variant shrink-0" />}
                        <span className={`font-body-sm text-sm ${metadata.title ? 'text-polar-midnight-deep font-semibold' : 'text-on-surface-variant'}`}>Title provided</span>
                     </div>
                     <div className="flex items-center gap-3">
                        {metadata.resourceType && metadata.domain ? <CheckCircle2 className="w-5 h-5 text-aurora-emerald shrink-0" /> : <div className="w-5 h-5 rounded-full border-2 border-surface-variant shrink-0" />}
                        <span className={`font-body-sm text-sm ${metadata.resourceType && metadata.domain ? 'text-polar-midnight-deep font-semibold' : 'text-on-surface-variant'}`}>Categorization complete</span>
                     </div>
                     <div className="flex items-center gap-3">
                        {metadata.description ? <CheckCircle2 className="w-5 h-5 text-aurora-emerald shrink-0" /> : <div className="w-5 h-5 rounded-full border-2 border-surface-variant shrink-0" />}
                        <span className={`font-body-sm text-sm ${metadata.description ? 'text-polar-midnight-deep font-semibold' : 'text-on-surface-variant'}`}>Description provided</span>
                     </div>
                  </div>

                  <div className="h-px bg-surface-variant my-1 w-full" />

                  <div className="flex flex-col gap-3">
                     <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-surface-variant shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                           <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-outline">SHA-256 Integrity</span>
                           <span className="font-body-sm text-xs text-on-surface-variant">Pending backend processing</span>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-surface-variant shrink-0 mt-0.5 flex items-center justify-center">
                          {(status === 'preparing' || status === 'uploading') && <Loader2 className="w-3 h-3 text-secondary animate-spin" />}
                        </div>
                        <div className="flex flex-col">
                           <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-outline">Supabase Storage</span>
                           <span className="font-body-sm text-xs text-on-surface-variant">Uploading to object storage</span>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-surface-variant shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                           <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-outline">Repository Indexing</span>
                           <span className="font-body-sm text-xs text-on-surface-variant">Pending backend integration</span>
                        </div>
                     </div>
                  </div>

                  {!isValid && file && (
                    <div className="mt-2 p-3 bg-draft-amber-bg/30 border border-draft-amber-border/40 rounded-lg flex gap-2">
                       <AlertTriangle className="w-4 h-4 text-draft-amber-text shrink-0 mt-0.5" />
                       <div className="flex flex-col">
                          <span className="font-label-sm text-[11px] font-bold text-draft-amber-text uppercase tracking-wider">Metadata Incomplete</span>
                          <span className="font-body-sm text-[11px] text-on-surface-variant">Fill all required fields to submit.</span>
                       </div>
                    </div>
                  )}

                  {status === 'error' && errorMessage && (
                    <div className="mt-2 p-3 bg-error/10 border border-error/30 rounded-lg flex gap-2">
                       <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                       <span className="font-body-sm text-[13px] text-error">{errorMessage}</span>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!isValid || status === 'preparing' || status === 'uploading'}
                    className="w-full py-3.5 mt-2 rounded-xl font-label-md font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all bg-polar-midnight-deep text-pure-white hover:bg-polar-navy-surface disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    {(status === 'preparing' || status === 'uploading') ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {status === 'uploading' ? 'Uploading File...' : 'Creating Resource...'}
                      </>
                    ) : (
                      'Submit Resource'
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
