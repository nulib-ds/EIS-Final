import { useState, useEffect } from "react";
import "../styles/scroll-to-explore.css";

export default function ScrollExplore() {
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
 
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY < window.innerHeight * 0.2);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);
 
  if (isMobile) return null;
 
  return (
    <div className={`scroll-wrapper ${visible ? "visible" : "hidden"}`}>
      <div className="scroll-inner">
        <span className="scroll-label">Scroll to Explore</span>
        <div className="arrow-track">
          <div className="chevron" />
          <div className="chevron" />
          <div className="chevron" />
        </div>
      </div>
    </div>
  );
}