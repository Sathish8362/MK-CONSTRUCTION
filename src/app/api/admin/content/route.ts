import { NextRequest, NextResponse } from 'next/server';
import { 
  getSiteSettings, 
  updateSiteSettings, 
  getServices, 
  updateServices, 
  getTestimonials, 
  updateTestimonials, 
  getFAQs, 
  updateFAQs 
} from '@/lib/data-store';

export async function GET() {
  try {
    const [settings, services, testimonials, faqs] = await Promise.all([
      getSiteSettings(),
      getServices(),
      getTestimonials(),
      getFAQs(),
    ]);

    return NextResponse.json({
      success: true,
      content: {
        settings,
        services,
        testimonials,
        faqs,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    switch (type) {
      case 'settings':
        const updatedSettings = await updateSiteSettings(data);
        return NextResponse.json({ success: true, settings: updatedSettings });
      case 'services':
        const updatedServices = await updateServices(data);
        return NextResponse.json({ success: true, services: updatedServices });
      case 'testimonials':
        const updatedTestimonials = await updateTestimonials(data);
        return NextResponse.json({ success: true, testimonials: updatedTestimonials });
      case 'faqs':
        const updatedFAQs = await updateFAQs(data);
        return NextResponse.json({ success: true, faqs: updatedFAQs });
      default:
        return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update content' }, { status: 500 });
  }
}
