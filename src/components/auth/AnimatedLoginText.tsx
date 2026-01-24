"use client";

import { useEffect, useState } from "react";

const words = [
  "effortlessly",
  "instantly",
  "securely",
  "efficiently",
  "smartly",
];

export function AnimatedLoginText() {
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
      Manage your business{" "}
      <span className="relative inline-block min-w-[280px] text-center">
        <span
          className={`inline-block transition-all duration-500 ${
            isAnimating
              ? "opacity-0 -translate-y-4"
              : "opacity-100 translate-y-0"
          }`}
        >
          <span className="bg-linear-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent font-extrabold">
            {words[currentWordIndex]}
          </span>
        </span>
      </span>
    </span>
  );
}
