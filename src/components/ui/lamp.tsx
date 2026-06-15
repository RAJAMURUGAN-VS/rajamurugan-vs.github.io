"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
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
            initial={{ opacity: 0.5, width: "15rem" }}
            whileInView={{ opacity: 1, width: "30rem" }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
            className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
          >
            <div className="absolute w-[100%] left-0 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" style={{ background: "#080808" }} />
            <div className="absolute w-40 h-[100%] left-0 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" style={{ background: "#080808" }} />
          </motion.div>

          {/* Right beam */}
          <motion.div
            initial={{ opacity: 0.5, width: "15rem" }}
            whileInView={{ opacity: 1, width: "30rem" }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
            className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]"
          >
            <div className="absolute w-40 h-[100%] right-0 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" style={{ background: "#080808" }} />
            <div className="absolute w-[100%] right-0 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" style={{ background: "#080808" }} />
          </motion.div>

          <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 blur-2xl" style={{ background: "#080808" }} />
          <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl" />
          <motion.div
            initial={{ width: "8rem" }}
            whileInView={{ width: "16rem" }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl"
          />
          <motion.div
            initial={{ width: "15rem" }}
            whileInView={{ width: "30rem" }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-cyan-400"
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
