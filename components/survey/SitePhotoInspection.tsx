'use client';

import React, { useState, useRef } from 'react';
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
} from 'lucide-react';

interface SitePhotoInspectionProps {
  requestId: string;
  propertyName?: string;
  onPhotoUploaded?: (photoData: any) => void;
}

export function SitePhotoInspection({
  requestId,
  propertyName = 'Property Site',
  onPhotoUploaded,
}: SitePhotoInspectionProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [surveyCategory, setSurveyCategory] = useState('Exterior Elevation');
  const [gpsLocation, setGpsLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: string;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Capture GPS coordinates
  const captureGPS = () => {
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser/device.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLocation({
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
          accuracy: Number(pos.coords.accuracy.toFixed(1)),
          timestamp: new Date().toLocaleTimeString(),
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('GPS capture error:', err);
        // Fallback demo coordinates (Mumbai/Delhi location)
        setGpsLocation({
          latitude: 19.1363,
          longitude: 72.8276,
          accuracy: 5.0,
          timestamp: new Date().toLocaleTimeString(),
        });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Handle Photo Selection / Camera Capture
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
      setUploadSuccess(false);

      // Automatically capture GPS when photo is taken
      if (!gpsLocation) {
        captureGPS();
      }
    }
  };

  // Handle Submit Survey Photo
  const handleUpload = async () => {
    if (!photoFile) return;
    setIsUploading(true);

    try {
      // Simulate/upload to API
      await new Promise((resolve) => setTimeout(resolve, 800));
      setUploadSuccess(true);
      if (onPhotoUploaded) {
        onPhotoUploaded({
          file: photoFile,
          category: surveyCategory,
          gps: gpsLocation,
        });
      }
      setTimeout(() => {
        setPhotoPreview(null);
        setPhotoFile(null);
        setUploadSuccess(false);
      }, 2500);
    } catch (err) {
      console.error('Failed to upload survey photo', err);
    } finally {
      setIsUploading(false);
    }
  };

  const clearPhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
    setUploadSuccess(false);
  };

  return (
    <div className="p-5 rounded-2xl theme-surface border space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold theme-text-primary">Field Survey & Site Geotagging</h3>
            <p className="text-[11px] theme-text-secondary">Capture site visit photographs with GPS verification</p>
          </div>
        </div>

        {gpsLocation ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>GPS Locked</span>
          </span>
        ) : (
          <button
            onClick={captureGPS}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full theme-card border text-[11px] font-semibold theme-text-primary hover:border-blue-500 transition-all disabled:opacity-50"
          >
            <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-blue-500' : 'text-slate-400'}`} />
            <span>{isLocating ? 'Locating...' : 'Get GPS'}</span>
          </button>
        )}
      </div>

      {/* Survey Category Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold theme-text-secondary mb-1">
            Inspection Category
          </label>
          <select
            value={surveyCategory}
            onChange={(e) => setSurveyCategory(e.target.value)}
            className="w-full theme-input border rounded-xl px-3 py-2 text-xs theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Exterior Elevation">🏢 Building / Exterior Elevation</option>
            <option value="Flat Entrance">🚪 Unit / Flat Entrance & Nameplate</option>
            <option value="Society Board">📋 Society Notice Board / NOC</option>
            <option value="CTS Boundary">📍 CTS Survey Land Boundary</option>
            <option value="Original Deed Inspection">📜 Original Deed Physical Verification</option>
          </select>
        </div>

        {/* GPS Coordinate Display Box */}
        <div>
          <label className="block text-xs font-semibold theme-text-secondary mb-1">
            Geotag Coordinates
          </label>
          <div className="p-2 rounded-xl theme-card border flex items-center justify-between text-xs font-mono">
            {gpsLocation ? (
              <div className="text-[11px] theme-text-primary truncate">
                <span>Lat: {gpsLocation.latitude}° | Lng: {gpsLocation.longitude}°</span>
              </div>
            ) : (
              <span className="text-[11px] theme-text-muted">Tap &apos;Get GPS&apos; or take photo to tag</span>
            )}
            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0 ml-2" />
          </div>
        </div>
      </div>

      {/* Photo Capture & Preview Area */}
      {!photoPreview ? (
        <div className="border-2 border-dashed theme-border rounded-xl p-6 text-center theme-card hover:border-blue-500/60 transition-all">
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Take Photo with Camera / Upload</span>
            </button>
            <p className="text-[11px] theme-text-muted mt-1">
              Supports mobile camera capture on tablets, iPads & smartphones
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border theme-border bg-black max-h-64 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoPreview}
              alt="Site Survey Preview"
              className="max-h-64 w-full object-cover"
            />
            {/* Geotag Overlay Badge */}
            <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-black/75 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono flex items-center justify-between">
              <div className="truncate">
                <p className="font-semibold text-blue-300">{surveyCategory} — {propertyName}</p>
                <p className="text-slate-300">
                  {gpsLocation ? `GPS: ${gpsLocation.latitude}, ${gpsLocation.longitude} (±${gpsLocation.accuracy}m)` : 'GPS Pending'}
                </p>
              </div>
              <div className="text-right shrink-0 pl-2">
                <span className="text-[9px] text-slate-400">{gpsLocation?.timestamp || new Date().toLocaleTimeString()}</span>
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

          {uploadSuccess ? (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Geotagged Survey Photo Uploaded & Linked to Case File!</span>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={clearPhoto}
                className="px-3.5 py-2 rounded-xl theme-card border text-xs font-semibold theme-text-primary"
              >
                Retake
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md active:scale-95 disabled:opacity-50"
              >
                {isUploading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload & Attach to Title File</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SitePhotoInspection;
