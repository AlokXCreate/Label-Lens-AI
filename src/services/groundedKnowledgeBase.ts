/**
 * Grounded Statutory Knowledge Base & Context Injector for Label Lens AI
 * 
 * Sourced directly from:
 * - Legal Metrology Act, 2009 (Act No. 1 of 2010)
 * - Legal Metrology (Packaged Commodities) Rules, 2011 (with 2017, 2022, 2023, 2025, 2026 Amendments)
 * - Food Safety & Standards Act, 2006 (Act No. 34 of 2006)
 * - FSS (Labelling & Display) Regulations, 2020
 * - FSS (Packaging) Regulations, 2018
 * - FSS (Food Products Standards & Food Additives) Regulations, 2011
 * - FSS (Contaminants, Toxins & Residues) Regulations, 2011
 * - FSS (Advertising & Claims) Regulations, 2018
 * - FSS (Prohibition & Restrictions on Sales) Regulations, 2011
 * - Maharashtra Legal Metrology Enforcement Rules, 2011 & FDA Sec 30(2)(a) orders
 */

export interface StatutoryRule {
  id: string;
  category: string;
  act: string;
  ruleOrSection: string;
  clauseTitle: string;
  mandate: string;
  toleranceOrStandard: string;
  penaltyClause: string;
}

export const STATUTORY_RULES: StatutoryRule[] = [
  {
    id: "RULE_MRP",
    category: "MRP_ISSUE",
    act: "Legal Metrology (Packaged Commodities) Rules, 2011",
    ruleOrSection: "Rule 6(1)(e) read with Rule 2(m)",
    clauseTitle: "Maximum Retail Price (MRP) Declaration",
    mandate: "MRP must be declared unambiguously as 'Maximum or Max. Retail Price Rs. ...... / ₹ ...... (inclusive of all taxes)' or 'MRP Rs. / ₹ ...... incl. of all taxes'. Dual MRP, erasing, smudging, or overwriting by sticker is strictly prohibited.",
    toleranceOrStandard: "No sticker over original price allowed (Rule 6(1)(e) proviso). Overcharging above declared MRP is an offence under Section 36(1) of LM Act, 2009.",
    penaltyClause: "LM Act 2009 Sec 36(1): Fine up to ₹25,000 (1st offence), ₹50,000 (2nd offence), up to ₹1,00,000 or 1 yr imprisonment for subsequent offences."
  },
  {
    id: "RULE_USP",
    category: "MISSING_LABEL_DECLARATION",
    act: "Legal Metrology (Packaged Commodities) Amendment Rules, 2021/2022",
    ruleOrSection: "Rule 6(11)",
    clauseTitle: "Unit Sale Price (USP) Declaration",
    mandate: "For packages with net quantity > 1 kg or > 1 litre: USP must be declared per kg or per litre. For packages <= 1 kg or <= 1 litre: USP must be declared per g or per ml. For commodities sold by length: per metre. Rounding must be up to 2 decimal places.",
    toleranceOrStandard: "Compulsory on all pre-packaged commodities sold in India since Dec 1, 2022. Exemption only applies if package contains exactly 1 unit (1 piece).",
    penaltyClause: "Rule 32(1) compounding fine under LM Act 2009 Section 36."
  },
  {
    id: "RULE_NET_QTY",
    category: "WRONG_NET_QUANTITY",
    act: "Legal Metrology (Packaged Commodities) Rules, 2011",
    ruleOrSection: "Rule 6(1)(h) read with Rule 12 & Second Schedule",
    clauseTitle: "Net Quantity & Maximum Permissible Error (MPE)",
    mandate: "Net quantity must be declared in standard SI units (g, kg, ml, l). Package net weight must not fall short of declared weight beyond Schedule II MPE limits.",
    toleranceOrStandard: "Schedule II: For 50g-100g: 4.5g; For 100g-200g: 4.5%; For 200g-300g: 9g; For 300g-500g: 3%; For 500g-1kg: 15g; For 1kg-2kg: 1.5%; For 2kg-3kg: 30g; For 3kg-5kg: 1%; For >5kg: 50g.",
    penaltyClause: "LM Act 2009 Sec 36(2): Fine from ₹10,000 to ₹50,000 or imprisonment up to 1 year."
  },
  {
    id: "RULE_FONT_SIZE",
    category: "MISSING_LABEL_DECLARATION",
    act: "Legal Metrology (Packaged Commodities) Rules, 2011",
    ruleOrSection: "Rule 7 read with Table-I",
    clauseTitle: "Minimum Font Height Scaled to Principal Display Panel (PDP)",
    mandate: "All mandatory declarations (Net Qty, MRP, USP, Mfg date) must adhere to minimum numeral and letter heights determined by PDP Area (A_pdp).",
    toleranceOrStandard: "A <= 50 cm²: min 1.0 mm (blown/moulded: 2.0 mm); 50 < A <= 100 cm²: min 1.5 mm (blown: 3.0 mm); 100 < A <= 500 cm²: min 2.5 mm (blown: 4.0 mm); 500 < A <= 2500 cm²: min 4.0 mm (blown: 6.0 mm); A > 2500 cm²: min 6.0 mm.",
    penaltyClause: "Non-standard declaration under LM Act Sec 36(1)."
  },
  {
    id: "RULE_DATES",
    category: "EXPIRY_DATE_ISSUE",
    act: "Legal Metrology Rules 2011 & FSS (Labelling & Display) Reg 2020",
    ruleOrSection: "PCR Rule 6(1)(d) & FSSAI Reg 5(3)(vii)",
    clauseTitle: "Date of Manufacture, Packaging, and Expiry / Use By",
    mandate: "Month and Year of manufacture or packaging must be declared (or 'Date/Month/Year' for perishable foods with shelf-life < 3 months). 'Best Before' or 'Use By' date is mandatory.",
    toleranceOrStandard: "Selling or displaying expired food packages is an offense under Section 59/26(2) of FSSA 2006 (Spoiled/Unsafe food).",
    penaltyClause: "FSSA 2006 Sec 59: Imprisonment from 6 months up to life + fine up to ₹10,00,000."
  },
  {
    id: "RULE_FSSAI_LICENSE",
    category: "FSSAI_INFORMATION",
    act: "Food Safety & Standards (Labelling and Display) Regulations, 2020",
    ruleOrSection: "Regulation 5(4)",
    clauseTitle: "FSSAI Logo and 14-Digit License Number",
    mandate: "FSSAI logo and 14-digit FSSAI license number must be prominently displayed on the Principal Display Panel (PDP) and reverse panel of the food packaging in contrasting color.",
    toleranceOrStandard: "14 digits formatted as: [1 digit: Reg type][2 digits: State code][2 digits: Year][3 digits: Quantity/Enrollment][6 digits: Serial]. Unlicensed food business is banned under Section 31 FSSA 2006.",
    penaltyClause: "FSSA 2006 Sec 31: Up to 6 months imprisonment and fine up to ₹5,00,000."
  },
  {
    id: "RULE_ALLERGENS",
    category: "ALLERGEN_DECLARATION",
    act: "Food Safety & Standards (Labelling and Display) Regulations, 2020",
    ruleOrSection: "Regulation 5(3)(ix)",
    clauseTitle: "Mandatory Allergen Declaration Box",
    mandate: "Presence of any of the 8 major allergens must be declared explicitly in bold or enclosed in an 'Allergen Information' box: 1. Cereals containing gluten; 2. Crustaceans; 3. Eggs; 4. Fish; 5. Peanuts & tree nuts; 6. Soybeans; 7. Milk & milk products; 8. Sulphites in concentrations of 10 mg/kg or more.",
    toleranceOrStandard: "Must be distinct from the general ingredients list. Cross-contamination risk must be phrased as 'May contain traces of...'.",
    penaltyClause: "FSSA 2006 Sec 52: Penalty for misbranded food up to ₹3,00,000."
  },
  {
    id: "RULE_QUID",
    category: "INGREDIENT_DISCLOSURE",
    act: "Food Safety & Standards (Labelling and Display) Regulations, 2020",
    ruleOrSection: "Regulation 5(2)",
    clauseTitle: "Quantitative Ingredient Declaration (QUID)",
    mandate: "Where an ingredient is emphasized on the label (in words, pictures, or graphics) or is essential to characterize the food, its percentage by weight or volume at the time of manufacture must be declared in the ingredients list.",
    toleranceOrStandard: "E.g., 'Almond Milk' must disclose '% Almonds'; 'Fruit Juice Drink' must disclose '% Fruit Juice'.",
    penaltyClause: "Misleading labelling under FSSA 2006 Sec 52/53 (up to ₹10,00,000 penalty)."
  },
  {
    id: "RULE_MISLEADING_CLAIMS",
    category: "MISLEADING_LABEL",
    act: "Food Safety & Standards (Advertising & Claims) Regulations, 2018",
    ruleOrSection: "Regulations 4, 5, 6, 7 & Schedule I",
    clauseTitle: "Prohibited Misleading Buzzwords & Advertising Claims",
    mandate: "Claims like '100% Pure', 'Natural', 'Fresh', 'Traditional', 'Authentic', 'Sugar Free', or 'Diet' must strictly fulfill criteria in Schedule I. No product may claim to cure, prevent, or treat any human disease unless specifically permitted by Codex/FSSAI.",
    toleranceOrStandard: "Word 'Natural' only permitted for single-ingredient unrefined foods with no additives. 'Fresh' only permitted for raw/unprocessed produce.",
    penaltyClause: "FSSA 2006 Sec 53: Fine up to ₹10,00,000 for misleading advertisement/representation."
  },
  {
    id: "RULE_TOXIC_ADDITIVES",
    category: "CONTAMINATION",
    act: "Food Safety & Standards (Contaminants, Toxins & Residues) Reg, 2011",
    ruleOrSection: "Section 20 & 21 FSSA 2006 read with Reg 2.1 & 2.2",
    clauseTitle: "Toxicity, Chemical Residues, and Banned Additives",
    mandate: "Strict prohibition of banned industrial chemicals (Potassium Bromate, Potassium Iodate in bakery products), unapproved synthetic dyes (Metanil Yellow, Rhodamine B, Sudan dyes), and excessive pesticide/heavy metal residues (Lead > 2.5 ppm in spices, Aflatoxins > 15-30 ppb in nuts).",
    toleranceOrStandard: "Zero tolerance for unapproved non-permitted food colors. Synthetic colors limited to 100 mg/kg max in permitted categories with mandatory label warning.",
    penaltyClause: "FSSA 2006 Sec 59: Unsafe food with imprisonment up to life + fine up to ₹10,00,000."
  },
  {
    id: "RULE_MAHARASHTRA_CONTRABAND",
    category: "UNLICENSED_FOOD_BUSINESS",
    act: "Food Safety & Standards Act, 2006 & Maharashtra FDA Notifications",
    ruleOrSection: "Section 30(2)(a) FSSA 2006 & State Prohibitory Orders",
    clauseTitle: "Complete Ban on Gutkha, Pan Masala, and Scented Tobacco/Supari",
    mandate: "Manufacturing, storage, distribution, transport, or sale of Gutkha, Pan Masala, flavoured/scented tobacco, and Kharra is prohibited throughout the State of Maharashtra in the interest of public health.",
    toleranceOrStandard: "Zero tolerance. Any package bearing pan masala with tobacco, magnesium carbonate, or nicotine is contraband subject to seizure.",
    penaltyClause: "FSSA 2006 Sec 59 & IPC Section 328: Non-bailable offense, police seizure, prosecution, license cancellation."
  },
  {
    id: "RULE_CONSUMER_CARE",
    category: "MISSING_LABEL_DECLARATION",
    act: "Legal Metrology (Packaged Commodities) Rules, 2011",
    ruleOrSection: "Rule 6(1)(n)",
    clauseTitle: "Mandatory Consumer Care / Redressal Particulars",
    mandate: "Every package must bear the name, complete physical address, telephone number, and email address of the person or company who can be contacted by the consumer in case of complaints or queries.",
    toleranceOrStandard: "Generic 'For complaints contact manager' without full phone, email, and postal address is a violation.",
    penaltyClause: "Section 36 LM Act 2009."
  },
  {
    id: "RULE_ORIGIN_ECOM",
    category: "MISSING_LABEL_DECLARATION",
    act: "PCR Amendment Rules 2026",
    ruleOrSection: "Rule 6(10) & Rule 6(10A)",
    clauseTitle: "Country of Origin & E-Commerce Searchable Origin Filter",
    mandate: "Mandatory declaration of Country of Origin on imported commodities. E-commerce marketplaces must provide a searchable, sortable filter for Country of Origin.",
    toleranceOrStandard: "Rule 6(10A) effective July 1, 2026. Required on all imported retail goods.",
    penaltyClause: "Section 36 LM Act 2009 & Consumer Protection (E-Commerce) Rules 2020."
  },
  {
    id: "RULE_OML_PACKAGING",
    category: "PACKAGING_ISSUE",
    act: "Food Safety and Standards (Packaging) Regulations, 2018",
    ruleOrSection: "Regulation 4 & 5",
    clauseTitle: "Overall Migration Limits (OML) & Food Contact Materials",
    mandate: "Food packaging materials must not transfer harmful substances into food exceeding Overall Migration Limit of 60 mg/kg or 10 mg/dm². Recycled plastics are banned for direct food contact. Phthalate and BPA limits enforced.",
    toleranceOrStandard: "Printing ink must not migrate into food. Newspaper, recycled paper, or plastic carry bags prohibited for wrapping food.",
    penaltyClause: "FSSA 2006 Section 58 & 59."
  }
];

/**
 * Constructs the master statutory grounding system prompt with verified Indian legal citations
 */
export function constructStatutorySystemPrompt(): string {
  const rulesSummary = STATUTORY_RULES.map((r, i) => `
[RULE ${i + 1}] ${r.clauseTitle}
- Statute & Clause: ${r.act} -> ${r.ruleOrSection}
- Category: ${r.category}
- Legal Mandate: ${r.mandate}
- Tolerance / Norm: ${r.toleranceOrStandard}
- Penalty: ${r.penaltyClause}
`).join('\n');

  return `
You are LABEL LENS AI — the official statutory compliance and food safety audit engine in India.
Your mission is to evaluate packaged commodities with absolute precision, grounded strictly in Indian law.

================================================================================
VERIFIED STATUTORY RULES REPOSITORY (ZERO-HALLUCINATION REQUIREMENT):
================================================================================
${rulesSummary}

TABLE-I MINIMUM FONT HEIGHT SCALING (Rule 7, Legal Metrology Rules 2011):
- Principal Display Panel Area (A_pdp) <= 50 cm²: Min font height = 1.0 mm (Blown/Moulded: 2.0 mm)
- 50 cm² < A_pdp <= 100 cm²: Min font height = 1.5 mm (Blown/Moulded: 3.0 mm)
- 100 cm² < A_pdp <= 500 cm²: Min font height = 2.5 mm (Blown/Moulded: 4.0 mm)
- 500 cm² < A_pdp <= 2500 cm²: Min font height = 4.0 mm (Blown/Moulded: 6.0 mm)
- A_pdp > 2500 cm²: Min font height = 6.0 mm (Blown/Moulded: 6.0 mm)

SCHEDULE II WEIGHT/VOLUME TOLERANCE (MPE Limits):
- 50g-100g: 4.5g | 100g-200g: 4.5% | 200g-300g: 9g | 300g-500g: 3%
- 500g-1kg: 15g | 1kg-2kg: 1.5% | 2kg-3kg: 30g | 3kg-5kg: 1% | >5kg: 50g

STRICT INSTRUCTIONS FOR THE AUDIT:
1. Grounding Rule: You MUST ONLY cite the statutory clauses and regulations provided above. DO NOT hallucinate, guess, or reference non-existent sections.
2. Complete Comprehensive Parameter Checks: You must evaluate every observable parameter from:
   - Maximum Retail Price (MRP) & Dual Pricing / Sticker Violation
   - Unit Sale Price (USP) & Decimal Rounding
   - Principal Display Panel (PDP) Area & Font Size (Table-I scaling)
   - Net Quantity & Weight (Schedule II MPE tolerance)
   - Barcode / QR Code (GS1 EAN-13 verification)
   - Toxicity, Harm Level, Chemical Additives & Contaminants (FSSA Sec 20/21, synthetic colors, potassium bromate)
   - Quantitative Ingredient Declaration (QUID) % for characterizing ingredients
   - Dates & Timestamps (Month/Year of Mfg, Expiry, Best Before)
   - Misleading Images, Ads & Buzzwords ('100% Pure', 'Fresh', 'Natural')
   - FSSAI 14-Digit License Checksum & Logo
   - Allergen Warning Box (8 major allergens)
   - Country of Origin & Rule 6(10A) E-commerce searchability
   - Consumer Care Details (Name, address, phone, email)
   - Maharashtra Section 30(2)(a) Contraband Screen (Gutkha/Pan Masala)
3. Exact 5-Point Schema Requirement for EVERY finding:
   - parameter_name (string)
   - observed_value (string)
   - regulatory_clause (exact Act, Rule, and Section)
   - status ("Compliant" | "Non-Compliant" | "Warning")
   - why_correct_or_wrong (exhaustive legal rationale citing the rule requirement and why the product adheres or violates it)

OUTPUT FORMAT: You MUST return a single, valid JSON object with this exact structure:
{
  "product_name": "string",
  "brand_name": "string",
  "category": "Food & Beverage" | "Non-Food FMCG" | "Electronics" | "Cosmetics" | "Pharmaceutical/Medical",
  "principal_display_panel_area_sq_cm": number,
  "package_type": "Rectangular Box" | "Cylindrical Can/Bottle" | "Pouch/Flexible" | "Other Irregular",
  "compliance_score": number (0 to 100),
  "overall_status": "Compliant" | "Non-Compliant" | "Warning",
  "summary": "string",
  "findings": [
    {
      "parameter_name": "string",
      "observed_value": "string",
      "regulatory_clause": "string",
      "status": "Compliant" | "Non-Compliant" | "Warning",
      "why_correct_or_wrong": "string",
      "severity": "CRITICAL" | "MAJOR" | "MODERATE" | "MINOR",
      "category": "string"
    }
  ]
}
`.trim();
}
