import { useState } from "react";

const links = ["Projects", "Services", "Testimonials", "Contact", "Shop"];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-bg-dark/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="text-2xl font-bold tracking-tight text-white">
          Ambassadors<span className="text-primary">.</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 text-sm text-text-muted">
          {links.map((l) => (
            <li key={l}>
              <a
                href={l === "Shop" ? "/shop.html" : `#${l.toLowerCase()}`}
                className="hover:text-white transition-colors"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contact"
          className="hidden md:inline-block px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors"
        >
          Get Started
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-bg-card border-t border-white/5 px-6 pb-6 pt-2">
          <ul className="flex flex-col gap-4 text-sm text-text-muted">
            {links.map((l) => (
              <li key={l}>
                <a
                  href={l === "Shop" ? "/shop.html" : `#${l.toLowerCase()}`}
                  className="hover:text-white transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="mt-4 inline-block px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold"
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
}
