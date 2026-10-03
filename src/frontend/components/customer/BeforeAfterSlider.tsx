'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeAlt = "Before construction",
  afterAlt = "After construction by MK Construction",
  className = "",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleInteractionStart = () => setIsDragging(true);
  const handleInteractionEnd = () => setIsDragging(false);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onMouseMove={handleMouseMove}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onTouchMove={handleTouchMove}
      className={`relative select-none overflow-hidden rounded-2xl cursor-ew-resize border border-slate-200 shadow-xl bg-slate-100 ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* AFTER IMAGE (Base layer, fully visible beneath) */}
      <div className="relative w-full h-[360px] sm:h-[460px] md:h-[540px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterUrl}
          alt={afterAlt}
          className="w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute bottom-4 right-4 bg-amber-500 text-slate-950 px-3 py-1 rounded text-xs font-black tracking-wider uppercase shadow-md">
          AFTER (MK Construction)
        </div>
      </div>

      {/* BEFORE IMAGE (Clipped on top based on sliderPosition) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="relative w-full h-full min-w-[100vw] sm:min-w-[1200px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beforeUrl}
            alt={beforeAlt}
            className="w-full h-[360px] sm:h-[460px] md:h-[540px] object-cover pointer-events-none"
          />
        </div>
        <div className="absolute bottom-4 left-4 bg-white/95 text-slate-900 border border-slate-200 px-3 py-1 rounded text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-md">
          BEFORE (Original Site)
        </div>
      </div>

      {/* DRAGGABLE DIVIDER LINE */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-amber-500 cursor-ew-resize pointer-events-none shadow-[0_0_10px_rgba(245,158,11,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Center Grab Handle */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-500 border-2 border-white shadow-xl flex items-center justify-center pointer-events-auto">
          <svg className="w-5 h-5 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m8 15-4-4 4-4m8 8 4-4-4-4" />
          </svg>
        </div>
      </div>

      {/* Instructional Tooltip */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full pointer-events-none shadow-xs">
        Drag slider left or right to compare
      </div>
    </div>
  );
}
