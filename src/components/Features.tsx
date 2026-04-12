const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "10+ Years of Experience",
    desc: "Over a decade of combined expertise in branding, design, and print production.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Transformative Designs",
    desc: "We've helped businesses stand out with bold, strategic design that drives real results.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "300+ Designers Empowered",
    desc: "Our tools, templates, and mentorship have empowered hundreds of creative professionals worldwide.",
  },
];

export default function Features() {
  return (
    <section className="py-12 md:py-16 px-6 bg-bg-card/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-primary/10 text-primary-light border border-primary/20">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">
            Built on <span className="text-primary-light">Experience</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-8 rounded-2xl bg-bg-card border border-white/5 hover:border-primary/30 transition-colors"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary-light">
                {f.icon}
              </span>
              <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
              <p className="mt-3 text-text-muted text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#about"
            className="text-primary-light text-sm font-semibold hover:underline inline-flex items-center gap-1"
          >
            View More About Us
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
