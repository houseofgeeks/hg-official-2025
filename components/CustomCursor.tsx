'use client';

import { useState, useEffect, useRef } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [target, setTarget] = useState<{
    width: number;
    height: number;
    top: number;
    left: number;
  } | null>(null);
  const hoveredElementRef = useRef<HTMLElement | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const renderRAF = () => {
      rafRef.current = null;
      // sync visible position with latest pointer (throttled)
      const p = positionRef.current;
      setPosition({ x: p.x, y: p.y });
    };

    const onMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      if (!rafRef.current) rafRef.current = requestAnimationFrame(renderRAF);
    };

    const onMouseOver = (e: MouseEvent) => {
      const targetElement = e.target as HTMLElement;
      const interactiveElement = targetElement.closest('.interactive-element') as HTMLElement;
      if (interactiveElement) {
        setIsHovering(true);
        hoveredElementRef.current = interactiveElement;
        const rect = interactiveElement.getBoundingClientRect();
        setTarget({
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
        });
      } else {
        setIsHovering(false);
        hoveredElementRef.current = null;
        setTarget(null);
      }
    };

    const onScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        // find element currently under the cursor and update target accordingly
        const pos = positionRef.current;
        const el = document.elementFromPoint(pos.x, pos.y) as HTMLElement | null;
        const interactiveElement = el?.closest('.interactive-element') as HTMLElement | null;
        if (interactiveElement) {
          hoveredElementRef.current = interactiveElement;
          const rect = interactiveElement.getBoundingClientRect();
          setTarget({
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
          });
          setIsHovering(true);
        } else {
          hoveredElementRef.current = null;
          setTarget(null);
          setIsHovering(false);
        }
      }, 10);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    // capture scrolls from any scrollable container (e.g., modal body)
    document.addEventListener('scroll', onScroll, true);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div
        className={`custom-cursor ${isHovering ? 'hover' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
      <div
        className={`cursor-lock ${target ? 'locked' : ''}`}
        style={{
          width: target ? `${target.width}px` : '30px',
          height: target ? `${target.height}px` : '30px',
          top: target ? `${target.top}px` : `${position.y - 15}px`,
          left: target ? `${target.left}px` : `${position.x - 15}px`,
        }}
      >
        <div className="corner top-left" />
        <div className="corner top-right" />
        <div className="corner bottom-left" />
        <div className="corner bottom-right" />
      </div>
    </>
  );
};

export default CustomCursor;
