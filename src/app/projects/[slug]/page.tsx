import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjectBySlug, getSiteSettings } from '@/lib/data-store';
import { Navbar } from '@/components/customer/Navbar';
import { Footer } from '@/components/customer/Footer';
import { BeforeAfterSlider } from '@/components/customer/BeforeAfterSlider';
import { ProjectDetailClient } from '@/components/customer/ProjectDetailClient';
import { ArrowLeft, MapPin, Ruler, Clock, Tag, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found | MK Construction',
    };
  }

  return {
    title: `${project.title} - ${project.project_type} in ${project.location} | MK Construction`,
    description: project.description.slice(0, 160),
    openGraph: {
      title: `${project.title} | MK Construction Thirubuvanam`,
      description: project.description.slice(0, 160),
      images: project.photos?.[0]?.public_url ? [project.photos[0].public_url] : [],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    getProjectBySlug(slug),
    getSiteSettings(),
  ]);

  if (!project) {
    notFound();
  }

  const beforePhoto = project.photos?.find(p => p.photo_tag === 'before');
  const afterPhoto = project.photos?.find(p => p.photo_tag === 'after') || project.photos?.[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <Navbar settings={settings} />

      <main className="py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back Navigation Breadcrumb */}
          <div className="mb-8">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 hover:text-amber-800 transition-colors py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Projects</span>
            </Link>
          </div>

          {/* Project Title & Badges */}
          <div className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-amber-50 border border-amber-200 text-amber-800">
                {project.project_type}
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-100 border border-slate-200 text-slate-700">
                Completed by MK Construction
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              {project.title}
            </h1>

            <p className="mt-2 text-sm sm:text-base text-slate-600 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{project.location}</span>
            </p>
          </div>

          {/* Specs Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-slate-200 mb-12 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-500 block">Total Built-Up Area</span>
                <span className="text-sm sm:text-base font-black text-slate-900">{project.area_sqft.toLocaleString()} sq.ft</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-500 block">Execution Duration</span>
                <span className="text-sm sm:text-base font-black text-slate-900">{project.duration}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-500 block">Budget Category</span>
                <span className="text-sm sm:text-base font-black text-amber-700">{project.budget_range || 'Contract Confidential'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-500 block">Warranty Standard</span>
                <span className="text-sm sm:text-base font-black text-slate-900">10-Year RCC Deed</span>
              </div>
            </div>
          </div>

          {/* Before & After Interactive Slider (if both exist) */}
          {beforePhoto && afterPhoto && (
            <div className="mb-14">
              <div className="mb-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
                  <span>Transformation: Before & After</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Drag the slider to see the structural transformation achieved by MK Construction.
                </p>
              </div>

              <BeforeAfterSlider
                beforeUrl={beforePhoto.public_url}
                afterUrl={afterPhoto.public_url}
                beforeAlt={`Before construction of ${project.title}`}
                afterAlt={`Completed ${project.title} by MK Construction`}
              />
            </div>
          )}

          {/* Project Client Photo Gallery & Lightbox Viewer */}
          <ProjectDetailClient project={project} settings={settings} />

        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
