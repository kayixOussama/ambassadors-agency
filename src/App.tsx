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
      <hr className="border-white/5 mx-6" />
      <About />
      <hr className="border-white/5 mx-6" />
      <Results />
      <hr className="border-white/5 mx-6" />
      <RecentWorks />
      <hr className="border-white/5 mx-6" />
      <HowWeWork />
      <hr className="border-white/5 mx-6" />
      <Features />
      <hr className="border-white/5 mx-6" />
      <Services />
      <hr className="border-white/5 mx-6" />
      <Reviews />
      <hr className="border-white/5 mx-6" />
      <Footer />
    </div>
  );
}
