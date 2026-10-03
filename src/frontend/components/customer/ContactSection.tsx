'use client';

import React from 'react';
import { SiteSettings } from '@/types';
import { Phone, Mail, MapPin, Clock, MessageSquare, Navigation } from 'lucide-react';

interface ContactSectionProps {
  settings: SiteSettings;
}

export function ContactSection({ settings }: ContactSectionProps) {
  const cleanMobile = settings.owner_mobile.replace(/[^0-9]/g, '');

  return (
    <section id="contact" className="py-24 bg-slate-50 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Direct Contact Details */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
              Get In Touch Directly
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight mb-6">
              VISIT OUR OFFICE OR CALL US TODAY
            </h2>

            <p className="text-slate-600 text-base leading-relaxed mb-8">
              Whether you want to inspect ongoing building sites in Thirubuvanam or review structural blueprints at our office, we are always available.
            </p>

            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition-colors shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Direct Phone Line
                  </h4>
                  <a
                    href={`tel:${settings.owner_mobile}`}
                    className="text-lg sm:text-xl font-black text-slate-900 hover:text-amber-600 transition-colors block mt-0.5"
                  >
                    {settings.owner_mobile}
                  </a>
                  <p className="text-xs text-slate-500 mt-1">Tap to call our lead civil engineer directly.</p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 transition-colors shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    WhatsApp Chat
                  </h4>
                  <a
                    href={`https://wa.me/${cleanMobile}?text=Hello%20MK%20Construction,%20I%20would%20like%20to%20discuss%20a%20project.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg sm:text-xl font-black text-emerald-600 hover:underline block mt-0.5"
                  >
                    +91 {cleanMobile.slice(-10)}
                  </a>
                  <p className="text-xs text-slate-500 mt-1">Instant photo sharing and quote queries.</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition-colors shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Email Correspondence
                  </h4>
                  <a
                    href={`mailto:${settings.owner_email}`}
                    className="text-base sm:text-lg font-bold text-slate-900 hover:text-amber-600 transition-colors block mt-0.5 break-all"
                  >
                    {settings.owner_email}
                  </a>
                  <p className="text-xs text-slate-500 mt-1">Send blueprints and CAD drawings for review.</p>
                </div>
              </div>

              {/* Address & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase mb-2">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>Office Address</span>
                  </div>
                  <p className="text-slate-800 text-xs sm:text-sm font-semibold leading-relaxed">
                    {settings.address}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase mb-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Working Hours</span>
                  </div>
                  <p className="text-slate-800 text-xs sm:text-sm font-semibold leading-relaxed">
                    {settings.working_hours}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Sunday by appointment</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Directions Map Representation */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Headquarters & Site Location
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thirubuvanam, Thanjavur District, Tamil Nadu - 612103
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                  <Navigation className="w-5 h-5" />
                </div>
              </div>

              {/* Map Graphic Preview */}
              <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-blueprint-pattern opacity-90" />
                
                {/* Visual Location Pin Indicator */}
                <div className="relative text-center z-10 p-6 bg-white/95 rounded-2xl border border-amber-300 shadow-xl backdrop-blur-md">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center mx-auto mb-2 animate-bounce shadow-md">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-slate-900 text-base">MK CONSTRUCTION</h4>
                  <p className="text-xs text-amber-700 font-bold mt-0.5">38/4, Kalaigar Nagar</p>
                  <p className="text-[11px] text-slate-500">Thirubuvanam - 612103</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent('MK Construction Thirubuvanam 612103')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-center font-bold text-xs uppercase tracking-wider border border-slate-200 transition-colors flex items-center justify-center gap-2 min-tap-target"
              >
                <Navigation className="w-4 h-4 text-amber-600" />
                <span>Open in Google Maps</span>
              </a>

              <a
                href={`tel:${settings.owner_mobile}`}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider text-center transition-colors min-tap-target flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
              >
                <Phone className="w-4 h-4" />
                <span>Call Before Visiting</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
