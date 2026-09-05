# AndroSMARTAi / AndroPVS — Frontend Application

Modern, high-performance Legal Due-Diligence & Title Search web portal built for Banks, NBFCs, and Legal Advocates.

---

## 🌟 Key Features

- **Branch Operations & Case Intake**: Fast wizard for property title search requests, multi-file upload with OCR processing status, and document classification.
- **Legal Scrutiny Workspace**: Split-screen document viewer with side-by-side title tree builder, flow-of-title timeline, and live search note authoring.
- **IGR & Land Records Explorer**: Real-time integration with IGR Maharashtra / Land Registry APIs with automated 30-year search summary generation.
- **Report Generation & Live Document Editing**: One-click generation of Bank-Format Title Search Reports (TSR), Non-Encumbrance Certificates (NEC), and interactive in-browser legal report editing with direct S3 delivery.
- **Real-Time OCR Progress Streaming**: Server-Sent Events (SSE) live updates for background OCR, entity extraction, and valuation analysis.
- **Role-Based Dashboards**: Tailored views and permissions for Branch Officers, Legal Advocates, Panel Reviewers, and System Administrators.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching & Cache**: [TanStack React Query v5](https://tanstack.com/query/latest)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/) with JWT interceptors
- **Animation**: [Framer Motion](https://www.framer.com/motion/)

---

## 📁 Project Structure

```text
frontend/
├── app/                      # Next.js App Router pages and layouts
│   ├── (auth)/login/         # Authentication & login interface
│   ├── (auth)/signup/        # User onboarding
│   ├── admin/                # System monitoring & scraper health
│   ├── branch/               # Branch officer case management
│   ├── legal/                # Advocate scrutiny & verification queue
│   ├── requests/             # Request repository, search, and reports
│   │   ├── [id]/             # Single case workspace & document viewer
│   │   ├── new/              # New title search request wizard
│   │   ├── reports/          # Report generation center
│   │   └── search/           # Global property title search
│   ├── globals.css           # Global Tailwind CSS stylesheet
│   └── layout.tsx            # Root layout with providers
├── components/               # Reusable UI component library
│   ├── ui/                   # Buttons, badges, inputs, modals, tabs
│   ├── branch/               # Branch dashboard widgets
│   ├── legal/                # Title tree, timeline, and scrutiny panels
│   └── shared/               # Navigation, header, sidebar, status indicators
├── lib/                      # Client utilities and helpers
│   ├── api/                  # Axios API modules (auth, requests, documents, igr, reports)
│   ├── hooks/                # Custom React hooks (queries, mutations, auth)
│   ├── store/                # Zustand stores (session, active request)
│   └── supabaseClient.ts     # Supabase client connector
├── types/                    # Shared TypeScript types and interfaces
├── public/                   # Static assets and public images
├── .env.example              # Environment variables template
└── package.json              # Project dependencies and scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: v20+ recommended
- **npm** or **pnpm** or **yarn**
- Running [Backend API](https://github.com/GauravVishwa5/AndroSMARTAi_Backend) (FastAPI) on `http://127.0.0.1:8000`

### 2. Environment Configuration

Copy the example environment file and configure your API URL:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### 3. Installation

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

> **Windows PowerShell note**: If execution policies restrict scripts, use `npm.cmd run dev` or `npx.cmd next dev`.

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧭 Page Routes & Navigation

| Route | Description | Access Role |
| :--- | :--- | :--- |
| `/login` | Secure portal sign-in | Public |
| `/branch` | Branch operations dashboard | Branch Officer, Admin |
| `/legal` | Legal scrutiny & verification queue | Advocate, Legal Team |
| `/requests` | Title search request directory | All Roles |
| `/requests/new` | Multi-step request intake wizard | Branch Officer |
| `/requests/[id]` | Comprehensive title examination workspace | Branch, Advocate, Admin |
| `/requests/reports` | Exportable TSR & compliance documents | Advocate, Admin |
| `/admin` | System health, worker queues & audit logs | System Admin |

---

## 📦 Available Scripts

- `npm run dev` — Starts the Next.js development server with Turbopack.
- `npm run build` — Builds the optimized production application.
- `npm run start` — Starts the Next.js production server.
- `npm run lint` — Runs ESLint checks.

---

## 🛡️ License

Proprietary and Confidential — AndroSMARTAi Platform.
