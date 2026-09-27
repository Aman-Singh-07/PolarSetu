import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight as ArrowRightIcon, Compass, Sparkles, Globe2, BadgeCheck, MapPin, CheckCircle2, ExternalLink, Download as DownloadIcon, Database as DatabaseIcon, FileText, Map as MapIcon2, Bot, MessageSquare, Edit3, School, Gavel } from 'lucide-react';

export default function Home() {
  const [activeResearchTab, setActiveResearchTab] = useState('all');

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION WITH FULL-BLEED POLAR BACKGROUND */}
      <section className="relative w-full overflow-hidden bg-polar-midnight-deep text-pure-white -mt-20 pt-28 pb-10">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Bharati Antarctic Station and Larsemann Hills Research Facility" 
            className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-110" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZlU0zKQ2fFmf3pyyxCzDmnJXg5L2Xj5SFAtHGSFS24kA0Gy58tAoWbTbUXqoGsekW5ZGVs6dqXXl-slkh9BnQJrowMjTnI9nnGQRWqDnG5dNYMPMEn_sLqSiNuzu-5lmTWUBYAQp6sygCs2C6UWIy4P03eL-w0hWfXwd3WJQ8kwAFp1kB-SnFBBPtQBDHatOHRxJKYaehqvpc6OmwpbpKPRQdMGzgI3cP85LtHag7OJP7QoCs2NerDA" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-polar-midnight-deep/95 via-polar-midnight-deep/80 to-polar-midnight-deep/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-polar-midnight-deep via-transparent to-polar-midnight-deep/50"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low/20 backdrop-blur-md text-glacial-sky font-label-sm text-label-sm uppercase tracking-widest shadow-sm">
              <span className="w-2 h-2 rounded-full bg-aurora-emerald animate-pulse"></span>
              SIH26063 • MoES & NCPOR Integration Layer
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pure-white/10 backdrop-blur-sm text-ice-white font-code-sm text-code-sm">
              <Globe2 className="w-4 h-4" /> 3 Polar Realms: Arctic, Antarctic & Himalayas
            </span>
          </div>
          
          <div className="max-w-3xl flex flex-col gap-2">
            <h1 className="font-display-hero text-[32px] md:text-[48px] font-bold tracking-tight text-pure-white leading-tight">
              Discover India's <span className="text-transparent bg-clip-text bg-gradient-to-r from-glacial-sky via-secondary-container to-pure-white">Polar Science</span>
            </h1>
            <p className="font-body-lg text-body-lg text-inverse-primary leading-relaxed">
              Explore expeditions, research datasets, peer-reviewed publications and field discoveries from India's pioneering missions across the Antarctic ice sheets, the high Arctic fjords, and the Third Pole.
            </p>
          </div>
          
          {/* SEARCH CARD COMPONENT */}
          <div className="w-full max-w-4xl p-4 rounded-xl bg-pure-white/95 backdrop-blur-xl shadow-xl flex flex-col gap-2 text-on-surface">
            <div className="flex items-center gap-2 bg-surface-container-low px-4 py-3 rounded-lg">
              <SearchIcon className="text-secondary w-6 h-6" />
              <input 
                className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none" 
                placeholder="Search expeditions, publications, datasets, reports... (e.g. 'sea ice', 'Maitri station', 'glaciology')" 
                type="text" 
              />
              <Link to="/explore" className="inline-flex items-center gap-1 px-4 py-2 rounded-md bg-polar-midnight-deep text-pure-white font-label-md text-label-md hover:bg-polar-navy-surface transition-colors shadow-sm">
                <span>Query</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex flex-wrap items-center gap-1 text-label-sm font-label-sm">
                <span className="text-on-surface-variant font-semibold uppercase tracking-wider mr-1">Quick Filters:</span>
                <button className="px-3 py-1 rounded-full bg-polar-midnight-deep text-pure-white transition-colors">All</button>
                <button className="px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors">Reports</button>
                <button className="px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors">Datasets</button>
                <button className="px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors">Publications</button>
                <button className="px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors">Expeditions</button>
                <button className="px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors">Media</button>
              </div>
              <span className="font-code-sm text-code-sm text-on-surface-variant flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5 text-aurora-emerald" /> FAIR & Open Access
              </span>
            </div>
          </div>
          
          {/* PRIMARY ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/expeditions" className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-polar-midnight-deep text-pure-white font-title-md text-title-md hover:bg-polar-navy-surface shadow-md hover:shadow-lg transition-all">
              <Compass className="w-5 h-5 text-glacial-sky" />
              <span>Explore Polar Research</span>
            </Link>
            <Link to="/ai" className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-surface-container-low/20 backdrop-blur-md text-glacial-sky font-title-md text-title-md hover:bg-surface-container-low/30 transition-all shadow-sm border border-pure-white/10">
              <Sparkles className="w-5 h-5" />
              <span>Ask Polar AI</span>
            </Link>
            <div className="hidden lg:flex items-center gap-2 pl-4 text-inverse-primary text-body-sm font-body-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-glacial-sky"></span>
              <span>Station Telemetry & Field Repositories Synchronized</span>
            </div>
          </div>
        </div>
      </section>

      {/* KEY PLATFORM STATISTICS STRIP */}
      <section className="w-full bg-pure-white shadow-sm relative z-20">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1 text-secondary">
                <Compass className="w-5 h-5" />
                <span className="font-headline-md text-headline-md font-bold text-polar-midnight-deep">Featured</span>
              </div>
              <span className="font-title-md text-title-md font-semibold text-on-surface">43rd Indian Scientific Expedition (ISEA-43)</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-glacial-sky"></span> Prototype Demonstration Data
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1 text-secondary">
                <FileText className="w-5 h-5" />
                <span className="font-headline-md text-headline-md font-bold text-polar-midnight-deep">186+</span>
              </div>
              <span className="font-title-md text-title-md font-semibold text-on-surface">Published Studies (Demo)</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Indexed with CrossRef DOIs</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1 text-secondary">
                <DatabaseIcon className="w-5 h-5" />
                <span className="font-headline-md text-headline-md font-bold text-polar-midnight-deep">320+</span>
              </div>
              <span className="font-title-md text-title-md font-semibold text-on-surface">Research Resources (Demo)</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Open NCPOR Field Archives</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1 text-secondary">
                <MapIcon2 className="w-5 h-5" />
                <span className="font-headline-md text-headline-md font-bold text-polar-midnight-deep">540+</span>
              </div>
              <span className="font-title-md text-title-md font-semibold text-on-surface">Media Assets (Demo)</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">High-res cryospheric photos</span>
            </div>
            <div className="col-span-2 md:col-span-1 flex flex-col gap-0.5">
              <div className="flex items-center gap-1 text-secondary">
                <Globe2 className="w-5 h-5" />
                <span className="font-headline-md text-headline-md font-bold text-polar-midnight-deep">4 Bases</span>
              </div>
              <span className="font-title-md text-title-md font-semibold text-on-surface">Indian Polar Research Stations</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Antarctica • Arctic • Himalaya</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SECTION: EXPLORE POLAR EXPEDITIONS */}
      <section className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-10 flex flex-col gap-6" id="expeditions">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-label-sm uppercase tracking-wider font-semibold">Active & Archived Missions</span>
              <span className="font-code-sm text-code-sm text-outline">MoES Polar Science Division</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep">Explore Polar Expeditions</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Traverse detailed field documentation, logistical reports, participant rosters, and physical oceanography from India's polar expeditions spanning the Southern Ocean, Svalbard, and the Larsemann Hills.
            </p>
          </div>
          <Link to="/expeditions" className="inline-flex items-center gap-1 text-secondary font-title-md text-title-md hover:text-polar-midnight-deep transition-colors">
            <span>View all 44 Expeditions</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 RICH EXPEDITION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* CARD 1 */}
          <article className="flex flex-col rounded-xl bg-pure-white shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative h-56 w-full overflow-hidden">
              <img alt="Bharati Base in Larsemann Hills Antarctica" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZlU0zKQ2fFmf3pyyxCzDmnJXg5L2Xj5SFAtHGSFS24kA0Gy58tAoWbTbUXqoGsekW5ZGVs6dqXXl-slkh9BnQJrowMjTnI9nnGQRWqDnG5dNYMPMEn_sLqSiNuzu-5lmTWUBYAQp6sygCs2C6UWIy4P03eL-w0hWfXwd3WJQ8kwAFp1kB-SnFBBPtQBDHatOHRxJKYaehqvpc6OmwpbpKPRQdMGzgI3cP85LtHag7OJP7QoCs2NerDA" />
              <div className="absolute top-4 left-4 flex items-center gap-1">
                <span className="px-2 py-0.5 rounded bg-polar-midnight-deep/90 text-pure-white font-label-sm text-label-sm uppercase tracking-wide">Antarctica</span>
                <span className="px-2 py-0.5 rounded bg-pure-white/90 text-on-surface font-label-sm text-label-sm font-semibold">43rd ISEA</span>
              </div>
              <div className="absolute bottom-4 right-4 px-2 py-0.5 rounded bg-surface-container-lowest/90 text-polar-midnight-deep font-code-sm text-code-sm">
                2023–2024 Season
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1 justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span>Larsemann Hills & Schirmacher Oasis</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep group-hover:text-secondary transition-colors">
                  43rd Indian Scientific Expedition to Antarctica
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                  Comprehensive meteorological, geophysical, and cryospheric investigations. Deployment of advanced automated weather stations, deep ice-core extraction, and geological baseline mapping.
                </p>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-surface-container-low text-center">
                  <div>
                    <span className="block font-headline-sm text-headline-sm font-bold text-polar-midnight-deep">48</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Scientists</span>
                  </div>
                  <div>
                    <span className="block font-headline-sm text-headline-sm font-bold text-polar-midnight-deep">14</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Reports</span>
                  </div>
                  <div>
                    <span className="block font-headline-sm text-headline-sm font-bold text-polar-midnight-deep">8</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Datasets</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-label-sm text-label-sm text-aurora-emerald font-semibold uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Mission Archived
                  </span>
                  <Link to="/expeditions/EXP-43" className="inline-flex items-center gap-1 text-secondary font-label-md text-label-md font-semibold hover:underline">
                    Dossier & Data <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
          
          {/* CARD 2 */}
          <article className="flex flex-col rounded-xl bg-pure-white shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative h-56 w-full overflow-hidden">
              <img alt="Arctic" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDB96sKfj2s1GP-c4K4liF32nJk6pqICs30jsSS1NnNd5dzn4ykdY0PyEOGQGyci-tWIbPkpGZNDPBgTXzxXGGr3elVT4A7ujheEbfdvpBDzu13jOxlU0GSgwsnizLarYDOymKsDbyYWRzYSAMiCXID7VzCUsIEIQ1znRyY9FIyODNc14oNsWRL17GHi2WhyUnLpa-j40NYGS0pB8F7qsL4sbyO-IoSP2c8FRtD1Dsp3c5de68u1EvlYw" />
              <div className="absolute top-4 left-4 flex items-center gap-1">
                <span className="px-2 py-0.5 rounded bg-polar-midnight-deep/90 text-pure-white font-label-sm text-label-sm uppercase tracking-wide">Arctic</span>
                <span className="px-2 py-0.5 rounded bg-pure-white/90 text-on-surface font-label-sm text-label-sm font-semibold">16th IN-ARCTIC</span>
              </div>
              <div className="absolute bottom-4 right-4 px-2 py-0.5 rounded bg-surface-container-lowest/90 text-polar-midnight-deep font-code-sm text-code-sm">
                2024–2025 Ongoing
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1 justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span>Ny-Ålesund, Svalbard (78°55′N)</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep group-hover:text-secondary transition-colors">
                  16th Indian Arctic Expedition & Kongsfjorden Mooring
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                  Long-term atmospheric ozone profiling, aerosol characterization at Himadri, and multi-sensor water column profiling using the IndARC underwater mooring system.
                </p>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-surface-container-low text-center">
                  <div>
                    <span className="block font-headline-sm text-headline-sm font-bold text-polar-midnight-deep">24</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Winter Crew</span>
                  </div>
                  <div>
                    <span className="block font-headline-sm text-headline-sm font-bold text-polar-midnight-deep">9</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Field Logs</span>
                  </div>
                  <div>
                    <span className="block font-headline-sm text-headline-sm font-bold text-polar-midnight-deep">12</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Live Streams</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-label-sm text-label-sm text-azure-accent font-semibold uppercase flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-azure-accent animate-ping"></span> Active Sampling
                  </span>
                  <Link to="/expeditions/EXP-ARC-15" className="inline-flex items-center gap-1 text-secondary font-label-md text-label-md font-semibold hover:underline">
                    Dossier & Data <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
          
          {/* CARD 3 */}
          <article className="flex flex-col rounded-xl bg-pure-white shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative h-56 w-full overflow-hidden">
              <img alt="Southern Ocean" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV_C6b5zrKkQSFIhMOvZZn6R1_m0viH4zJ6telQyT419UgjW68niXGtanxETA0KhUkk7u7ZDCRoo8G_3TX4uRj7IjyjCh1KhhfLBb7VNFm0b5XBUenvylXHIxgPQW5bL-mL8EWZ5H1IoPPjf8WVP4Gg8OLjhDrnAplWyW9F1Fqxewx6cTtETEK9t63P0vpIAzj9pOGuAUmkp_145lHVXmNB39MGwf1_-kTM_ja55If4ejn8Uw_t6rMIw" />
              <div className="absolute top-4 left-4 flex items-center gap-1">
                <span className="px-2 py-0.5 rounded bg-polar-midnight-deep/90 text-pure-white font-label-sm text-label-sm uppercase tracking-wide">Southern Ocean</span>
                <span className="px-2 py-0.5 rounded bg-pure-white/90 text-on-surface font-label-sm text-label-sm font-semibold">SO-CRUISE 2024</span>
              </div>
              <div className="absolute bottom-4 right-4 px-2 py-0.5 rounded bg-surface-container-lowest/90 text-polar-midnight-deep font-code-sm text-code-sm">
                Oceanographic Cruise
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1 justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span>Southern Ocean Sub-polar Front (40°S to 68°S)</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-polar-midnight-deep group-hover:text-secondary transition-colors">
                  Southern Ocean Oceanographic & Carbon Sink Survey
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                  Dedicated marine biogeochemical transit on research vessels. Deep CTD casts, dissolved organic carbon sampling, and acoustic doppler current profiling across the Antarctic Circumpolar Current.
                </p>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-surface-container-low text-center">
                  <div>
                    <span className="block font-headline-sm text-headline-sm font-bold text-polar-midnight-deep">22</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">CTD Stations</span>
                  </div>
                  <div>
                    <span className="block font-headline-sm text-headline-sm font-bold text-polar-midnight-deep">3,400</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Naut. Miles</span>
                  </div>
                  <div>
                    <span className="block font-headline-sm text-headline-sm font-bold text-polar-midnight-deep">5</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Institutes</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-label-sm text-label-sm text-aurora-emerald font-semibold uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> MoES Validated
                  </span>
                  <Link to="/expeditions" className="inline-flex items-center gap-1 text-secondary font-label-md text-label-md font-semibold hover:underline">
                    Cruise Logs <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* POLAR RESEARCH AT A GLANCE (SEGMENTED TABS) */}
      <section className="w-full bg-surface-container-low py-10">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Scientific Records Repository</span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep">Polar Research at a Glance</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                Direct gateway to verified NCPOR cryospheric inventories, technical debriefs, and international open peer reviews.
              </p>
            </div>
            {/* SEGMENTED CONTROLS */}
            <div className="inline-flex p-1 rounded-lg bg-pure-white shadow-sm">
              <button onClick={() => setActiveResearchTab('all')} className={`px-4 py-2 rounded-md font-label-md text-label-md transition-colors ${activeResearchTab === 'all' ? 'font-semibold text-pure-white bg-polar-midnight-deep shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>All Outputs</button>
              <button onClick={() => setActiveResearchTab('reports')} className={`px-4 py-2 rounded-md font-label-md text-label-md transition-colors ${activeResearchTab === 'reports' ? 'font-semibold text-pure-white bg-polar-midnight-deep shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Reports</button>
              <button onClick={() => setActiveResearchTab('datasets')} className={`px-4 py-2 rounded-md font-label-md text-label-md transition-colors ${activeResearchTab === 'datasets' ? 'font-semibold text-pure-white bg-polar-midnight-deep shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Datasets</button>
              <button onClick={() => setActiveResearchTab('publications')} className={`px-4 py-2 rounded-md font-label-md text-label-md transition-colors ${activeResearchTab === 'publications' ? 'font-semibold text-pure-white bg-polar-midnight-deep shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Publications</button>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            {/* ITEM 1: DATASET */}
            {(activeResearchTab === 'all' || activeResearchTab === 'datasets') && (
              <div className="p-4 rounded-xl bg-pure-white shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
                    <DatabaseIcon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary font-code-sm text-code-sm font-semibold">Dataset • NPDC-DS-8821</span>
                      <span className="px-2 py-0.5 rounded bg-ice-white text-on-surface-variant font-label-sm text-label-sm">Antarctica • Prydz Bay</span>
                      <span className="text-outline font-label-sm text-label-sm">Updated 14 Feb 2025</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-semibold text-polar-midnight-deep hover:text-secondary cursor-pointer transition-colors">
                      Antarctic Sea Ice Thickness & Albedo Dynamics in Prydz Bay (2024)
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant max-w-3xl">
                      Continuous ground-penetrating radar profiling coupled with calibrated MODIS surface reflectance metrics along the Bharati coastal fast-ice corridor. Raw NetCDF-4 format.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 lg:flex-col lg:items-end justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-surface-container text-polar-midnight-deep font-code-sm text-code-sm">1.82 GB</span>
                    <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm uppercase font-semibold">CC-BY 4.0</span>
                  </div>
                  <Link to="/research/1" className="inline-flex items-center gap-1 text-secondary font-label-md text-label-md font-semibold hover:underline">
                    Download NetCDF <DownloadIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
            
            {/* ITEM 2: PUBLICATION */}
            {(activeResearchTab === 'all' || activeResearchTab === 'publications') && (
              <div className="p-4 rounded-xl bg-pure-white shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-azure-accent shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-azure-accent font-code-sm text-code-sm font-semibold">Publication • J. Geophys. Res</span>
                      <span className="px-2 py-0.5 rounded bg-ice-white text-on-surface-variant font-label-sm text-label-sm">Arctic • Himadri Station</span>
                      <span className="text-outline font-label-sm text-label-sm">Published Jan 2025</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-semibold text-polar-midnight-deep hover:text-secondary cursor-pointer transition-colors">
                      Atmospheric Trace Gas Variations at Himadri Arctic Station: Decade-Long Trends
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant max-w-3xl">
                      Dr. R. Sharma, Dr. P. K. Joshi et al. Longitudinal observational record of tropospheric halogens and black carbon transport from mid-latitudes into the Ny-Ålesund international research hub.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 lg:flex-col lg:items-end justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-surface-container text-on-surface font-code-sm text-code-sm">doi:10.1029/2024JD041920</span>
                  </div>
                  <Link to="/research/2" className="inline-flex items-center gap-1 text-secondary font-label-md text-label-md font-semibold hover:underline">
                    Access Full Paper <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
            
            {/* ITEM 3: REPORT */}
            {(activeResearchTab === 'all' || activeResearchTab === 'reports') && (
              <div className="p-4 rounded-xl bg-pure-white shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-aurora-emerald shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-aurora-emerald font-code-sm text-code-sm font-semibold">Technical Report • MoES-TR-41</span>
                      <span className="px-2 py-0.5 rounded bg-ice-white text-on-surface-variant font-label-sm text-label-sm">Dronning Maud Land</span>
                      <span className="text-outline font-label-sm text-label-sm">NCPOR Technical Series</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-semibold text-polar-midnight-deep hover:text-secondary cursor-pointer transition-colors">
                      Glacial Bed Topography and Sub-ice Topography near Schirmacher Oasis
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant max-w-3xl">
                      Synthesis of airborne radio-echo sounding and seismological transects between Maitri station and the polar plateau ice divide, detailing subglacial hydrological networks and permafrost depths.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 lg:flex-col lg:items-end justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-surface-container text-polar-midnight-deep font-code-sm text-code-sm">PDF • 44 Pages</span>
                  </div>
                  <Link to="/research/3" className="inline-flex items-center gap-1 text-secondary font-label-md text-label-md font-semibold hover:underline">
                    Download Report <DownloadIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* INNOVATION FRAMEWORK */}
      <section className="w-full bg-surface-container py-10">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-10">
          <div className="flex flex-col items-center text-center gap-2 max-w-3xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-surface-container-high text-secondary font-label-sm text-label-sm font-bold uppercase tracking-widest">
              The SIH26063 Innovation Framework
            </span>
            <h2 className="font-headline-lg text-headline-lg font-bold text-polar-midnight-deep">
              From Rigorous Research to Verified Public Outreach
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Bridging technical cryospheric datasets from remote MoES bases into accessible, grounded science for schools, universities, and policy makers without hallucination.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
            {/* STEP 1 */}
            <div className="p-4 rounded-xl bg-pure-white shadow-sm flex flex-col gap-4 relative">
              <div className="w-10 h-10 rounded-lg bg-polar-midnight-deep text-pure-white flex items-center justify-center font-headline-sm text-headline-sm font-bold">1</div>
              <div className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase">Primary Ingestion</span>
                <h3 className="font-title-md text-title-md font-bold text-polar-midnight-deep">Scientific Source</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Field expedition reports, cruise tracklogs, GPR soundings, and institutional publications vetted by MoES & NCPOR.
                </p>
              </div>
              <div className="mt-auto pt-2 font-code-sm text-code-sm text-outline flex items-center gap-1">
                <BadgeCheck className="w-4 h-4 text-aurora-emerald" /> FAIR & ISO/TC 211
              </div>
            </div>
            
            {/* STEP 2 */}
            <div className="p-4 rounded-xl bg-pure-white shadow-sm flex flex-col gap-4 relative">
              <div className="w-10 h-10 rounded-lg bg-polar-midnight-deep text-pure-white flex items-center justify-center font-headline-sm text-headline-sm font-bold">2</div>
              <div className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase">Semantic Graph</span>
                <h3 className="font-title-md text-title-md font-bold text-polar-midnight-deep">Relational Indexing</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Automated extraction of geographic coordinates, mission years, scientific disciplines, and sensor metadata.
                </p>
              </div>
              <div className="mt-auto pt-2 font-code-sm text-code-sm text-outline flex items-center gap-1">
                Vector & Geodetic Hub
              </div>
            </div>
            
            {/* STEP 3 */}
            <div className="p-4 rounded-xl bg-pure-white shadow-sm flex flex-col gap-4 relative">
              <div className="w-10 h-10 rounded-lg bg-azure-accent text-pure-white flex items-center justify-center font-headline-sm text-headline-sm font-bold">3</div>
              <div className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-azure-accent font-bold uppercase">Inference Layer</span>
                <h3 className="font-title-md text-title-md font-bold text-polar-midnight-deep">Grounded Polar AI</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Zero-hallucination RAG pipelines strictly referencing DOI documents, specific page paragraphs, and tabular metrics.
                </p>
              </div>
              <div className="mt-auto pt-2 font-code-sm text-code-sm text-outline flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-azure-accent" /> Strict Citations
              </div>
            </div>
            
            {/* STEP 4 */}
            <div className="p-4 rounded-xl bg-pure-white shadow-sm flex flex-col gap-4 relative">
              <div className="w-10 h-10 rounded-lg bg-polar-midnight-deep text-pure-white flex items-center justify-center font-headline-sm text-headline-sm font-bold">4</div>
              <div className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase">Content Studio</span>
                <h3 className="font-title-md text-title-md font-bold text-polar-midnight-deep">Outreach Engine</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Auto-generation of school curriculum worksheets, interactive infographics, media press releases, and multi-lingual summaries.
                </p>
              </div>
              <div className="mt-auto pt-2 font-code-sm text-code-sm text-outline flex items-center gap-1">
                <School className="w-4 h-4" /> Multi-Audience Modes
              </div>
            </div>
            
            {/* STEP 5 */}
            <div className="p-4 rounded-xl bg-pure-white shadow-sm flex flex-col gap-4 relative">
              <div className="w-10 h-10 rounded-lg bg-aurora-emerald text-pure-white flex items-center justify-center font-headline-sm text-headline-sm font-bold">5</div>
              <div className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-aurora-emerald font-bold uppercase">Final Clearance</span>
                <h3 className="font-title-md text-title-md font-bold text-polar-midnight-deep">Human Review Sign-off</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Editorial board validation by polar scientists before public broadcast. Fixed provenance and tamper-evident audit trails.
                </p>
              </div>
              <div className="mt-auto pt-2 font-code-sm text-code-sm text-outline flex items-center gap-1">
                <Gavel className="w-4 h-4 text-aurora-emerald" /> Editorial Governance
              </div>
            </div>
          </div>
          
          {/* AI ASSISTANT DEMO PROMO BANNER */}
          <div className="p-6 rounded-2xl bg-polar-midnight-deep text-pure-white shadow-md flex flex-col lg:flex-row items-center justify-between gap-6" id="ai-assistant">
            <div className="flex items-start gap-4 max-w-2xl">
              <div className="w-12 h-12 rounded-xl bg-azure-accent/20 text-glacial-sky flex items-center justify-center shrink-0">
                <Bot className="w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm font-bold">Ask Polar AI — Grounded Intelligence</span>
                  <span className="px-2 py-0.5 rounded bg-draft-amber-bg text-draft-amber-text font-label-sm text-label-sm font-bold">Source-Grounded AI</span>
                </div>
                <p className="font-body-sm text-body-sm text-inverse-primary leading-relaxed">
                  Query 40+ years of Indian Antarctic expedition reports directly. Every response links to exact MoES document pages, expedition diary entries, and physical sample catalogs.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <Link to="/ai" className="inline-flex items-center gap-2 px-4 py-3 rounded-md bg-glacial-sky text-polar-midnight-deep font-title-md text-title-md font-bold hover:bg-pure-white transition-all shadow-md">
                <MessageSquare className="w-5 h-5" />
                <span>Open AI Terminal</span>
              </Link>
              <Link to="/outreach" className="inline-flex items-center gap-2 px-4 py-3 rounded-md bg-polar-navy-surface text-ice-white font-title-md text-title-md hover:bg-surface-container-high/20 transition-all">
                <Edit3 className="w-5 h-5" />
                <span>Launch Outreach Studio</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
