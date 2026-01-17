import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplineSceneProps {
  className?: string;
}

const SplineScene = ({ className = "" }: SplineSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer@1.12.36/build/spline-viewer.js";
    
    script.onload = () => {
      setTimeout(() => setIsLoading(false), 1500);
    };
    
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Loading animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-background overflow-hidden"
          >
            {/* Animated skeleton background */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-sage/10 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-sage/5 via-transparent to-sage/5" />
            </div>

            {/* Skeleton shapes */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-sage/10"
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute w-48 h-48 md:w-72 md:h-72 rounded-full bg-sage/15"
                animate={{ scale: [1.05, 1, 1.05], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
              <motion.div
                className="absolute w-32 h-32 md:w-48 md:h-48 rounded-full bg-sage/20"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              />
            </div>

            {/* Center loading indicator */}
            <div className="relative flex flex-col items-center gap-6 z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <div className="w-16 h-16 rounded-full border-2 border-sage/30 border-t-sage" />
              </motion.div>
              
              <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                <span className="font-serif italic">Loading 3D experience</span>
                <span className="flex gap-1 ml-1">
                  <motion.span 
                    className="w-1.5 h-1.5 rounded-full bg-sage"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <motion.span 
                    className="w-1.5 h-1.5 rounded-full bg-sage"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.span 
                    className="w-1.5 h-1.5 rounded-full bg-sage"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spline 3D scene - New URL */}
      <spline-viewer
        url="https://prod.spline.design/rnIOuXM897c32O10/scene.splinecode"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      
      {/* Hide Spline watermark */}
      <style>{`
        spline-viewer::part(logo) {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "spline-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { url: string },
        HTMLElement
      >;
    }
  }
}

export default SplineScene;
