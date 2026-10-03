'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project, ProjectPhoto } from '@/types';
import { MapPin, Maximize2, Clock, Ruler, ArrowUpRight, Sparkles } from 'lucide-react';
import { LightboxModal } from './LightboxModal';

interface ProjectGalleryProps {
  projects: Project[];
}

export function ProjectGallery({ projects }: ProjectGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [lightboxPhotos, setLightboxPhotos] = useState<ProjectPhoto[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  const filterCategories = ['All', 'Residential', 'Commercial', 'Renovation', 'Interiors'];

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'All') return true;
    return project.project_type.toLowerCase() === activeFilter.toLowerCase();
  });

  const openLightboxForProject = (photos: ProjectPhoto[] = [], initialIndex = 0) => {
    if (photos.length > 0) {
      setLightboxPhotos(photos);
      setLightboxIndex(initialIndex);
      setLightboxOpen(true);
    }
  };

  return (
    <section id="projects" className="py-24 bg-white relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
              Portfolio of Completed Works
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              FEATURED PROJECTS ACROSS TAMIL NADU
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm sm:text-base text-slate-600 max-w-md">
            Every structure represents our obsession with structural durability, aesthetic symmetry, and adherence to time commitments.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {filterCategories.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap min-tap-target ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 scale-102'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat} {cat === 'All' ? `(${projects.length})` : ''}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const coverPhoto = project.photos?.find(p => p.is_cover) || project.photos?.[0] || {
              public_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1200&q=80',
              caption: project.title,
            };

            const hasBeforeAfter = project.photos?.some(p => p.photo_tag === 'before') &&
                                   project.photos?.some(p => p.photo_tag === 'after');

            return (
              <div
                key={project.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                {/* Photo Header */}
                <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverPhoto.public_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/95 text-slate-900 border border-slate-200 shadow-xs backdrop-blur-md">
                      {project.project_type}
                    </span>

                    {hasBeforeAfter && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-amber-500 text-slate-950 shadow-md">
                        <Sparkles className="w-3 h-3" />
                        <span>Before & After</span>
                      </span>
                    )}
                  </div>

                  {/* Quick Expand Button */}
                  {project.photos && project.photos.length > 0 && (
                    <button
                      onClick={() => openLightboxForProject(project.photos, 0)}
                      className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/60 text-white hover:text-amber-400 hover:bg-black/80 border border-white/20 transition-colors backdrop-blur-xs"
                      title="Quick Preview Photos"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Project Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2 group-hover:text-amber-700 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    {/* Specs Matrix */}
                    <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-100 mb-4 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Ruler className="w-3.5 h-3.5 text-amber-600" />
                        <span>{project.area_sqft.toLocaleString()} sq.ft</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{project.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium col-span-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </div>
                    </div>

                    {/* View Project Link */}
                    <Link
                      href={`/projects/${project.slug}`}
                      className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 text-xs font-bold uppercase tracking-wider transition-colors min-tap-target"
                    >
                      <span>Explore Full Project</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Component */}
      <LightboxModal
        photos={lightboxPhotos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </section>
  );
}
