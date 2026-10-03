'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project, ProjectType } from '@/types';
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  Sparkles, 
  MapPin, 
  Ruler, 
  Clock, 
  Save, 
  Eye, 
  EyeOff,
  ExternalLink 
} from 'lucide-react';

interface Props {
  initialProjects: Project[];
}

export function ProjectsManagerClient({ initialProjects }: Props) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const projectTypes: ProjectType[] = [
    'Residential',
    'Commercial',
    'Renovation',
    'Interiors',
    'Turnkey Construction',
  ];

  const handleOpenAdd = () => {
    setEditingProject({
      title: '',
      slug: '',
      project_type: 'Residential',
      area_sqft: 2500,
      duration: '8 Months',
      location: 'Thirubuvanam, Tamil Nadu',
      budget_range: '₹45 - ₹60 Lakhs',
      description: '',
      is_featured: true,
      is_published: true,
      photos: [],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject({ ...project });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject),
      });

      const data = await res.json();
      if (res.ok && data.project) {
        if (editingProject.id) {
          setProjects(prev => prev.map(p => p.id === data.project.id ? data.project : p));
        } else {
          setProjects(prev => [data.project, ...prev]);
        }
        setModalOpen(false);
      }
    } catch (err) {
      console.error("Save project error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error("Delete project error:", err);
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    // Update display orders
    newProjects.forEach((p, idx) => {
      p.display_order = idx + 1;
    });

    setProjects(newProjects);

    // Save orders to API
    try {
      await Promise.all(
        newProjects.map(p => fetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(p),
        }))
      );
    } catch (e) {
      console.error("Failed to reorder projects:", e);
    }
  };

  return (
    <div>
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Projects Portfolio Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Add new builds, edit specifications, reorder priority, and manage multi-photo galleries with auto-WebP compression.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-transform hover:scale-102 min-tap-target shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project, idx) => {
          const coverPhoto = project.photos?.find(p => p.is_cover) || project.photos?.[0] || {
            public_url: 'https://placehold.co/400x300/122144/f59e0b?text=No+Photo+Uploaded',
          };

          return (
            <div
              key={project.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors"
            >
              {/* Left Column: Thumbnail + Details */}
              <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1">
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleReorder(idx, 'up')}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed min-tap-target flex items-center justify-center cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={idx === projects.length - 1}
                    onClick={() => handleReorder(idx, 'down')}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed min-tap-target flex items-center justify-center cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Cover Thumbnail */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverPhoto.public_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/75 text-[10px] text-amber-300 px-1.5 py-0.5 rounded font-bold">
                    {project.photos?.length || 0} pics
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                      {project.project_type}
                    </span>
                    {project.is_featured && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-amber-500 text-slate-950">
                        Featured
                      </span>
                    )}
                    {!project.is_published && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-200">
                        Draft / Hidden
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-slate-900 truncate">
                    {project.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Ruler className="w-3.5 h-3.5 text-amber-600" />
                      <span>{project.area_sqft} sq.ft</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{project.duration}</span>
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{project.location}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                {/* Manage Photos CTA */}
                <Link
                  href={`/admin/projects/${project.id}/photos`}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors min-tap-target shadow-xs"
                >
                  <ImageIcon className="w-4 h-4 text-amber-700" />
                  <span>Photos ({project.photos?.length || 0})</span>
                </Link>

                {/* Edit Details */}
                <button
                  onClick={() => handleOpenEdit(project)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors min-tap-target flex items-center justify-center cursor-pointer"
                  title="Edit Project"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Delete */}
                {deleteConfirmId === project.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-2.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase min-tap-target cursor-pointer"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 min-tap-target cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(project.id)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors min-tap-target flex items-center justify-center cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT PROJECT MODAL */}
      {modalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-xl font-black text-slate-900">
                {editingProject.id ? 'Edit Project Details' : 'Add New Portfolio Project'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 min-tap-target flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      setEditingProject({ ...editingProject, title, slug: editingProject.id ? editingProject.slug : slug });
                    }}
                    placeholder="e.g. Royal Heritage Villa"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                {/* Project Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Project Type *
                  </label>
                  <select
                    value={editingProject.project_type || 'Residential'}
                    onChange={(e) => setEditingProject({ ...editingProject, project_type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500 cursor-pointer"
                  >
                    {projectTypes.map((t) => (
                      <option key={t} value={t} className="bg-white text-slate-900">{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Area */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Area (sq.ft) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProject.area_sqft || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, area_sqft: Number(e.target.value) })}
                    placeholder="3500"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500 font-mono"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.duration || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })}
                    placeholder="e.g. 10 Months"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Budget Range
                  </label>
                  <input
                    type="text"
                    value={editingProject.budget_range || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, budget_range: e.target.value })}
                    placeholder="e.g. ₹60 - 75 Lakhs"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Location in Tamil Nadu *
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.location || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                  placeholder="e.g. Kalaigar Nagar, Thirubuvanam"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Detailed Architectural Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  placeholder="Highlight key materials, architectural styling, Vastu features, and warranty details..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 pb-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.is_featured ?? true}
                    onChange={(e) => setEditingProject({ ...editingProject, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-white border-slate-300 accent-amber-500"
                  />
                  <span>Show in Featured Projects</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.is_published ?? true}
                    onChange={(e) => setEditingProject({ ...editingProject, is_published: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-white border-slate-300 accent-amber-500"
                  />
                  <span>Publish to Customer Website</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider min-tap-target cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 min-tap-target cursor-pointer shadow-md shadow-amber-500/20"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Project</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
