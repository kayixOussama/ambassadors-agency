const projects = [
  { title: "Oconnecta", tag: "NEW", color: "bg-primary" },
  { title: "Oconnecta", tag: null, color: "bg-primary-light/20" },
  { title: "Oconnecta", tag: "REBRANDED", color: "bg-primary/60" },
];

// Duplicate for seamless infinite loop
const looped = [...projects, ...projects];

export default function RecentWorks() {
  return (
    <section id="projects" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-primary/10 text-primary-light border border-primary/20">
            Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">
            Recent <span className="text-primary-light">Works</span>
          </h2>
        </div>
      </div>

      {/* Marquee container */}
      <div className="marquee-wrapper overflow-hidden">
        <div
          className="animate-marquee flex gap-6 w-max"
          style={{ "--marquee-duration": "25s" } as React.CSSProperties}
        >
          {looped.map((p, i) => (
            <div
              key={i}
              className="group relative w-[340px] sm:w-[400px] aspect-[4/3] flex-shrink-0 rounded-2xl overflow-hidden bg-bg-card border border-white/5 hover:border-primary/30 transition-all"
            >
              <div className={`absolute inset-0 ${p.color} opacity-20`} />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-bg-dark/20 to-transparent" />

              {p.tag && (
                <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-primary text-white">
                  {p.tag}
                </span>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-lg font-bold">{p.title}</h3>
                <a
                  href="#"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-primary-light hover:underline"
                >
                  View Case Study
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
