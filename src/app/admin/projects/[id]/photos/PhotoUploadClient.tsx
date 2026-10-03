'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Project, ProjectPhoto } from '@/types';
import { compressAndConvertToWebP } from '@/lib/image-compression';
import { 
  UploadCloud, 
  Camera, 
  Trash2, 
  Check, 
  ArrowLeft, 
  Save, 
  ArrowLeftRight, 
  Image as ImageIcon, 
  Sparkles, 
  Star, 
  AlertCircle,
  MoveLeft,
  MoveRight 
} from 'lucide-react';

interface Props {
  project: Project;
}

export function PhotoUploadClient({ project: initialProject }: Props) {
  const [project, setProject] = useState<Project>(initialProject);
  const [photos, setPhotos] = useState<ProjectPhoto[]>(initialProject.photos || []);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [savingChanges, setSavingChanges] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(10);
    setStatusMessage(`Processing ${files.length} photo(s)...`);

    const newUploadedPhotos: ProjectPhoto[] = [];

    for (let i = 0; i < files.length; i++) {
      const originalFile = files[i];

      // Validate size (< 10MB)
      if (originalFile.size > 10 * 1024 * 1024) {
        alert(`File "${originalFile.name}" exceeds 10MB limit and was skipped.`);
        continue;
      }

      setStatusMessage(`Auto-compressing to WebP: ${originalFile.name}...`);
      
      // 1. Client-side canvas compression & WebP conversion
      let webpFile: File;
      try {
        webpFile = await compressAndConvertToWebP(originalFile, {
          maxWidth: 2048,
          maxHeight: 2048,
          quality: 0.85,
        });
      } catch (cErr) {
        console.warn("Client compression fallback to original:", cErr);
        webpFile = originalFile;
      }

      setUploadProgress(Math.round(((i + 0.5) / files.length) * 80) + 10);
      setStatusMessage(`Uploading: ${webpFile.name}...`);

      // 2. Upload to API route
      const formData = new FormData();
      formData.append('file', webpFile);
      formData.append('projectId', project.id);

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.publicUrl) {
          newUploadedPhotos.push({
            id: `photo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            project_id: project.id,
            storage_path: data.storagePath,
            public_url: data.publicUrl,
            caption: originalFile.name.replace(/\.[^/.]+$/, ""),
            is_cover: photos.length === 0 && newUploadedPhotos.length === 0,
            photo_tag: 'standard',
            display_order: photos.length + newUploadedPhotos.length + 1,
            created_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("Upload error for file:", originalFile.name, err);
      }

      setUploadProgress(Math.round(((i + 1) / files.length) * 85) + 10);
    }

    const updatedPhotos = [...photos, ...newUploadedPhotos];
    setPhotos(updatedPhotos);
    setUploadProgress(100);
    setStatusMessage(`Successfully uploaded ${newUploadedPhotos.length} photo(s)!`);

    // Auto-save project with new photos
    await saveProjectPhotos(updatedPhotos);

    setTimeout(() => {
      setUploading(false);
      setUploadProgress(0);
      setStatusMessage(null);
    }, 1500);
  };

  const saveProjectPhotos = async (photosToSave: ProjectPhoto[]) => {
    setSavingChanges(true);
    try {
      const updatedProject = { ...project, photos: photosToSave };
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject),
      });

      if (res.ok) {
        setProject(updatedProject);
      }
    } catch (e) {
      console.error("Save project photos error:", e);
    } finally {
      setSavingChanges(false);
    }
  };

  const handleSetCover = (photoId: string) => {
    const updated = photos.map(p => ({
      ...p,
      is_cover: p.id === photoId,
    }));
    setPhotos(updated);
    saveProjectPhotos(updated);
  };

  const handleTagChange = (photoId: string, tag: 'standard' | 'before' | 'after') => {
    const updated = photos.map(p => p.id === photoId ? { ...p, photo_tag: tag } : p);
    setPhotos(updated);
    saveProjectPhotos(updated);
  };

  const handleCaptionChange = (photoId: string, caption: string) => {
    const updated = photos.map(p => p.id === photoId ? { ...p, caption } : p);
    setPhotos(updated);
  };

  const handleDeletePhoto = (photoId: string) => {
    const updated = photos.filter(p => p.id !== photoId);
    if (updated.length > 0 && !updated.some(p => p.is_cover)) {
      updated[0].is_cover = true;
    }
    setPhotos(updated);
    saveProjectPhotos(updated);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= photos.length) return;

    const copy = [...photos];
    const item = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = item;

    copy.forEach((p, i) => { p.display_order = i + 1; });
    setPhotos(copy);
    saveProjectPhotos(copy);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="mb-2">
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 hover:text-amber-700 py-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects Manager</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Photo Gallery Manager: {project.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Upload from mobile camera or desktop. Automatically compressed to modern WebP format. Tag photos as Before/After.
          </p>
        </div>

        <button
          onClick={() => saveProjectPhotos(photos)}
          disabled={savingChanges}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-102 min-tap-target shrink-0"
        >
          {savingChanges ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Order & Captions</span>
            </>
          )}
        </button>
      </div>

      {/* DRAG AND DROP / UPLOAD ZONE */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        className={`bg-white border-2 border-dashed ${
          isDragging ? 'border-amber-500 bg-amber-50' : 'border-slate-300 hover:border-amber-400'
        } rounded-3xl p-8 sm:p-12 text-center transition-all mb-10 shadow-xs relative`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/heic"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        {/* Mobile Camera input with capture environment */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
            Drag and Drop Photos Here
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Supports multiple photos (JPG, PNG, WebP, HEIC up to 10MB each). Photos are auto-compressed to WebP before storing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-tap-target shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Browse Photos (Gallery)</span>
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-tap-target shadow-xs cursor-pointer"
            >
              <Camera className="w-4 h-4 text-amber-600" />
              <span>Take Photo (Camera)</span>
            </button>
          </div>
        </div>

        {/* Upload Progress Bar */}
        {uploading && (
          <div className="mt-8 pt-6 border-t border-slate-100 max-w-lg mx-auto animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-slate-700 font-semibold mb-2">
              <span>{statusMessage}</span>
              <span className="text-amber-700">{uploadProgress}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* PHOTOS GRID & MANAGEMENT */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              Project Photos ({photos.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Set cover photos, tag Before / After images for slider comparison, and add captions.
            </p>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs">
            No photos uploaded for this project yet. Use the upload box above or take a photo with your mobile camera.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                className={`bg-white rounded-2xl overflow-hidden border ${
                  photo.is_cover ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
                } flex flex-col justify-between shadow-xs transition-all`}
              >
                {/* Image Preview */}
                <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.public_url}
                    alt={photo.caption || 'Project photo'}
                    className="w-full h-full object-cover"
                  />

                  {/* Cover Photo Badge */}
                  {photo.is_cover && (
                    <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-slate-950" />
                      <span>Cover Photo</span>
                    </div>
                  )}

                  {/* Photo Tag Badge */}
                  {photo.photo_tag !== 'standard' && (
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                        photo.photo_tag === 'before'
                          ? 'bg-rose-500 text-white'
                          : 'bg-emerald-500 text-white'
                      }`}>
                        {photo.photo_tag}
                      </span>
                    </div>
                  )}

                  {/* Reorder Buttons Overlay */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 backdrop-blur-xs p-1 rounded-lg">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'left')}
                      className="p-1 rounded text-slate-300 hover:text-white disabled:opacity-30 min-tap-target flex items-center justify-center"
                      title="Move Left / Earlier"
                    >
                      <MoveLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] text-amber-400 font-mono px-1">#{idx + 1}</span>
                    <button
                      disabled={idx === photos.length - 1}
                      onClick={() => handleMove(idx, 'right')}
                      className="p-1 rounded text-slate-300 hover:text-white disabled:opacity-30 min-tap-target flex items-center justify-center"
                      title="Move Right / Later"
                    >
                      <MoveRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Photo Controls */}
                <div className="p-4 space-y-3 bg-white">
                  {/* Caption Input */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Photo Caption / Description
                    </label>
                    <input
                      type="text"
                      value={photo.caption || ''}
                      onChange={(e) => handleCaptionChange(photo.id, e.target.value)}
                      placeholder="e.g. Front facade with teak woodwork..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                    />
                  </div>

                  {/* Tag Selector: Standard, Before, After */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Comparison Tag
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['standard', 'before', 'after'] as const).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagChange(photo.id, tag)}
                          className={`py-1.5 text-[10px] font-extrabold uppercase rounded-lg border transition-colors ${
                            photo.photo_tag === tag
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 cursor-pointer'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions: Set as Cover & Delete */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    {!photo.is_cover ? (
                      <button
                        type="button"
                        onClick={() => handleSetCover(photo.id)}
                        className="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>Make Cover</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-800">
                        Primary Cover
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
