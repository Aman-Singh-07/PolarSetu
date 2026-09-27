import { useState } from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminUpload() {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('uploading');
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Ingest Resource</h1>
        <p className="text-slate-500">Upload reports, datasets, and media to the institutional repository.</p>
      </div>

      {status === 'success' ? (
        <div className="bg-white border border-border rounded-xl p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-primary mb-2">Upload Successful</h2>
          <p className="text-slate-500 mb-8">The resource has been indexed and added to the repository.</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setStatus('idle')}
              className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded font-medium hover:bg-slate-50 transition-colors"
            >
              Upload Another
            </button>
            <Link 
              to="/admin"
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded font-medium transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpload} className="bg-white border border-border rounded-xl p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                <input type="text" required className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-secondary focus:border-secondary" placeholder="Resource title..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Resource Type</label>
                <select required className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-secondary focus:border-secondary">
                  <option value="">Select type...</option>
                  <option value="REPORT">Report</option>
                  <option value="DATASET">Dataset</option>
                  <option value="PUBLICATION">Publication</option>
                  <option value="PHOTO">Photo</option>
                  <option value="VIDEO">Video</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Expedition (Optional)</label>
                <select className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-secondary focus:border-secondary">
                  <option value="">None</option>
                  <option value="EXP-43">43rd Indian Antarctic Expedition</option>
                  <option value="EXP-ARC-15">15th Indian Arctic Expedition</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Author / Institution</label>
                <input type="text" required className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-secondary focus:border-secondary" placeholder="e.g. Dr. Sharma / NCPOR" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Year</label>
                <input type="number" required defaultValue={2026} className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-secondary focus:border-secondary" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description / Abstract</label>
                <textarea required className="w-full border border-slate-300 rounded p-2 text-sm min-h-[100px] resize-none focus:ring-secondary focus:border-secondary" placeholder="Brief description..." />
              </div>
            </div>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
            <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-secondary mx-auto mb-3 transition-colors" />
            <div className="text-sm font-medium text-slate-700 mb-1">Click to upload or drag and drop</div>
            <div className="text-xs text-slate-500">PDF, CSV, JPEG, or MP4 (Max. 50MB)</div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={status === 'uploading'}
              className="bg-secondary hover:bg-accent text-white px-8 py-2.5 rounded font-medium transition-colors flex items-center disabled:opacity-50"
            >
              {status === 'uploading' ? 'Uploading...' : 'Ingest Resource'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
