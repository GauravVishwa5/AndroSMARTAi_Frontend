/**
 * Comprehensive Hardcoded Demonstration Dataset for PVS Platform
 * Curated specifically for institutional bank panels, credit committees, and investor presentations.
 * Zero database dependency — 100% predictable, instant, and fault-tolerant.
 */

import { User, AuthToken } from '@/types/auth';
import {
  CaseFinding,
  CollateralRiskScore,
  DisbursementReadiness,
  AdvocateReview,
  CaseAuditEvent,
} from '@/types/enterprise';

// ── 1. DEMO USER PERSONAS ──────────────────────────────────────────────────
export const DEMO_USERS: Record<'branch' | 'legal' | 'admin' | 'applicant', User> = {
  branch: {
    id: 'c0000000-0000-0000-0000-000000000002',
    username: 'demo.branch',
    email: 'demo.branch@andropvs.com',
    first_name: 'Rajesh',
    last_name: 'Sharma (Branch Officer)',
    role: 'Branch User',
    is_admin: false,
    is_applicant: false,
    is_active: true,
    is_verified: true,
    created_at: '2026-08-30T07:15:58Z',
  },
  legal: {
    id: 'c0000000-0000-0000-0000-000000000003',
    username: 'demo.legal',
    email: 'demo.legal@andropvs.com',
    first_name: 'Adv. Kushal',
    last_name: 'Verma (Panel Advocate)',
    role: 'Legal Investigator',
    is_admin: false,
    is_applicant: false,
    is_active: true,
    is_verified: true,
    created_at: '2026-08-30T07:15:58Z',
  },
  admin: {
    id: 'c0000000-0000-0000-0000-000000000004',
    username: 'demo.admin',
    email: 'demo.admin@andropvs.com',
    first_name: 'Dr. Priya',
    last_name: 'Nair (Chief Risk Officer)',
    role: 'Super Admin',
    is_admin: true,
    is_applicant: false,
    is_active: true,
    is_verified: true,
    created_at: '2026-08-30T07:15:58Z',
  },
  applicant: {
    id: 'c0000000-0000-0000-0000-000000000005',
    username: 'demo.applicant',
    email: 'demo.applicant@andropvs.com',
    first_name: 'Vikram',
    last_name: 'Malhotra (Loan Borrower)',
    role: 'Borrower Applicant',
    is_admin: false,
    is_applicant: true,
    is_active: true,
    is_verified: true,
    created_at: '2026-08-30T07:15:58Z',
  },
};

export const DEMO_TOKEN: AuthToken = {
  access_token: 'demo-investor-token-pvs-2026',
  token_type: 'bearer',
  user_id: 'c0000000-0000-0000-0000-000000000002',
  expires_in: 86400,
};

export const DEMO_MODULES = {
  assistant: { is_active: true, session_access: 'global' },
  drafter: { is_active: true, session_access: 'global' },
  legal_research: { is_active: true, session_access: 'global' },
  due_diligence: { is_active: true, session_access: 'global' },
  dms: { is_active: true, session_access: 'global' },
  case_analyzer: { is_active: true, session_access: 'global' },
  translator: { is_active: true, session_access: 'global' },
  doc_comparator: { is_active: true, session_access: 'global' },
  doc_qna: { is_active: true, session_access: 'global' },
};

/**
 * Switch persona directly in browser local storage and state for seamless 1-click demos
 */
export function activateDemoPersona(personaKey: 'branch' | 'legal' | 'admin' | 'applicant') {
  if (typeof window === 'undefined') return;
  const user = DEMO_USERS[personaKey];
  const token = { ...DEMO_TOKEN, user_id: user.id };
  localStorage.setItem('andropvs_token', JSON.stringify(token));
  localStorage.setItem('andropvs_user', JSON.stringify(user));
  localStorage.setItem('andropvs_modules', JSON.stringify(DEMO_MODULES));
}

// ── 2. PORTFOLIO SHOWCASE CASES (Used in /branch, /legal, /requests) ──────
export const DEMO_SHOWCASE_REQUESTS = [
  {
    id: 'REQ-101',
    raw_id: 101,
    propertyName: 'Godrej Sky Terraces Flat 1402',
    property_name: 'Godrej Sky Terraces Flat 1402',
    ownerName: 'Vikram Malhotra',
    owner_name: 'Vikram Malhotra',
    applicantName: 'Vikram & Ananya Malhotra',
    applicant_name: 'Vikram & Ananya Malhotra',
    bankBranch: 'Axis Bank Bandra West Wealth Branch',
    Bank_branch: 'Axis Bank Bandra West Wealth Branch',
    bankName: 'Axis Bank Limited',
    bank_name: 'Axis Bank Limited',
    branchOfficer: 'Rajesh Sharma (Branch Officer)',
    raised_by: 'Rajesh Sharma (Branch Officer)',
    location: 'Perry Cross Road, Bandra West, Mumbai',
    address: '14th Floor, Tower B, Godrej Sky Terraces, Perry Cross Road, Bandra West',
    city: 'Mumbai',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    pinCode: '400050',
    cts: 'CTS-892/B',
    ctsNumber: 'CTS-892/B',
    docCount: 4,
    status: 'Verified',
    date: 'Sep 04, 2026',
    ocrDone: true,
    riskScore: '12 (Low Risk)',
    composite_risk_score: 12,
    risk_grade: 'LOW_RISK',
    disbursement_status: 'READY',
    maker_checker_status: 'APPROVED',
    loanamount: '4.25 Cr',
    caseType: 'Home Loan Scrutiny',
    transactionType: 'Direct Purchase',
    highlight: 'Green-Channel Clear Title • 100% SRO Match',
  },
  {
    id: 'REQ-102',
    raw_id: 102,
    propertyName: 'Lodha Belmondo Villa 18',
    property_name: 'Lodha Belmondo Villa 18',
    ownerName: 'Sunil Singhania',
    owner_name: 'Sunil Singhania',
    applicantName: 'Sunil & Radhika Singhania',
    applicant_name: 'Sunil & Radhika Singhania',
    bankBranch: 'Axis Bank Nariman Point Corporate Branch',
    Bank_branch: 'Axis Bank Nariman Point Corporate Branch',
    bankName: 'Axis Bank Limited',
    bank_name: 'Axis Bank Limited',
    branchOfficer: 'Rajesh Sharma (Branch Officer)',
    raised_by: 'Rajesh Sharma (Branch Officer)',
    location: 'Pune-Mumbai Expressway, Gahunje, Pune',
    address: 'Villa 18, Golf Course Enclave, Lodha Belmondo, Gahunje',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    pinCode: '412101',
    cts: 'Survey No. 44/1/B',
    ctsNumber: 'Survey No. 44/1/B',
    docCount: 5,
    status: 'In Progress',
    date: 'Sep 03, 2026',
    ocrDone: true,
    riskScore: '35 (Standard Risk)',
    composite_risk_score: 35,
    risk_grade: 'LOW_RISK',
    disbursement_status: 'CONDITIONAL',
    maker_checker_status: 'CHECKER_PENDING',
    loanamount: '2.80 Cr',
    caseType: 'Villa Mortgage Refinance',
    transactionType: 'Resale',
    highlight: 'Conditional Approval • 2 CPs Required • Ready for Checker Signoff',
  },
  {
    id: 'REQ-103',
    raw_id: 103,
    propertyName: 'Kharghar Commercial Plot 88',
    property_name: 'Kharghar Commercial Plot 88',
    ownerName: 'Apex Logistics & Warehousing Pvt Ltd',
    owner_name: 'Apex Logistics & Warehousing Pvt Ltd',
    applicantName: 'Apex Logistics & Warehousing Pvt Ltd',
    applicant_name: 'Apex Logistics & Warehousing Pvt Ltd',
    bankBranch: 'Axis Bank Fort Commercial Banking Branch',
    Bank_branch: 'Axis Bank Fort Commercial Banking Branch',
    bankName: 'Axis Bank Limited',
    bank_name: 'Axis Bank Limited',
    branchOfficer: 'Rajesh Sharma (Branch Officer)',
    raised_by: 'Rajesh Sharma (Branch Officer)',
    location: 'Sector 14, Kharghar, Navi Mumbai',
    address: 'Commercial Plot No. 88, Sector 14, CIDCO Development Node, Kharghar',
    city: 'Navi Mumbai',
    district: 'Raigad',
    state: 'Maharashtra',
    pinCode: '410210',
    cts: 'Plot 88 / Node 14',
    ctsNumber: 'Plot 88 / Node 14',
    docCount: 3,
    status: 'Rejected',
    date: 'Sep 02, 2026',
    ocrDone: true,
    riskScore: '78 (Critical Defect)',
    composite_risk_score: 78,
    risk_grade: 'CRITICAL_LEGAL_DEFECT',
    disbursement_status: 'BLOCKED',
    maker_checker_status: 'MAKER_PENDING',
    loanamount: '8.50 Cr',
    caseType: 'Commercial Plot Term Loan',
    transactionType: 'Leasehold Assignment',
    highlight: 'Fatal Blockers • Bombay High Court Suit #412/2023 Lis Pendens',
  },
  {
    id: 'REQ-104',
    raw_id: 104,
    propertyName: 'Rustomjee Elements Flat 501',
    property_name: 'Rustomjee Elements Flat 501',
    ownerName: 'Dr. Sameer Sen',
    owner_name: 'Dr. Sameer Sen',
    applicantName: 'Dr. Sameer & Meera Sen (Co-Applicant: Vikram Malhotra)',
    applicant_name: 'Dr. Sameer & Meera Sen (Co-Applicant: Vikram Malhotra)',
    bankBranch: 'Axis Bank Andheri West Premier Banking',
    Bank_branch: 'Axis Bank Andheri West Premier Banking',
    bankName: 'Axis Bank Limited',
    bank_name: 'Axis Bank Limited',
    branchOfficer: 'Rajesh Sharma (Branch Officer)',
    raised_by: 'Rajesh Sharma (Branch Officer)',
    location: 'Upper Juhu, Andheri West, Mumbai',
    address: 'Flat 501, 5th Floor, Wing C, Rustomjee Elements, Upper Juhu, Andheri West',
    city: 'Mumbai',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    pinCode: '400053',
    cts: 'CTS-304/A',
    ctsNumber: 'CTS-304/A',
    docCount: 4,
    status: 'In Progress',
    date: 'Sep 01, 2026',
    ocrDone: true,
    riskScore: '24 (Low Risk)',
    composite_risk_score: 24,
    risk_grade: 'LOW_RISK',
    disbursement_status: 'CONDITIONAL',
    maker_checker_status: 'NOT_STARTED',
    loanamount: '6.10 Cr',
    caseType: 'Home Loan Scrutiny',
    transactionType: 'Direct Developer Allotment',
    highlight: 'Active Borrower Deficiency Exchange • 1 Pending Document Upload',
  },
  {
    id: 'REQ-105',
    raw_id: 105,
    propertyName: 'DLF Magnolias Tower 3, Flat 901',
    property_name: 'DLF Magnolias Tower 3, Flat 901',
    ownerName: 'Rajiv Kapoor',
    owner_name: 'Rajiv Kapoor',
    applicantName: 'Rajiv & Natasha Kapoor',
    applicant_name: 'Rajiv & Natasha Kapoor',
    bankBranch: 'Axis Bank Cyber City Wealth Branch',
    Bank_branch: 'Axis Bank Cyber City Wealth Branch',
    bankName: 'Axis Bank Limited',
    bank_name: 'Axis Bank Limited',
    branchOfficer: 'Rajesh Sharma (Branch Officer)',
    raised_by: 'Rajesh Sharma (Branch Officer)',
    location: 'Golf Course Road, Sector 42, Gurugram',
    address: 'Tower 3, Flat 901, DLF Golf Links, Sector 42, Golf Course Road',
    city: 'Gurugram',
    district: 'Gurugram',
    state: 'Haryana',
    pinCode: '122002',
    cts: 'Khasra No. 89/12',
    ctsNumber: 'Khasra No. 89/12',
    docCount: 6,
    status: 'Verified',
    date: 'Aug 28, 2026',
    ocrDone: true,
    riskScore: '15 (Low Risk)',
    composite_risk_score: 15,
    risk_grade: 'LOW_RISK',
    disbursement_status: 'READY',
    maker_checker_status: 'APPROVED',
    loanamount: '9.50 Cr',
    caseType: 'Luxury Residential Mortgage',
    transactionType: 'Resale',
    highlight: 'High Net-Worth Prime Case • Instant Disbursal Ready',
  },
];

export interface DemoWorkspaceDetail {
  requestData: any;
  docs: any[];
  readiness: any;
  risk: any;
  findings: any[];
  advocateReview: any;
  auditEvents: any[];
}

export const DEMO_WORKSPACE_CASES: Record<string, DemoWorkspaceDetail> = {
  'REQ-101': {
    requestData: {
      ...DEMO_SHOWCASE_REQUESTS[0],
      flatNumber: '1402',
      flat_number: '1402',
      state: 'Maharashtra',
      from_year: 1995,
      advocateName: 'Adv. Kushal Verma',
      searchName: 'Vikram Malhotra',
      application_number: 'APP-AXIS-2026-101',
      created_at: 'Sep 04, 2026, 09:30 AM',
    },
    docs: [
      {
        id: 'DOC-101-A',
        name: 'Registered_Sale_Deed_2018.pdf',
        type: 'Absolute Sale Deed',
        status: 'clear',
        ocrStatus: 'done',
        date: '14/11/2018',
        fileUrl: '#',
        rawText: `DEED OF CONVEYANCE / SALE DEED
Registration No: BND-4/8912/2018
Date of Execution: 14th November 2018
Sub-Registrar Office: Bandra-4, Mumbai Suburban
BETWEEN:
1. Vendor: Mr. Sunil K. Sharma, PAN: ABCPS1249K
2. Purchaser: Mr. Vikram Malhotra, PAN: AAFPM9021R
PROPERTY DESCRIPTION:
All that piece and parcel of residential Flat No. 1402 on the 14th Floor, Tower B, Godrej Sky Terraces, Perry Cross Road, Bandra West, Mumbai 400050, bearing CTS No. 892/B of Village Bandra, Taluka Andheri.
FINANCIAL CONSIDERATION:
The Purchaser has paid total consideration of Rs. 4,25,00,000/- (Rupees Four Crore Twenty Five Lakhs Only).
STAMP DUTY: Rs. 21,25,000/- paid via e-Challan No. MH0048192834.
REGISTRATION FEE: Rs. 30,000/- paid at SRO Bandra-4.
TITLE DECLARATION:
The Vendor covenants that the said property is free from all encumbrances, charges, liens, mortgages, claims, attachments, and trusts whatsoever.`,
        ocrMeta: { char_count: 1480, total_pages: 18, source: 'ocr_engine' },
        extracted_json: {
          vendor: 'Mr. Sunil K. Sharma',
          vendee: 'Mr. Vikram Malhotra',
          date: '14/11/2018',
          regNo: 'BND-4/8912/2018',
          sro: 'SRO Bandra-4',
          cts: 'CTS-892/B',
          consideration: '₹ 4,25,00,000',
          stampDuty: '₹ 21,25,000',
          remarks: 'Clear marketable title transferred with full consideration received',
        },
      },
      {
        id: 'DOC-101-B',
        name: 'SRO_Index_II_Search_1995_2026.pdf',
        type: 'SRO Index-II 30-Year Search',
        status: 'clear',
        ocrStatus: 'done',
        date: '02/09/2026',
        fileUrl: '#',
        rawText: `GOVERNMENT OF MAHARASHTRA
DEPARTMENT OF REGISTRATION AND STAMPS (IGR)
INDEX-II OFFICIAL CERTIFIED EXTRACT (1995 - 2026)
Property: CTS No. 892/B, Village Bandra, Taluka Andheri, Flat No. 1402, Godrej Sky Terraces.
1. Entry 1998/1249: Parent Development Agreement between Godrej Properties Ltd and Society.
2. Entry 2012/4819: Builder Allotment Agreement to Sunil K. Sharma. Stamp Duty Paid: ₹14,50,000/-.
3. Entry 2018/8912: Registered Sale Deed from Sunil K. Sharma to Vikram Malhotra.
4. No prior mortgage, lis pendens, attachment order, or charge registered in Book-I.`,
        ocrMeta: { char_count: 920, total_pages: 6, source: 'igr_digital_feed' },
        extracted_json: {
          vendor: 'Sunil K. Sharma',
          vendee: 'Vikram Malhotra',
          date: '02/09/2026',
          regNo: 'CERT-IGR-38912',
          sro: 'SRO Bandra-4',
          cts: 'CTS-892/B',
          consideration: '₹ 4,25,00,000',
          stampDuty: '₹ 21,25,000',
          remarks: '30-year unbroken chain of title verified. Zero prior encumbrances in Book-I records.',
        },
      },
      {
        id: 'DOC-101-C',
        name: 'Society_Share_Certificate_NOC.pdf',
        type: 'Society Share Certificate & NOC',
        status: 'clear',
        ocrStatus: 'done',
        date: '20/08/2026',
        fileUrl: '#',
        rawText: `GODREJ SKY TERRACES CO-OPERATIVE HOUSING SOCIETY LIMITED
Registration No. BOM/HSG/TC/10492/2014
NO OBJECTION CERTIFICATE FOR MORTGAGE
To: The Branch Manager, Axis Bank Limited, Bandra West.
We hereby confirm that Mr. Vikram Malhotra is the registered owner of Flat No. 1402, holding Share Certificate No. 48, Distinctive Nos. 241 to 245 inclusive.
The Society has no objection to Mr. Vikram Malhotra mortgaging the flat with Axis Bank Limited for securing home loan facilities.
All society dues, maintenance charges, and sinking fund contributions are fully paid up to date.`,
        ocrMeta: { char_count: 750, total_pages: 2, source: 'ocr_engine' },
        extracted_json: {
          authority: 'Godrej Sky Terraces CHSL',
          vendee: 'Vikram Malhotra',
          date: '20/08/2026',
          regNo: 'SOC-NOC-1049',
          cts: 'CTS-892/B',
          remarks: 'Society NOC unconditionally issued for equitable mortgage creation with Axis Bank',
        },
      },
      {
        id: 'DOC-101-D',
        name: 'MCGM_Property_Tax_Paid_Receipt_2026.pdf',
        type: 'Municipal Corporation Tax Receipt',
        status: 'clear',
        ocrStatus: 'done',
        date: '15/07/2026',
        fileUrl: '#',
        rawText: `MUNICIPAL CORPORATION OF GREATER MUMBAI (MCGM)
ASSESSMENT AND COLLECTION DEPARTMENT
PROPERTY TAX PAYMENT RECEIPT (FY 2025-26)
Receipt No: MCGM-PT-2026-981249
Property SAC No: HW1402892B01
Tax Payer Name: Vikram Malhotra
Property Address: Flat 1402, Godrej Sky Terraces, Bandra West, Mumbai 400050
Total Assessment Paid: Rs. 68,420/- (Paid in full via Net Banking).
Outstanding Arrears: NIL.`,
        ocrMeta: { char_count: 580, total_pages: 1, source: 'ocr_engine' },
        extracted_json: {
          authority: 'MCGM Assessment Dept',
          vendee: 'Vikram Malhotra',
          date: '15/07/2026',
          regNo: 'MCGM-PT-2026-981249',
          consideration: '₹ 68,420',
          remarks: 'All municipal property taxes paid with zero outstanding arrears',
        },
      },
    ],
    readiness: {
      status: 'READY',
      composite_risk_score: 12,
      risk_grade: 'LOW_RISK',
      blocking_reasons: [],
      conditions_precedent: [],
      conditions_subsequent: [
        {
          id: 'CS-1',
          description: 'Deposit of registered Memorandum of Entry (MODT) with CERSAI within 30 days of loan disbursement.',
          document_id: null,
          page_number: null,
        },
      ],
      summary: 'Green-Channel Approved: Title is clear, marketable, and free from all encumbrances. Valid equitable mortgage can be created.',
      evaluated_at: '2026-09-04T06:12:15Z',
      evaluated_by: 'SYSTEM',
    },
    risk: {
      composite_risk_score: 12,
      risk_grade: 'LOW_RISK',
      confidence_score: 0.98,
      title_clarity_score: 95,
      registry_confidence_score: 98,
      encumbrance_penalty: 0,
      litigation_penalty: 0,
      rule_penalties: {},
      summary: 'Prime Clean Collateral (Grade A). 30-year chain of title verified unbroken against SRO Book-I records.',
      evaluated_at: '2026-09-04T06:12:15Z',
    },
    findings: [
      {
        id: 1011,
        form_id: 101,
        organization_id: 'a0000000-0000-0000-0000-000000000001',
        document_id: 'DOC-101-A',
        document_name: 'Registered_Sale_Deed_2018.pdf',
        severity: 'INFORMATIONAL',
        category: 'TITLE_CHAIN',
        finding_type: 'REGISTERED_DEED',
        title: 'Complete 30-Year Devolution Chain',
        description: 'Absolute registered Sale Deed executed in 2018 by Sunil K. Sharma to Vikram Malhotra with valid consideration and stamp duty.',
        actual_value: 'Registered with SRO Bandra-4',
        expected_value: 'Registered Sale Deed',
        page_number: 1,
        extracted_text: '...Purchaser has paid total consideration of Rs. 4,25,00,000/- with Stamp Duty Rs. 21,25,000/-...',
        source_type: 'OCR_EXTRACTION',
        confidence: 0.99,
        impact: 'LOW',
        recommended_action: 'Title chain verified complete; safe for equitable mortgage.',
        status: 'RESOLVED',
        created_at: '2026-09-04T06:12:15Z',
      },
      {
        id: 1012,
        form_id: 101,
        organization_id: 'a0000000-0000-0000-0000-000000000001',
        document_id: 'DOC-101-B',
        document_name: 'SRO_Index_II_Search_1995_2026.pdf',
        severity: 'INFORMATIONAL',
        category: 'GOVERNMENT_RECORD',
        finding_type: 'SRO_MATCH',
        title: '100% SRO Book-I Registry Match',
        description: 'Certified online Index-II search confirmed registration volume 8912/2018 matches deed details. Zero prior mortgage registered.',
        actual_value: 'Registration No. BND-4/8912/2018 verified',
        expected_value: 'Exact Match',
        page_number: 2,
        extracted_text: '...No prior mortgage, lis pendens, attachment order, or charge registered in Book-I...',
        source_type: 'IGR_DIGITAL_FEED',
        confidence: 0.98,
        impact: 'LOW',
        recommended_action: 'Proceed with disbursement upon original document deposit.',
        status: 'RESOLVED',
        created_at: '2026-09-04T06:12:15Z',
      },
    ],
    advocateReview: {
      id: 28,
      form_id: 101,
      organization_id: 'a0000000-0000-0000-0000-000000000001',
      workflow_stage: 'APPROVED',
      maker_user_id: 'c0000000-0000-0000-0000-000000000003',
      checker_user_id: 'c0000000-0000-0000-0000-000000000004',
      legal_opinion: 'Based on thorough inspection of certified Title Deeds, SRO Index-II search from 1995 to 2026, and physical society share certificate, the title of Vikram Malhotra to Flat 1402 Godrej Sky Terraces is clear, marketable, and free from encumbrances. Valid equitable mortgage can be created.',
      bar_council_id: 'MAH/4820/2012',
      opinion_hash: 'abcd124d6166cf89d85a6cec56b94c61d4d94101ca2086ea63f31d4f3c624d3e',
      maker_notes: 'Original title chain inspected. Society share certificate verified with society secretary.',
      maker_submitted_at: '2026-09-04T06:12:15Z',
      checker_notes: 'Concur with empanelled advocate opinion. Title clear for disbursement of loan amount Rs 4.25 Cr.',
      checker_action_at: '2026-09-04T06:12:15Z',
      created_at: '2026-09-04T06:12:15Z',
      updated_at: '2026-09-04T06:12:15Z',
    },
    auditEvents: [
      {
        id: 101,
        form_id: 101,
        actor_role: 'BRANCH_OFFICER',
        event_type: 'CASE_INTAKE_SUBMITTED',
        entity_type: 'BANK_FORM',
        entity_id: '101',
        new_state: { status: 'SUBMITTED', loan_amount: '4.25 Cr', branch: 'Bandra West' },
        ip_address: '10.0.4.18',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
        created_at: '2026-09-04T02:15:00Z',
      },
      {
        id: 102,
        form_id: 101,
        actor_role: 'ADVOCATE_MAKER',
        event_type: 'OPINION_SUBMITTED',
        entity_type: 'ADVOCATE_REVIEW',
        entity_id: '101',
        new_state: { workflow_stage: 'CHECKER_PENDING', bar_council_id: 'MAH/4820/2012' },
        ip_address: '10.0.4.18',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
        created_at: '2026-09-04T04:30:00Z',
      },
      {
        id: 103,
        form_id: 101,
        actor_role: 'ADVOCATE_CHECKER',
        event_type: 'CHECKER_APPROVED',
        entity_type: 'ADVOCATE_REVIEW',
        entity_id: '101',
        new_state: { workflow_stage: 'APPROVED', opinion_hash: 'abcd124d6166cf89d85a6cec56b94c61d4d94101ca2086ea63f31d4f3c624d3e' },
        ip_address: '10.0.4.22',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
        created_at: '2026-09-04T06:12:15Z',
      },
    ],
  },

  'REQ-102': {
    requestData: {
      ...DEMO_SHOWCASE_REQUESTS[1],
      flatNumber: 'Villa 18',
      flat_number: 'Villa 18',
      state: 'Maharashtra',
      from_year: 2005,
      advocateName: 'Adv. Kushal Verma',
      searchName: 'Sunil Singhania',
      application_number: 'APP-AXIS-2026-102',
      created_at: 'Sep 03, 2026, 11:15 AM',
    },
    docs: [
      {
        id: 'DOC-102-A',
        name: 'Agreement_for_Sale_2015.pdf',
        type: 'Agreement for Sale',
        status: 'clear',
        ocrStatus: 'done',
        date: '10/05/2015',
        fileUrl: '#',
        rawText: `AGREEMENT FOR SALE
Villa No. 18, Golf Enclave, Lodha Belmondo, Gahunje, Pune.
Vendor: Lodha Developers Ltd.
Purchaser: Sunil Singhania & Radhika Singhania.
Consideration: Rs. 2,80,00,000/-. Stamp duty paid in full.
Pending Condition: Original 1999 prior parent deed of agricultural conversion to be deposited.`,
        ocrMeta: { char_count: 890, total_pages: 12, source: 'ocr_engine' },
        extracted_json: {
          vendor: 'Lodha Developers Ltd',
          vendee: 'Sunil & Radhika Singhania',
          date: '10/05/2015',
          cts: 'Survey No. 44/1/B',
          consideration: '₹ 2,80,00,000',
          remarks: 'Original 1999 prior title conversion deed pending physical deposit',
        },
      },
      {
        id: 'DOC-102-B',
        name: '7_12_Extract_Mutation_1042.pdf',
        type: '7/12 Extract & Mutation',
        status: 'clear',
        ocrStatus: 'done',
        date: '12/08/2026',
        fileUrl: '#',
        rawText: `VILLAGE FORM VII-XII (7/12 EXTRACT)
Taluka: Maval, District: Pune. Survey No. 44/1/B.
Mutation Entry No: 1042 reflecting non-agricultural (NA) residential layout sanction.
Registered Owner: Sunil Singhania.`,
        ocrMeta: { char_count: 650, total_pages: 3, source: 'ocr_engine' },
        extracted_json: {
          vendee: 'Sunil Singhania',
          date: '12/08/2026',
          cts: 'Survey No. 44/1/B',
          remarks: 'Mutation entry verified clear with NA conversion approval',
        },
      },
    ],
    readiness: {
      status: 'CONDITIONAL',
      composite_risk_score: 35,
      risk_grade: 'LOW_RISK',
      blocking_reasons: [],
      conditions_precedent: [
        {
          id: 'CP-102-1',
          description: 'Physical deposit of original 1999 registered parent allotment deed into branch custody prior to disbursal.',
          document_id: 'DOC-102-A',
          page_number: 1,
        },
        {
          id: 'CP-102-2',
          description: 'Submission of formal Society No-Objection Certificate (NOC) confirming zero dues and transfer endorsement.',
          document_id: null,
          page_number: null,
        },
      ],
      conditions_subsequent: [],
      summary: 'Conditional Clearance: Title is marketable subject to satisfaction of 2 Pre-Disbursement Conditions Precedent (CPs).',
      evaluated_at: '2026-09-04T05:30:00Z',
      evaluated_by: 'SYSTEM',
    },
    risk: {
      composite_risk_score: 35,
      risk_grade: 'LOW_RISK',
      confidence_score: 0.94,
      title_clarity_score: 80,
      registry_confidence_score: 90,
      encumbrance_penalty: 15,
      litigation_penalty: 0,
      rule_penalties: { missing_parent_deed: 15 },
      summary: 'Standard Institutional Collateral (Grade B). Requires physical deposit of 1999 prior parent deed before disbursal.',
      evaluated_at: '2026-09-04T05:30:00Z',
    },
    findings: [
      {
        id: 1021,
        form_id: 102,
        organization_id: 'a0000000-0000-0000-0000-000000000001',
        document_id: 'DOC-102-A',
        document_name: 'Agreement_for_Sale_2015.pdf',
        severity: 'MEDIUM',
        category: 'DOCUMENT_AUTHENTICITY',
        finding_type: 'MISSING_LINK_DOC',
        title: 'Original 1999 Parent Deed Deposit Required',
        description: 'Prior link deed of agricultural conversion mentioned in Recital 4 must be lodged with lending bank custody.',
        actual_value: 'Photocopy furnished',
        expected_value: 'Original Registered Deed Deposit',
        page_number: 2,
        extracted_text: '...Vendor derived title under conveyance dated 12-Dec-1999...',
        source_type: 'OCR_EXTRACTION',
        confidence: 0.95,
        impact: 'MEDIUM',
        recommended_action: 'Place Condition Precedent on sanction letter requiring original deposit.',
        status: 'OPEN',
        created_at: '2026-09-04T05:30:00Z',
      },
    ],
    advocateReview: {
      id: 29,
      form_id: 102,
      organization_id: 'a0000000-0000-0000-0000-000000000001',
      workflow_stage: 'CHECKER_PENDING',
      maker_user_id: 'c0000000-0000-0000-0000-000000000003',
      checker_user_id: null,
      legal_opinion: 'I have examined the registered Agreement for Sale and Revenue 7/12 Extract. Subject to deposit of the original 1999 deed and Society NOC, title is marketable and equitable mortgage can be created.',
      bar_council_id: 'MAH/4820/2012',
      opinion_hash: null,
      maker_notes: 'Submitted for Chief Risk Officer / Legal Head signoff with 2 CPs.',
      maker_submitted_at: '2026-09-04T05:30:00Z',
      checker_notes: null,
      checker_action_at: null,
      created_at: '2026-09-04T05:30:00Z',
      updated_at: '2026-09-04T05:30:00Z',
    },
    auditEvents: [
      {
        id: 104,
        form_id: 102,
        actor_role: 'BRANCH_OFFICER',
        event_type: 'CASE_INTAKE_SUBMITTED',
        entity_type: 'BANK_FORM',
        entity_id: '102',
        new_state: { status: 'SUBMITTED', loan_amount: '2.80 Cr' },
        ip_address: '10.0.4.18',
        user_agent: 'Mozilla/5.0 Chrome/128.0',
        created_at: '2026-09-03T11:15:00Z',
      },
      {
        id: 105,
        form_id: 102,
        actor_role: 'ADVOCATE_MAKER',
        event_type: 'OPINION_SUBMITTED',
        entity_type: 'ADVOCATE_REVIEW',
        entity_id: '102',
        new_state: { workflow_stage: 'CHECKER_PENDING', bar_council_id: 'MAH/4820/2012' },
        ip_address: '10.0.4.18',
        user_agent: 'Mozilla/5.0 Chrome/128.0',
        created_at: '2026-09-04T05:30:00Z',
      },
    ],
  },

  'REQ-103': {
    requestData: {
      ...DEMO_SHOWCASE_REQUESTS[2],
      flatNumber: 'Plot 88',
      flat_number: 'Plot 88',
      state: 'Maharashtra',
      from_year: 2000,
      advocateName: 'Adv. Kushal Verma',
      searchName: 'Apex Logistics',
      application_number: 'APP-AXIS-2026-103',
      created_at: 'Sep 02, 2026, 04:20 PM',
    },
    docs: [
      {
        id: 'DOC-103-A',
        name: 'CIDCO_Tripartite_Agreement_2004.pdf',
        type: 'CIDCO Tripartite Lease Agreement',
        status: 'rejected',
        ocrStatus: 'done',
        date: '14/06/2004',
        fileUrl: '#',
        rawText: `CITY AND INDUSTRIAL DEVELOPMENT CORPORATION OF MAHARASHTRA (CIDCO)
TRIPARTITE LEASE AGREEMENT
Plot No. 88, Sector 14, Kharghar Node.
CRITICAL DEFECT:
Clause 14 specifies that the lease term expired on 31st March 2024. No extension or formal transfer approval has been issued by CIDCO New Bombay office.`,
        ocrMeta: { char_count: 650, total_pages: 5, source: 'ocr_engine' },
        extracted_json: {
          authority: 'CIDCO Limited',
          cts: 'Plot 88 / Node 14',
          remarks: 'FATAL: Tripartite lease term expired. Transfer unauthorized.',
        },
      },
      {
        id: 'DOC-103-B',
        name: 'High_Court_Suit_412_2023_Lis_Pendens.pdf',
        type: 'High Court Lis Pendens Notice',
        status: 'rejected',
        ocrStatus: 'done',
        date: '18/10/2023',
        fileUrl: '#',
        rawText: `IN THE HIGH COURT OF JUDICATURE AT BOMBAY
ORDINARY ORIGINAL CIVIL JURISDICTION
COMMERCIAL SUIT NO. 412 OF 2023
M/s Western Warehousing Partners ... Plaintiffs
v/s
Apex Logistics & Warehousing Pvt Ltd ... Defendants
ORDER OF INJUNCTION:
The Defendants are restrained from creating any third-party right, title, mortgage, charge, or encumbrance over Commercial Plot No. 88, Sector 14, Kharghar pending final disposal of the suit.`,
        ocrMeta: { char_count: 720, total_pages: 4, source: 'ocr_engine' },
        extracted_json: {
          authority: 'Bombay High Court',
          remarks: 'FATAL LIS PENDENS: Active injunction restraining mortgage creation.',
        },
      },
    ],
    readiness: {
      status: 'BLOCKED',
      composite_risk_score: 78,
      risk_grade: 'CRITICAL_LEGAL_DEFECT',
      blocking_reasons: [
        {
          id: 'BLK-1',
          code: 'ACTIVE_LIS_PENDENS_INJUNCTION',
          description: 'Bombay High Court Commercial Suit #412/2023 order strictly restrains mortgage creation or alienation of Plot 88.',
          document_id: 'DOC-103-B',
          page_number: 1,
        },
        {
          id: 'BLK-2',
          code: 'EXPIRED_CIDCO_STATUTORY_LEASE',
          description: 'CIDCO 20-year tripartite lease expired on 31/03/2024 with no registered extension or statutory NOC.',
          document_id: 'DOC-103-A',
          page_number: 1,
        },
      ],
      conditions_precedent: [],
      conditions_subsequent: [],
      summary: 'DISBURSEMENT STRICTLY BLOCKED: Fatal legal blockers detected. Property is encumbered by active High Court injunction. Title cannot be mortgaged.',
      evaluated_at: '2026-09-04T06:00:00Z',
      evaluated_by: 'SYSTEM',
    },
    risk: {
      composite_risk_score: 78,
      risk_grade: 'CRITICAL_LEGAL_DEFECT',
      confidence_score: 0.99,
      title_clarity_score: 20,
      registry_confidence_score: 40,
      encumbrance_penalty: 40,
      litigation_penalty: 38,
      rule_penalties: { lis_pendens_restraint: 38, expired_statutory_lease: 40 },
      summary: 'High-Risk Encumbered Asset (Grade D). Red-flag legal blockers protect bank against invalid security creation.',
      evaluated_at: '2026-09-04T06:00:00Z',
    },
    findings: [
      {
        id: 1031,
        form_id: 103,
        organization_id: 'a0000000-0000-0000-0000-000000000001',
        document_id: 'DOC-103-B',
        document_name: 'High_Court_Suit_412_2023_Lis_Pendens.pdf',
        severity: 'CRITICAL',
        category: 'ENCUMBRANCE',
        finding_type: 'LIS_PENDENS',
        title: 'Active Bombay High Court Injunction',
        description: 'Commercial Suit #412/2023 directly restrains creation of any mortgage or security over Plot 88.',
        actual_value: 'Injunction Active (Bombay High Court)',
        expected_value: 'Zero Litigation / Unencumbered',
        page_number: 1,
        extracted_text: '...Defendants restrained from creating third party mortgage...',
        source_type: 'OCR_EXTRACTION',
        confidence: 0.99,
        impact: 'CRITICAL',
        recommended_action: 'REJECT LOAN APPLICATION. Title cannot be mortgaged.',
        status: 'OPEN',
        created_at: '2026-09-04T06:00:00Z',
      },
    ],
    advocateReview: {
      id: 30,
      form_id: 103,
      organization_id: 'a0000000-0000-0000-0000-000000000001',
      workflow_stage: 'MAKER_PENDING',
      maker_user_id: 'c0000000-0000-0000-0000-000000000003',
      checker_user_id: null,
      legal_opinion: 'REJECTION RECOMMENDED: The property is the subject matter of an active injunction in Bombay High Court Suit #412/2023. Any mortgage created during pendency of suit will be hit by Doctrine of Lis Pendens (Sec 52 TPA).',
      bar_council_id: 'MAH/4820/2012',
      opinion_hash: null,
      maker_notes: 'Red-flag adverse report compiled. Loan disbursement must be denied.',
      maker_submitted_at: '2026-09-04T06:00:00Z',
      checker_notes: null,
      checker_action_at: null,
      created_at: '2026-09-04T06:00:00Z',
      updated_at: '2026-09-04T06:00:00Z',
    },
    auditEvents: [
      {
        id: 106,
        form_id: 103,
        actor_role: 'ADVOCATE_MAKER',
        event_type: 'DEFECT_FLAGGED',
        entity_type: 'CASE_FINDING',
        entity_id: '1031',
        new_state: { severity: 'CRITICAL', finding_type: 'LIS_PENDENS' },
        ip_address: '10.0.4.18',
        user_agent: 'Mozilla/5.0 Chrome/128.0',
        created_at: '2026-09-04T06:00:00Z',
      },
    ],
  },
};

// Default fallback for any other REQ ID
export function getDemoWorkspaceCase(id: string): DemoWorkspaceDetail {
  const cleanId = String(id).toUpperCase().trim();
  if (DEMO_WORKSPACE_CASES[cleanId]) {
    return DEMO_WORKSPACE_CASES[cleanId];
  }
  // Default to REQ-101 for any unmatched ID so demo never breaks
  const fallback = DEMO_WORKSPACE_CASES['REQ-101'];
  return {
    ...fallback,
    requestData: {
      ...fallback.requestData,
      id: cleanId,
      raw_id: Number(cleanId.replace(/[^0-9]/g, '')) || 101,
    },
  };
}

// ── 4. BORROWER APPLICANT PORTAL HARDCODED DATA ────────────────────────────
export const DEMO_BORROWER_APPLICATIONS = [
  {
    id: 101,
    application_number: 'APP-AXIS-2026-101',
    property_name: 'Godrej Sky Terraces Flat 1402',
    bank_name: 'Axis Bank Limited — Bandra West Wealth Branch',
    applicant_name: 'Vikram Malhotra',
    city: 'Bandra West, Mumbai',
    district: 'Mumbai Suburban',
    status: 'Approved — Clear for Disbursement',
    created_at: '2026-09-04T09:30:00Z',
    pending_deficiencies_count: 0,
    loan_amount: '₹ 4,25,00,000',
    current_milestone: 4,
    timeline: [
      { id: 1, title: 'Application Submitted', state: 'completed', date: 'Sep 04, 09:30 AM' },
      { id: 2, title: 'Document Scrutiny', state: 'completed', date: 'Sep 04, 11:45 AM' },
      { id: 3, title: 'SRO Title Verification', state: 'completed', date: 'Sep 04, 01:15 PM' },
      { id: 4, title: 'Approved for Disbursal', state: 'completed', date: 'Sep 04, 02:30 PM' },
    ],
  },
  {
    id: 104,
    application_number: 'APP-AXIS-2026-104',
    property_name: 'Rustomjee Elements Flat 501',
    bank_name: 'Axis Bank Limited — Andheri Premier Branch',
    applicant_name: 'Vikram Malhotra (Co-Applicant)',
    city: 'Upper Juhu, Mumbai',
    district: 'Mumbai Suburban',
    status: 'Action Required — Document Requested',
    created_at: '2026-09-01T11:00:00Z',
    pending_deficiencies_count: 1,
    loan_amount: '₹ 6,10,00,000',
    current_milestone: 2,
    timeline: [
      { id: 1, title: 'Application Submitted', state: 'completed', date: 'Sep 01, 11:00 AM' },
      { id: 2, title: 'Document Scrutiny', state: 'in_progress', date: 'In Progress' },
      { id: 3, title: 'SRO Title Verification', state: 'pending', date: 'Pending' },
      { id: 4, title: 'Disbursal Sanction', state: 'pending', date: 'Pending' },
    ],
    deficiency: {
      id: 'DEF-104-1',
      title: 'Municipal Property Tax Paid Receipt (FY 2025-26)',
      description: 'Please upload the latest MCGM municipal tax receipt reflecting paid status for Flat 501.',
      status: 'pending',
      requested_at: '2026-09-03T10:00:00Z',
      requested_by: 'Legal Scrutinizer (Adv. Kushal Verma)',
    },
  },
];
