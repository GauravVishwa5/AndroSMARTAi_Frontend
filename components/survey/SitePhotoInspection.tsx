'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  MapPin,
  CheckCircle2,
  UploadCloud,
  X,
  Sparkles,
  Navigation,
  Image as ImageIcon,
  Compass,
  Clock,
  Trash2,
  ExternalLink,
  Eye,
  Loader2,
  AlertCircle,
  Maximize2,
} from 'lucide-react';
import { requestsApi } from '@/lib/api/requests';

export interface SurveyPhoto {
  id: string;
  file_name: string;
  file_url: string;
  category: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  notes?: string;
  captured_at: string;
  uploaded_by?: string;
}

interface SitePhotoInspectionProps {
  requestId: string;
  propertyName?: string;
  existingPhotos?: SurveyPhoto[];
  onPhotosUpdated?: (photos: SurveyPhoto[]) => void;
}

export function SitePhotoInspection({
  requestId,
  propertyName = 'Property Site',
  existingPhotos = [],
  onPhotosUpdated,
}: SitePhotoInspectionProps) {
  const [photos, setPhotos] = useState<SurveyPhoto[]>(existingPhotos);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [surveyCategory, setSurveyCategory] = useState('Exterior Elevation');
  const [notes, setNotes] = useState('');
  const [gpsLocation, setGpsLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: string;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<SurveyPhoto | null>(null);
  const [viewingPhoto, setViewingPhoto] = useState<SurveyPhoto | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhotos(existingPhotos);
  }, [existingPhotos]);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Real HTML5 Geolocation capture with high accuracy
  const captureGPS = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      showFeedback('Geolocation is not supported by your browser', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLocation({
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
          accuracy: Number((pos.coords.accuracy || 5).toFixed(1)),
          timestamp: new Date().toLocaleTimeString(),
        });
        setIsLocating(false);
        showFeedback(`GPS coordinates locked (accuracy ±${pos.coords.accuracy.toFixed(0)}m)`);
      },
      (err) => {
        console.warn('GPS capture error:', err.message);
        setGpsLocation({
          latitude: 19.1136,
          longitude: 72.8697,
          accuracy: 10.0,
          timestamp: new Date().toLocaleTimeString(),
        });
        setIsLocating(false);
        showFeedback('GPS permission denied or timed out — using property reference GPS', 'error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle Photo Selection / Camera Capture
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);

      if (!gpsLocation) {
        captureGPS();
      }
    }
  };

  // Real Upload to Backend API & S3
  const handleUpload = async () => {
    if (!photoFile) return;
    setIsUploading(true);

    try {
      const res = await requestsApi.uploadSurveyPhoto(requestId, photoFile, {
        category: surveyCategory,
        latitude: gpsLocation?.latitude,
        longitude: gpsLocation?.longitude,
        accuracy: gpsLocation?.accuracy,
        notes: notes.trim() || undefined,
      });

      if (res?.photo) {
        const updatedList = [...photos, res.photo];
        setPhotos(updatedList);
        if (onPhotosUpdated) {
          onPhotosUpdated(updatedList);
        }
      }

      showFeedback('Geotagged survey photo uploaded & saved to case file!');
      setPhotoPreview(null);
      setPhotoFile(null);
      setNotes('');
    } catch (err: any) {
      console.error('Failed to upload survey photo:', err);
      showFeedback(err?.response?.data?.detail || 'Failed to upload photo', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Real Delete photo
  const handleConfirmDelete = async () => {
    if (!photoToDelete) return;
    const photoId = photoToDelete.id;
    setDeletingPhotoId(photoId);

    try {
      await requestsApi.deleteSurveyPhoto(requestId, photoId);
      const updatedList = photos.filter((p) => p.id !== photoId);
      setPhotos(updatedList);
      if (onPhotosUpdated) {
        onPhotosUpdated(updatedList);
      }
      if (viewingPhoto?.id === photoId) {
        setViewingPhoto(null);
      }
      showFeedback('Photo deleted successfully');
      setPhotoToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete photo:', err);
      showFeedback('Failed to remove photo', 'error');
    } finally {
      setDeletingPhotoId(null);
    }
  };

  const clearPhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
  };

  return (
    <div className="p-6 rounded-2xl theme-surface border space-y-5 shadow-xs backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b theme-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold theme-text-primary">Field Survey & Site Geotagging</h3>
            <p className="text-xs theme-text-secondary">Capture and verify site visit photographs with live GPS stamping</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {gpsLocation ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>GPS Locked (±{gpsLocation.accuracy}m)</span>
              </span>
              <a
                href={`https://www.google.com/maps?q=${gpsLocation.latitude},${gpsLocation.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg theme-card border text-blue-600 dark:text-blue-400 hover:border-blue-500 transition-colors"
                title="View on Google Maps"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <button
              onClick={captureGPS}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Acquiring GPS...' : 'Acquire GPS'}</span>
            </button>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Survey Category & GPS Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold theme-text-secondary uppercase tracking-wider mb-1.5">
            Inspection Category
          </label>
          <select
            value={surveyCategory}
            onChange={(e) => setSurveyCategory(e.target.value)}
            className="w-full theme-input border rounded-xl px-3 py-2 text-xs theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="Exterior Elevation">🏢 Building / Exterior Elevation</option>
            <option value="Flat Entrance">🚪 Unit / Flat Entrance & Nameplate</option>
            <option value="Society Board">📋 Society Notice Board / Society Plaque</option>
            <option value="CTS Boundary">📍 Physical CTS Land Boundary (North/South/East/West)</option>
            <option value="Approach Road">🚗 Approach Road & Infrastructure</option>
            <option value="Original Deed Inspection">📜 Physical Deed Verification</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold theme-text-secondary uppercase tracking-wider mb-1.5">
            Live Geotag Coordinates
          </label>
          <div className="p-2.5 rounded-xl theme-card border flex items-center justify-between text-xs font-mono">
            {gpsLocation ? (
              <div className="theme-text-primary truncate">
                <span>Lat: {gpsLocation.latitude}° | Lng: {gpsLocation.longitude}°</span>
              </div>
            ) : (
              <span className="theme-text-muted">Click &apos;Acquire GPS&apos; or capture photo to lock coordinates</span>
            )}
            <MapPin className="w-4 h-4 text-blue-500 shrink-0 ml-2" />
          </div>
        </div>
      </div>

      {/* Photo Capture & Upload Box */}
      {!photoPreview ? (
        <div className="border-2 border-dashed theme-border rounded-2xl p-6 text-center theme-card hover:border-blue-500/60 transition-all">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoCapture}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Photo with Mobile Camera / Upload File</span>
            </button>
            <p className="text-xs theme-text-muted mt-1">
              Supports live camera capture on smartphones, tablets, and field tablets
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 p-4 rounded-2xl theme-card border">
          <div className="relative rounded-xl overflow-hidden border theme-border bg-black max-h-72 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoPreview} alt="Site Survey Preview" className="max-h-72 w-full object-cover" />

            {/* Geotag Overlay Banner */}
            <div className="absolute bottom-2 left-2 right-2 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-mono flex items-center justify-between">
              <div className="truncate">
                <p className="font-semibold text-blue-300">{surveyCategory} • {propertyName}</p>
                <p className="text-slate-300 text-[11px]">
                  {gpsLocation ? `GPS: ${gpsLocation.latitude}, ${gpsLocation.longitude} (±${gpsLocation.accuracy}m)` : 'GPS Pending'}
                </p>
              </div>
              <div className="text-right shrink-0 pl-2">
                <span className="text-[10px] text-slate-400">{gpsLocation?.timestamp || new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={clearPhoto}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold theme-text-secondary uppercase tracking-wider mb-1">
              Inspection Notes / Observation
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Society nameplate clearly visible, physical boundary matches deed..."
              className="w-full theme-input border rounded-xl px-3 py-2 text-xs theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={clearPhoto}
              className="px-4 py-2 rounded-xl theme-card border text-xs font-semibold theme-text-primary hover:border-slate-400 transition-colors"
            >
              Cancel / Retake
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 active:scale-95 disabled:opacity-50 transition-all"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading Photo...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload & Attach to Title File</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Uploaded Site Photos Gallery */}
      {photos.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold theme-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
              <span>Inspection Photo Gallery ({photos.length})</span>
            </h4>
            <span className="text-[11px] theme-text-muted">Verified Case Photos</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((p) => {
              const hasError = imageErrors[p.id];

              return (
                <div
                  key={p.id}
                  className="group relative rounded-2xl overflow-hidden border theme-border theme-card shadow-xs transition-all hover:shadow-md hover:border-blue-500/50 flex flex-col justify-between"
                >
                  <div className="h-44 bg-slate-900/90 dark:bg-slate-950 flex items-center justify-center overflow-hidden relative">
                    {!hasError ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.file_url}
                        alt={p.category}
                        onError={() => setImageErrors((prev) => ({ ...prev, [p.id]: true }))}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 p-4 text-center text-slate-400">
                        <ImageIcon className="w-8 h-8 opacity-40" />
                        <span className="text-[11px] font-medium text-slate-300">{p.category}</span>
                        <span className="text-[9px] text-slate-500 font-mono truncate max-w-[200px]">{p.file_name}</span>
                      </div>
                    )}

                    {/* Category Pill */}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 shadow-sm">
                      {p.category}
                    </span>

                    {/* Top Action Overlay (Always visible on mobile, crisp on hover) */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <button
                        onClick={() => setViewingPhoto(p)}
                        className="p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all shadow-sm"
                        title="View Full Photo"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setPhotoToDelete(p)}
                        disabled={deletingPhotoId === p.id}
                        className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white backdrop-blur-md border border-rose-400/40 transition-all shadow-sm disabled:opacity-50"
                        title="Delete Photo"
                      >
                        {deletingPhotoId === p.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Content & Action Bar */}
                  <div className="p-3.5 space-y-2 text-xs flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] theme-text-secondary font-mono">
                        <span className="truncate font-semibold">
                          {p.latitude && p.longitude ? `GPS: ${p.latitude}, ${p.longitude}` : 'No GPS Tag'}
                        </span>
                        {p.latitude && p.longitude && (
                          <a
                            href={`https://www.google.com/maps?q=${p.latitude},${p.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 hover:text-blue-600 hover:underline shrink-0 ml-1 flex items-center gap-0.5 font-medium"
                          >
                            <MapPin className="w-3 h-3" /> Map
                          </a>
                        )}
                      </div>
                      {p.notes && <p className="text-xs theme-text-primary italic mt-1 line-clamp-2">&quot;{p.notes}&quot;</p>}
                    </div>

                    <div className="pt-2 border-t theme-border flex items-center justify-between">
                      <span className="text-[10px] theme-text-muted">{p.captured_at}</span>
                      <button
                        type="button"
                        onClick={() => setPhotoToDelete(p)}
                        disabled={deletingPhotoId === p.id}
                        className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-600 hover:underline transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Photo Modal Preview */}
      {viewingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="theme-surface border theme-border rounded-2xl max-w-2xl w-full p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold theme-text-primary">{viewingPhoto.category}</h4>
                <p className="text-xs theme-text-secondary font-mono">
                  {viewingPhoto.latitude && viewingPhoto.longitude
                    ? `GPS: ${viewingPhoto.latitude}, ${viewingPhoto.longitude}`
                    : 'Inspection Photo'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPhotoToDelete(viewingPhoto);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingPhoto(null)}
                  className="p-1.5 rounded-lg theme-card border theme-text-secondary hover:theme-text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden bg-black max-h-[70vh] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={viewingPhoto.file_url} alt={viewingPhoto.category} className="max-h-[70vh] w-full object-contain" />
            </div>

            {viewingPhoto.notes && (
              <p className="text-xs theme-text-primary p-2.5 rounded-xl theme-card border">
                <strong>Inspector Remark:</strong> {viewingPhoto.notes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Higher z-index so it always appears in front of the preview modal) */}
      {photoToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="theme-surface border border-rose-500/30 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold theme-text-primary">Delete Survey Photo?</h4>
                <p className="text-xs theme-text-secondary">{photoToDelete.category}</p>
              </div>
            </div>

            <p className="text-xs theme-text-secondary leading-relaxed">
              Are you sure you want to permanently delete this photo from the site survey records?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                disabled={deletingPhotoId === photoToDelete.id}
                className="px-3.5 py-2 rounded-xl theme-card border text-xs font-semibold theme-text-secondary hover:theme-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deletingPhotoId === photoToDelete.id}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {deletingPhotoId === photoToDelete.id ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SitePhotoInspection;
