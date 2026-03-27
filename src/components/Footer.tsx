const pageLinks = ["Home", "About", "Portfolio", "Services", "Contact"];

const socials = [
  { name: "Twitter (X)", href: "#" },
  { name: "Instagram", href: "#" },
  { name: "Pinterest", href: "#" },
  { name: "LinkedIn", href: "#" },
];

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <a href="#" className="text-2xl font-bold tracking-tight text-white">
              Ambassadors<span className="text-primary">.</span>
            </a>
            <p className="mt-4 text-text-muted text-sm leading-relaxed max-w-xs">
              Where great brands come to life. Premium branding, design, and
              printing solutions for businesses worldwide.
            </p>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-text-muted mb-4">
              Pages
            </h4>
            <ul className="space-y-3">
              {pageLinks.map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    className="text-sm text-text-muted hover:text-white transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-text-muted mb-4">
              Social
            </h4>
            <ul className="space-y-3">
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    className="text-sm text-text-muted hover:text-white transition-colors"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 px-6 text-center">
        <p className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Ambassadors Agency. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
