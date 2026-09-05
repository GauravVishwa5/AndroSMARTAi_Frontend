/**
 * Enterprise Collateral Intelligence Types (Phases 1 - 7)
 * Institutional Title Verification, Risk Scoring & Readiness Gate
 */

export type FindingSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type FindingStatus = 'OPEN' | 'RESOLVED' | 'WAIVED';

export interface CaseFinding {
  id: string;
  request_id: string;
  category: string; // 'TITLE_CHAIN', 'ENCUMBRANCE', 'DOCUMENTATION', 'IDENTITY', 'REGULATORY', etc.
  severity: FindingSeverity;
  title: string;
  description: string;
  document_id?: string | null;
  document_name?: string | null;
  page_number?: number | null;
  status: FindingStatus;
  resolution_notes?: string | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface FindingsResponse {
  total: number;
  open_count?: number;
  critical_count?: number;
  findings: CaseFinding[];
}

export interface RiskSignal {
  code: string;
  dimension: 'TITLE_INTEGRITY' | 'ENCUMBRANCE' | 'DOCUMENTATION' | 'IDENTITY_KYC';
  penalty: number;
  reason: string;
  finding_id?: string | null;
}

export interface RiskDimensionBreakdown {
  title_integrity: number; // max 35
  encumbrance: number; // max 30
  documentation: number; // max 20
  identity_kyc: number; // max 15
}

export interface CollateralRiskScore {
  risk_score?: number; // 0 to 100
  composite_risk_score?: number;
  grade?: string;
  risk_grade?: string;
  summary?: string;
  breakdown?: RiskDimensionBreakdown;
  signals?: RiskSignal[];
  recommendations?: string[];
  evaluated_at?: string;
}

export interface ConditionPrecedent {
  id?: string;
  description: string;
  document_id?: string | null;
  page_number?: number | null;
  severity?: FindingSeverity;
  status?: string;
}

export type ReadinessStatus = 'READY' | 'CONDITIONAL' | 'BLOCKED';

export interface DisbursementReadiness {
  status: ReadinessStatus;
  collateral_risk_score: number;
  blockers: string[];
  conditions_precedent: ConditionPrecedent[];
  policy_violations?: any[];
  evaluated_at: string;
}

export type AdvocateReviewStatus =
  | 'MAKER_PENDING'
  | 'CHECKER_PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'RETURNED';

export interface AdvocateReview {
  id: string;
  request_id: string;
  status: AdvocateReviewStatus;
  maker_user_id?: string | null;
  maker_name?: string | null;
  maker_bar_council_id?: string | null;
  maker_submitted_at?: string | null;
  maker_notes?: string | null;
  opinion_summary?: string | null;
  checker_user_id?: string | null;
  checker_name?: string | null;
  checker_action?: 'APPROVED' | 'REJECTED' | 'RETURNED' | null;
  checker_action_at?: string | null;
  checker_notes?: string | null;
  digital_seal_hash?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface CaseAuditEvent {
  id: string;
  request_id: string;
  event_type: string;
  actor_user_id?: string | null;
  actor_name?: string | null;
  actor_role?: string | null;
  action: string;
  details: Record<string, any>;
  created_at: string;
}

export interface AuditTrailResponse {
  total: number;
  events: CaseAuditEvent[];
}
