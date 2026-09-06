export type ComplianceStatus = 'Compliant' | 'Non-Compliant' | 'Warning';

export type ViolationSeverity = 'CRITICAL' | 'MAJOR' | 'MINOR' | 'CRITICAL_RED_ALERT' | 'CRITICAL_CRIMINAL' | 'PROHIBITED_CONTRABAND';

export interface StatutoryRule {
  rule_id: string;
  statute: string;
  clause: string;
  title: string;
  severity: ViolationSeverity;
  penalty_section: string;
  regex_pattern?: string;
  prohibited_keywords_regex?: string;
  prohibited_symbols_regex?: string;
  valid_units?: string[];
  required_subfields?: string[];
  tolerance_allowed?: number;
  description?: string;
}

export interface Table1FontThreshold {
  area_min_sq_cm?: number;
  area_max_sq_cm?: number;
  min_font_height_normal_mm: number;
  min_font_height_blown_moulded_mm: number;
}

export interface MPETolerance {
  min_qty: number;
  max_qty?: number;
  percentage_error: number | null;
  absolute_error: number | null;
}

export interface ViolationCategory {
  code: string;
  title: string;
  statute: string;
  severity: ViolationSeverity;
  description: string;
  ai_detection_heuristics: string[];
  penalty: string;
}
