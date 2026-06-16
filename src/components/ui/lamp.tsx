"use client";
import React from "react";
import { motion, useTransform, useSpring, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
  scrollProgress,
}: {
  children: React.ReactNode;
  className?: string;
  scrollProgress?: MotionValue<number>;
}) => {
  // Use scrollProgress if provided, fallback to a dummy motion value if not
  const fallbackProgress = new MotionValue(1);
  const progressToUse = scrollProgress || fallbackProgress;

  // Buttery-smooth spring configuration to ease scroll movements
  const smoothProgress = useSpring(progressToUse, {
    stiffness: 70,
    damping: 25,
    restDelta: 0.001,
  });

  // Map progress (0 to 0.45 of the section viewport) to widths and opacity
  const beamWidth = useTransform(smoothProgress, [0.05, 0.45], ["15rem", "30rem"]);
  const centerCircleWidth = useTransform(smoothProgress, [0.05, 0.45], ["8rem", "16rem"]);
  const beamOpacity = useTransform(smoothProgress, [0.05, 0.45], [0.3, 1]);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center w-full z-0 pt-24 pb-10",
        className
      )}
      style={{ background: "#080808" }}
    >
      {/* Beam layer — purely decorative, sits behind content */}
      <div className="absolute inset-0 flex items-start justify-center overflow-hidden pointer-events-none" style={{ top: 0 }}>
        <div className="relative flex w-full h-[340px] scale-y-125 items-center justify-center isolate">
          {/* Left beam */}
          <motion.div
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
              width: scrollProgress ? beamWidth : "30rem",
              opacity: scrollProgress ? beamOpacity : 1,
            }}
            className="absolute inset-auto right-1/2 h-56 overflow-visible bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
          >
            <div className="absolute w-[100%] left-0 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" style={{ background: "#080808" }} />
            <div className="absolute w-40 h-[100%] left-0 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" style={{ background: "#080808" }} />
          </motion.div>

          {/* Right beam */}
          <motion.div
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
              width: scrollProgress ? beamWidth : "30rem",
              opacity: scrollProgress ? beamOpacity : 1,
            }}
            className="absolute inset-auto left-1/2 h-56 bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]"
          >
            <div className="absolute w-40 h-[100%] right-0 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" style={{ background: "#080808" }} />
            <div className="absolute w-[100%] right-0 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" style={{ background: "#080808" }} />
          </motion.div>

          <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 blur-2xl" style={{ background: "#080808" }} />
          <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl" />
          
          {/* Center blue glow */}
          <motion.div
            style={{
              width: scrollProgress ? centerCircleWidth : "16rem",
            }}
            className="absolute inset-auto z-30 h-36 -translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl"
          />
          
          {/* Bottom horizontal line */}
          <motion.div
            style={{
              width: scrollProgress ? beamWidth : "30rem",
            }}
            className="absolute inset-auto z-50 h-0.5 -translate-y-[7rem] bg-cyan-400"
          />
          <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem]" style={{ background: "#080808" }} />
        </div>
      </div>

      {/* Content sits above beams, no negative translate */}
      <div className="relative z-10 flex flex-col items-center px-5 w-full">
        {children}
      </div>
    </div>
  );
};

export default LampContainer;

