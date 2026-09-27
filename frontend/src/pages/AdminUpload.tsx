import { useState } from 'react';
import { UploadCloud, CheckCircle2, ArrowLeft } from 'lucide-react';
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
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="w-full bg-ice-white py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
          <Link to="/admin" className="inline-flex items-center gap-1 text-secondary font-label-sm text-label-sm hover:text-polar-midnight-deep transition-colors self-start">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep">Ingest Resource</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Upload reports, datasets, and media to the institutional repository.</p>
        </div>
      </section>

      <section className="w-full px-4 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto">
          {status === 'success' ? (
            <div className="bg-pure-white rounded-xl p-12 text-center shadow-sm">
              <CheckCircle2 className="w-16 h-16 text-aurora-emerald mx-auto mb-4" />
              <h2 className="font-headline-md text-headline-md font-bold text-polar-midnight-deep mb-2">Upload Successful</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8">The resource has been indexed and added to the repository.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2.5 rounded-lg bg-surface-container-low text-on-surface-variant font-label-md text-label-md font-medium hover:bg-surface-container transition-colors"
                >
                  Upload Another
                </button>
                <Link
                  to="/admin"
                  className="px-6 py-2.5 rounded-lg bg-polar-midnight-deep text-on-primary font-label-md text-label-md font-medium hover:bg-polar-navy-surface transition-colors"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="bg-pure-white rounded-xl p-8 shadow-sm flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block font-label-sm text-label-sm uppercase tracking-wider text-outline mb-1.5">Title</label>
                    <input type="text" required className="w-full bg-surface rounded-lg p-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-azure-accent" placeholder="Resource title..." />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm uppercase tracking-wider text-outline mb-1.5">Resource Type</label>
                    <select required className="w-full bg-surface rounded-lg p-2.5 font-label-md text-label-md text-on-surface focus:outline-none focus:ring-2 focus:ring-azure-accent">
                      <option value="">Select type...</option>
                      <option value="REPORT">Report</option>
                      <option value="DATASET">Dataset</option>
                      <option value="PUBLICATION">Publication</option>
                      <option value="PHOTO">Photo</option>
                      <option value="VIDEO">Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm uppercase tracking-wider text-outline mb-1.5">Expedition (Optional)</label>
                    <select className="w-full bg-surface rounded-lg p-2.5 font-label-md text-label-md text-on-surface focus:outline-none focus:ring-2 focus:ring-azure-accent">
                      <option value="">None</option>
                      <option value="EXP-43">43rd Indian Antarctic Expedition</option>
                      <option value="EXP-ARC-15">16th Indian Arctic Expedition</option>
                      <option value="EXP-SO-2024">Southern Ocean Cruise 2024</option>
                      <option value="EXP-HIM-5">5th Himalayan Expedition</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block font-label-sm text-label-sm uppercase tracking-wider text-outline mb-1.5">Author / Institution</label>
                    <input type="text" required className="w-full bg-surface rounded-lg p-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-azure-accent" placeholder="e.g. Dr. Sharma / NCPOR" />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm uppercase tracking-wider text-outline mb-1.5">Year</label>
                    <input type="number" required defaultValue={2026} className="w-full bg-surface rounded-lg p-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-azure-accent" />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm uppercase tracking-wider text-outline mb-1.5">Description / Abstract</label>
                    <textarea required className="w-full bg-surface rounded-lg p-2.5 font-body-md text-body-md text-on-surface min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-azure-accent" placeholder="Brief description..." />
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-outline-variant rounded-xl p-12 text-center bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
                <UploadCloud className="w-10 h-10 text-outline group-hover:text-secondary mx-auto mb-3 transition-colors" />
                <div className="font-title-md text-title-md font-medium text-polar-midnight-deep mb-1">Click to upload or drag and drop</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">PDF, CSV, JPEG, or MP4 (Max. 50MB)</div>
              </div>

              <div className="flex justify-end pt-4 border-t border-surface-container-low">
                <button
                  type="submit"
                  disabled={status === 'uploading'}
                  className="px-8 py-2.5 rounded-lg bg-secondary text-on-secondary font-title-md text-title-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50 hover:bg-on-secondary-container"
                >
                  {status === 'uploading' ? 'Uploading...' : 'Ingest Resource'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
