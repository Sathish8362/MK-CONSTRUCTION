'use client';

import React from 'react';
import { SiteSettings } from '@/types';
import { ShieldCheck, Award, FileCheck, HardHat } from 'lucide-react';

interface CredentialsProps {
  settings: SiteSettings;
}

export function Credentials({ settings }: CredentialsProps) {
  const credentialsList = [
    {
      icon: Award,
      badge: "GOVERNMENT REGISTERED",
      title: "Class-1 Licensed Contractor",
      number: settings.license_number,
      detail: "Formally registered with Tamil Nadu Public Works & Urban Local Bodies for residential & commercial grade structures.",
    },
    {
      icon: ShieldCheck,
      badge: "RISK MITIGATION",
      title: "Comprehensive Builder's Risk",
      number: settings.insurance_status,
      detail: "Complete site coverage protecting property, equipment, workforce, and adjacent land against accidents or acts of nature.",
    },
    {
      icon: FileCheck,
      badge: "WRITTEN ASSURANCE",
      title: "10-Year Structural RCC Warranty",
      number: `[WARRANTY-DOC-CERT-MK-2000]`,
      detail: "Legally binding warranty deed certifying structural load-bearing stability, anti-termite treatment, and foundation integrity.",
    },
    {
      icon: HardHat,
      badge: "COMPLIANCE & STANDARDS",
      title: "Safety & IS-Code Quality Protocol",
      number: settings.safety_standard,
      detail: "Mandatory personal protective equipment on all sites, cube strength verification, and zero tolerance for hazardous practices.",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            Accreditations & Guarantees
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            INDUSTRY-CERTIFIED CREDENTIALS
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            We operate strictly within regulatory frameworks, ensuring complete legal and structural compliance for your investment.
          </p>
        </div>

        {/* Credentials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {credentialsList.map((cred, idx) => {
            const Icon = cred.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-5">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 block mb-1">
                    {cred.badge}
                  </span>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {cred.title}
                  </h3>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-amber-800 font-semibold mb-3 break-all">
                    {cred.number}
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed">
                    {cred.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
