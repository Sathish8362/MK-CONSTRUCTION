'use client';

import React from 'react';
import { Trophy, CheckCircle2, Star, ShieldCheck } from 'lucide-react';
import { SiteSettings } from '@/types';

interface KeyFactsStripProps {
  settings: SiteSettings;
}

export function KeyFactsStrip({ settings }: KeyFactsStripProps) {
  const currentYear = new Date().getFullYear();
  const yearsExp = currentYear - settings.established_year;

  const facts = [
    {
      icon: Trophy,
      value: `${yearsExp}+ Years`,
      label: "Industry Heritage",
      subtext: `Established in ${settings.established_year}`,
    },
    {
      icon: CheckCircle2,
      value: settings.stats_projects_count,
      label: "Projects Completed",
      subtext: "Villas, Commercial & Renovation",
    },
    {
      icon: Star,
      value: "4.9 / 5.0",
      label: "Client Rating",
      subtext: `${settings.stats_happy_clients} Verified Reviews`,
    },
    {
      icon: ShieldCheck,
      value: settings.stats_warranty_years,
      label: "Structural Warranty",
      subtext: "Complete Peace of Mind",
    },
  ];

  return (
    <div className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {facts.map((fact, idx) => {
            const Icon = fact.icon;
            return (
              <div 
                key={fact.label} 
                className={`flex items-center gap-4 ${idx > 0 && idx % 2 === 0 ? 'pt-6 lg:pt-0' : ''} ${idx > 0 ? 'lg:pl-8' : ''}`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {fact.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-amber-700 uppercase tracking-wider">
                    {fact.label}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {fact.subtext}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
