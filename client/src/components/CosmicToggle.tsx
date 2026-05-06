import React, { useState, useEffect } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import "./CosmicToggle.css";

const PARTICLE_ANGLES = ["30deg", "60deg", "90deg", "120deg", "150deg", "180deg"];
const PARTICLE_DURATIONS = [2.2, 2.5, 2.8, 2.4, 2.6, 2.9];

const ringLoop: Variants = {
  rest: { scale: 0.94, opacity: 0.7 },
  pulse: {
    scale: [0.94, 1, 0.96],
    opacity: [0.7, 1, 0.75],
    transition: {
      duration: 1.8,
      ease: "easeOut",
      times: [0, 0.45, 1],
      repeat: Infinity,
    },
  },
};

function particleLoop(duration: number): Variants {
  return {
    rest: { opacity: 0, ["--p-scale" as string]: 0.85 },
    drift: {
      opacity: [0, 1, 0.65, 0],
      // Drive CSS var so the static radial translate in CSS is preserved.
      ["--p-scale" as string]: [0.85, 1, 1.05, 0.9],
      transition: {
        duration,
        ease: "easeOut",
        times: [0, 0.25, 0.6, 1],
        repeat: Infinity,
      },
    },
  } as unknown as Variants;
}

export function CosmicToggle() {
  const reduceMotion = useReducedMotion();
  const [checked, setChecked] = useState(() => {
    try {
      const saved = window.localStorage.getItem("theme");
      if (saved === "dark") return true;
      if (saved === "light") return false;
      return true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      document.documentElement.classList.toggle("dark", checked);
      window.localStorage.setItem("theme", checked ? "dark" : "light");
    } catch {
      // ignore
    }
  }, [checked]);

  const animateState = reduceMotion ? "rest" : undefined;

  return (
    <label className="cosmic-toggle" aria-label="Toggle dark mode">
      <input
        className="toggle"
        type="checkbox"
        checked={checked}
        onChange={() => setChecked((prev) => !prev)}
      />
      <div className="slider">
        <div className="cosmos" />
        <div className="energy-line" />
        <div className="energy-line" />
        <div className="energy-line" />
        <div className="toggle-orb">
          <div className="inner-orb" />
          <motion.div
            className="ring"
            variants={ringLoop}
            initial="rest"
            animate={animateState ?? "pulse"}
          />
        </div>
        <div className="particles">
          {PARTICLE_ANGLES.map((angle, i) => (
            <motion.div
              key={angle}
              className="particle"
              style={{ ["--angle" as string]: angle } as React.CSSProperties}
              variants={particleLoop(PARTICLE_DURATIONS[i])}
              initial="rest"
              animate={animateState ?? "drift"}
            />
          ))}
        </div>
      </div>
    </label>
  );
}
