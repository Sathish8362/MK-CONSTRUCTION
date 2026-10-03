'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Award, Ruler, PhoneCall, Sparkles } from 'lucide-react';
import { SiteSettings } from '@/types';

interface HeroProps {
  settings: SiteSettings;
}

export function Hero({ settings }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-blueprint-pattern pt-12 pb-20 overflow-hidden">
      {/* Ambient Lighting Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Trust Pill / Location Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-amber-300 bg-amber-50/90 backdrop-blur-md mb-8 shadow-xs animate-in fade-in duration-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span className="text-xs sm:text-sm font-bold tracking-wider text-amber-900 uppercase">
              Premier Builders in {settings.location} • Estd {settings.established_year}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.1] mb-6">
            SOLID FOUNDATIONS. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700">
              UNCOMPROMISED QUALITY.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 font-normal max-w-3xl mx-auto mb-10 leading-relaxed">
            {settings.hero_subtitle}
          </p>

          {/* CTA Button Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#quote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 min-tap-target group"
            >
              <span>Get Free Construction Quote</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href={`tel:${settings.owner_mobile}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm tracking-wide transition-all hover:border-amber-400 shadow-sm min-tap-target"
            >
              <PhoneCall className="w-4 h-4 text-amber-600" />
              <span>Direct Call: {settings.owner_mobile}</span>
            </a>
          </div>

          {/* Trust Guarantees Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-200">
            <div className="p-3.5 text-left bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>10-Yr Guarantee</span>
              </div>
              <p className="text-xs text-slate-500">Written structural RCC warranty</p>
            </div>

            <div className="p-3.5 text-left bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase mb-1">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Govt Class-1</span>
              </div>
              <p className="text-xs text-slate-500">Registered civil contractor</p>
            </div>

            <div className="p-3.5 text-left bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase mb-1">
                <Ruler className="w-4 h-4 text-amber-600" />
                <span>100% On-Time</span>
              </div>
              <p className="text-xs text-slate-500">Strict contractual milestone delivery</p>
            </div>

            <div className="p-3.5 text-left bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase mb-1">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Transparent BOQ</span>
              </div>
              <p className="text-xs text-slate-500">Zero hidden costs or sudden price hikes</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
