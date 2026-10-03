'use client';

import React from 'react';
import { Testimonial } from '@/types';
import { Star, Quote, MapPin } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            Client Voices & Experiences
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            TRUSTED BY FAMILIES & BUSINESS LEADERS
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Read authentic reviews from clients who trusted MK Construction to build their legacy homes and commercial establishments.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-slate-50 rounded-2xl p-7 border border-slate-200 hover:border-amber-400 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xs hover:shadow-md relative group"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-amber-500/20 group-hover:text-amber-500/30 transition-colors" />

              <div>
                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < test.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-xs font-bold text-amber-800">
                    5.0 / 5.0
                  </span>
                </div>

                {/* Comment */}
                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{test.comment}&rdquo;
                </p>
              </div>

              {/* Client Info */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {test.client_name}
                    </h4>
                    {test.client_role && (
                      <p className="text-[11px] text-amber-700 font-semibold">
                        {test.client_role}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>{test.location.split(',')[0]}</span>
                  </div>
                </div>

                {test.project_title && (
                  <div className="mt-2 text-[10px] text-slate-500 font-mono">
                    Project: {test.project_title}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
