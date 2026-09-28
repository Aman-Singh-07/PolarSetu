import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight as ArrowRightIcon, Compass, Sparkles, Globe2, BadgeCheck, MapPin, Database as DatabaseIcon, FileText, Map as MapIcon2, Bot, MessageSquare, Gavel, Camera, PlayCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const stationIcon = L.divIcon({
  className: 'custom-station-icon',
  html: `<div class="w-4 h-4 rounded-full bg-aurora-emerald border-2 border-pure-white shadow-lg ring-4 ring-aurora-emerald/20"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function Home() {
  const [activeResearchTab, setActiveResearchTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1 & 2. HERO & UNIVERSAL DISCOVERY SEARCH */}
      <section className="relative w-full overflow-hidden bg-polar-midnight-deep text-pure-white -mt-20 pt-32 pb-16">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Bharati Antarctic Station and Larsemann Hills Research Facility" 
            className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-125" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZlU0zKQ2fFmf3pyyxCzDmnJXg5L2Xj5SFAtHGSFS24kA0Gy58tAoWbTbUXqoGsekW5ZGVs6dqXXl-slkh9BnQJrowMjTnI9nnGQRWqDnG5dNYMPMEn_sLqSiNuzu-5lmTWUBYAQp6sygCs2C6UWIy4P03eL-w0hWfXwd3WJQ8kwAFp1kB-SnFBBPtQBDHatOHRxJKYaehqvpc6OmwpbpKPRQdMGzgI3cP85LtHag7OJP7QoCs2NerDA" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-polar-midnight-deep/95 via-polar-midnight-deep/80 to-polar-midnight-deep/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-polar-midnight-deep via-transparent to-polar-midnight-deep/50"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low/20 backdrop-blur-md text-glacial-sky font-label-sm text-label-sm uppercase tracking-widest shadow-sm border border-glacial-sky/20">
              <span className="w-2 h-2 rounded-full bg-aurora-emerald animate-pulse"></span>
              MoES & NCPOR Integration Layer
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pure-white/10 backdrop-blur-sm text-ice-white font-code-sm text-code-sm border border-pure-white/10">
              <Globe2 className="w-4 h-4" /> 3 Polar Realms: Arctic, Antarctic & Himalayas
            </span>
          </div>
          
          <div className="max-w-3xl flex flex-col gap-4">
            <h1 className="font-display-hero text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-pure-white leading-tight">
              Discover India's <span className="text-transparent bg-clip-text bg-gradient-to-r from-glacial-sky via-secondary-container to-pure-white">Polar Science</span>
            </h1>
            <p className="font-body-lg text-lg lg:text-xl text-pure-white/80 leading-relaxed max-w-2xl">
              Explore expeditions, research, datasets, discoveries and stories from India's work across the Arctic and Antarctic.
            </p>
          </div>
          
          {/* SEARCH CARD COMPONENT */}
          <div className="w-full max-w-4xl p-5 rounded-2xl bg-pure-white/95 backdrop-blur-xl shadow-2xl flex flex-col gap-4 text-on-surface">
            <form onSubmit={handleSearch} className="flex items-center gap-3 bg-surface-container-low px-4 py-3.5 rounded-xl border border-surface-variant transition-colors focus-within:border-secondary focus-within:bg-pure-white">
              <SearchIcon className="text-secondary w-6 h-6 shrink-0" />
              <input 
                className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none" 
                placeholder="Search expeditions, reports, publications, datasets and media..." 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-polar-midnight-deep text-pure-white font-label-md text-label-md hover:bg-polar-navy-surface transition-colors shadow-sm shrink-0">
                <span>Search</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </form>
            
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-2 text-label-sm font-label-sm">
                <span className="text-on-surface-variant font-semibold uppercase tracking-wider mr-2">Quick Filters:</span>
                <Link to="/explore?type=report" className="px-3.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors">Reports</Link>
                <Link to="/explore?type=publication" className="px-3.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors">Publications</Link>
                <Link to="/explore?type=dataset" className="px-3.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors">Datasets</Link>
                <Link to="/expeditions" className="px-3.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors">Expeditions</Link>
                <Link to="/media" className="px-3.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors">Media</Link>
              </div>
              <span className="font-code-sm text-code-sm text-on-surface-variant flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-aurora-emerald" /> FAIR Open Access Repository
              </span>
            </div>
          </div>
          
          {/* PRIMARY ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link to="/explore" className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-polar-midnight-deep text-pure-white font-title-md text-title-md hover:bg-polar-navy-surface shadow-lg hover:shadow-xl transition-all">
              <Compass className="w-5 h-5 text-glacial-sky" />
              <span>Explore Polar Research</span>
            </Link>
            <Link to="/ai" className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-surface-container-low/10 backdrop-blur-md text-glacial-sky font-title-md text-title-md hover:bg-surface-container-low/20 transition-all shadow-sm border border-pure-white/20">
              <Sparkles className="w-5 h-5" />
              <span>Ask Polar AI</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. PLATFORM OVERVIEW / METRICS */}
      <section className="w-full bg-pure-white shadow-sm relative z-20 border-b border-surface-variant">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-secondary">
                <Compass className="w-5 h-5" />
                <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Featured Expedition</span>
              </div>
              <span className="font-title-md text-title-md font-bold text-polar-midnight-deep leading-tight">43rd ISEA (Antarctica)</span>
              <span className="font-code-sm text-[10px] text-on-surface-variant flex items-center gap-1.5 bg-surface-container px-2 py-1 rounded w-max">
                <span className="w-1.5 h-1.5 rounded-full bg-glacial-sky"></span> Live Data Feed
              </span>
            </div>
            <div className="flex flex-col gap-1.5 border-l border-surface-variant pl-6">
              <div className="flex items-center gap-2 text-secondary">
                <FileText className="w-5 h-5" />
                <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Published Studies</span>
              </div>
              <span className="font-display-hero text-3xl font-bold text-polar-midnight-deep">186+</span>
              <span className="font-code-sm text-[10px] text-outline bg-surface-container px-2 py-1 rounded w-max">Verified</span>
            </div>
            <div className="flex flex-col gap-1.5 border-l border-surface-variant pl-6">
              <div className="flex items-center gap-2 text-secondary">
                <DatabaseIcon className="w-5 h-5" />
                <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Research Resources</span>
              </div>
              <span className="font-display-hero text-3xl font-bold text-polar-midnight-deep">320+</span>
              <span className="font-code-sm text-[10px] text-outline bg-surface-container px-2 py-1 rounded w-max">Verified</span>
            </div>
            <div className="flex flex-col gap-1.5 border-l border-surface-variant pl-6">
              <div className="flex items-center gap-2 text-secondary">
                <Camera className="w-5 h-5" />
                <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Media Assets</span>
              </div>
              <span className="font-display-hero text-3xl font-bold text-polar-midnight-deep">540+</span>
              <span className="font-code-sm text-[10px] text-outline bg-surface-container px-2 py-1 rounded w-max">Verified</span>
            </div>
            <div className="flex flex-col gap-1.5 border-l border-surface-variant pl-6 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-secondary">
                <Globe2 className="w-5 h-5" />
                <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Research Stations</span>
              </div>
              <span className="font-display-hero text-3xl font-bold text-polar-midnight-deep">4</span>
              <span className="font-code-sm text-xs text-on-surface-variant pt-1">Antarctica, Arctic, Himalaya</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED EXPEDITION */}
      <section className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-16 flex flex-col gap-8" id="featured-expedition">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="px-3 py-1 w-max rounded bg-surface-container text-secondary font-label-sm text-label-sm uppercase tracking-wider font-bold">
              Featured Expedition
            </span>
            <h2 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep">43rd Indian Scientific Expedition to Antarctica</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Comprehensive meteorological, geophysical, and cryospheric investigations. Deployment of advanced automated weather stations, deep ice-core extraction, and geological baseline mapping around Bharati and Maitri.
            </p>
          </div>
          <Link to="/expeditions" className="inline-flex items-center gap-2 text-secondary font-title-md text-title-md hover:text-polar-midnight-deep transition-colors bg-surface-container-low hover:bg-surface-container px-4 py-2 rounded-lg">
            <span>View all 44 Expeditions</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row bg-pure-white rounded-2xl shadow-md border border-surface-variant overflow-hidden group">
          <div className="lg:w-1/2 relative h-72 lg:h-auto overflow-hidden">
            <img alt="Bharati Base in Larsemann Hills Antarctica" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZlU0zKQ2fFmf3pyyxCzDmnJXg5L2Xj5SFAtHGSFS24kA0Gy58tAoWbTbUXqoGsekW5ZGVs6dqXXl-slkh9BnQJrowMjTnI9nnGQRWqDnG5dNYMPMEn_sLqSiNuzu-5lmTWUBYAQp6sygCs2C6UWIy4P03eL-w0hWfXwd3WJQ8kwAFp1kB-SnFBBPtQBDHatOHRxJKYaehqvpc6OmwpbpKPRQdMGzgI3cP85LtHag7OJP7QoCs2NerDA" />
            <div className="absolute inset-0 bg-gradient-to-r from-polar-midnight-deep/40 to-transparent"></div>
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded bg-polar-midnight-deep/90 text-pure-white font-label-sm text-label-sm uppercase tracking-wider backdrop-blur-sm shadow-sm">Antarctica</span>
              <span className="px-3 py-1 rounded bg-pure-white/90 text-polar-midnight-deep font-code-sm text-code-sm font-bold shadow-sm">2023–2024</span>
            </div>
          </div>
          <div className="lg:w-1/2 p-6 md:p-10 flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-secondary font-label-md text-label-md font-semibold">
                <MapPin className="w-5 h-5" />
                <span>Larsemann Hills & Schirmacher Oasis</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">Meteorology</span>
                <span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">Geophysics</span>
                <span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">Glaciology</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 py-4 px-6 rounded-xl bg-surface-container-low/50 border border-surface-variant text-center">
              <div className="flex flex-col gap-1">
                <span className="font-display-hero text-2xl font-bold text-polar-midnight-deep">48</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Scientists</span>
              </div>
              <div className="flex flex-col gap-1 border-l border-surface-variant">
                <span className="font-display-hero text-2xl font-bold text-polar-midnight-deep">14</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Reports</span>
              </div>
              <div className="flex flex-col gap-1 border-l border-surface-variant">
                <span className="font-display-hero text-2xl font-bold text-polar-midnight-deep">8</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Datasets</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link to="/expeditions/EXP-43" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-polar-midnight-deep text-pure-white font-title-md font-bold hover:bg-polar-navy-surface transition-colors shadow-md">
                Explore Expedition <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link to="/explore?q=43rd+ISEA" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-pure-white border-2 border-surface-container text-secondary font-title-md font-bold hover:bg-surface-container-low transition-colors">
                View Research
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RESEARCH SPOTLIGHT */}
      <section className="w-full bg-surface-container-low py-16 border-y border-surface-variant">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Scientific Records Repository</span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep">Research Spotlight</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                Direct gateway to verified field inventories, technical debriefs, and international open peer reviews.
              </p>
            </div>
            {/* SEGMENTED CONTROLS */}
            <div className="inline-flex p-1.5 rounded-lg bg-pure-white shadow-sm border border-surface-variant">
              <button onClick={() => setActiveResearchTab('all')} className={`px-5 py-2 rounded-md font-label-md text-label-md transition-all ${activeResearchTab === 'all' ? 'font-bold text-pure-white bg-polar-midnight-deep shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}>All Spotlights</button>
              <button onClick={() => setActiveResearchTab('reports')} className={`px-5 py-2 rounded-md font-label-md text-label-md transition-all ${activeResearchTab === 'reports' ? 'font-bold text-pure-white bg-polar-midnight-deep shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}>Reports</button>
              <button onClick={() => setActiveResearchTab('datasets')} className={`px-5 py-2 rounded-md font-label-md text-label-md transition-all ${activeResearchTab === 'datasets' ? 'font-bold text-pure-white bg-polar-midnight-deep shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}>Datasets</button>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            {/* ITEM 1: DATASET */}
            {(activeResearchTab === 'all' || activeResearchTab === 'datasets') && (
              <div className="p-5 rounded-2xl bg-pure-white shadow-sm border border-surface-variant flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition-shadow group">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary shrink-0 group-hover:bg-secondary group-hover:text-pure-white transition-colors">
                    <DatabaseIcon className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-surface-container-high text-secondary font-code-sm text-code-sm font-semibold">Dataset • NPDC-DS-8821</span>
                      <span className="px-2.5 py-0.5 rounded bg-ice-white text-on-surface-variant font-label-sm text-label-sm border border-surface-variant">Antarctica • Prydz Bay</span>
                      <span className="text-outline font-label-sm text-label-sm">Updated 2024</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep hover:text-secondary cursor-pointer transition-colors">
                      Antarctic Sea Ice Thickness & Albedo Dynamics in Prydz Bay (2024)
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant max-w-3xl leading-relaxed">
                      Continuous ground-penetrating radar profiling coupled with calibrated MODIS surface reflectance metrics along the Bharati coastal fast-ice corridor. Raw NetCDF-4 format.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5 shrink-0 lg:flex-col lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-surface-variant pt-4 lg:pt-0 lg:pl-6">
                  <div className="flex flex-col lg:items-end gap-1">
                    <span className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">MoES / NCPOR Archive</span>
                    <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-code-sm text-[10px] uppercase font-bold w-max">Open Access</span>
                  </div>
                  <Link to="/research/1" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container-low text-secondary font-label-md font-bold hover:bg-surface-container transition-colors">
                    View Resource <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
            
            {/* ITEM 2: PUBLICATION */}
            {(activeResearchTab === 'all' || activeResearchTab === 'publications') && (
              <div className="p-5 rounded-2xl bg-pure-white shadow-sm border border-surface-variant flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition-shadow group">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl bg-surface-container-low flex items-center justify-center text-azure-accent shrink-0 group-hover:bg-azure-accent group-hover:text-pure-white transition-colors">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-surface-container-high text-azure-accent font-code-sm text-code-sm font-semibold">Publication • J. Geophys. Res</span>
                      <span className="px-2.5 py-0.5 rounded bg-ice-white text-on-surface-variant font-label-sm text-label-sm border border-surface-variant">Arctic • Himadri Station</span>
                      <span className="text-outline font-label-sm text-label-sm">Published 2025</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep hover:text-secondary cursor-pointer transition-colors">
                      Atmospheric Trace Gas Variations at Himadri Arctic Station: Decade-Long Trends
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant max-w-3xl leading-relaxed">
                      Dr. R. Sharma, Dr. P. K. Joshi et al. Longitudinal observational record of tropospheric halogens and black carbon transport from mid-latitudes into the Ny-Ålesund international research hub.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5 shrink-0 lg:flex-col lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-surface-variant pt-4 lg:pt-0 lg:pl-6">
                  <div className="flex flex-col lg:items-end gap-1">
                    <span className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">doi:10.1029/2024JD0</span>
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-code-sm text-[10px] uppercase font-bold w-max">Peer Reviewed</span>
                  </div>
                  <Link to="/research/2" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container-low text-secondary font-label-md font-bold hover:bg-surface-container transition-colors">
                    View Resource <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
            
            {/* ITEM 3: REPORT */}
            {(activeResearchTab === 'all' || activeResearchTab === 'reports') && (
              <div className="p-5 rounded-2xl bg-pure-white shadow-sm border border-surface-variant flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition-shadow group">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl bg-surface-container-low flex items-center justify-center text-aurora-emerald shrink-0 group-hover:bg-aurora-emerald group-hover:text-pure-white transition-colors">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-surface-container-high text-aurora-emerald font-code-sm text-code-sm font-semibold">Technical Report • MoES-TR-41</span>
                      <span className="px-2.5 py-0.5 rounded bg-ice-white text-on-surface-variant font-label-sm text-label-sm border border-surface-variant">Dronning Maud Land</span>
                      <span className="text-outline font-label-sm text-label-sm">NCPOR Technical Series</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep hover:text-secondary cursor-pointer transition-colors">
                      Glacial Bed Topography and Sub-ice Topography near Schirmacher Oasis
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant max-w-3xl leading-relaxed">
                      Synthesis of airborne radio-echo sounding and seismological transects between Maitri station and the polar plateau ice divide, detailing subglacial hydrological networks and permafrost depths.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5 shrink-0 lg:flex-col lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-surface-variant pt-4 lg:pt-0 lg:pl-6">
                  <div className="flex flex-col lg:items-end gap-1">
                    <span className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">PDF • 44 Pages</span>
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-code-sm text-[10px] uppercase font-bold w-max">Official Record</span>
                  </div>
                  <Link to="/research/3" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container-low text-secondary font-label-md font-bold hover:bg-surface-container transition-colors">
                    View Resource <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6 & 7. STATIONS & POLAR MAP PREVIEW */}
      <section className="w-full bg-polar-midnight-deep pt-20 pb-24 overflow-hidden relative border-t border-polar-navy-surface text-pure-white">
        <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none"></div>
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 relative z-10 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-2xl">
              <span className="font-label-sm text-label-sm text-glacial-sky font-bold uppercase tracking-widest">Geographic Locations</span>
              <h2 className="font-headline-lg text-headline-lg font-bold">Indian Polar & Himalayan Research Stations</h2>
              <p className="font-body-md text-body-md text-pure-white/80 max-w-xl">
                Discover research stations, expedition locations and scientific activity across India's polar and Himalayan research ecosystem.
              </p>
            </div>
            <Link to="/map" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-glacial-sky text-polar-midnight-deep font-title-md font-bold hover:bg-pure-white transition-all shadow-md shrink-0">
              <MapIcon2 className="w-5 h-5" />
              <span>Open Polar Map</span>
            </Link>
          </div>

          <div className="relative w-full rounded-2xl overflow-hidden bg-polar-midnight-deep shadow-2xl border border-white/10 min-h-[500px] flex flex-col justify-between p-4 md:p-8">
            <div className="absolute inset-0 w-full h-full z-0">
               <MapContainer
                  center={[20, 78]}
                  zoom={3}
                  minZoom={2.5}
                  zoomControl={false}
                  scrollWheelZoom={false}
                  dragging={false}
                  maxBounds={[[-90, -180], [90, 180]]}
                  className="w-full h-full opacity-60 mix-blend-luminosity grayscale"
                  style={{ background: '#0B132B' }}
                >
                  <TileLayer
                    url={`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${import.meta.env.VITE_CARTO_API_KEY || ''}`}
                    noWrap={true}
                  />
                  <Marker position={[-69.4, 76.18]} icon={stationIcon} />
                  <Marker position={[-70.75, 11.73]} icon={stationIcon} />
                  <Marker position={[78.91, 11.93]} icon={stationIcon} />
                  <Marker position={[32.4, 77.6]} icon={stationIcon} />
               </MapContainer>
               <div className="absolute inset-0 bg-gradient-to-t from-polar-navy-surface via-polar-navy-surface/30 to-transparent z-[5]"></div>
            </div>
            
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 bg-polar-midnight-deep/80 backdrop-blur-md p-3.5 rounded-xl border border-white/5">
              <div className="flex items-center gap-4 text-label-sm font-label-sm">
                <span className="flex items-center gap-2 text-glacial-sky font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-glacial-sky animate-ping"></span> Latest Station Observations
                </span>
                <span className="hidden sm:inline text-white/20">|</span>
                <span className="hidden sm:inline text-pure-white/80">Source: NCPOR (Simulated)</span>
              </div>
              <div className="flex items-center gap-2 text-code-sm font-code-sm">
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-16">
              {/* BHARATI */}
              <div className="p-5 rounded-xl bg-polar-midnight-deep/95 border border-white/10 backdrop-blur-md hover:bg-polar-midnight-deep transition-all flex flex-col gap-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="font-title-md text-title-md font-bold text-pure-white">Bharati</span>
                  <span className="px-2 py-0.5 rounded bg-aurora-emerald/20 text-aurora-emerald font-label-sm text-label-sm uppercase font-bold tracking-wider">Antarctica</span>
                </div>
                <div className="flex flex-col text-code-sm font-code-sm text-glacial-sky">
                  <span className="">69°24′S, 76°11′E</span>
                  <span className="text-pure-white/80 font-body-sm text-body-sm pt-1">Larsemann Hills</span>
                </div>
                <div className="pt-2 mt-auto border-t border-white/10 flex items-center justify-between text-label-sm font-label-sm text-ice-white">
                  <span className="">Temp: -18.4°C</span>
                  <span className="">Wind: 28 kts</span>
                </div>
              </div>
              
              {/* MAITRI */}
              <div className="p-5 rounded-xl bg-polar-midnight-deep/95 border border-white/10 backdrop-blur-md hover:bg-polar-midnight-deep transition-all flex flex-col gap-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="font-title-md text-title-md font-bold text-pure-white">Maitri</span>
                  <span className="px-2 py-0.5 rounded bg-aurora-emerald/20 text-aurora-emerald font-label-sm text-label-sm uppercase font-bold tracking-wider">Antarctica</span>
                </div>
                <div className="flex flex-col text-code-sm font-code-sm text-glacial-sky">
                  <span className="">70°45′S, 11°44′E</span>
                  <span className="text-pure-white/80 font-body-sm text-body-sm pt-1">Schirmacher Oasis</span>
                </div>
                <div className="pt-2 mt-auto border-t border-white/10 flex items-center justify-between text-label-sm font-label-sm text-ice-white">
                  <span className="">Temp: -22.1°C</span>
                  <span className="">Wind: 19 kts</span>
                </div>
              </div>

              {/* HIMADRI */}
              <div className="p-5 rounded-xl bg-polar-midnight-deep/95 border border-white/10 backdrop-blur-md hover:bg-polar-midnight-deep transition-all flex flex-col gap-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="font-title-md text-title-md font-bold text-pure-white">Himadri</span>
                  <span className="px-2 py-0.5 rounded bg-azure-accent/20 text-azure-accent font-label-sm text-label-sm uppercase font-bold tracking-wider">Arctic</span>
                </div>
                <div className="flex flex-col text-code-sm font-code-sm text-glacial-sky">
                  <span className="">78°55′N, 11°56′E</span>
                  <span className="text-pure-white/80 font-body-sm text-body-sm pt-1">Ny-Ålesund, Svalbard</span>
                </div>
                <div className="pt-2 mt-auto border-t border-white/10 flex items-center justify-between text-label-sm font-label-sm text-ice-white">
                  <span className="">Temp: -12.8°C</span>
                  <span className="">Wind: 14 kts</span>
                </div>
              </div>

              {/* HIMANSH */}
              <div className="p-5 rounded-xl bg-polar-midnight-deep/95 border border-white/10 backdrop-blur-md hover:bg-polar-midnight-deep transition-all flex flex-col gap-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="font-title-md text-title-md font-bold text-pure-white">Himansh</span>
                  <span className="px-2 py-0.5 rounded bg-surface-variant/20 text-surface-variant font-label-sm text-label-sm uppercase font-bold tracking-wider">Himalaya</span>
                </div>
                <div className="flex flex-col text-code-sm font-code-sm text-glacial-sky">
                  <span className="">32°24′N, 77°36′E</span>
                  <span className="text-pure-white/80 font-body-sm text-body-sm pt-1">Spiti Valley (4,000m)</span>
                </div>
                <div className="pt-2 mt-auto border-t border-white/10 flex items-center justify-between text-label-sm font-label-sm text-ice-white">
                  <span className="">Temp: -9.5°C</span>
                  <span className="">Snow: 142 cm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SCIENCE-TO-OUTREACH WORKFLOW */}
      <section className="w-full bg-surface-container py-16">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
          <div className="flex flex-col items-center text-center gap-3 max-w-3xl mx-auto">
            <span className="px-4 py-1.5 rounded-full bg-surface-container-high text-secondary font-label-sm text-label-sm font-bold uppercase tracking-widest border border-surface-variant">
              The Innovation Framework
            </span>
            <h2 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep">
              From Rigorous Research to Verified Public Outreach
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Bridging technical cryospheric datasets from remote MoES bases into accessible, grounded science for schools, universities, and policy makers without hallucination.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
            <div className="hidden lg:block absolute top-8 left-10 right-10 h-0.5 bg-surface-variant z-0"></div>
            
            {/* STEP 1 */}
            <div className="p-5 rounded-2xl bg-pure-white shadow-sm border border-surface-variant flex flex-col gap-4 relative z-10 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-polar-midnight-deep text-pure-white flex items-center justify-center font-title-md font-bold shadow-md">1</div>
              <div className="flex flex-col gap-1.5 pt-2">
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Science</span>
                <h3 className="font-title-md text-title-md font-bold text-polar-midnight-deep leading-tight">Research Source</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Research, reports, datasets and field observations vetted by MoES & NCPOR.
                </p>
              </div>
            </div>
            
            {/* STEP 2 */}
            <div className="p-5 rounded-2xl bg-pure-white shadow-sm border border-surface-variant flex flex-col gap-4 relative z-10 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-polar-midnight-deep text-pure-white flex items-center justify-center font-title-md font-bold shadow-md">2</div>
              <div className="flex flex-col gap-1.5 pt-2">
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Discovery</span>
                <h3 className="font-title-md text-title-md font-bold text-polar-midnight-deep leading-tight">Semantic Graph</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Find connected knowledge from one searchable repository and geodetic hub.
                </p>
              </div>
            </div>
            
            {/* STEP 3 */}
            <div className="p-5 rounded-2xl bg-pure-white shadow-md border-2 border-azure-accent flex flex-col gap-4 relative z-10 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-azure-accent text-pure-white flex items-center justify-center font-title-md font-bold shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1.5 pt-2">
                <span className="font-label-sm text-label-sm text-azure-accent font-bold uppercase tracking-wider">Source-Grounded AI</span>
                <h3 className="font-title-md text-title-md font-bold text-polar-midnight-deep leading-tight">Understand</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Understand information using retrieved repository sources with strict citations.
                </p>
              </div>
            </div>
            
            {/* STEP 4 */}
            <div className="p-5 rounded-2xl bg-pure-white shadow-sm border border-surface-variant flex flex-col gap-4 relative z-10 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-polar-midnight-deep text-pure-white flex items-center justify-center font-title-md font-bold shadow-md">4</div>
              <div className="flex flex-col gap-1.5 pt-2">
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Outreach</span>
                <h3 className="font-title-md text-title-md font-bold text-polar-midnight-deep leading-tight">Content Studio</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Turn scientific findings into audience-ready content for schools and media.
                </p>
              </div>
            </div>
            
            {/* STEP 5 */}
            <div className="p-5 rounded-2xl bg-pure-white shadow-sm border border-surface-variant flex flex-col gap-4 relative z-10 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-aurora-emerald text-pure-white flex items-center justify-center font-title-md font-bold shadow-md">
                <Gavel className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1.5 pt-2">
                <span className="font-label-sm text-label-sm text-aurora-emerald font-bold uppercase tracking-wider">Human Review</span>
                <h3 className="font-title-md text-title-md font-bold text-polar-midnight-deep leading-tight">Publication</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Review and approve AI-generated drafts before disseminating scientific communication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. AI PROMOTION BANNER */}
      <section className="w-full bg-surface-container pb-16">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8">
          <div className="p-8 lg:p-10 rounded-3xl bg-polar-midnight-deep text-pure-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden" id="ai-assistant">
            <div className="absolute top-0 right-0 w-64 h-64 bg-azure-accent opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="flex items-start gap-6 max-w-3xl relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-azure-accent/20 text-glacial-sky flex items-center justify-center shrink-0 border border-azure-accent/30 shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                <Bot className="w-8 h-8" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-headline-sm md:text-2xl font-bold">Ask Polar AI</h2>
                  <span className="px-3 py-1 rounded-full bg-draft-amber-bg text-draft-amber-text font-label-sm text-label-sm font-bold shadow-sm">Source-Grounded AI</span>
                </div>
                <p className="font-body-md text-body-md md:text-lg text-pure-white/80 leading-relaxed">
                  Explore polar science through answers grounded in the PolarSetu knowledge repository. Every response links to exact document pages, diary entries, and sample catalogs.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0 relative z-10 w-full lg:w-auto">
              <Link to="/ai" className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-glacial-sky text-polar-midnight-deep font-title-md font-bold hover:bg-pure-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                <MessageSquare className="w-5 h-5" />
                <span>Ask Polar AI</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. POLAR STORIES / MEDIA */}
      <section className="w-full bg-surface-container-low py-16 border-t border-surface-variant">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-2 max-w-2xl">
              <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Field Media & Cryospheric Imagery</span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep">Polar Stories</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Verified visual dispatches from NCPOR research teams operating on polar ice floes, glaciological summits, and Antarctic research vessels.
              </p>
            </div>
            <Link to="/media" className="inline-flex items-center gap-1 text-secondary font-title-md font-bold hover:text-polar-midnight-deep transition-colors bg-surface-container hover:bg-surface-container-high px-4 py-2 rounded-lg">
              <span>Explore Media</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* HERO MEDIA CARD */}
            <div className="lg:col-span-7 flex flex-col rounded-2xl overflow-hidden bg-pure-white shadow-sm border border-surface-variant group relative block">
              <div className="relative h-[400px] w-full overflow-hidden">
                <img alt="Bharati station panoramic view under clear polar skies" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZlU0zKQ2fFmf3pyyxCzDmnJXg5L2Xj5SFAtHGSFS24kA0Gy58tAoWbTbUXqoGsekW5ZGVs6dqXXl-slkh9BnQJrowMjTnI9nnGQRWqDnG5dNYMPMEn_sLqSiNuzu-5lmTWUBYAQp6sygCs2C6UWIy4P03eL-w0hWfXwd3WJQ8kwAFp1kB-SnFBBPtQBDHatOHRxJKYaehqvpc6OmwpbpKPRQdMGzgI3cP85LtHag7OJP7QoCs2NerDA" />
                <div className="absolute inset-0 bg-gradient-to-t from-polar-midnight-deep/90 via-polar-midnight-deep/20 to-transparent"></div>
                <div className="absolute top-5 left-5 px-3 py-1.5 rounded-lg bg-polar-midnight-deep/80 text-pure-white font-label-sm uppercase font-bold tracking-wider backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                  <Camera className="w-4 h-4" /> Station Profile
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2 text-pure-white">
                  <span className="font-code-sm font-bold text-glacial-sky tracking-wide">Antarctica • Larsemann Hills</span>
                  <h3 className="font-headline-md text-2xl font-bold leading-tight">
                    Life and Rigorous Science at Bharati Station
                  </h3>
                </div>
              </div>
              <Link to="/media" className="absolute inset-0 z-10"><span className="sr-only">View Media</span></Link>
            </div>

            {/* SECONDARY MEDIA CARDS */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="flex flex-col rounded-2xl overflow-hidden bg-pure-white shadow-sm border border-surface-variant group relative h-[188px]">
                <div className="relative h-full w-full overflow-hidden">
                  <img alt="Expedition vessel breaking through pack ice" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV_C6b5zrKkQSFIhMOvZZn6R1_m0viH4zJ6telQyT419UgjW68niXGtanxETA0KhUkk7u7ZDCRoo8G_3TX4uRj7IjyjCh1KhhfLBb7VNFm0b5XBUenvylXHIxgPQW5bL-mL8EWZ5H1IoPPjf8WVP4Gg8OLjhDrnAplWyW9F1Fqxewx6cTtETEK9t63P0vpIAzj9pOGuAUmkp_145lHVXmNB39MGwf1_-kTM_ja55If4ejn8Uw_t6rMIw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-polar-midnight-deep/90 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-polar-midnight-deep/80 text-pure-white font-label-sm uppercase font-bold tracking-wider backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                    <PlayCircle className="w-3.5 h-3.5" /> Southern Ocean
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1 text-pure-white">
                    <span className="font-code-sm text-glacial-sky font-bold tracking-wide">Vessel Operations</span>
                    <h4 className="font-title-md font-bold leading-snug">Navigating Pack Ice in Prydz Bay</h4>
                  </div>
                </div>
                <Link to="/media" className="absolute inset-0 z-10"><span className="sr-only">View Media</span></Link>
              </div>

              <div className="flex flex-col rounded-2xl overflow-hidden bg-pure-white shadow-sm border border-surface-variant group relative h-[188px]">
                <div className="relative h-full w-full overflow-hidden">
                  <img alt="Glaciology researchers drilling ice cores in Svalbard" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDB96sKfj2s1GP-c4K4liF32nJk6pqICs30jsSS1NnNd5dzn4ykdY0PyEOGQGyci-tWIbPkpGZNDPBgTXzxXGGr3elVT4A7ujheEbfdvpBDzu13jOxlU0GSgwsnizLarYDOymKsDbyYWRzYSAMiCXID7VzCUsIEIQ1znRyY9FIyODNc14oNsWRL17GHi2WhyUnLpa-j40NYGS0pB8F7qsL4sbyO-IoSP2c8FRtD1Dsp3c5de68u1EvlYw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-polar-midnight-deep/90 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-polar-midnight-deep/80 text-pure-white font-label-sm uppercase font-bold tracking-wider backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                    <Camera className="w-3.5 h-3.5" /> Arctic Fieldwork
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1 text-pure-white">
                    <span className="font-code-sm text-glacial-sky font-bold tracking-wide">Ny-Ålesund, Norway</span>
                    <h4 className="font-title-md font-bold leading-snug">Ice Core Biogeochemistry</h4>
                  </div>
                </div>
                <Link to="/media" className="absolute inset-0 z-10"><span className="sr-only">View Media</span></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="w-full bg-surface-container py-20 text-center border-t border-surface-variant relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
        <div className="max-w-3xl mx-auto px-4 flex flex-col items-center gap-6 relative z-10">
          <span className="w-16 h-1.5 bg-secondary rounded-full mb-2"></span>
          <h2 className="font-display-hero text-4xl md:text-5xl font-bold text-polar-midnight-deep">Explore the Knowledge of India's Polar Research</h2>
          <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Discover expeditions, scientific resources, media and source-grounded tools built to connect polar research with wider audiences.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-6">
            <Link to="/explore" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-polar-midnight-deep text-pure-white font-title-md font-bold shadow-xl hover:shadow-2xl hover:bg-polar-navy-surface hover:-translate-y-0.5 transition-all">
              <Compass className="w-5 h-5 text-glacial-sky" />
              <span>Explore Polar Research</span>
            </Link>
            <Link to="/ai" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-pure-white border-2 border-surface-variant text-secondary font-title-md font-bold hover:bg-surface-container hover:border-secondary transition-all shadow-sm">
              <Sparkles className="w-5 h-5" />
              <span>Ask Polar AI</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
