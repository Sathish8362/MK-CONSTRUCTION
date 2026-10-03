'use client';

import React from 'react';
import { SiteSettings } from '@/types';
import { CheckCircle2, MapPin } from 'lucide-react';

interface AboutUsProps {
  settings: SiteSettings;
}

export function AboutUs({ settings }: AboutUsProps) {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Showcase Card */}
          <div className="relative">
            <div className="relative mx-auto rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1200&q=80"
                alt="MK Construction Site Engineers"
                className="w-full h-[450px] sm:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xl shrink-0 shadow-md">
                    26+
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold text-sm sm:text-base">
                      Generations of Structural Trust
                    </h4>
                    <p className="text-slate-600 text-xs mt-0.5">
                      Continuously operating in Thirubuvanam & Cauvery delta region since {settings.established_year}.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full -z-10" />
          </div>

          {/* Right Column: Company Story & Principles */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
              About MK Construction
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-6">
              BUILDING THE ARCHITECTURAL HERITAGE OF THIRUBUVANAM
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Founded in the year 2000, <strong>{settings.company_name}</strong> began with a steadfast commitment: to provide families and business owners across Thirubuvanam, Kumbakonam, Thanjavur, and Mayiladuthurai with engineering-backed construction that withstands climate, earthquakes, and time.
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
              Under dedicated civil leadership, we have grown from local residential foundations into a respected Class-1 building enterprise with over 250 completed turnkey structures. We operate on principles of zero material compromise, transparent stage-wise billing, and daily on-site safety protocols.
            </p>

            {/* Key Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">TMT Steel & Lab Tested Cement</h4>
                  <p className="text-slate-500 text-xs mt-1">Direct sourcing of primary steel & certified OPC/PPC 53-grade cement.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Vastu & Climate Precision</h4>
                  <p className="text-slate-500 text-xs mt-1">Cross-ventilation designs optimized for Tamil Nadu heat and monsoons.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Contractual Delivery Timelines</h4>
                  <p className="text-slate-500 text-xs mt-1">Strict adherence to completion schedules with milestone-linked handovers.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Single Point Accountability</h4>
                  <p className="text-slate-500 text-xs mt-1">Direct communication with the owner and site engineers from day one.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-amber-800 font-semibold tracking-wide bg-amber-50 p-3 rounded-xl border border-amber-200">
              <MapPin className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Registered Headquarters: {settings.address}</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
