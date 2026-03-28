import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 100, suffix: "+", label: "Projects Printed" },
  { value: 57, suffix: "+", label: "Brands Created" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const start = performance.now();

          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <p ref={ref} className="text-5xl md:text-6xl font-extrabold text-primary-light">
      {count}{suffix}
    </p>
  );
}

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
              <CountUp target={s.value} suffix={s.suffix} />
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
