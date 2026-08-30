export type SessionAccessScope = 'personal' | 'teams' | 'departments' | 'global';

export interface ModuleAccessItem {
  is_active: boolean;
  session_access: SessionAccessScope;
}

export type ModuleKey =
  | 'assistant'
  | 'drafter'
  | 'case_analyzer'
  | 'due_diligence'
  | 'legal_research'
  | 'translator'
  | 'doc_comparator'
  | 'doc_qna'
  | 'dms';

export type ModuleAccessMap = Partial<Record<ModuleKey, ModuleAccessItem>>;

export interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  is_active: boolean;
  is_verified: boolean;
  is_sso_user?: boolean;
  sso_provider?: string | null;
  is_admin: boolean;
  organization_id?: string | null;
  department_id?: string | null;
  role_id?: string | null;
  role?: string | null;
  branch_id?: number | null;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user_id: string;
  expires_in?: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: AuthToken;
  user: User;
  module_access: ModuleAccessMap;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user?: User | null;
  token?: AuthToken | null;
}

export interface SSOProvider {
  name: string;
  display_name: string;
  icon?: string;
}
