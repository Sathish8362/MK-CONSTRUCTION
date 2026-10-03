import { NextRequest, NextResponse } from 'next/server';
import { getProjects, saveProject, deleteProject } from '@/lib/data-store';

export async function GET(req: NextRequest) {
  try {
    const projects = await getProjects(true); // include unpublished for admin
    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const saved = await saveProject(body);
    return NextResponse.json({ success: true, project: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: "Missing project ID" }, { status: 400 });
    }
    await deleteProject(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete project' }, { status: 500 });
  }
}
