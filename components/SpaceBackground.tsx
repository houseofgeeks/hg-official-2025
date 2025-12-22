"use client";

import React, { useEffect, useRef } from "react";

const SpaceBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; z: number }[] = [];

    let numStars = 1000;
    let speed = 5;
    let starBaseSize = 1;

    const initStars = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width * 2 - canvas.width,
          y: Math.random() * canvas.height * 2 - canvas.height,
          z: Math.random() * canvas.width,
        });
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Responsive adjustments
      if (window.innerWidth >= 1024) {
        numStars = 2000; // More dots for big screens
        speed = 13; // Faster for big screens
        starBaseSize = 1.5; // Larger dots
      } else {
        numStars = 1500; // Original count for small screens
        speed = 5; // Original speed for small screens
        starBaseSize = 1;
      }

      initStars();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const render = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const fov = canvas.width;

      ctx.fillStyle = "white";

      for (let star of stars) {
        // Move star towards screen (decrease Z)
        star.z -= speed;

        // Reset star if it passes the screen
        if (star.z <= 0) {
          star.z = canvas.width;
          star.x = Math.random() * canvas.width * 2 - canvas.width;
          star.y = Math.random() * canvas.height * 2 - canvas.height;
        }

        // Project 3D coordinates to 2D
        const scale = fov / star.z;
        const x = star.x * scale + cx;
        const y = star.y * scale + cy;

        // Calculate size based on proximity
        const depth = 1 - star.z / canvas.width;
        const size = Math.max(0.1, depth * 2 * starBaseSize);

        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 bg-black pointer-events-none"
    />
  );
};

export default SpaceBackground;