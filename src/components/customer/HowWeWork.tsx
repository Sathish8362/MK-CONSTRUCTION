'use client';

import React from 'react';
import { Compass, FileSpreadsheet, Hammer, KeyRound } from 'lucide-react';

export function HowWeWork() {
  const steps = [
    {
      num: "01",
      icon: Compass,
      title: "Site Survey & Soil Analysis",
      description: "We inspect your plot in Thirubuvanam/surrounding towns, conduct soil load-bearing tests, and align on your architectural vision and Vastu orientations.",
      deliverable: "Topography & Soil Integrity Report",
    },
    {
      num: "02",
      icon: FileSpreadsheet,
      title: "3D Design & Transparent BOQ",
      description: "Our licensed architects craft structural CAD drawings and photorealistic 3D elevations paired with an itemized Bill of Quantities without hidden costs.",
      deliverable: "Fixed-Price Construction Contract",
    },
    {
      num: "03",
      icon: Hammer,
      title: "Milestone-Driven Execution",
      description: "Strict RCC curing schedules, laboratory cube tests, high-grade TMT steel placement, and weekly drone/photo updates sent directly to your phone.",
      deliverable: "Weekly WhatsApp Progress Logs",
    },
    {
      num: "04",
      icon: KeyRound,
      title: "Final Handover & 10-Yr Warranty",
      description: "Flawless punch-list resolution, deep cleaning, ceremonial key delivery, and formal handover of your 10-Year RCC Structural Warranty certificate.",
      deliverable: "10-Year Warranty Deed & As-Built Plans",
    },
  ];

  return (
    <section id="how-we-work" className="py-24 bg-slate-50 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            Our Proven 4-Step Process
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            TRANSPARENT, TIMELY & STRESS-FREE
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            We eliminate the ambiguity of traditional building contractors through contractual milestones and daily owner updates.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Connecting line for large screens */}
          <div className="hidden lg:block absolute top-1/4 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-amber-500/20 via-amber-500/60 to-amber-500/20 -z-0" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative bg-white border border-slate-200 rounded-2xl p-7 flex flex-col justify-between hover:border-amber-400 transition-colors shadow-sm hover:shadow-lg z-10 group"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-4xl font-black text-slate-200 group-hover:text-amber-500/40 transition-colors">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 block mb-1">
                    Key Deliverable:
                  </span>
                  <span className="text-xs text-slate-800 font-bold">
                    {step.deliverable}
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
