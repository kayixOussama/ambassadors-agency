export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Image placeholder */}
        <div className="relative aspect-[4/3] rounded-2xl bg-bg-card overflow-hidden border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center text-text-muted text-sm">
            <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div>
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-primary/10 text-primary-light border border-primary/20">
            About Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            We Don&apos;t Just Print —<br />
            <span className="text-primary-light">We Build Brands.</span>
          </h2>
          <p className="mt-6 text-text-muted leading-relaxed">
            We are a team of passionate designers and print specialists dedicated
            to turning your vision into reality. Every project we touch is
            infused with creativity, strategy, and pixel-perfect execution.
          </p>

          <ul className="mt-8 space-y-4">
            <li className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-primary-light" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-text-muted">Worked with clients in <strong className="text-white">10+ countries</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-primary-light" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-text-muted">Over <strong className="text-white">a decade</strong> of experience in branding &amp; print</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
