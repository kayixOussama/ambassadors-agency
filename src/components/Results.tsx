const stats = [
  { value: "100+", label: "Projects Printed" },
  { value: "57+", label: "Brands Created" },
  { value: "98%", label: "Client Satisfaction" },
];

export default function Results() {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-primary/10 text-primary-light border border-primary/20">
          Our Impact
        </span>
        <h2 className="text-3xl md:text-4xl font-bold">
          Results That <span className="text-primary-light">Speak Volumes</span>
        </h2>

        <div className="mt-14 grid sm:grid-cols-3 gap-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="p-8 rounded-2xl bg-bg-card border border-white/5 hover:border-primary/30 transition-colors"
            >
              <p className="text-5xl md:text-6xl font-extrabold text-primary-light">
                {s.value}
              </p>
              <p className="mt-3 text-text-muted text-sm tracking-wide uppercase">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <a
          href="#contact"
          className="mt-12 inline-block px-8 py-3.5 rounded-full bg-primary text-white font-semibold hover:bg-primary-light transition-colors"
        >
          Get Started
        </a>
      </div>
    </section>
  );
}
