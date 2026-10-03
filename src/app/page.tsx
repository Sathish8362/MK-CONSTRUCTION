import React from 'react';
import { 
  getSiteSettings, 
  getProjects, 
  getServices, 
  getTestimonials, 
  getFAQs 
} from '@/lib/data-store';

import { Navbar } from '@/components/customer/Navbar';
import { Hero } from '@/components/customer/Hero';
import { KeyFactsStrip } from '@/components/customer/KeyFactsStrip';
import { ServicesSection } from '@/components/customer/ServicesSection';
import { ProjectGallery } from '@/components/customer/ProjectGallery';
import { HowWeWork } from '@/components/customer/HowWeWork';
import { AboutUs } from '@/components/customer/AboutUs';
import { Credentials } from '@/components/customer/Credentials';
import { TestimonialsSection } from '@/components/customer/TestimonialsSection';
import { FAQSection } from '@/components/customer/FAQSection';
import { QuoteForm } from '@/components/customer/QuoteForm';
import { ContactSection } from '@/components/customer/ContactSection';
import { Footer } from '@/components/customer/Footer';
import { FloatingActionButtons } from '@/components/customer/FloatingActionButtons';
import { PWAInstallPrompt } from '@/components/customer/PWAInstallPrompt';

export default async function CustomerHomePage() {
  const [settings, projects, services, testimonials, faqs] = await Promise.all([
    getSiteSettings(),
    getProjects(false), // only published projects
    getServices(),
    getTestimonials(),
    getFAQs(),
  ]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      
      {/* 1. Header & Navigation */}
      <Navbar settings={settings} />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero settings={settings} />

        {/* 3. Key Facts Strip */}
        <KeyFactsStrip settings={settings} />

        {/* 4. Core Services */}
        <ServicesSection services={services} />

        {/* 5. Projects Portfolio Gallery */}
        <ProjectGallery projects={projects} />

        {/* 6. How We Work (4 Steps) */}
        <HowWeWork />

        {/* 7. About MK Construction */}
        <AboutUs settings={settings} />

        {/* 8. Credentials (License, Insurance, Warranty, Safety) */}
        <Credentials settings={settings} />

        {/* 9. Testimonials */}
        <TestimonialsSection testimonials={testimonials} />

        {/* 10. Frequently Asked Questions */}
        <FAQSection faqs={faqs} />

        {/* 11. Free Quote Request Form */}
        <QuoteForm settings={settings} />

        {/* 12. Office Location & Contact */}
        <ContactSection settings={settings} />
      </main>

      {/* 13. Footer */}
      <Footer settings={settings} />

      {/* 14. Floating WhatsApp & Call Buttons */}
      <FloatingActionButtons phone={settings.owner_mobile} />

      {/* 15. Progressive Web App Install Banner */}
      <PWAInstallPrompt />

    </div>
  );
}
