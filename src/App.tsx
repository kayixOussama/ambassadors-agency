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
  return (
    <div className="min-h-screen bg-bg-dark">
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
    </div>
  );
}
