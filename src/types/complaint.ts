export interface LegalComplaint {
  complaint_id: string;
  created_at: string;
  authority_target: string;
  subject_line: string;
  complainant: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  respondent: {
    brand_name: string;
    manufacturer_name: string;
    premises_address: string;
    fssai_license_number?: string;
  };
  incident_location?: {
    latitude: number;
    longitude: number;
    formatted_address: string;
    state: string;
    district: string;
    maps_link: string;
  };
  itemized_violations: {
    rule_title: string;
    observed_finding: string;
    violated_statute: string;
    legal_ramifications: string;
  }[];
  formal_prayer: string[];
  evidence_summary: {
    photo_count: number;
    barcode?: string;
    digital_sha256_hash: string;
  };
}
