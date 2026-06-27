"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function HeroConfetti() {
  useEffect(() => {
    // Two quick bursts from opposite sides — feels celebratory, not overwhelming
    const left = () =>
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ["#4A2D6F", "#EDE8F5", "#141414", "#F7F5F2", "#B0ABA6"],
        scalar: 0.9,
      });

    const right = () =>
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ["#4A2D6F", "#EDE8F5", "#141414", "#F7F5F2", "#B0ABA6"],
        scalar: 0.9,
      });

    left();
    right();
    setTimeout(() => { left(); right(); }, 200);
  }, []);

  return null;
}
