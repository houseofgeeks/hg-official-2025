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

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
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
        if (hoveredElementRef.current) {
          const rect = hoveredElementRef.current.getBoundingClientRect();
          setTarget({
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
          });
        }
      }, 10);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    window.addEventListener('scroll', onScroll);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('scroll', onScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
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
