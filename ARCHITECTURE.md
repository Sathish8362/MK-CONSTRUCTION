# MK CONSTRUCTION - PROJECT ARCHITECTURE & FILE STRUCTURE

This full-stack application is organized into a modular **Frontend vs Backend Separation** while preserving 100% compatibility with Next.js App Router conventions.

---

## 🏗️ Directory Organization

```
Final Construction/
│
├── src/
│   ├── backend/                    # 🔙 BACKEND LOGIC & DATA LAYER
│   │   ├── db/                     # Data stores, persistence & initial seeds
│   │   │   ├── data-store.ts       # File-backed persistence (.data/store.json) & Supabase query abstraction
│   │   │   └── mock-data.ts        # Initial database schemas and seeds
│   │   ├── services/               # Server-side business logic
│   │   │   ├── notifications.ts    # WhatsApp (Meta/Twilio), SMS, and Email (Resend) dispatchers
│   │   │   ├── image-compression.ts# WebP conversion, aspect ratio and size optimization
│   │   │   └── auth.ts             # Session verification and owner credential validator
│   │   ├── supabase/               # Server-side Supabase clients
│   │   │   ├── admin.ts            # Supabase Admin (Service Role) client
│   │   │   └── server.ts           # Supabase Server (Cookie-based Auth) client
│   │   └── index.ts                # Backend barrel export
│   │
│   ├── frontend/                   # 🎨 FRONTEND UI & CLIENT LOGIC
│   │   ├── components/             # Reusable UI component modules
│   │   │   ├── customer/           # Customer-facing website components
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── QuoteForm.tsx
│   │   │   │   ├── ProjectGallery.tsx
│   │   │   │   ├── BeforeAfterSlider.tsx
│   │   │   │   ├── LightboxModal.tsx
│   │   │   │   ├── AboutUs.tsx
│   │   │   │   ├── ServicesSection.tsx
│   │   │   │   ├── HowWeWork.tsx
│   │   │   │   ├── TestimonialsSection.tsx
│   │   │   │   ├── FAQSection.tsx
│   │   │   │   ├── Credentials.tsx
│   │   │   │   ├── ContactSection.tsx
│   │   │   │   ├── FloatingActionButtons.tsx
│   │   │   │   ├── KeyFactsStrip.tsx
│   │   │   │   ├── PWAInstallPrompt.tsx
│   │   │   │   └── ProjectDetailClient.tsx
│   │   │   └── admin/              # Owner administration components
│   │   │       └── AdminLayout.tsx # Light theme administrative sidebar & navigation
│   │   ├── supabase/               # Client-side Supabase
│   │   │   └── client.ts           # Browser Supabase client
│   │   └── index.ts                # Frontend barrel export
│   │
│   ├── app/                        # ⚡ NEXT.JS APP ROUTER ENTRYPOINTS
│   │   ├── (customer pages)        # Home (/), Projects (/projects/[slug])
│   │   ├── admin/                  # Dashboard (/admin), Enquiries, Content, Projects, Settings, Login
│   │   ├── api/                    # API Route Handlers (/api/quote, /api/admin/*, /api/auth/*)
│   │   ├── globals.css             # Light theme design tokens & global CSS
│   │   └── layout.tsx              # Root HTML layout with colorScheme: 'light'
│   │
│   ├── types/                      # 📐 SHARED DATA CONTRACTS & INTERFACES
│   │   └── index.ts                # Project, Enquiry, ServiceItem, Testimonial, FAQItem, SiteSettings
│   │
│   ├── lib/                        # 🔗 BACKWARDS-COMPATIBILITY RE-EXPORT BRIDGE
│   │   ├── data-store.ts           # Re-exports from @/backend/db/data-store
│   │   ├── mock-data.ts            # Re-exports from @/backend/db/mock-data
│   │   ├── notifications.ts        # Re-exports from @/backend/services/notifications
│   │   ├── image-compression.ts    # Re-exports from @/backend/services/image-compression
│   │   └── supabase/               # Re-exports from @/backend/supabase and @/frontend/supabase
│   │
│   └── components/                 # 🔗 BACKWARDS-COMPATIBILITY RE-EXPORT BRIDGE
│       ├── customer/               # Points to @/frontend/components/customer
│       └── admin/                  # Points to @/frontend/components/admin
│
├── .data/                          # 💾 LOCAL PERSISTENT STORAGE
│   └── store.json                  # Disk store maintaining all quotes and admin edits
│
└── tsconfig.json                   # Path aliases (@/backend/*, @/frontend/*, @/*)
```

---

## 🎨 Light Theme Enforced

- **Global Override:** `:root`, `html`, `body`, and all form elements (`input`, `select`, `textarea`, `button`) have `color-scheme: light !important;`.
- **Operating System / Browser Dark Mode Protection:** Even if the visitor or browser has dark mode turned on globally, inputs, selects, backgrounds, and text remain crisp light slate on white.
- **Admin Panel:** Clean white sidebar (`bg-white border-r border-slate-200`), dark slate typography (`text-slate-950`), and vibrant amber accents (`bg-amber-500`).

---

## 🚀 Import Paths & Path Aliases

Both direct and bridged import patterns are supported:

```typescript
// Backend import example:
import { getEnquiries, createEnquiry } from '@/backend/db/data-store';
import { sendWhatsAppNotification } from '@/backend/services/notifications';

// Frontend import example:
import { Hero } from '@/frontend/components/customer/Hero';
import { AdminLayout } from '@/frontend/components/admin/AdminLayout';

// Shared types:
import { Enquiry, Project } from '@/types';
```
