import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const projectId = formData.get('projectId') as string || 'general';

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds 10MB maximum limit." }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!validTypes.includes(file.type.toLowerCase()) && !file.name.toLowerCase().endsWith('.heic')) {
      return NextResponse.json({ error: "Invalid image format. Allowed: JPG, PNG, WebP, HEIC." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `projects/${projectId}/${Date.now()}_${cleanFileName}`;

    if (isSupabaseConfigured()) {
      const supabase = createAdminClient();
      const { data, error } = await supabase.storage
        .from('project-media')
        .upload(storagePath, buffer, {
          contentType: file.type || 'image/webp',
          upsert: true,
        });

      if (error) {
        console.error("Supabase storage error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const { data: publicUrlData } = supabase.storage
        .from('project-media')
        .getPublicUrl(data.path);

      return NextResponse.json({
        success: true,
        storagePath: data.path,
        publicUrl: publicUrlData.publicUrl,
        fileName: file.name,
      });
    }

    // Fallback: create base64 data URL for local preview testing
    const base64 = buffer.toString('base64');
    const mime = file.type || 'image/webp';
    const fallbackDataUrl = `data:${mime};base64,${base64}`;

    return NextResponse.json({
      success: true,
      storagePath,
      publicUrl: fallbackDataUrl,
      fileName: file.name,
    });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 });
  }
}
