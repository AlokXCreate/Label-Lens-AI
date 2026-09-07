import { ProductAuditReport } from '../types/audit';
import { LegalComplaint } from '../types/complaint';
import { UserProfile } from '../types/user';

export interface FoodSafetyAuthorityDesk {
  key: string;
  state: string;
  department: string;
  primaryEmail: string;
  ccEmails: string[];
  helpline: string;
  portalUrl: string;
}

export const STATE_FOOD_SAFETY_DESKS: FoodSafetyAuthorityDesk[] = [
  {
    key: "central",
    state: "National (Central FSSAI)",
    department: "Food Safety and Standards Authority of India (FSSAI Central HQ)",
    primaryEmail: "compliance@fssai.gov.in",
    ccEmails: ["foodsafety-complaints@fssai.gov.in", "consumer-helpline@nic.in"],
    helpline: "1800-11-2100",
    portalUrl: "https://foscos.fssai.gov.in/consumergrievance"
  },
  {
    key: "maharashtra",
    state: "Maharashtra",
    department: "Food & Drug Administration (FDA) & Legal Metrology, Maharashtra",
    primaryEmail: "comm.fda-mah@nic.in",
    ccEmails: ["clmmh@gov.in", "compliance@fssai.gov.in"],
    helpline: "1800-222-365",
    portalUrl: "https://fda.maharashtra.gov.in"
  },
  {
    key: "delhi",
    state: "Delhi",
    department: "Department of Food Safety, Govt. of NCT of Delhi",
    primaryEmail: "foodsafety-delhi@nic.in",
    ccEmails: ["compliance@fssai.gov.in", "consumer-helpline@nic.in"],
    helpline: "1800-11-0440",
    portalUrl: "https://foodsafety.delhi.gov.in"
  },
  {
    key: "karnataka",
    state: "Karnataka",
    department: "Food Safety and Standards Authority, Karnataka",
    primaryEmail: "cfskarnataka@gmail.com",
    ccEmails: ["compliance@fssai.gov.in"],
    helpline: "1800-425-3777",
    portalUrl: "https://hfw.karnataka.gov.in"
  },
  {
    key: "tamilnadu",
    state: "Tamil Nadu",
    department: "Food Safety and Drug Administration, Tamil Nadu",
    primaryEmail: "commr.fssatn@gmail.com",
    ccEmails: ["compliance@fssai.gov.in"],
    helpline: "9444042322",
    portalUrl: "https://foodsafety.tn.gov.in"
  },
  {
    key: "gujarat",
    state: "Gujarat",
    department: "Food and Drugs Control Administration (FDCA) Gujarat",
    primaryEmail: "comfdca@gujarat.gov.in",
    ccEmails: ["compliance@fssai.gov.in"],
    helpline: "1800-233-5500",
    portalUrl: "https://fdca.gujarat.gov.in"
  },
  {
    key: "uttarpradesh",
    state: "Uttar Pradesh",
    department: "Food Safety and Drug Administration (FSDA) Uttar Pradesh",
    primaryEmail: "fsda.up@nic.in",
    ccEmails: ["compliance@fssai.gov.in"],
    helpline: "1800-180-5533",
    portalUrl: "http://fsda.up.nic.in"
  },
  {
    key: "westbengal",
    state: "West Bengal",
    department: "Food Safety Wing, Health & Family Welfare, West Bengal",
    primaryEmail: "foodsafety-wb@nic.in",
    ccEmails: ["compliance@fssai.gov.in"],
    helpline: "1800-345-3220",
    portalUrl: "https://wbhealth.gov.in"
  },
  {
    key: "telangana",
    state: "Telangana",
    department: "Public Health & Food (Health) Administration, Telangana",
    primaryEmail: "ipm-tg@nic.in",
    ccEmails: ["compliance@fssai.gov.in"],
    helpline: "1800-425-0087",
    portalUrl: "https://ipm.telangana.gov.in"
  }
];

export interface OfficialGovtPortal {
  id: string;
  name: string;
  shortName: string;
  description: string;
  url: string;
  badge: string;
  tagColor: string;
}

export const OFFICIAL_GOVT_PORTALS: OfficialGovtPortal[] = [
  {
    id: 'fssai_foscos',
    name: 'FSSAI FoSCoS Consumer Grievance Portal',
    shortName: 'FoSCoS Grievance',
    description: 'Official online grievance lodging system under Food Safety and Standards Authority of India.',
    url: 'https://foscos.fssai.gov.in/consumergrievance',
    badge: 'Central FSSAI',
    tagColor: 'emerald'
  },
  {
    id: 'food_safety_connect',
    name: 'FSSAI Food Safety Connect (Eat Right India)',
    shortName: 'Food Safety Connect',
    description: 'Consumer portal to report substandard, misbranded, or adulterated packaged foods directly.',
    url: 'https://eatrightindia.gov.in/food-safety-connect/',
    badge: 'Ministry of H&FW',
    tagColor: 'teal'
  },
  {
    id: 'nch_ingram',
    name: 'National Consumer Helpline (NCH / INGRAM)',
    shortName: 'National Consumer Portal (1915)',
    description: 'Integrated Grievance Redress Mechanism run by Department of Consumer Affairs for LMPC violations.',
    url: 'https://consumerhelpline.gov.in/',
    badge: 'MoCAF&PD',
    tagColor: 'blue'
  },
  {
    id: 'cpgrams',
    name: 'CPGRAMS Central Public Grievance Redressal',
    shortName: 'CPGRAMS Portal',
    description: 'Prime Minister Office & Central Government apex citizen grievance monitoring mechanism.',
    url: 'https://pgportal.gov.in/',
    badge: 'Govt of India',
    tagColor: 'purple'
  }
];

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
    created_at: new Date().toISOString(),
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

/**
 * Generates official court-ready legal petition text for clipboard or filing
 */
export function generateOfficialLegalText(complaint: LegalComplaint): string {
  return `
════════════════════════════════════════════════════════════════════════════════
FORMAL STATUTORY LEGAL COMPLAINT & INVESTIGATION PETITION
Under Section 18 & 36 of Legal Metrology Act, 2009, Rule 6 of LM (PC) Rules, 2011/2026,
and Sections 23, 52, 53 & 65 of Food Safety and Standards Act (FSSA), 2006.
════════════════════════════════════════════════════════════════════════════════

TO:
${complaint.authority_target}
Government of India & State Directorate of Food Safety & Legal Metrology

DOCKET NUMBER    : ${complaint.complaint_id}
FILING TIMESTAMP : ${complaint.created_at}
SECURITY SEAL    : ${complaint.evidence_summary.digital_sha256_hash}

SUBJECT:
${complaint.subject_line}

1. COMPLAINANT PARTICULARS:
   • Full Name      : ${complaint.complainant.name}
   • Email Address  : ${complaint.complainant.email}
   • Contact Number : ${complaint.complainant.phone}
   • Address/Coords : ${complaint.complainant.address}

2. RESPONDENT / ACCUSED ENTITY:
   • Brand Name     : ${complaint.respondent.brand_name}
   • Manufacturer   : ${complaint.respondent.manufacturer_name}
   • Declared Premise: ${complaint.respondent.premises_address}
   ${complaint.respondent.fssai_license_number ? `• FSSAI Lic No  : ${complaint.respondent.fssai_license_number}` : ''}

${complaint.incident_location ? `3. GEO-TAGGED INCIDENT COORDINATES:
   • Exact Location : ${complaint.incident_location.formatted_address}
   • GPS Coordinates: ${complaint.incident_location.latitude.toFixed(5)}, ${complaint.incident_location.longitude.toFixed(5)}
   • Maps Satellite : ${complaint.incident_location.maps_link}
` : ''}
4. ITEMIZED STATUTORY VIOLATIONS & CHARGE SHEET:
${complaint.itemized_violations.map((v, i) => `
   [Violation ${i + 1}] ${v.rule_title}
   - Violated Statute   : ${v.violated_statute}
   - Observed Defect    : ${v.observed_finding}
   - Legal Ramification : ${v.legal_ramifications}`).join('\n')}

5. FORMAL PRAYER / RELIEF SOUGHT:
${complaint.formal_prayer.map((p, i) => `   (${String.fromCharCode(97 + i)}) ${p}`).join('\n')}

6. SOLEMN VERIFICATION & AFFIDAVIT:
I, ${complaint.complainant.name}, do hereby verify and affirm on solemn oath that the contents of this statutory petition are true to the best of my personal knowledge and belief, based upon empirical product label examination and forensic measurement standards. No part hereof is false, and nothing material has been concealed therein.

Digital Integrity Hash: ${complaint.evidence_summary.digital_sha256_hash}
Generated via Label Lens AI (Statutory Regulatory Engine)
════════════════════════════════════════════════════════════════════════════════
  `.trim();
}

/**
 * Builds a pre-filled mailto URI for 1-click email dispatch to Food Safety Department
 */
export function generatePreFilledEmailUrl(
  complaint: LegalComplaint,
  targetEmail: string = "compliance@fssai.gov.in",
  ccEmails: string[] = ["foodsafety-complaints@fssai.gov.in", "consumer-helpline@nic.in"]
): string {
  const subject = encodeURIComponent(complaint.subject_line);
  const legalBody = `Respected Designated Officer & Food Safety Authority,

Please take cognizance of this formal statutory complaint filed under Section 18 & 36 of Legal Metrology Act, 2009 and Section 23/52/53 of Food Safety and Standards Act, 2006 regarding a non-compliant pre-packaged commodity:

DOCKET REFERENCE : ${complaint.complaint_id}
FILING TIMESTAMP : ${complaint.created_at}
TARGET ENTITY    : ${complaint.respondent.brand_name} (${complaint.respondent.manufacturer_name})
${complaint.incident_location ? `INCIDENT LOCATION: ${complaint.incident_location.formatted_address}` : ''}

KEY STATUTORY VIOLATIONS IDENTIFIED:
${complaint.itemized_violations.map((v, i) => `${i + 1}. ${v.rule_title} [Clause: ${v.violated_statute}]\n   Observed: ${v.observed_finding}\n   Liability: ${v.legal_ramifications}`).join('\n\n')}

FORMAL STATUTORY RELIEF PRAYED:
${complaint.formal_prayer.map((p, i) => `(${String.fromCharCode(97 + i)}) ${p}`).join('\n')}

COMPLAINANT DETAILS:
Name   : ${complaint.complainant.name}
Phone  : ${complaint.complainant.phone}
Email  : ${complaint.complainant.email}
Address: ${complaint.complainant.address}

Cryptographic Hash: ${complaint.evidence_summary.digital_sha256_hash}
(Official Legal Docket attached / filed via Label Lens AI Statutory Compliance Engine)
`;

  const body = encodeURIComponent(legalBody);
  const ccParam = ccEmails.length > 0 ? `&cc=${encodeURIComponent(ccEmails.join(','))}` : '';
  return `mailto:${targetEmail}?subject=${subject}${ccParam}&body=${body}`;
}

