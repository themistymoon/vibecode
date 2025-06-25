import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Philosophy } from "./components/Philosophy";
import { Experience } from "./components/Experience";
import { Skills } from "./components/Skills";
import { Vision } from "./components/Vision";
import { Contact } from "./components/Contact";
import { Navigation } from "./components/Navigation";
import { Cursor } from "./components/Cursor";

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isLoaded, setIsLoaded] = useState(false);
  const trackVisitor = useMutation(api.analytics.trackVisitor);
  const trackInteraction = useMutation(api.analytics.trackInteraction);
  const visitorCount = useQuery(api.analytics.getVisitorCount);

  useEffect(() => {
    // Track visitor
    trackVisitor({
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
    });

    // Set loaded state
    setTimeout(() => setIsLoaded(true), 500);

    // Intersection Observer for section tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setActiveSection(sectionId);
            trackInteraction({
              section: sectionId,
              action: "view",
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [trackVisitor, trackInteraction]);

  return (
    <div className={`min-h-screen bg-black text-white transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Cursor />
      <Navigation activeSection={activeSection} />
      
      <main className="relative">
        <Hero />
        <About />
        <Philosophy />
        <Experience />
        <Skills />
        <Vision />
        <Contact visitorCount={visitorCount} />
      </main>

      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}
