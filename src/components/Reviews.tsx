const reviews = [
  {
    quote:
      "Ambassadors didn't just design our brand — they redefined how our audience sees us. Bold, strategic, and impactful. Our product visibility skyrocketed after the rebrand.",
    name: "Richards Johnson",
    role: "CEO of GreenRoots",
  },
  {
    quote:
      "Working with Ambassadors was seamless from start to finish. The attention to detail in our packaging design exceeded every expectation.",
    name: "Amara Okafor",
    role: "Founder, Bloom Naturals",
  },
  {
    quote:
      "Their team delivered a brand identity that truly represents who we are. Professional, creative, and always on time.",
    name: "David Chen",
    role: "Creative Director, PixelForge",
  },
];

export default function Reviews() {
  return (
    <section id="testimonials" className="py-20 md:py-28 px-6 bg-bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-primary/10 text-primary-light border border-primary/20">
            Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">
            What Our <span className="text-primary-light">Clients Say</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="p-8 rounded-2xl bg-bg-card border border-white/5 hover:border-primary/30 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 text-primary-light mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-text-muted text-sm leading-relaxed italic">
                &ldquo;{r.quote}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold text-sm">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-text-muted">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
