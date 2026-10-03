'use client';

import React from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/types';
import { HardHat, Phone, Mail, MapPin, Shield, Lock, ExternalLink } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 border-t border-slate-200 text-slate-600 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-xs">
                <HardHat className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-black text-slate-900 tracking-wider block">
                  MK <span className="text-amber-600">CONSTRUCTION</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  Thirubuvanam, Tamil Nadu
                </span>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed text-xs">
              Premier turnkey residential villas, commercial complexes, and bespoke interior design across Tamil Nadu. Building solid foundations since {settings.established_year}.
            </p>

            <div className="pt-2">
              <span className="inline-block px-2.5 py-1 rounded bg-white border border-slate-200 text-amber-800 text-[11px] font-bold shadow-xs">
                PWD Class-1 Registered • 10-Yr Warranty
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#services" className="text-slate-600 hover:text-amber-600 transition-colors">Construction Services</a>
              </li>
              <li>
                <a href="#projects" className="text-slate-600 hover:text-amber-600 transition-colors">Completed Projects Gallery</a>
              </li>
              <li>
                <a href="#how-we-work" className="text-slate-600 hover:text-amber-600 transition-colors">4-Step Construction Workflow</a>
              </li>
              <li>
                <a href="#about" className="text-slate-600 hover:text-amber-600 transition-colors">About MK Construction</a>
              </li>
              <li>
                <a href="#testimonials" className="text-slate-600 hover:text-amber-600 transition-colors">Verified Client Testimonials</a>
              </li>
              <li>
                <a href="#faq" className="text-slate-600 hover:text-amber-600 transition-colors">Frequently Asked Questions</a>
              </li>
              <li>
                <a href="#quote" className="text-slate-600 hover:text-amber-600 transition-colors">Get a Free Cost Estimate</a>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs mb-4">
              Our Disciplines
            </h4>
            <ul className="space-y-2.5">
              <li>New Turnkey Homes & Luxury Villas</li>
              <li>Commercial Complexes & Retail Hubs</li>
              <li>Structural Renovation & Facelifts</li>
              <li>Architectural Interiors & Modular Kitchens</li>
              <li>Soil Bearing Capacity Testing</li>
              <li>DTCP & Municipal Approval Assistance</li>
              <li>10-Year RCC Structural Guarantee</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs mb-4">
              Head Office Contact
            </h4>
            
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-600 shrink-0" />
              <a href={`tel:${settings.owner_mobile}`} className="text-slate-900 hover:text-amber-600 font-semibold">
                {settings.owner_mobile}
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-600 shrink-0" />
              <a href={`mailto:${settings.owner_email}`} className="text-slate-900 hover:text-amber-600 break-all">
                {settings.owner_email}
              </a>
            </div>

            <div className="pt-2 text-[11px] text-slate-500">
              Hours: {settings.working_hours}
            </div>
          </div>

        </div>

        {/* Bottom Bar with Privacy Policy & Owner Portal */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-center sm:text-left text-[11px]">
            &copy; {currentYear} {settings.company_name}. All rights reserved. Registered under Laws of Tamil Nadu, India.
          </p>

          <div className="flex items-center gap-6 text-[11px]">
            <Link
              href="/privacy-policy"
              className="text-slate-600 hover:text-amber-600 transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Privacy Policy (DPDP Act)</span>
            </Link>

            <Link
              href="/admin"
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-xs transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Owner Portal &rarr;</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
