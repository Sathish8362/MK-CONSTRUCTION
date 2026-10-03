'use client';

import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectPhoto } from '@/types';

interface LightboxModalProps {
  photos: ProjectPhoto[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function LightboxModal({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: LightboxModalProps) {
  const currentPhoto = photos[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onNavigate(0); // loop
    }
  }, [currentIndex, photos.length, onNavigate]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      onNavigate(photos.length - 1); // loop
    }
  }, [currentIndex, photos.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-200">
      
      {/* Top Bar with Counter and Close Button */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-800 text-xs font-bold shadow-md">
          Photo {currentIndex + 1} of {photos.length}
          {currentPhoto.photo_tag !== 'standard' && (
            <span className="ml-2 uppercase text-amber-600 font-black">
              • {currentPhoto.photo_tag}
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-3 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 hover:bg-white hover:scale-105 transition-all min-tap-target flex items-center justify-center shadow-md cursor-pointer"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Buttons */}
      {photos.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 hover:bg-white hover:scale-105 transition-all z-10 min-tap-target flex items-center justify-center shadow-md cursor-pointer"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 hover:bg-white hover:scale-105 transition-all z-10 min-tap-target flex items-center justify-center shadow-md cursor-pointer"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </>
      )}

      {/* Main Image Container */}
      <div className="relative max-w-5xl max-h-[80vh] w-full flex flex-col items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentPhoto.public_url}
          alt={currentPhoto.caption || "MK Construction Project Photo"}
          className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
        />

        {currentPhoto.caption && (
          <p className="mt-4 text-center text-sm font-semibold text-slate-800 max-w-2xl px-5 py-2 bg-white/90 backdrop-blur-md rounded-full border border-slate-200 shadow-md">
            {currentPhoto.caption}
          </p>
        )}
      </div>

    </div>
  );
}
