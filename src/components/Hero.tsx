const trustLogos = ["Canva", "Facebook", "Twitter", "Pinterest"];

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

        {/* Trust logos */}
        <div className="mt-16 flex items-center justify-center gap-8 opacity-40">
          {trustLogos.map((name) => (
            <span
              key={name}
              className="text-sm font-semibold tracking-wider uppercase text-text-muted"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
