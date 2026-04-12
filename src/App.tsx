import { useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Results from "./components/Results";
import RecentWorks from "./components/RecentWorks";
import HowWeWork from "./components/HowWeWork";
import Features from "./components/Features";
import Services from "./components/Services";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";

export default function App() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let x = 0, y = 0, cx = 0, cy = 0;

    const onMouseMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    let raf: number;
    const animate = () => {
      cx += (x - cx) * 0.15;
      cy += (y - cy) * 0.15;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cx}px, ${cy}px)`;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark">
      <div
        ref={cursorRef}
        className="cursor-dot pointer-events-none fixed top-0 left-0 z-50 w-5 h-5 -ml-2.5 -mt-2.5 rounded-full border-2 border-primary-light opacity-70 hidden md:block"
      />
      <Navbar />
      <Hero />
      <About />
      <Results />
      <RecentWorks />
      <HowWeWork />
      <Features />
      <Services />
      <Reviews />
      <Footer />
      {/* Bottom blur overlay */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-[100px] z-40 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent" />
    </div>
  );
}
