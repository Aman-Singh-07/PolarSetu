export default function Footer() {
  return (
    <footer className="bg-[#0B132B] text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-[1360px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display font-bold text-white text-lg mb-4">PolarSetu</h3>
            <p className="text-sm">India's Polar Science Knowledge & Outreach Platform.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/explore" className="hover:text-white transition">Knowledge Repository</a></li>
              <li><a href="/expeditions" className="hover:text-white transition">Expeditions</a></li>
              <li><a href="/map" className="hover:text-white transition">Polar Map</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Institutional</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">MoES</a></li>
              <li><a href="#" className="hover:text-white transition">NCPOR</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs text-slate-500 mt-8">
              Prototype Demonstration Data. Not for official operational use.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
