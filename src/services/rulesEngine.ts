import { Table1FontThreshold, MPETolerance } from '../types/rules';
import { ParameterFinding } from '../types/audit';

// Statutory Table-I Font Sizing Data under LMPC Rule 7
export const TABLE_1_FONT_THRESHOLDS: Table1FontThreshold[] = [
  { area_max_sq_cm: 50, min_font_height_normal_mm: 1.0, min_font_height_blown_moulded_mm: 2.0 },
  { area_min_sq_cm: 50, area_max_sq_cm: 100, min_font_height_normal_mm: 1.5, min_font_height_blown_moulded_mm: 3.0 },
  { area_min_sq_cm: 100, area_max_sq_cm: 500, min_font_height_normal_mm: 2.5, min_font_height_blown_moulded_mm: 4.0 },
  { area_min_sq_cm: 500, area_max_sq_cm: 2500, min_font_height_normal_mm: 4.0, min_font_height_blown_moulded_mm: 6.0 },
  { area_min_sq_cm: 2500, min_font_height_normal_mm: 6.0, min_font_height_blown_moulded_mm: 6.0 },
];

// First Schedule Maximum Permissible Error (MPE) on Net Quantity
export const MPE_SCHEDULE: MPETolerance[] = [
  { min_qty: 0, max_qty: 50, percentage_error: 9.0, absolute_error: null },
  { min_qty: 50, max_qty: 100, percentage_error: null, absolute_error: 4.5 },
  { min_qty: 100, max_qty: 200, percentage_error: 4.5, absolute_error: null },
  { min_qty: 200, max_qty: 300, percentage_error: null, absolute_error: 9.0 },
  { min_qty: 300, max_qty: 500, percentage_error: 3.0, absolute_error: null },
  { min_qty: 500, max_qty: 1000, percentage_error: null, absolute_error: 15.0 },
  { min_qty: 1000, max_qty: 10000, percentage_error: 1.5, absolute_error: null },
  { min_qty: 10000, max_qty: 15000, percentage_error: null, absolute_error: 150.0 },
  { min_qty: 15000, percentage_error: 1.0, absolute_error: null },
];

/**
 * Calculates Principal Display Panel (PDP) surface area in cm²
 */
export function calculatePDPArea(
  packageType: 'Rectangular Box' | 'Cylindrical Can/Bottle' | 'Pouch/Flexible' | 'Other Irregular',
  dimensions: { heightCm: number; widthCm?: number; diameterCm?: number; totalSurfaceAreaCm2?: number }
): number {
  if (packageType === 'Rectangular Box' && dimensions.widthCm) {
    return Math.round(dimensions.heightCm * dimensions.widthCm * 100) / 100;
  }
  if (packageType === 'Cylindrical Can/Bottle' && dimensions.diameterCm) {
    // Under Rule 7 & Parle Agro Precedent: 40% of height * circumference
    const circumference = Math.PI * dimensions.diameterCm;
    return Math.round(0.40 * dimensions.heightCm * circumference * 100) / 100;
  }
  if (dimensions.totalSurfaceAreaCm2) {
    // 20% of total surface area
    return Math.round(0.20 * dimensions.totalSurfaceAreaCm2 * 100) / 100;
  }
  return 100; // Default fallback
}

/**
 * Computes Minimum Required Font Height under Table-I
 */
export function getRequiredFontHeightMm(pdpAreaSqCm: number, isBlownMoulded: boolean = false): number {
  for (const t of TABLE_1_FONT_THRESHOLDS) {
    if (t.area_max_sq_cm && pdpAreaSqCm <= t.area_max_sq_cm) {
      return isBlownMoulded ? t.min_font_height_blown_moulded_mm : t.min_font_height_normal_mm;
    }
    if (!t.area_max_sq_cm && t.area_min_sq_cm && pdpAreaSqCm > t.area_min_sq_cm) {
      return isBlownMoulded ? t.min_font_height_blown_moulded_mm : t.min_font_height_normal_mm;
    }
  }
  return 2.5;
}

/**
 * Validates Unit Sale Price (USP) under Rule 6(11)
 */
export function validateUSP(
  mrpAmount: number,
  netQuantityValue: number,
  netQuantityUnit: string,
  declaredUspAmount?: number,
  declaredUspUnit?: string
): { isCompliant: boolean; expectedUSP: number; expectedUnit: string; reason: string } {
  let expectedUnit = 'per g';
  let divisor = netQuantityValue;

  const unitLower = netQuantityUnit.toLowerCase();
  if (unitLower === 'g' || unitLower === 'gm' || unitLower === 'grams') {
    if (netQuantityValue > 1000) {
      expectedUnit = 'per kg';
      divisor = netQuantityValue / 1000;
    } else {
      expectedUnit = 'per g';
    }
  } else if (unitLower === 'kg') {
    expectedUnit = 'per kg';
  } else if (unitLower === 'ml' || unitLower === 'millilitre') {
    if (netQuantityValue > 1000) {
      expectedUnit = 'per L';
      divisor = netQuantityValue / 1000;
    } else {
      expectedUnit = 'per ml';
    }
  } else if (unitLower === 'l' || unitLower === 'litre') {
    expectedUnit = 'per L';
  } else if (unitLower === 'n' || unitLower === 'u' || unitLower === 'piece') {
    expectedUnit = 'per piece';
  }

  const expectedUSP = Math.round((mrpAmount / divisor) * 100) / 100;

  if (declaredUspAmount === undefined || !declaredUspUnit) {
    return {
      isCompliant: false,
      expectedUSP,
      expectedUnit,
      reason: `Mandatory Unit Sale Price (USP) is missing from the package. Under Rule 6(11) of LMPC Rules (effective Oct 1, 2022), every retail package must declare USP rounded to 2 decimal places (Expected: ₹ ${expectedUSP.toFixed(2)} / ${expectedUnit}).`
    };
  }

  const diff = Math.abs(declaredUspAmount - expectedUSP);
  if (diff > 0.02) {
    return {
      isCompliant: false,
      expectedUSP,
      expectedUnit,
      reason: `Mathematical calculation mismatch: Declared USP is ₹ ${declaredUspAmount.toFixed(2)}, but calculated USP is ₹ ${expectedUSP.toFixed(2)} (MRP ₹ ${mrpAmount} / Net Qty ${netQuantityValue} ${netQuantityUnit}). Violates Rule 6(11).`
    };
  }

  return {
    isCompliant: true,
    expectedUSP,
    expectedUnit,
    reason: `Complies with LMPC Rule 6(11). Declared USP ₹ ${declaredUspAmount.toFixed(2)} / ${declaredUspUnit} accurately reflects metric price rounded to 2 decimal places.`
  };
}

/**
 * Validates FSSAI 14-Digit License Number Format
 */
export function validateFSSAILicense(licenseNo: string): { isValid: boolean; stateCode?: string; year?: string; reason: string } {
  const cleanLic = licenseNo.replace(/[^0-9]/g, '');
  if (cleanLic.length !== 14) {
    return {
      isValid: false,
      reason: `FSSAI License must be exactly 14 numeric digits. Observed: ${cleanLic.length} digits. Violates Regulation 5(2) of FSS (Labelling and Display) Regulations, 2020.`
    };
  }

  const firstDigit = cleanLic.charAt(0);
  if (firstDigit !== '1' && firstDigit !== '2') {
    return {
      isValid: false,
      reason: `Invalid FSSAI License prefix: Must start with 1 (License) or 2 (Registration). Observed start: '${firstDigit}'.`
    };
  }

  const stateCode = cleanLic.substring(1, 3);
  const year = cleanLic.substring(3, 5);

  return {
    isValid: true,
    stateCode,
    year,
    reason: `Valid 14-digit FSSAI License format (${firstDigit === '1' ? 'State/Central License' : 'Registration'}, State Code: ${stateCode}, Enrolment Year: 20${year}). Conforms to FSS Regulations.`
  };
}

/**
 * Screens for Maharashtra Section 30(2)(a) Contraband (Gutkha, Pan Masala, Scented Supari)
 */
export function checkMaharashtraContraband(text: string): { isContraband: boolean; detectedTerm?: string; reason: string } {
  const prohibitedRegex = /\b(gutkha|gutka|pan\s+masala|flavoured\s+tobacco|scented\s+supari|kharra|mawa\s+tobacco)\b/i;
  const match = text.match(prohibitedRegex);
  if (match) {
    return {
      isContraband: true,
      detectedTerm: match[0],
      reason: `STRICT PROHIBITED CONTRABAND: '${match[0]}' is completely banned in Maharashtra under Section 30(2)(a) of Food Safety and Standards Act, 2006 read with Maharashtra State Gazettes. Manufacturing, distributing, or selling is subject to immediate criminal confiscation.`
    };
  }
  return {
    isContraband: false,
    reason: 'No prohibited tobacco, gutkha, or scented supari formulations detected.'
  };
}

/**
 * Screens for Misleading Claims (FSSAI Advertising Regulations 2018 & 2024 Directives)
 */
export function screenMisleadingClaims(claimsText: string, ingredientText: string): ParameterFinding[] {
  const findings: ParameterFinding[] = [];

  // Ban on "100% Fruit Juice" for reconstituted juice
  if (/100%\s*(fruit\s*juice|pure\s*juice|natural\s*juice)/i.test(claimsText)) {
    if (/reconstituted|concentrate|water/i.test(ingredientText)) {
      findings.push({
        parameter_name: "Fruit Juice Claim Substantiation",
        observed_value: "100% Fruit Juice / Pure Juice",
        regulatory_clause: "FSSAI Directives 2024 & FSS (Advertising and Claims) Regulations, 2018",
        status: "Non-Compliant",
        why_correct_or_wrong: "VIOLATION: FSSAI circular 2024 strictly prohibited declaring '100% Fruit Juice' on reconstituted juice labels prepared from water and fruit concentrates, as it misleads consumers regarding fresh content.",
        severity: "CRITICAL"
      });
    }
  }

  // Ban on "ORS" for non-medicinal ready-to-drink beverages
  if (/\bORS\b|oral\s+rehydration\s+salts/i.test(claimsText) && !/licensed\s+drug|who\s+formulation/i.test(claimsText)) {
    findings.push({
      parameter_name: "ORS Branding & Misrepresentation",
      observed_value: "ORS branded synthetic beverage",
      regulatory_clause: "FSSAI Order on Misleading ORS Labelling (2022-2024)",
      status: "Non-Compliant",
      why_correct_or_wrong: "VIOLATION: FSSAI prohibits non-medicinal ready-to-drink synthetic beverages from using 'ORS' or phonetically similar trademarks to protect patients needing genuine WHO-approved medicinal rehydration formulas.",
      severity: "CRITICAL"
    });
  }

  return findings;
}
