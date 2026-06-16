"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// One line height in px (text-base = 16px, line-height 1.6 = 25.6px)
const LINE_HEIGHT = 25.6;
const MAX_LINES = 6;
const MAX_HEIGHT = Math.round(LINE_HEIGHT * MAX_LINES); // ~154px

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
  inputRef: externalInputRef,
  onFocus,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  onFocus?: () => void;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  // ── Placeholder cycling ──────────────────────────────────────────
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startAnimation();
    }
  };

  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholders]);

  // ── Refs & state ─────────────────────────────────────────────────
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = (externalInputRef ?? internalRef) as React.RefObject<HTMLTextAreaElement>;

  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);
  const [scrollable, setScrollable] = useState(false);

  // ── Auto-resize ──────────────────────────────────────────────────
  const autoResize = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;

    // Shrink to measure natural scroll height
    el.style.height = "auto";
    const sh = el.scrollHeight;

    if (sh <= MAX_HEIGHT) {
      // Fits within max — grow to content, hide scrollbar
      el.style.height = `${sh}px`;
      el.style.overflowY = "hidden";
      setScrollable(false);
    } else {
      // Exceeds max — lock height, show scrollbar
      el.style.height = `${MAX_HEIGHT}px`;
      el.style.overflowY = "auto";
      setScrollable(true);
    }

    setScrollable(sh > MAX_HEIGHT);
  }, [inputRef]);

  useEffect(() => {
    autoResize();
  }, [value, autoResize]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift+Enter — insert newline naturally
        return;
      }
      // Plain Enter — submit the form
      e.preventDefault();
      // Trigger the form's submit event so Contact's handleSubmit fires
      e.currentTarget.form?.requestSubmit();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value.trim()) {
      if (onSubmit) onSubmit(e);
      return;
    }
    // Call parent first — parent reads inputValue before we clear
    if (onSubmit) onSubmit(e);
    // Then animate the vanish
    setAnimating(true);
    setTimeout(() => {
      setValue("");
      setAnimating(false);
    }, 320);
  };

  return (
    <form
      className={cn(
        "w-full relative max-w-xl mx-auto rounded-2xl transition-all duration-200",
        "bg-[#161616] border",
        value ? "border-white/[0.18]" : "border-white/[0.18]"
      )}
      onSubmit={handleSubmit}
    >
      <textarea
        ref={inputRef}
        value={value}
        rows={1}
        onChange={(e) => {
          if (!animating) {
            setValue(e.target.value);
            if (onChange) onChange(e);
          }
        }}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onInput={(e) => {
          // Sync from keyboard panel injections
          const val = (e.target as HTMLTextAreaElement).value;
          if (!animating) {
            setValue(val);
            autoResize();
          }
        }}
        className={cn(
          // Layout
          "w-[calc(100%-3rem)] block relative z-50",
          // Typography
          "text-sm sm:text-base leading-[1.6] text-white",
          // Padding — right pad leaves room for the scrollbar
          "pt-3.5 pb-3.5 pl-4 sm:pl-5 pr-2",
          // Sizing — min one line, max controlled by JS
          "min-h-[48px]",
          // Behaviour
          "resize-none",        // no manual resize handle
          "overflow-hidden",    // JS controls overflow, start hidden
          "word-break",         // break long words
          // Chrome/Safari custom scrollbar styling via Tailwind
          scrollable && "overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent",
          // Input chrome reset
          "bg-transparent border-none focus:outline-none focus:ring-0",
          animating && "text-transparent"
        )}
        style={{
          transition: "height 0.15s ease",
          overflowWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",  // preserves newlines + wraps
        }}
      />

      {/* Submit button — anchored bottom-right, always visible */}
      <button
        disabled={!value.trim()}
        type="submit"
        className="absolute right-2 bottom-2 z-50 h-8 w-8 rounded-full disabled:bg-white/5 bg-[#6EE7F7] transition duration-200 flex items-center justify-center flex-shrink-0"
        aria-label="Submit message"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#080808] h-4 w-4"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <motion.path
            d="M5 12l14 0"
            initial={{ strokeDasharray: "50%", strokeDashoffset: "50%" }}
            animate={{ strokeDashoffset: value ? 0 : "50%" }}
            transition={{ duration: 0.3, ease: "linear" }}
          />
          <path d="M13 18l6 -6" />
          <path d="M13 6l6 6" />
        </motion.svg>
      </button>

      {/* Animated placeholder — only when empty */}
      <div className="absolute inset-0 flex items-start pt-3.5 pointer-events-none rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              initial={{ y: 5, opacity: 0 }}
              key={`placeholder-${currentPlaceholder}`}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.25, ease: "linear" }}
              className="text-[#555555] text-sm sm:text-base font-normal pl-4 sm:pl-5 pr-14 leading-[1.6] w-full truncate"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

    </form>
  );
}

export default PlaceholdersAndVanishInput;
