import { NextRequest, NextResponse } from 'next/server';
import { getEnquiries, updateEnquiryStatus } from '@/lib/data-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format');
    const enquiries = await getEnquiries();

    if (format === 'csv') {
      const headers = ['ID', 'Name', 'Mobile', 'Location', 'Project Type', 'Budget', 'Status', 'Date', 'Notes'];
      const rows = enquiries.map(e => [
        `"${e.id}"`,
        `"${(e.name || '').replace(/"/g, '""')}"`,
        `"+91${e.mobile}"`,
        `"${(e.location || '').replace(/"/g, '""')}"`,
        `"${e.project_type}"`,
        `"${e.budget}"`,
        `"${e.status}"`,
        `"${new Date(e.created_at).toISOString()}"`,
        `"${(e.owner_notes || '').replace(/"/g, '""')}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="mk_construction_enquiries_${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({ success: true, enquiries });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, owner_notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required enquiry ID or status" }, { status: 400 });
    }

    const updated = await updateEnquiryStatus(id, status, owner_notes);
    if (!updated) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update enquiry' }, { status: 500 });
  }
}
