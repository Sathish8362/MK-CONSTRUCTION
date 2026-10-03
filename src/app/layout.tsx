import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f8fafc",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://yourcompany.com"),
  title: {
    default: "MK Construction | Turnkey Builders in Thirubuvanam, Tamil Nadu",
    template: "%s | MK Construction",
  },
  description: "Premier construction company in Thirubuvanam, Tamil Nadu since 2000. Luxury new homes, commercial complexes, structural renovation, and architectural interiors with 10-year warranty.",
  keywords: [
    "Construction in Thirubuvanam",
    "Builders in Thirubuvanam",
    "Building Contractors Kumbakonam",
    "Civil Engineers Thanjavur",
    "Tamil Nadu Turnkey House Construction",
    "Renovation Thirubuvanam",
    "Commercial Building Contractors Tamil Nadu",
    "MK Construction"
  ],
  authors: [{ name: "MK Construction" }],
  creator: "MK Construction",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://yourcompany.com",
    title: "MK Construction | Solid Foundations Since 2000",
    description: "New homes, commercial buildings, renovation & interiors in Thirubuvanam, Tamil Nadu. Licensed Class-1 contractors.",
    siteName: "MK Construction",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "MK Construction Royal Residence Elevation",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "name": "MK Construction",
    "alternateName": "MK Construction & Engineering",
    "foundingDate": "2000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "38/4, Kalaigar Nagar",
      "addressLocality": "Thirubuvanam",
      "addressRegion": "Tamil Nadu",
      "postalCode": "612103",
      "addressCountry": "IN"
    },
    "telephone": "+919150786656",
    "email": "sathishsathish979139@gmail.com",
    "url": "https://yourcompany.com",
    "openingHours": "Mo-Sa 09:00-18:00",
    "areaServed": [
      "Thirubuvanam",
      "Kumbakonam",
      "Thanjavur",
      "Mayiladuthurai",
      "Tamil Nadu"
    ],
    "priceRange": "₹₹",
    "description": "Licensed Class-1 building contractor in Thirubuvanam, Tamil Nadu specializing in turnkey residential homes, commercial buildings, and renovations."
  };

  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" style={{ colorScheme: 'light' }} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-[#f8fafc] text-slate-900 selection:bg-amber-500 selection:text-slate-950" suppressHydrationWarning>
        {children}
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('[PWA] ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('[PWA] ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
