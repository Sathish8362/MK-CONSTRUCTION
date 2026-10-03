'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Menu, X, HardHat, ExternalLink, Shield } from 'lucide-react';
import { SiteSettings } from '@/types';

interface NavbarProps {
  settings: SiteSettings;
}

export function Navbar({ settings }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'How We Work', href: '#how-we-work' },
    { name: 'About', href: '#about' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs pt-safe transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <HardHat className="w-7 h-7 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-slate-900">
                  MK <span className="text-amber-600">CONSTRUCTION</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300 rounded">
                  Estd {settings.established_year}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-wide">
                Thirubuvanam, Tamil Nadu
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-700 hover:text-amber-600 transition-colors py-2 tracking-wide"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Direct Owner Portal Link on Desktop */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 text-xs font-bold transition-all min-tap-target"
              title="Access Owner Admin Panel"
            >
              <HardHat className="w-3.5 h-3.5 text-amber-600" />
              <span>Owner Portal</span>
            </Link>

            <a
              href={`tel:${settings.owner_mobile}`}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold tracking-wider transition-colors min-tap-target shadow-xs"
              title="Call Owner Directly"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>{settings.owner_mobile}</span>
            </a>

            <a
              href="#quote"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 transition-all hover:scale-102 active:scale-98 min-tap-target"
            >
              <span>Get Free Quote</span>
            </a>
          </div>

          {/* Mobile menu button & quick phone call */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={`tel:${settings.owner_mobile}`}
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-100 text-amber-700 min-tap-target flex items-center justify-center"
              aria-label="Call Owner"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 min-tap-target flex items-center justify-center shadow-xs"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200 shadow-xl">
          <div className="grid grid-cols-2 gap-2 pt-1 pb-2">
            <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 block">Class-1 License</span>
              <span className="text-xs font-bold text-amber-700">TN-PWD Reg</span>
            </div>
            <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 block">Experience</span>
              <span className="text-xs font-bold text-amber-700">26+ Years</span>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-amber-50 hover:text-amber-700 transition-colors min-tap-target flex items-center"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
            <a
              href="#quote"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm uppercase tracking-wider min-tap-target flex items-center justify-center gap-2 shadow-md shadow-amber-500/25"
            >
              <span>Get Free Construction Quote</span>
            </a>
            <div className="flex gap-2">
              <a
                href={`tel:${settings.owner_mobile}`}
                className="flex-1 py-2.5 rounded-lg border border-slate-300 bg-white text-center text-xs font-bold text-slate-800 flex items-center justify-center gap-2 min-tap-target shadow-xs"
              >
                <Phone className="w-4 h-4 text-amber-600" />
                <span>Call {settings.owner_mobile}</span>
              </a>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-lg border border-amber-300 bg-amber-50 text-center text-xs font-bold text-amber-800 flex items-center justify-center gap-1.5 min-tap-target"
              >
                <HardHat className="w-3.5 h-3.5 text-amber-600" />
                <span>Owner Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
