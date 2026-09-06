import { ComplianceStatus, ViolationSeverity } from './rules';
import { CallLogEntry } from './user';

export interface ParameterFinding {
  parameter_name: string;
  observed_value: string;
  regulatory_clause: string;
  status: ComplianceStatus;
  why_correct_or_wrong: string;
  severity?: ViolationSeverity;
  category?: string;
}

export interface ProductAuditReport {
  id: string;
  timestamp: string;
  product_name: string;
  brand_name: string;
  category: 'Food & Beverage' | 'Non-Food FMCG' | 'Electronics' | 'Cosmetics' | 'Pharmaceutical/Medical';
  principal_display_panel_area_sq_cm: number;
  package_type: 'Rectangular Box' | 'Cylindrical Can/Bottle' | 'Pouch/Flexible' | 'Other Irregular';
  compliance_score: number; // 0 to 100
  overall_status: ComplianceStatus;
  summary: string;
  findings: ParameterFinding[];
  evidence_images: string[]; // Base64 or Object URLs
  barcode_data?: string;
  qr_code_payload?: string;
  detected_location?: {
    latitude: number;
    longitude: number;
    formatted_address: string;
    state: string;
    district?: string;
    maps_link?: string;
  };
  call_logs?: CallLogEntry[];
  cloud_storage_links?: {
    firebase_pdf_url?: string;
    firebase_html_url?: string;
    firebase_evidence_urls?: string[];
    google_drive_file_id?: string;
    google_drive_folder_url?: string;
  };
}

