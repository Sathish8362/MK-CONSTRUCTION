'use client';

import React from 'react';
import { MessageSquare, Phone } from 'lucide-react';

interface FloatingActionButtonsProps {
  phone: string;
}

export function FloatingActionButtons({ phone }: FloatingActionButtonsProps) {
  const cleanNumber = phone.replace(/[^0-9]/g, '');

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pb-safe pr-safe pointer-events-none">
      
      {/* Call Button (Mobile Only) */}
      <a
        href={`tel:${phone}`}
        className="sm:hidden pointer-events-auto p-3.5 rounded-full bg-amber-500 text-slate-950 shadow-xl shadow-amber-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all min-tap-target"
        aria-label="Direct Call"
        title="Call Owner"
      >
        <Phone className="w-6 h-6 stroke-[2.2]" />
      </a>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${cleanNumber}?text=Hello%20MK%20Construction,%20I%20am%20interested%20in%20discussing%20a%20project.`}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group relative flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-900/50 hover:scale-105 active:scale-95 transition-all min-tap-target border border-emerald-400/40"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp with MK Construction"
      >
        {/* Pulsing beacon */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>

        <MessageSquare className="w-5 h-5 fill-white" />
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline-block">
          Chat on WhatsApp
        </span>
      </a>

    </div>
  );
}
