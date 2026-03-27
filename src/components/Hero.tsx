const trustLogos = ["Canva", "Facebook", "Twitter", "Pinterest", "Shopify", "Dribbble"];

// Duplicate for seamless infinite loop
const loopedLogos = [...trustLogos, ...trustLogos];

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 overflow-hidden">
      {/* Gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[160px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase rounded-full bg-primary/10 text-primary-light border border-primary/20">
          Premium Branding &amp; Printing
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
          Where Great Brands
          <br />
          <span className="text-primary-light">Come to Life.</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
          From concept to print, we craft identities that captivate audiences
          and elevate businesses. Premium quality. Unforgettable results.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="px-8 py-3.5 rounded-full bg-primary text-white font-semibold hover:bg-primary-light transition-colors"
          >
            Get Started
          </a>
          <a
            href="#projects"
            className="px-8 py-3.5 rounded-full border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors"
          >
            See Projects
          </a>
        </div>

        {/* Trust logos — auto scroll */}
        <div className="mt-16">
          <p className="text-xs text-text-muted uppercase tracking-widest text-center mb-6 opacity-50">
            Trusted by teams at
          </p>
          <div className="marquee-wrapper overflow-hidden relative">
            {/* Edge fades */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-bg-dark to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-bg-dark to-transparent" />
            <div
              className="animate-marquee flex items-center gap-12 w-max"
              style={{ "--marquee-duration": "18s" } as React.CSSProperties}
            >
              {loopedLogos.map((name, i) => (
                <span
                  key={i}
                  className="text-sm font-semibold tracking-wider uppercase text-text-muted opacity-40 whitespace-nowrap"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
