export default function Home() {
  return (
    <div className="space-y-12">
      <section className="bg-primary text-primary-foreground -mx-4 md:-mx-6 -mt-6 md:-mt-8 px-4 md:px-6 py-20 rounded-b-xl mb-12">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">India's Polar Science, Connected.</h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 font-sans">
            From Polar Research to Public Understanding. Discover expeditions, understand the evidence, and share the story.
          </p>
          <div className="flex gap-4">
            <a href="/explore" className="bg-secondary hover:bg-accent text-white px-6 py-3 rounded-md font-medium transition-colors">
              Explore Repository
            </a>
            <a href="/ai" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-md font-medium border border-white/20 transition-colors">
              Ask Polar AI
            </a>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-display font-semibold mb-6">Platform Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-border">
            <div className="text-3xl font-bold text-primary mb-1">45+</div>
            <div className="text-sm text-slate-500 font-medium">Expeditions Catalogued</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-border">
            <div className="text-3xl font-bold text-primary mb-1">1,200</div>
            <div className="text-sm text-slate-500 font-medium">Research Resources</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-border">
            <div className="text-3xl font-bold text-primary mb-1">3</div>
            <div className="text-sm text-slate-500 font-medium">Active Stations</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-border">
            <div className="text-3xl font-bold text-primary mb-1">8,500</div>
            <div className="text-sm text-slate-500 font-medium">Data Points</div>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-right">Prototype Demonstration Data</p>
      </section>
    </div>
  )
}
