import React, { useId, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export default function ShredText({ children, className = "", delay = 0 }) {
  const fid = "shred-" + useId().replace(/:/g, "");
  const animRef = useRef(null);
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { once: true, margin: "-60px" });

  useEffect(() => {
    if (inView && animRef.current && animRef.current.beginElement) {
      const t = setTimeout(() => animRef.current.beginElement(), delay);
      return () => clearTimeout(t);
    }
  }, [inView, delay]);

  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id={fid} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="7" result="turb" />
            <feDisplacementMap in="SourceGraphic" in2="turb" scale="0">
              <animate
                ref={animRef}
                attributeName="scale"
                values="90;0"
                dur="1.2s"
                begin="indefinite"
                fill="freeze"
                calcMode="spline"
                keyTimes="0;1"
                keySplines="0.2 0.8 0.3 1"
              />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>
      <span ref={wrapRef} className={className} style={{ filter: `url(#${fid})` }}>
        {children}
      </span>
    </>
  );
}
