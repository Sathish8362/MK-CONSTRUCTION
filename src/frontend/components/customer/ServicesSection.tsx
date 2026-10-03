'use client';

import React from 'react';
import { ServiceItem } from '@/types';
import { Home, Building2, Wrench, Palette, CheckCircle2, ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectService?: (serviceTitle: string) => void;
}

const iconMap: Record<string, any> = {
  Home,
  Building2,
  Wrench,
  Palette,
};

export function ServicesSection({ services, onSelectService }: ServicesSectionProps) {
  return (
    <section id="services" className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200">
      {/* Blueprint decorative lines */}
      <div className="absolute inset-0 bg-blueprint-pattern opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            Core Construction Disciplines
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            ENGINEERED EXCELLENCE FOR EVERY STRUCTURE
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            From greenfield foundation pours to luxury turnkey interiors, MK Construction applies 26+ years of licensed mastery in Thirubuvanam and Tamil Nadu.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon_name] || Home;

            return (
              <div
                key={service.id}
                className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/80 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                      <IconComponent className="w-7 h-7 stroke-[2]" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-amber-700 transition-colors">
                      MK-ENG-{service.slug.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3 group-hover:text-amber-700 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {service.short_desc}
                  </p>

                  {/* Feature Checkpoints */}
                  <div className="space-y-2.5 mb-8">
                    {service.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href="#quote"
                    onClick={() => onSelectService?.(service.title)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:text-amber-800 uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                  >
                    <span>Request Estimate For This</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                    10-Yr Warranty
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
