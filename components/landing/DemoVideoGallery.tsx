'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Maximize2,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  FileCheck2,
  GitBranch,
  Search,
  Database,
  Camera,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  Lock,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  RotateCcw,
  X,
  Download,
} from 'lucide-react';

export interface DemoVideoItem {
  id: string;
  videoNumber: string;
  title: string;
  category: 'Flagship' | 'Overview & Intake' | 'Borrower Portal' | 'Legal AI' | 'Field & Reports';
  tag: string;
  durationLabel: string;
  description: string;
  routes: string;
  poster: string;
  videoSrc: string;
  keyFeatures: string[];
}

export const DEMO_VIDEOS: DemoVideoItem[] = [
  {
    id: '14_complete_property_verification',
    videoNumber: '14',
    title: 'Complete Property Verification Journey (Flagship)',
    category: 'Flagship',
    tag: 'Flagship Master Demo',
    durationLabel: 'Full Journey',
    description: 'The master 16-stage end-to-end verification narrative: branch intake, live tracking number, borrower milestone portal, deficiency upload, vision OCR, AI extraction, legal review, conflict engine, IGR search, field survey, TSR report assembly, and server-level applicant isolation.',
    routes: '/login, /requests/new, /branch, /applicant/activate, /applicant/applications/7, /requests/7',
    poster: '/audit/12_workspace_req7_tab_timeline.png',
    videoSrc: '/videos/14_complete_property_verification.webm',
    keyFeatures: ['16 Cohesive Business Stages', 'IDOR Security Segment (HTTP 403)', 'Full End-to-End Workflow']
  },
  {
    id: '01_platform_overview',
    videoNumber: '01',
    title: 'PVS Platform Overview',
    category: 'Overview & Intake',
    tag: 'Multi-Role Architecture',
    durationLabel: 'Platform Tour',
    description: 'Comprehensive walkthrough demonstrating how PVS connects Branch Officers, Legal Advocates, System Administrators, and Loan Borrowers in one unified ecosystem.',
    routes: '/login, /branch, /legal, /admin, /requests/7, /applicant/dashboard',
    poster: '/audit/01_login_page.png',
    videoSrc: '/videos/01_platform_overview.webm',
    keyFeatures: ['Unified Role-Based Access', 'Branch SLA Queue', 'Legal Scrutiny Workspace']
  },
  {
    id: '02_application_intake',
    videoNumber: '02',
    title: 'Smart Application Intake',
    category: 'Overview & Intake',
    tag: '3-Step Wizard',
    durationLabel: 'Branch Intake',
    description: '3-Step guided application intake wizard: entering borrower profile (Rahul Sharma), property coordinates (Baner, Pune, Survey 124/3A, CTS-4587), and generating live tracking ID PVS-2026-000007.',
    routes: '/branch, /requests/new',
    poster: '/audit/06_new_request_wizard_step1.png',
    videoSrc: '/videos/02_application_intake.webm',
    keyFeatures: ['Applicant Profile', 'Property Geolocation & Survey 124/3A', 'Live PVS-2026-000007 Generation']
  },
  {
    id: '03_applicant_activation',
    videoNumber: '03',
    title: 'Secure Applicant Activation',
    category: 'Borrower Portal',
    tag: 'Token Onboarding',
    durationLabel: 'Account Setup',
    description: 'Borrower password setup and account activation using token validation without exposing sensitive security credentials, transitioning smoothly into the borrower dashboard.',
    routes: '/applicant/activate, /applicant/dashboard',
    poster: '/audit/02_applicant_activation_page.png',
    videoSrc: '/videos/03_applicant_activation.webm',
    keyFeatures: ['Zero Token Leakage', 'Password Complexity Validation', 'Instant Dashboard Transition']
  },
  {
    id: '04_applicant_tracking',
    videoNumber: '04',
    title: 'Applicant Portal & Tracking',
    category: 'Borrower Portal',
    tag: '4-Stage Milestones',
    durationLabel: 'Milestone Tracking',
    description: 'Borrower self-service portal featuring the 4-stage verification lifecycle (Submitted → Scrutiny → Verification → Completed) with strict privacy barriers hiding internal attorney notes.',
    routes: '/applicant/dashboard, /applicant/applications/7',
    poster: '/audit/22_applicant_dashboard.png',
    videoSrc: '/videos/04_applicant_tracking.webm',
    keyFeatures: ['4-Stage Visual Milestones', 'Application Card PVS-2026-000007', 'Sanitized Borrower View']
  },
  {
    id: '05_deficiency_workflow',
    videoNumber: '05',
    title: 'Deficiency Document Workflow',
    category: 'Borrower Portal',
    tag: 'Collaborative Loop',
    durationLabel: 'Deficiency Resolution',
    description: 'Collaborative missing document cycle: Legal Officer flags a missing prior deed; borrower receives notification, uploads Index-II to S3, and triggers the OCR processing pipeline.',
    routes: '/requests/7, /applicant/applications/7',
    poster: '/audit/23_applicant_tracking_req7.png',
    videoSrc: '/videos/05_deficiency_workflow.webm',
    keyFeatures: ['In-App Deficiency Alerts', 'S3 File Dropzone', 'OCR Trigger on Upload']
  },
  {
    id: '06_document_intelligence_workspace',
    videoNumber: '06',
    title: 'Document Intelligence Workspace',
    category: 'Legal AI',
    tag: '12-Pane Deep Dive',
    durationLabel: 'Workspace Inspection',
    description: 'In-depth showcase of all 12 audited workspace views: 3 Left Document views (Interactive, Native PDF, Raw OCR), 6 Right operational tabs (Timeline, OCR Grid, IGR, Site Survey, Flags, TSR), and 3 Modals.',
    routes: '/requests/7',
    poster: '/audit/09_workspace_req7_interactive_doc.png',
    videoSrc: '/videos/06_document_intelligence_workspace.webm',
    keyFeatures: ['Interactive OCR Deed Highlighting', 'Native PDF & Raw OCR Streams', 'Upload, Fullscreen & Edit Modals']
  },
  {
    id: '07_ocr_gemini',
    videoNumber: '07',
    title: 'AI-Powered OCR & Legal Extraction',
    category: 'Legal AI',
    tag: 'Vision OCR & Gemini',
    durationLabel: 'Data Extraction',
    description: 'High-precision multi-page legal entity extraction: verbatim Survey 124/3A preservation, dual regional Marathi/English values, page citations, and 98% AI confidence scoring.',
    routes: '/requests/7 (OCR Grid)',
    poster: '/audit/13_workspace_req7_tab_ocr_grid.png',
    videoSrc: '/videos/07_ocr_gemini.webm',
    keyFeatures: ['Immutable Survey 124/3A Preservation', 'Dual Regional & Normalized Text', 'Exact Page Snippets & 98% Confidence']
  },
  {
    id: '08_conflict_detection',
    videoNumber: '08',
    title: 'Cross-Document Conflict Detection',
    category: 'Legal AI',
    tag: 'Conflict Engine',
    durationLabel: 'Risk Discrepancy',
    description: 'Cross-document title conflict engine detecting Survey number discrepancies across deeds (Mother Deed 124/3A vs Sale Deed 124/3B) and unreleased mortgage warnings.',
    routes: '/requests/7 (Flags Tab)',
    poster: '/audit/16_workspace_req7_tab_flags_conflicts.png',
    videoSrc: '/videos/08_conflict_detection.webm',
    keyFeatures: ['Cross-Deed Survey Discrepancy Alerts', 'Active Mortgage Reconciliation', 'Advocate Risk Classifications']
  },
  {
    id: '09_legal_review',
    videoNumber: '09',
    title: 'Legal Review & Evidence Verification',
    category: 'Legal AI',
    tag: 'Human In The Loop',
    durationLabel: 'Advocate Scrutiny',
    description: 'Senior advocate evidentiary review aligning deed PDF text side-by-side with OCR entities, utilizing Accept, Edit, Mark Uncertain, and Flag controls with immutable audit stamps.',
    routes: '/requests/7 (OCR Grid & Review)',
    poster: '/audit/10_workspace_req7_native_pdf.png',
    videoSrc: '/videos/09_legal_review.webm',
    keyFeatures: ['Side-by-Side Source Text Alignment', 'Accept / Edit / Flag Controls', 'Advocate Verification Stamp']
  },
  {
    id: '10_igr_verification',
    videoNumber: '10',
    title: 'IGR Property Verification',
    category: 'Field & Reports',
    tag: 'State Land Registry',
    durationLabel: 'Registry Scraper',
    description: 'Automated integration with Maharashtra e-Search and Delhi DORIS portals: managing background scraping tasks, index queries, and direct case linkage in the title docket.',
    routes: '/admin/igr-jobs, /requests/search, /requests/7',
    poster: '/audit/14_workspace_req7_tab_igr_search.png',
    videoSrc: '/videos/10_igr_verification.webm',
    keyFeatures: ['Maharashtra & Delhi IGR Queues', 'SRO Haveli Index Registry Search', 'In-Workspace Docket Linkage']
  },
  {
    id: '11_field_survey',
    videoNumber: '11',
    title: 'Field Survey & Geotagging',
    category: 'Field & Reports',
    tag: 'GPS Geotagged',
    durationLabel: 'On-Site Inspection',
    description: 'Physical on-site ground inspection: locked GPS coordinates (18.5590° N, 73.7868° E), 4-boundary physical verification against deed schedule, inspection photos, and surveyor logs.',
    routes: '/requests/7 (Site Survey Tab)',
    poster: '/audit/15_workspace_req7_tab_site_survey.png',
    videoSrc: '/videos/11_field_survey.webm',
    keyFeatures: ['GPS Coordinates (18.5590° N, 73.7868° E)', '4-Side Boundary Reconciliation', 'Geotagged Inspection Photographs']
  },
  {
    id: '12_legal_report_generation',
    videoNumber: '12',
    title: 'Automated Legal Report Generation',
    category: 'Field & Reports',
    tag: 'TSR / LSR Assembly',
    durationLabel: 'Report Compilation',
    description: 'Automated assembly of Title Search Reports (TSR) and Legal Scrutiny Reports (LSR) with 30-year chain-of-title synthesis, customizable clauses, and 1-click bank DOCX export.',
    routes: '/requests/7 (TSR Report Tab)',
    poster: '/audit/17_workspace_req7_tab_tsr_report.png',
    videoSrc: '/videos/12_legal_report_generation.webm',
    keyFeatures: ['30-Year Devolution Synthesis', 'Customizable Legal Clauses Editor', 'Institutional Bank DOCX Export']
  },
  {
    id: '13_wopi_collaboration',
    videoNumber: '13',
    title: 'Live Document Collaboration (WOPI)',
    category: 'Field & Reports',
    tag: 'Office Online WOPI',
    durationLabel: 'In-Browser Drafting',
    description: 'Zero-leakage Microsoft Office Online / WOPI collaborative drafting: direct .docx report editing in the browser without local workstation file downloads, featuring lock token sync.',
    routes: '/requests/7 (TSR Report / WOPI)',
    poster: '/audit/19_workspace_req7_modal_fullscreen_doc.png',
    videoSrc: '/videos/13_wopi_collaboration.webm',
    keyFeatures: ['WOPI Host Protocol Architecture', 'Zero Local File Storage Policy', 'Real-Time Synchronized Saves']
  }
];

const CATEGORIES = [
  'All (14)',
  'Flagship',
  'Overview & Intake',
  'Borrower Portal',
  'Legal AI',
  'Field & Reports',
] as const;

export function DemoVideoGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All (14)');
  const [activeVideo, setActiveVideo] = useState<DemoVideoItem>(DEMO_VIDEOS[0]); // Default to Flagship Video 14
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isTheaterModalOpen, setIsTheaterModalOpen] = useState<boolean>(false);

  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  // Filtered list
  const filteredVideos = DEMO_VIDEOS.filter((v) => {
    if (selectedCategory === 'All (14)') return true;
    return v.category === selectedCategory;
  });

  const handleSelectVideo = (video: DemoVideoItem) => {
    setActiveVideo(video);
    setIsPlaying(true);
    if (mainVideoRef.current) {
      mainVideoRef.current.currentTime = 0;
      mainVideoRef.current.play().catch(() => {});
    }
  };

  const togglePlay = () => {
    if (!mainVideoRef.current) return;
    if (isPlaying) {
      mainVideoRef.current.pause();
      setIsPlaying(false);
    } else {
      mainVideoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!mainVideoRef.current) return;
    mainVideoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section id="video-demos" className="space-y-8 scroll-mt-24">
      {/* ── Section Header ─────────────────────────────────────────── */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600 dark:text-blue-400 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Verified Against Live Infrastructure &bull; No Synthetic Mocks</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold theme-text-primary tracking-tight">
          Watch PVS in Action:{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 dark:from-blue-400 dark:via-indigo-300 dark:to-blue-500 bg-clip-text text-transparent">
            14-Video Demonstration Series
          </span>
        </h2>

        <p className="text-xs sm:text-sm theme-text-secondary leading-relaxed">
          High-definition screen recordings demonstrating real application workflows across branch intake, AI document intelligence, state land registries, borrower coordination, and institutional reporting.
        </p>
      </div>

      {/* ── Category Filter Tabs ───────────────────────────────────── */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap pb-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.02]'
                  : 'theme-card border hover:border-blue-500/40 theme-text-secondary hover:theme-text-primary'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Featured Master Video Player ───────────────────────────── */}
      <div className="rounded-3xl border theme-border theme-surface shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Top Header of the Player */}
        <div className="border-b theme-border bg-slate-900/95 text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-600 text-white font-mono">
                VIDEO {activeVideo.videoNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-blue-300 border border-white/15">
                {activeVideo.tag}
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-400 font-mono">
                {activeVideo.durationLabel}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              {activeVideo.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsTheaterModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Open Expanded Theater Modal"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Theater View</span>
            </button>

            <a
              href={activeVideo.videoSrc}
              download={`${activeVideo.id}.webm`}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
              title="Download WebM Demonstration Video"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>
        </div>

        {/* Video Canvas & Controls */}
        <div className="relative bg-black aspect-video max-h-[640px] w-full flex items-center justify-center group overflow-hidden">
          <video
            ref={mainVideoRef}
            src={activeVideo.videoSrc}
            poster={activeVideo.poster}
            controls
            playsInline
            className="w-full h-full object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>

        {/* Video Metadata Footer */}
        <div className="p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-950/40 border-t theme-border grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Workflow & Architecture Demonstrated</span>
            </h4>
            <p className="text-xs sm:text-sm theme-text-secondary leading-relaxed">
              {activeVideo.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {activeVideo.keyFeatures.map((feat, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                >
                  &bull; {feat}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl theme-card border space-y-2.5 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Application Routes Covered</span>
            <p className="font-mono text-xs text-blue-600 dark:text-blue-400 break-all">
              {activeVideo.routes}
            </p>
            <div className="pt-2 border-t theme-border flex items-center justify-between text-[11px]">
              <span className="theme-text-muted">Verification Status:</span>
              <span className="px-2 py-0.5 rounded-md font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                100% PASS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 14 Video Cards Grid ────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold theme-text-primary">
            Browse All 14 Demonstration Videos ({filteredVideos.length})
          </h3>
          <span className="text-xs theme-text-muted">Click any card to play in featured player</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredVideos.map((video) => {
            const isSelected = activeVideo.id === video.id;
            return (
              <div
                key={video.id}
                onClick={() => handleSelectVideo(video)}
                className={`group rounded-2xl theme-card border overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/20 dark:bg-blue-950/20'
                    : 'hover:border-blue-500/50'
                }`}
              >
                {/* Thumbnail Preview with Overlay */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  <img
                    src={video.poster}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badges on Thumbnail */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-mono text-[10px] font-bold shadow-xs">
                      #{video.videoNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-semibold border border-white/10">
                      {video.tag}
                    </span>
                  </div>

                  {/* Play Hover Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>

                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/75 text-white/90 font-mono text-[9px]">
                    {video.durationLabel}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-3.5 sm:p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold theme-text-primary line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-[11px] theme-text-secondary line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t theme-border flex items-center justify-between text-[10px]">
                    <span className="theme-text-muted font-mono truncate max-w-[150px]">
                      {video.routes.split(',')[0]}
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>Watch</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Theater Fullscreen Modal ───────────────────────────────── */}
      {isTheaterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-5xl bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            {/* Modal Top Bar */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 text-white">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-xs font-mono font-bold">
                  VIDEO {activeVideo.videoNumber}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-md sm:max-w-xl">
                  {activeVideo.title}
                </h3>
              </div>

              <button
                onClick={() => setIsTheaterModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative bg-black flex-1 flex items-center justify-center aspect-video">
              <video
                ref={modalVideoRef}
                src={activeVideo.videoSrc}
                poster={activeVideo.poster}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Footer Description */}
            <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-slate-400 max-w-2xl leading-relaxed">
                {activeVideo.description}
              </p>
              <a
                href={activeVideo.videoSrc}
                download={`${activeVideo.id}.webm`}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save WebM</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
