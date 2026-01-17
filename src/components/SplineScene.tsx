import Spline from "@splinetool/react-spline";
import { Suspense } from "react";

interface SplineSceneProps {
  className?: string;
}

const SplineScene = ({ className = "" }: SplineSceneProps) => {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Spline 3D scene as ambient background */}
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
        <Spline
          scene="https://prod.spline.design/DnEGNNUDHHw0Ga5l/scene.splinecode"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      </Suspense>
      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background pointer-events-none" />
      {/* Subtle intelligence glow from top */}
      <div className="absolute inset-0 hero-gradient opacity-60 pointer-events-none" />
    </div>
  );
};

export default SplineScene;
