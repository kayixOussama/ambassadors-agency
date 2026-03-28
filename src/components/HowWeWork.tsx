const steps = [
  {
    num: "01",
    title: "Kickoff",
    desc: "We align on goals, vision, and expectations — setting a strong foundation for every project.",
  },
  {
    num: "02",
    title: "Execution",
    desc: "Collaborative, high-efficiency implementation. We keep you in the loop while we bring ideas to life.",
  },
  {
    num: "03",
    title: "Handoff",
    desc: "Asset delivery, documentation, and smooth launch support — everything you need to hit the ground running.",
  },
];

export default function HowWeWork() {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-primary/10 text-primary-light border border-primary/20">
            Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">
            How We <span className="text-primary-light">Work</span>
          </h2>
          <p className="mt-4 text-lg text-text-muted max-w-xl mx-auto leading-relaxed">
            We Simplify The Journey From Design To Launch.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="relative p-8 rounded-2xl bg-bg-card border border-white/5 hover:border-primary/30 transition-colors group"
            >
              <span className="text-5xl font-extrabold text-primary/20 group-hover:text-primary/40 transition-colors">
                {s.num}
              </span>
              <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
              <p className="mt-3 text-text-muted text-sm leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
