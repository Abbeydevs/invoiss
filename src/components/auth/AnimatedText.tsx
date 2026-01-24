"use client";

import { useEffect, useState } from "react";

const words = ["professional", "beautiful", "custom", "branded", "instant"];

export function AnimatedText() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block">
      Start creating{" "}
      <span className="relative inline-block min-w-[280px] text-left">
        <span
          className={`inline-block transition-all duration-500 ${
            isAnimating
              ? "opacity-0 -translate-y-4"
              : "opacity-100 translate-y-0"
          }`}
        >
          <span className="bg-linear-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent font-extrabold">
            {words[currentWordIndex]}
          </span>
        </span>
      </span>
      <br />
      invoices today
    </span>
  );
}
