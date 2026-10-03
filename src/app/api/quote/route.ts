import { NextRequest, NextResponse } from 'next/server';
import { createEnquiry } from '@/lib/data-store';
import { dispatchEnquiryNotifications } from '@/lib/notifications';

// In-memory rate limiting cache for quote submissions
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const ipRateLimits = new Map<string, RateLimitRecord>();
const mobileRateLimits = new Map<string, RateLimitRecord>();

function checkRateLimit(key: string, map: Map<string, RateLimitRecord>, maxRequests = 5, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const record = map.get(key);

  if (!record || now > record.resetAt) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return true; // allowed
  }

  if (record.count >= maxRequests) {
    return false; // exceeded
  }

  record.count += 1;
  return true;
}

// Basic input sanitizer
function sanitize(input?: string): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // remove HTML tags
    .trim()
    .slice(0, 1000); // cap length
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, mobile, location, project_type, budget, message, consent, _honeypot } = body;

    // 1. Honeypot anti-spam check
    if (_honeypot && _honeypot.trim() !== '') {
      console.warn("Spam detected via honeypot field, rejecting quietly");
      return NextResponse.json(
        { success: true, message: "Thanks, we will call you within one working day" },
        { status: 200 }
      );
    }

    // 2. IP extraction & Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const isLocal = ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || process.env.NODE_ENV !== 'production';
    
    if (!isLocal && !checkRateLimit(ip, ipRateLimits, 25, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many quote requests from this network. Please wait a while or call us directly." },
        { status: 429 }
      );
    }

    // 3. Server-side validation
    const cleanName = sanitize(name);
    let cleanMobile = (mobile || '').toString().replace(/[^0-9]/g, '');
    if (cleanMobile.startsWith('91') && cleanMobile.length === 12) {
      cleanMobile = cleanMobile.slice(2);
    } else if (cleanMobile.startsWith('0') && cleanMobile.length === 11) {
      cleanMobile = cleanMobile.slice(1);
    }

    const cleanLocation = sanitize(location);
    const cleanType = sanitize(project_type);
    const cleanBudget = sanitize(budget);
    const cleanMessage = sanitize(message);

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json({ error: "Please provide a valid full name (minimum 2 characters)." }, { status: 400 });
    }

    // Indian 10-digit mobile number validation: starts with 6, 7, 8, or 9
    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (!indianMobileRegex.test(cleanMobile)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian mobile number (e.g. 9150786656)." },
        { status: 400 }
      );
    }

    if (!isLocal && !checkRateLimit(cleanMobile, mobileRateLimits, 15, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "A quote request was already submitted recently for this mobile number. Our team will contact you shortly!" },
        { status: 429 }
      );
    }

    if (!cleanLocation || cleanLocation.length < 2) {
      return NextResponse.json({ error: "Please provide your project location or town." }, { status: 400 });
    }

    if (!cleanType) {
      return NextResponse.json({ error: "Please select a project type." }, { status: 400 });
    }

    if (!cleanBudget) {
      return NextResponse.json({ error: "Please select an estimated budget range." }, { status: 400 });
    }

    const hasConsent = consent === true || consent === 'true' || consent === 1;
    if (!hasConsent) {
      return NextResponse.json(
        { error: "Please check the consent box agreeing to be contacted regarding this enquiry." },
        { status: 400 }
      );
    }

    // 4. Save enquiry into database (Status: 'New')
    const savedEnquiry = await createEnquiry({
      name: cleanName,
      mobile: cleanMobile,
      location: cleanLocation,
      project_type: cleanType,
      budget: cleanBudget,
      message: cleanMessage,
      consent: true,
      status: 'New',
      ip_hash: ip,
    });

    // 5. Asynchronously dispatch notifications (WhatsApp & Email) to Owner
    // If notification fails, enquiry is still guaranteed saved
    try {
      await dispatchEnquiryNotifications(savedEnquiry);
    } catch (notifError) {
      console.error("Non-blocking notification dispatch error:", notifError);
    }

    // 6. Return friendly success confirmation to customer
    return NextResponse.json({
      success: true,
      enquiryId: savedEnquiry.id,
      message: "Thanks, we will call you within one working day",
    });

  } catch (error: any) {
    console.error("API quote error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while submitting your enquiry. Please call us directly." },
      { status: 500 }
    );
  }
}
