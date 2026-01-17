import { useEffect, useRef } from "react";

interface SplineSceneProps {
  className?: string;
}

const SplineScene = ({ className = "" }: SplineSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Spline viewer script dynamically
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer@1.9.48/build/spline-viewer.js";
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Spline 3D scene as ambient background */}
      <spline-viewer
        url="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
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
      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      {/* Subtle intelligence glow from top */}
      <div className="absolute inset-0 hero-gradient opacity-60" />
    </div>
  );
};

// Extend JSX for spline-viewer custom element
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
