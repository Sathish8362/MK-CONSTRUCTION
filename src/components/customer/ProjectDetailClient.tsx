'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project, SiteSettings } from '@/types';
import { LightboxModal } from '@/components/customer/LightboxModal';
import { Maximize2, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

interface ProjectDetailClientProps {
  project: Project;
  settings: SiteSettings;
}

export function ProjectDetailClient({ project, settings }: ProjectDetailClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const photos = project.photos || [];

  const handleOpenPhoto = (idx: number) => {
    setCurrentIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <div>
      {/* Description & Engineering Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">
        
        {/* Main Text */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-2xl font-black text-slate-900">
            Project Overview & Architectural Scope
          </h3>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {project.description}
          </p>
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Tested High-Yield TMT Reinforcement</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Multi-layer Polymer Waterproofing</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Vastu Compliant Floor Orientation</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Strict Milestone Handover Record</span>
            </div>
          </div>
        </div>

        {/* Right Action Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
              Interested in similar construction?
            </span>
            <h4 className="text-xl font-bold text-slate-900 mb-2">
              Build your {project.project_type} with MK Construction
            </h4>
            <p className="text-slate-600 text-xs mb-6">
              Our civil engineers will calculate cost estimations according to your plot dimensions.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href={`/#quote`}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-tap-target text-center shadow-md shadow-amber-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Request Quote For This Type</span>
            </Link>

            <a
              href={`https://wa.me/${settings.owner_mobile.replace(/[^0-9]/g, '')}?text=Hi%20MK%20Construction,%20I%20am%20interested%20in%20a%20project%20similar%20to%20${encodeURIComponent(project.title)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-tap-target text-center shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>

      </div>

      {/* Complete Project Photo Gallery */}
      <div className="mb-14">
        <h3 className="text-2xl font-black text-slate-900 mb-6">
          Project Photo Gallery ({photos.length} Photos)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              onClick={() => handleOpenPhoto(idx)}
              className="group relative h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 hover:border-amber-400 cursor-pointer shadow-sm transition-all hover:scale-[1.02]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.public_url}
                alt={photo.caption || `${project.title} - photo ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

              {/* Tag Badge */}
              {photo.photo_tag !== 'standard' && (
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                    photo.photo_tag === 'before'
                      ? 'bg-rose-500 text-white'
                      : 'bg-amber-500 text-slate-950'
                  }`}>
                    {photo.photo_tag}
                  </span>
                </div>
              )}

              {/* Expand Icon */}
              <div className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 text-slate-200 group-hover:text-amber-400 border border-white/20 transition-colors">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Caption */}
              {photo.caption && (
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-xs text-white font-medium line-clamp-2">
                    {photo.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <LightboxModal
        photos={photos}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setCurrentIndex(idx)}
      />
    </div>
  );
}
