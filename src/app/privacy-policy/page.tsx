import React from 'react';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/data-store';
import { Navbar } from '@/components/customer/Navbar';
import { Footer } from '@/components/customer/Footer';
import { Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy & DPDP Act Compliance | MK Construction Thirubuvanam',
  description: 'Learn how MK Construction protects customer personal data and phone numbers under the Digital Personal Data Protection (DPDP) Act of India.',
};

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <Navbar settings={settings} />

      <main className="py-16 flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 hover:text-amber-800 transition-colors py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-950">
                  Privacy Policy & Data Protection
                </h1>
                <p className="text-xs text-amber-700 font-bold mt-1 uppercase tracking-wider">
                  In Compliance with India&apos;s Digital Personal Data Protection (DPDP) Act
                </p>
              </div>
            </div>

            <div className="space-y-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-6">
              <p>
                At <strong>{settings.company_name}</strong> (established 2000, Thirubuvanam, Tamil Nadu), we respect your right to privacy and are committed to safeguarding personal information collected through our website, quote estimation forms, and communication channels.
              </p>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  1. Information We Collect
                </h2>
                <p>When you submit a quote request or contact our team, we collect:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2 text-slate-600">
                  <li>Your Name and Contact Details (including your 10-digit Indian Mobile Number)</li>
                  <li>Project Location / Town in Tamil Nadu</li>
                  <li>Type of Construction Requested and Estimated Budget</li>
                  <li>Optional notes or plot specifications provided by you</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  2. How Your Phone Number and Data are Used
                </h2>
                <p>
                  Your phone number and enquiry data are used exclusively for:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2 text-slate-600">
                  <li>Directly calling or messaging you via WhatsApp regarding your specific construction enquiry</li>
                  <li>Scheduling on-site plot measurements and preparing technical estimations</li>
                  <li>Providing construction progress updates if a contract is formalized</li>
                </ul>
                <div className="mt-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <strong>Strict Non-Disclosure Guarantee:</strong> We NEVER sell, lease, rent, trade, or publicly expose customer phone numbers to third-party telemarketers, financiers, or advertisers.
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  3. Access Control & Row Level Security (RLS)
                </h2>
                <p>
                  All customer enquiry records are stored in an encrypted PostgreSQL database secured with strict <strong>Row Level Security (RLS)</strong> policies. Only authenticated owners of MK Construction can access submitted enquiries. Public visitors and search crawlers cannot view any submitted phone numbers or personal records.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  4. Your Rights under the DPDP Act
                </h2>
                <p>
                  You have the right to request deletion or correction of your phone number and contact information from our database at any time. Simply call or WhatsApp our owner Sathish at <strong>{settings.owner_mobile}</strong> or email <strong>{settings.owner_email}</strong>.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 text-xs text-slate-500">
                Registered office: {settings.address} • Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
