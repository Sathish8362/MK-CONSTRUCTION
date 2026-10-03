/**
 * Frontend Architecture Barrel Export
 * Groups all customer-facing and admin-facing UI components, client-side Supabase, and utilities.
 */

// Customer UI Components
export * from './components/customer/Navbar';
export * from './components/customer/Footer';
export * from './components/customer/Hero';
export * from './components/customer/QuoteForm';
export * from './components/customer/ProjectGallery';
export * from './components/customer/BeforeAfterSlider';
export * from './components/customer/LightboxModal';
export * from './components/customer/AboutUs';
export * from './components/customer/ServicesSection';
export * from './components/customer/HowWeWork';
export * from './components/customer/TestimonialsSection';
export * from './components/customer/FAQSection';
export * from './components/customer/Credentials';
export * from './components/customer/ContactSection';
export * from './components/customer/FloatingActionButtons';
export * from './components/customer/KeyFactsStrip';
export * from './components/customer/PWAInstallPrompt';
export * from './components/customer/ProjectDetailClient';

// Admin UI Components
export * from './components/admin/AdminLayout';

// Browser Supabase Client
export * from './supabase/client';
