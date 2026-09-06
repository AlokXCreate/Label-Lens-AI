import { ProductAuditReport } from '../types/audit';
import { LegalComplaint } from '../types/complaint';
import { UserProfile } from '../types/user';

export function generateLegalComplaint(
  report: ProductAuditReport,
  userProfile: UserProfile,
  includeLiveLocation: boolean = false,
  locationData?: {
    latitude: number;
    longitude: number;
    formatted_address: string;
    state: string;
    district: string;
  }
): LegalComplaint {
  const violations = report.findings
    .filter(f => f.status === 'Non-Compliant')
    .map(f => ({
      rule_title: f.parameter_name,
      observed_finding: f.observed_value,
      violated_statute: f.regulatory_clause,
      legal_ramifications: f.why_correct_or_wrong
    }));

  const primaryViolation = violations[0]?.rule_title || "STATUTORY LABELLING DEFECT";
  const state = locationData?.state || "Maharashtra";

  return {
    complaint_id: `COMPLAINT-${Date.now()}`,
    created_at: new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    authority_target: `The District Controller of Legal Metrology & Designated Officer (FSSAI), Division of ${state}`,
    subject_line: `STATUTORY COMPLAINT UNDER SECTION 18 & 36 OF LEGAL METROLOGY ACT, 2009 AND SECTIONS 23, 52 & 53 OF FSSA, 2006 REGARDING ${report.brand_name.toUpperCase()} - ${report.product_name.toUpperCase()} (${primaryViolation})`,
    complainant: {
      name: userProfile.displayName || "Consumer Complainant",
      email: userProfile.email || "consumer@example.com",
      phone: userProfile.phone || "+91-9800000000",
      address: userProfile.address || userProfile.currentLocation || "Location Unspecified"
    },
    respondent: {
      brand_name: report.brand_name,
      manufacturer_name: `${report.brand_name} Consumer Products Ltd.`,
      premises_address: "Registered Manufacturing & Packaging Premises as Declared on Pack",
      fssai_license_number: "Declared on Packaging"
    },
    incident_location: (includeLiveLocation && locationData) ? {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      formatted_address: locationData.formatted_address,
      state: locationData.state,
      district: locationData.district,
      maps_link: `https://www.google.com/maps/search/?api=1&query=${locationData.latitude},${locationData.longitude}`
    } : undefined,
    itemized_violations: violations.length > 0 ? violations : [{
      rule_title: "General Mandatory Declaration Defect",
      observed_finding: "Non-conforming packaging declaration observed during inspection.",
      violated_statute: "Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6",
      legal_ramifications: "Non-compliance with statutory declarations under Rule 6 attracts penalties under Section 36(2) of the Legal Metrology Act, 2009."
    }],
    formal_prayer: [
      "Issue immediate summons and initiate a field inspection at the respondent's manufacturing and retail distribution premises under Section 15 of the Legal Metrology Act, 2009 and Section 38 of the Food Safety and Standards Act, 2006.",
      "Seize all non-compliant product lots bearing the defective label declarations in accordance with Section 15(1)(b) of the Legal Metrology Act, 2009.",
      "Initiate penal proceedings or determine compounding liability under Section 36 of the Legal Metrology Act and Section 52/53 of the Food Safety and Standards Act, 2006.",
      "Direct the respondent entity to implement an immediate commercial product recall from retail stores and e-commerce platforms under the FSS (Food Recall Procedure) Regulations, 2017.",
      "Grant appropriate relief and statutory consumer compensation under Section 65 of the Food Safety and Standards Act, 2006."
    ],
    evidence_summary: {
      photo_count: report.evidence_images.length,
      barcode: report.barcode_data,
      digital_sha256_hash: `SHA256-${Math.random().toString(36).substring(2)}${Date.now()}`
    }
  };
}
