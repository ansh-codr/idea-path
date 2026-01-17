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
    script.src = "https://unpkg.com/@splinetool/viewer@1.9.48/build/spline-viewer.js";
    
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
            className="absolute inset-0 z-20 flex items-center justify-center bg-background"
          >
            <div className="flex flex-col items-center gap-6">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sage to-sage/50 blur-sm" />
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-sage via-sage/80 to-transparent" />
              </motion.div>
              
              <div className="flex items-center gap-1 text-muted-foreground text-sm font-medium">
                <span className="font-serif italic">Loading experience</span>
                <span className="thinking-dots flex gap-1 ml-1">
                  <span className="w-1 h-1 rounded-full bg-sage" />
                  <span className="w-1 h-1 rounded-full bg-sage" />
                  <span className="w-1 h-1 rounded-full bg-sage" />
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spline 3D scene - New URL */}
      <spline-viewer
        url="https://prod.spline.design/USSssSA4oj9qAUAz/scene.splinecode"
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
