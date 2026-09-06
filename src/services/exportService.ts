import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  WidthType,
  AlignmentType
} from 'docx';
import { ProductAuditReport } from '../types/audit';
import { LegalComplaint } from '../types/complaint';
import { getLabelLensSvgMarkup } from '../components/common/LabelLensLogo';
import { storeArchivedDocument, getCurrentUser } from './firebaseService';
import { dispatchNotification } from './notificationService';

function triggerDownload(
  blob: Blob,
  filename: string,
  meta?: {
    title?: string;
    docType?: 'audit_report' | 'complaint_petition';
    format?: 'pdf' | 'docx' | 'html' | 'json' | 'txt';
    auditId?: string;
    complaintId?: string;
  }
) {
  if (typeof document === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  try {
    const user = getCurrentUser();
    const ext = (filename.split('.').pop() || 'file').toUpperCase();
    storeArchivedDocument({
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: meta?.title || filename,
      documentType: meta?.docType || (filename.includes('Complaint') ? 'complaint_petition' : 'audit_report'),
      format: (meta?.format || ext || 'pdf').toLowerCase() as any,
      fileName: filename,
      fileSizeBytes: blob.size,
      downloadedAt: new Date().toISOString(),
      userId: user?.uid || 'usr_anonymous',
      userEmail: user?.email || 'citizen@consumer.gov.in',
      auditId: meta?.auditId,
      complaintId: meta?.complaintId
    });

    const isComplaint = meta?.docType === 'complaint_petition' || filename.toLowerCase().includes('complaint');
    dispatchNotification({
      type: isComplaint ? 'COMPLAINT_FILED' : 'FILE_DOWNLOADED',
      title: meta?.title || (isComplaint ? "Statutory Petition Exported" : "Compliance Dossier Exported"),
      message: `File "${filename}" (${(blob.size / 1024).toFixed(1)} KB) saved to your device and archived.`,
      meta: {
        fileName: filename,
        fileFormat: ext,
        fileSizeBytes: blob.size,
        docketId: meta?.complaintId || meta?.auditId
      }
    });
  } catch (err) {
    console.warn("Failed to archive downloaded document:", err);
  }
}

// ============================================================================
// 1. PLAIN TEXT EXPORTS (.txt)
// ============================================================================

/**
 * Download Audit Report as Plain Text (.txt)
 */
export function exportToTXT(report: ProductAuditReport, complaint?: LegalComplaint): void {
  let content = `╔══════════════════════════════════════════════════════════════════════════════╗\n`;
  content += `║       LABEL LENS AI - STATUTORY COMPLIANCE & LEGAL METROLOGY AUDIT           ║\n`;
  content += `║     Ministry of Consumer Affairs, Food & Public Distribution (MoCAF&PD)      ║\n`;
  content += `║               Grounded in PCR 2026 & FSSAI Regulations 2020                  ║\n`;
  content += `╚══════════════════════════════════════════════════════════════════════════════╝\n\n`;

  content += `[1] DOCKET IDENTIFICATION & PRODUCT PARTICULARS\n`;
  content += `--------------------------------------------------------------------------------\n`;
  content += `Dossier ID         : ${report.id}\n`;
  content += `Audit Timestamp    : ${new Date(report.timestamp).toLocaleString('en-IN')}\n`;
  content += `Product Name       : ${report.product_name}\n`;
  content += `Brand Name         : ${report.brand_name}\n`;
  content += `Category           : ${report.category}\n`;
  content += `Package Form Factor: ${report.package_type}\n`;
  content += `PDP Surface Area   : ${report.principal_display_panel_area_sq_cm} sq. cm\n`;
  content += `Compliance Score   : ${report.compliance_score} / 100\n`;
  content += `Overall Status     : ${report.overall_status.toUpperCase()}\n`;
  content += `Executive Summary  : ${report.summary}\n\n`;

  content += `[2] ITEMIZED 5-POINT STATUTORY EVALUATION FINDINGS\n`;
  content += `--------------------------------------------------------------------------------\n`;
  report.findings.forEach((f, idx) => {
    content += `\nParameter #${idx + 1}: ${f.parameter_name.toUpperCase()}\n`;
    content += `  • Observed Value     : ${f.observed_value}\n`;
    content += `  • Regulatory Clause  : ${f.regulatory_clause}\n`;
    content += `  • Statutory Status   : [ ${f.status.toUpperCase()} ]\n`;
    content += `  • Legal Reasoning    : ${f.why_correct_or_wrong}\n`;
  });

  if (complaint) {
    content += `\n\n[3] OFFICIAL STATUTORY GRIEVANCE / COMPLAINT DOCKET\n`;
    content += `--------------------------------------------------------------------------------\n`;
    content += `Docket Ref         : ${complaint.complaint_id}\n`;
    content += `Before Authority   : ${complaint.authority_target}\n`;
    content += `Formal Subject     : ${complaint.subject_line}\n`;
    content += `Complainant        : ${complaint.complainant.name} | Tel: ${complaint.complainant.phone} | Email: ${complaint.complainant.email}\n`;
    content += `Respondent         : ${complaint.respondent.brand_name} (${complaint.respondent.manufacturer_name})\n`;
    content += `Premises Address   : ${complaint.respondent.premises_address}\n`;
    if (complaint.incident_location) {
      content += `Incident Location  : ${complaint.incident_location.formatted_address}\n`;
      content += `Geo-Coordinates    : ${complaint.incident_location.latitude}, ${complaint.incident_location.longitude}\n`;
      content += `Google Maps Link   : ${complaint.incident_location.maps_link}\n`;
    }
    content += `Digital Evidence   : SHA-256 Hash [${complaint.evidence_summary.digital_sha256_hash.substring(0, 32)}...]\n\n`;

    content += `Statutory Violations Cited:\n`;
    complaint.itemized_violations.forEach((v, i) => {
      content += `  (${i + 1}) ${v.rule_title} [${v.violated_statute}]\n`;
      content += `      Finding: ${v.observed_finding}\n`;
      content += `      Ramification: ${v.legal_ramifications}\n`;
    });

    content += `\nFormal Statutory Prayer:\n`;
    complaint.formal_prayer.forEach((p, i) => {
      content += `  (${String.fromCharCode(97 + i)}) ${p}\n`;
    });

    content += `\nVERIFICATION:\n`;
    content += `I, ${complaint.complainant.name}, do hereby verify that the statements made herein are true\n`;
    content += `and correct to the best of my personal knowledge and statutory record.\n`;
  }

  content += `\n================================================================================\n`;
  content += `Generated automatically by Label Lens AI Verification Engine (SIH 2026 PS 26034)\n`;
  content += `================================================================================\n`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  triggerDownload(blob, `Label_Lens_Audit_${report.id}.txt`);
}

/**
 * Download Standalone Complaint Letter as Plain Text (.txt)
 */
export function exportComplaintToTXT(complaint: LegalComplaint, report?: ProductAuditReport): void {
  let content = `╔══════════════════════════════════════════════════════════════════════════════╗\n`;
  content += `║       FORMAL STATUTORY COMPLAINT & LEGAL PETITION UNDER LM ACT 2009          ║\n`;
  content += `║     Ministry of Consumer Affairs, Food & Public Distribution (MoCAF&PD)      ║\n`;
  content += `╚══════════════════════════════════════════════════════════════════════════════╝\n\n`;

  content += `BEFORE THE HON'BLE:\n`;
  content += `${complaint.authority_target}\n\n`;

  content += `DOCKET REFERENCE NO : ${complaint.complaint_id}\n`;
  content += `DATE OF PETITION    : ${new Date(complaint.created_at).toLocaleDateString('en-IN')}\n\n`;

  content += `IN THE MATTER OF:\n`;
  content += `Complainant: ${complaint.complainant.name}\n`;
  content += `Address    : ${complaint.complainant.address}\n`;
  content += `Contact    : Phone: ${complaint.complainant.phone} | Email: ${complaint.complainant.email}\n`;
  content += `                                                              ...COMPLAINANT\n`;
  content += `                                 VERSUS\n`;
  content += `Respondent : ${complaint.respondent.brand_name} / ${complaint.respondent.manufacturer_name}\n`;
  content += `Premises   : ${complaint.respondent.premises_address}\n`;
  if (complaint.respondent.fssai_license_number) {
    content += `FSSAI Lic  : ${complaint.respondent.fssai_license_number}\n`;
  }
  content += `                                                              ...RESPONDENT\n\n`;

  content += `SUBJECT:\n`;
  content += `${complaint.subject_line}\n\n`;

  content += `MOST RESPECTFULLY SHOWETH:\n\n`;
  content += `1. That the Complainant is a consumer/authorized inspection entity who examined the pre-packaged commodity\n`;
  if (report) {
    content += `   bearing name "${report.product_name}" under Brand "${report.brand_name}" (Category: ${report.category}).\n`;
  } else {
    content += `   manufactured/marketed by the Respondent.\n`;
  }

  if (complaint.incident_location) {
    content += `\n2. INCIDENT & GEO-TAGGED LOCATION:\n`;
    content += `   The commodity was audited/purchased at:\n`;
    content += `   Address    : ${complaint.incident_location.formatted_address}\n`;
    content += `   District   : ${complaint.incident_location.district}, State: ${complaint.incident_location.state}\n`;
    content += `   Coordinates: Latitude ${complaint.incident_location.latitude}, Longitude ${complaint.incident_location.longitude}\n`;
    content += `   Maps Link  : ${complaint.incident_location.maps_link}\n`;
  }

  content += `\n3. ITEMIZED STATUTORY CONTRAVENTIONS & NON-COMPLIANCE FINDINGS:\n`;
  content += `--------------------------------------------------------------------------------\n`;
  complaint.itemized_violations.forEach((v, idx) => {
    content += `(${idx + 1}) Violation   : ${v.rule_title}\n`;
    content += `    Statute     : ${v.violated_statute}\n`;
    content += `    Finding     : ${v.observed_finding}\n`;
    content += `    Ramification: ${v.legal_ramifications}\n\n`;
  });

  content += `4. EVIDENCE & DIGITAL FORENSIC RECORD:\n`;
  content += `   Photographic Evidence Items Attached : ${complaint.evidence_summary.photo_count}\n`;
  if (complaint.evidence_summary.barcode) {
    content += `   Barcode / EAN-13 Scanned             : ${complaint.evidence_summary.barcode}\n`;
  }
  content += `   Cryptographic SHA-256 Integrity Hash : ${complaint.evidence_summary.digital_sha256_hash}\n\n`;

  content += `5. STATUTORY PRAYER / RELIEF SOUGHT:\n`;
  content += `   In light of the above statutory violations, it is most respectfully prayed that this Hon'ble Authority may be pleased to:\n`;
  complaint.formal_prayer.forEach((p, idx) => {
    content += `   (${String.fromCharCode(97 + idx)}) ${p}\n`;
  });

  content += `\n\nVERIFICATION & AFFIDAVIT:\n`;
  content += `I, ${complaint.complainant.name}, the Complainant above-named, do solemnly affirm that the contents of this\n`;
  content += `statutory complaint petition are true and verified on the basis of AI-driven legal metrology examination.\n\n`;
  content += `Place: ${complaint.incident_location ? complaint.incident_location.district : 'India'}\n`;
  content += `Date : ${new Date(complaint.created_at).toLocaleDateString('en-IN')}\n\n`;
  content += `_______________________________\n`;
  content += `Signature of Complainant\n`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  triggerDownload(blob, `Statutory_Complaint_${complaint.complaint_id}.txt`);
}

// ============================================================================
// 2. STRUCTURED JSON EXPORTS (.json)
// ============================================================================

/**
 * Download Audit Report as Structured JSON (.json)
 */
export function exportToJSON(report: ProductAuditReport, complaint?: LegalComplaint): void {
  const payload = {
    $schema: "https://label-lens-ai.gov.in/schemas/statutory-audit-v2.json",
    generator: {
      name: "Label Lens AI Statutory Inspection Engine",
      version: "2.1.0-SIH2026",
      statutory_grounding: [
        "Legal Metrology Act, 2009",
        "Legal Metrology (Packaged Commodities) Rules, 2011 (as amended 2026)",
        "Food Safety and Standards Act, 2006",
        "FSSAI Labelling & Display Regulations, 2020"
      ]
    },
    report,
    complaint: complaint || null,
    exported_at: new Date().toISOString()
  };
  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  triggerDownload(blob, `Label_Lens_Audit_${report.id}.json`);
}

/**
 * Download Standalone Complaint Letter as Structured JSON (.json)
 */
export function exportComplaintToJSON(complaint: LegalComplaint, report?: ProductAuditReport): void {
  const payload = {
    $schema: "https://label-lens-ai.gov.in/schemas/statutory-complaint-v2.json",
    complaint_type: "STATUTORY_LEGAL_METROLOGY_COMPLAINT",
    complaint,
    associated_audit: report ? {
      id: report.id,
      product_name: report.product_name,
      compliance_score: report.compliance_score,
      overall_status: report.overall_status,
      timestamp: report.timestamp
    } : null,
    exported_at: new Date().toISOString()
  };
  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  triggerDownload(blob, `Statutory_Complaint_${complaint.complaint_id}.json`);
}

// ============================================================================
// 3. SPECIAL BRANDED INTERACTIVE APPLICATION FORMAT (.html)
// ============================================================================

/**
 * Generate & Download Special Branded Interactive HTML Application (.html)
 * for Product Audit Dossier
 */
export function exportToHTML(report: ProductAuditReport, complaint?: LegalComplaint): void {
  const statusColor = report.overall_status === 'Compliant' ? '#059669' : (report.overall_status === 'Warning' ? '#D97706' : '#DC2626');
  const statusBg = report.overall_status === 'Compliant' ? '#ECFDF5' : (report.overall_status === 'Warning' ? '#FFFBEB' : '#FEF2F2');
  const statusBorder = report.overall_status === 'Compliant' ? '#A7F3D0' : (report.overall_status === 'Warning' ? '#FDE68A' : '#FECACA');

  let rowsHtml = '';
  report.findings.forEach((f, idx) => {
    const badgeColor = f.status === 'Compliant' ? '#059669' : (f.status === 'Warning' ? '#D97706' : '#DC2626');
    const badgeBg = f.status === 'Compliant' ? '#ECFDF5' : (f.status === 'Warning' ? '#FFFBEB' : '#FEF2F2');
    const badgeBorder = f.status === 'Compliant' ? '#A7F3D0' : (f.status === 'Warning' ? '#FDE68A' : '#FECACA');
    rowsHtml += `
      <tr style="border-bottom: 1px solid #E2E8F0; transition: background 0.15s ease;" onmouseover="this.style.background='#F8FAFC'" onmouseout="this.style.background='white'">
        <td style="padding: 14px 16px; font-weight: 700; color: #0F172A; width: 5%;">#${idx + 1}</td>
        <td style="padding: 14px 16px; font-weight: 700; color: #1E293B;">
          ${f.parameter_name}
        </td>
        <td style="padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #334155; background: #F8FAFC; border-radius: 6px;">
          ${f.observed_value}
        </td>
        <td style="padding: 14px 16px; font-size: 13px; color: #4338CA; font-weight: 600;">
          ${f.regulatory_clause}
        </td>
        <td style="padding: 14px 16px; text-align: center;">
          <span style="display: inline-block; padding: 5px 12px; border-radius: 9999px; font-size: 12px; font-weight: 800; color: ${badgeColor}; background: ${badgeBg}; border: 1px solid ${badgeBorder}; letter-spacing: 0.025em;">
            ${f.status.toUpperCase()}
          </span>
        </td>
        <td style="padding: 14px 16px; font-size: 13px; color: #334155; line-height: 1.6;">
          ${f.why_correct_or_wrong}
        </td>
      </tr>
    `;
  });

  let complaintBlock = '';
  if (complaint) {
    let prayersList = '';
    complaint.formal_prayer.forEach((p, i) => {
      prayersList += `<li style="margin-bottom: 10px; line-height: 1.5;"><strong>(${String.fromCharCode(97 + i)})</strong> ${p}</li>`;
    });

    let violationsList = '';
    complaint.itemized_violations.forEach((v, i) => {
      violationsList += `
        <div style="background: white; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <strong style="color: #0F172A; font-size: 14px;">${i + 1}. ${v.rule_title}</strong>
            <span style="font-size: 12px; color: #DC2626; font-weight: 700; background: #FEF2F2; padding: 2px 8px; border-radius: 4px; border: 1px solid #FECACA;">${v.violated_statute}</span>
          </div>
          <div style="font-size: 13px; color: #475569; margin-top: 6px;"><strong>Finding:</strong> ${v.observed_finding}</div>
          <div style="font-size: 13px; color: #B91C1C; margin-top: 4px;"><strong>Ramifications:</strong> ${v.legal_ramifications}</div>
        </div>
      `;
    });

    complaintBlock = `
      <section style="margin-top: 40px; border: 2px solid #CBD5E1; border-radius: 16px; padding: 28px; background: #F8FAFC; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 20px;">
          <div>
            <span style="font-size: 11px; font-weight: 800; color: #DC2626; letter-spacing: 0.08em; text-transform: uppercase;">Official Grievance Petition</span>
            <h2 style="margin: 4px 0 0 0; font-size: 22px; color: #0F172A; font-weight: 800;">Statutory Legal Metrology Complaint</h2>
          </div>
          <span style="background: #DC2626; color: white; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 800; letter-spacing: 0.05em;">
            FILED UNDER LM ACT 2009
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 20px;">
          <div style="background: white; padding: 14px; border-radius: 10px; border: 1px solid #E2E8F0;">
            <div style="font-size: 11px; color: #64748B; font-weight: 700; text-transform: uppercase;">Target Authority</div>
            <div style="font-size: 14px; color: #0F172A; font-weight: 700; margin-top: 4px;">${complaint.authority_target}</div>
          </div>
          <div style="background: white; padding: 14px; border-radius: 10px; border: 1px solid #E2E8F0;">
            <div style="font-size: 11px; color: #64748B; font-weight: 700; text-transform: uppercase;">Docket Reference</div>
            <div style="font-size: 14px; color: #4338CA; font-weight: 800; font-family: monospace; margin-top: 4px;">${complaint.complaint_id}</div>
          </div>
        </div>

        <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 10px; padding: 14px; margin-bottom: 20px;">
          <div style="font-size: 11px; color: #991B1B; font-weight: 800; text-transform: uppercase;">Subject Line</div>
          <div style="font-size: 14px; color: #7F1D1D; font-weight: 700; margin-top: 2px;">${complaint.subject_line}</div>
        </div>

        ${complaint.incident_location ? `
          <div style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 10px; padding: 14px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <div>
              <span style="font-size: 11px; color: #0369A1; font-weight: 800; text-transform: uppercase;">📍 Geo-Tagged Audit Location</span>
              <div style="font-size: 13px; color: #0C4A6E; font-weight: 600; margin-top: 2px;">${complaint.incident_location.formatted_address}</div>
            </div>
            <a href="${complaint.incident_location.maps_link}" target="_blank" style="font-size: 12px; font-weight: 700; color: #0284C7; text-decoration: none; padding: 6px 12px; background: white; border: 1px solid #BAE6FD; border-radius: 6px;">
              Open in Google Maps →
            </a>
          </div>
        ` : ''}

        <h3 style="font-size: 15px; color: #0F172A; margin: 20px 0 10px 0; text-transform: uppercase; letter-spacing: 0.04em;">Itemized Statutory Contraventions</h3>
        ${violationsList}

        <h3 style="font-size: 15px; color: #0F172A; margin: 24px 0 10px 0; text-transform: uppercase; letter-spacing: 0.04em;">Formal Relief Demanded (Statutory Prayer)</h3>
        <ul style="font-size: 13px; color: #334155; padding-left: 20px; background: white; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px 20px 16px 36px;">
          ${prayersList}
        </ul>

        <div style="margin-top: 24px; display: flex; flex-wrap: wrap; gap: 12px;" class="no-print">
          <a href="mailto:compliance@fssai.gov.in?subject=${encodeURIComponent(complaint.subject_line)}&body=${encodeURIComponent(complaint.subject_line + '\n\n' + report.summary)}" style="background: #4338CA; color: white; text-decoration: none; padding: 10px 22px; border-radius: 8px; font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; gap: 8px;">
            ✉️ Dispatch to Official Authority Email
          </a>
          <a href="https://foscos.fssai.gov.in/consumergrievance" target="_blank" style="background: #059669; color: white; text-decoration: none; padding: 10px 22px; border-radius: 8px; font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; gap: 8px;">
            🏛️ Submit on FoSCoS Consumer Grievance Portal
          </a>
        </div>
      </section>
    `;
  }

  const logoSvg = getLabelLensSvgMarkup(60);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Label Lens AI - ${report.product_name} Statutory Audit Dossier</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #4338CA;
      --navy: #0F172A;
      --slate: #334155;
      --light: #F8FAFC;
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #F1F5F9;
      color: #0F172A;
      margin: 0;
      padding: 32px 16px;
      -webkit-font-smoothing: antialiased;
    }
    .app-container {
      max-width: 1140px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 10px 30px -5px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03);
      overflow: hidden;
    }
    .header-banner {
      background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #064E3B 100%);
      color: white;
      padding: 32px 40px;
      position: relative;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    .brand-cluster {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .gold-accent-line {
      height: 4px;
      background: linear-gradient(90deg, #F59E0B, #10B981, #6366F1);
      width: 100%;
      margin-top: 24px;
      border-radius: 2px;
    }
    .content-body {
      padding: 36px 40px;
    }
    .action-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 16px 40px;
      background: #F8FAFC;
      border-bottom: 1px solid #E2E8F0;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      border: 1px solid #CBD5E1;
      background: white;
      color: #1E293B;
      transition: all 0.15s ease;
    }
    .btn:hover {
      background: #F1F5F9;
      border-color: #94A3B8;
    }
    .btn-primary {
      background: #4338CA;
      color: white;
      border-color: #4338CA;
    }
    .btn-primary:hover {
      background: #3730A3;
    }
    .grid-specs {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 14px;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 28px;
    }
    .spec-item {
      display: flex;
      flex-direction: column;
    }
    .spec-label {
      font-size: 11px;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .spec-val {
      font-size: 14px;
      font-weight: 700;
      color: #0F172A;
      margin-top: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th {
      background: #F8FAFC;
      color: #475569;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 12px 16px;
      border-bottom: 2px solid #E2E8F0;
    }
    .footer-stamp {
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid #E2E8F0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 12px;
      color: #64748B;
    }
    @media print {
      body { background: white; padding: 0; }
      .app-container { box-shadow: none; border-radius: 0; }
      .no-print { display: none !important; }
      .header-banner { background: #0F172A !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="app-container">
    
    <!-- Action Toolbar (Hidden in Print) -->
    <div class="action-toolbar no-print">
      <button class="btn btn-primary" onclick="window.print()">
        🖨️ Print Dossier / Save PDF
      </button>
      <button class="btn" onclick="navigator.clipboard.writeText(window.location.href); alert('Dossier link copied to clipboard!');">
        🔗 Share Link
      </button>
      <a class="btn" href="https://foscos.fssai.gov.in" target="_blank">
        🏛️ FoSCoS Portal
      </a>
      <a class="btn" href="https://consumeraffairs.nic.in" target="_blank">
        ⚖️ Department of Consumer Affairs
      </a>
    </div>

    <!-- Header Banner -->
    <header class="header-banner">
      <div class="header-top">
        <div class="brand-cluster">
          <div>${logoSvg}</div>
          <div>
            <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.08em; color: #34D399; text-transform: uppercase;">
              Government of India • Ministry of Consumer Affairs
            </div>
            <h1 style="margin: 4px 0 0 0; font-size: 26px; font-weight: 800; letter-spacing: -0.02em;">
              Label Lens AI
            </h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #CBD5E1;">
              Statutory Legal Metrology (PCR 2026) & Food Safety Compliance Engine
            </p>
          </div>
        </div>

        <div style="text-align: right;">
          <div style="display: inline-block; padding: 8px 18px; border-radius: 9999px; font-size: 14px; font-weight: 800; color: ${statusColor}; background: ${statusBg}; border: 1.5px solid ${statusBorder};">
            ${report.overall_status.toUpperCase()} (${report.compliance_score}%)
          </div>
          <div style="margin-top: 6px; font-size: 11px; color: #94A3B8; font-family: monospace;">
            Dossier ID: ${report.id}
          </div>
        </div>
      </div>

      <div class="gold-accent-line"></div>
    </header>

    <!-- Main Content Body -->
    <main class="content-body">
      
      <!-- Product Specifications Grid -->
      <div class="grid-specs">
        <div class="spec-item">
          <span class="spec-label">Audited Product</span>
          <span class="spec-val">${report.product_name}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Brand / Manufacturer</span>
          <span class="spec-val">${report.brand_name}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Category</span>
          <span class="spec-val">${report.category}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Package Form Factor</span>
          <span class="spec-val">${report.package_type}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">PDP Surface Area</span>
          <span class="spec-val">${report.principal_display_panel_area_sq_cm} cm²</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Verification Date</span>
          <span class="spec-val">${new Date(report.timestamp).toLocaleDateString('en-IN')}</span>
        </div>
      </div>

      <!-- Executive Compliance Summary Card -->
      <div style="background: #F8FAFC; border-left: 4px solid #4338CA; border-radius: 0 12px 12px 0; padding: 18px 20px; margin-bottom: 32px;">
        <h3 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.04em;">
          Executive Regulatory Evaluation
        </h3>
        <p style="margin: 0; font-size: 13.5px; color: #334155; line-height: 1.6;">
          ${report.summary}
        </p>
      </div>

      <!-- 5-Point Statutory Parameter Table -->
      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 16px 0;">
          Statutory 5-Point Evaluation Matrix
        </h2>
        <div style="overflow-x: auto; border: 1px solid #E2E8F0; border-radius: 12px;">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>1. Statutory Parameter</th>
                <th>2. Observed Value</th>
                <th>3. Regulatory Clause</th>
                <th style="text-align: center;">4. Status</th>
                <th>5. Legal Grounding & Justification</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Statutory Complaint Dossier if generated -->
      ${complaintBlock}

      <!-- Official Footer / Verification Hash -->
      <footer class="footer-stamp">
        <div>
          <strong>Label Lens AI</strong> • Smart India Hackathon (SIH 2026 Problem Statement 26034)
          <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">
            Department of Consumer Affairs (DoCA) & FSSAI Labelling Verification System
          </div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 10px; font-family: monospace; background: #F1F5F9; padding: 4px 8px; border-radius: 4px; border: 1px solid #E2E8F0;">
            SHA-256 DIGITAL AUTHENTICITY STAMP
          </span>
        </div>
      </footer>

    </main>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  triggerDownload(blob, `Label_Lens_Interactive_Report_${report.id}.html`);
}

/**
 * Generate & Download Special Branded Interactive HTML Application (.html)
 * for Standalone Statutory Complaint Petition
 */
export function exportComplaintToHTML(complaint: LegalComplaint, _report?: ProductAuditReport): void {
  const logoSvg = getLabelLensSvgMarkup(54);

  let violationsHtml = '';
  complaint.itemized_violations.forEach((v, idx) => {
    violationsHtml += `
      <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 10px; padding: 18px; margin-bottom: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
          <h4 style="margin: 0; font-size: 15px; color: #0F172A; font-weight: 800;">
            ${idx + 1}. ${v.rule_title}
          </h4>
          <span style="background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; font-family: monospace;">
            ${v.violated_statute}
          </span>
        </div>
        <div style="margin-top: 10px; font-size: 13.5px; color: #334155; line-height: 1.5;">
          <strong>Observed Finding:</strong> ${v.observed_finding}
        </div>
        <div style="margin-top: 6px; font-size: 13px; color: #B91C1C; background: #FEF2F2; padding: 8px 12px; border-radius: 6px; border-left: 3px solid #DC2626;">
          <strong>Statutory Ramification / Penalty:</strong> ${v.legal_ramifications}
        </div>
      </div>
    `;
  });

  let prayerHtml = '';
  complaint.formal_prayer.forEach((p, idx) => {
    prayerHtml += `<li style="margin-bottom: 12px; line-height: 1.6;"><strong>(${String.fromCharCode(97 + idx)})</strong> ${p}</li>`;
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Statutory Complaint Petition - ${complaint.complaint_id}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #F1F5F9;
      color: #0F172A;
      margin: 0;
      padding: 32px 16px;
    }
    .petition-container {
      max-width: 960px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      overflow: hidden;
      border: 1px solid #E2E8F0;
    }
    .petition-header {
      background: linear-gradient(135deg, #0F172A 0%, #312E81 100%);
      color: white;
      padding: 32px 36px;
    }
    .action-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 14px 36px;
      background: #F8FAFC;
      border-bottom: 1px solid #E2E8F0;
    }
    .btn {
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      border: 1px solid #CBD5E1;
      background: white;
      color: #1E293B;
    }
    .btn-primary { background: #DC2626; color: white; border-color: #DC2626; }
    .petition-body { padding: 36px; }
    .court-title { text-align: center; text-transform: uppercase; font-weight: 800; font-size: 16px; letter-spacing: 0.05em; color: #0F172A; margin-bottom: 24px; }
    .memo-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .memo-table td { padding: 12px 14px; border: 1px solid #CBD5E1; vertical-align: top; }
    @media print {
      body { background: white; padding: 0; }
      .petition-container { box-shadow: none; border: none; }
      .no-print { display: none !important; }
      .petition-header { background: #0F172A !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="petition-container">
    
    <!-- Action Bar -->
    <div class="action-bar no-print">
      <button class="btn btn-primary" onclick="window.print()">🖨️ Print Legal Petition / Save PDF</button>
      <a class="btn" href="mailto:compliance@fssai.gov.in?subject=${encodeURIComponent(complaint.subject_line)}&body=${encodeURIComponent(complaint.subject_line)}">
        ✉️ Dispatch to Official Authority
      </a>
      <a class="btn" href="https://foscos.fssai.gov.in/consumergrievance" target="_blank">
        🏛️ FoSCoS Grievance Portal
      </a>
    </div>

    <!-- Header -->
    <div class="petition-header">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div>${logoSvg}</div>
          <div>
            <div style="font-size: 11px; font-weight: 800; color: #F59E0B; text-transform: uppercase; letter-spacing: 0.08em;">
              Republic of India • Statutory Consumer Protection
            </div>
            <h1 style="margin: 4px 0 0 0; font-size: 22px; font-weight: 800;">Label Lens AI — Legal Petition</h1>
            <p style="margin: 2px 0 0 0; font-size: 12px; color: #CBD5E1;">Statutory Complaint under Section 15 & 36 of Legal Metrology Act, 2009</p>
          </div>
        </div>
        <div style="text-align: right;">
          <span style="background: #DC2626; color: white; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 800;">
            STATUTORY DOCKET
          </span>
          <div style="font-family: monospace; font-size: 11px; margin-top: 6px; color: #CBD5E1;">
            Ref: ${complaint.complaint_id}
          </div>
        </div>
      </div>
    </div>

    <!-- Legal Petition Body -->
    <div class="petition-body">
      <div class="court-title">
        BEFORE THE HON'BLE<br>
        <span style="color: #4338CA; font-size: 18px;">${complaint.authority_target}</span>
      </div>

      <table class="memo-table">
        <tr style="background: #F8FAFC;">
          <td style="width: 50%;"><strong>IN THE MATTER OF COMPLAINANT:</strong></td>
          <td style="width: 50%;"><strong>VERSUS RESPONDENT / MANUFACTURER:</strong></td>
        </tr>
        <tr>
          <td>
            <strong style="color: #0F172A;">${complaint.complainant.name}</strong><br>
            <span style="font-size: 13px; color: #475569;">${complaint.complainant.address}</span><br>
            <span style="font-size: 12px; color: #4338CA;">Tel: ${complaint.complainant.phone} | Email: ${complaint.complainant.email}</span>
          </td>
          <td>
            <strong style="color: #0F172A;">${complaint.respondent.brand_name}</strong><br>
            <span style="font-size: 13px; color: #475569;">${complaint.respondent.manufacturer_name}</span><br>
            <span style="font-size: 13px; color: #475569;">${complaint.respondent.premises_address}</span>
            ${complaint.respondent.fssai_license_number ? `<br><span style="font-size: 12px; color: #059669; font-weight: 700;">FSSAI: ${complaint.respondent.fssai_license_number}</span>` : ''}
          </td>
        </tr>
      </table>

      <div style="background: #FEF2F2; border-left: 4px solid #DC2626; padding: 14px 18px; margin-bottom: 24px; border-radius: 0 8px 8px 0;">
        <strong style="font-size: 11px; color: #991B1B; text-transform: uppercase;">Formal Subject Line:</strong>
        <div style="font-size: 14px; font-weight: 700; color: #7F1D1D; margin-top: 2px;">
          ${complaint.subject_line}
        </div>
      </div>

      ${complaint.incident_location ? `
        <div style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; font-size: 13px; color: #0369A1;">
          <strong>📍 Geo-Tagged Inspection Location:</strong> ${complaint.incident_location.formatted_address}
          (<a href="${complaint.incident_location.maps_link}" target="_blank" style="color: #0284C7; font-weight: 700;">View Coordinates</a>)
        </div>
      ` : ''}

      <h3 style="font-size: 15px; text-transform: uppercase; color: #0F172A; margin: 24px 0 12px 0;">
        Itemized Statutory Violations (${complaint.itemized_violations.length})
      </h3>
      ${violationsHtml}

      <h3 style="font-size: 15px; text-transform: uppercase; color: #0F172A; margin: 28px 0 12px 0;">
        Formal Prayer / Statutory Relief Demanded
      </h3>
      <div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 10px; padding: 20px 24px 16px 40px; font-size: 13.5px; color: #334155;">
        <ol style="margin: 0; padding: 0;">
          ${prayerHtml}
        </ol>
      </div>

      <!-- Verification and Affidavit Block -->
      <div style="margin-top: 36px; padding: 20px; border: 1px solid #CBD5E1; border-radius: 10px; background: #FFFFFF;">
        <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #0F172A; letter-spacing: 0.04em;">
          Verification & Affidavit
        </h4>
        <p style="font-size: 13px; color: #475569; line-height: 1.6; margin: 0;">
          I, <strong>${complaint.complainant.name}</strong>, the Complainant above-named, do hereby verify that the contents of this statutory complaint petition are true and correct to the best of my knowledge and technical evidence.
        </p>
        <div style="margin-top: 24px; display: flex; justify-content: space-between; align-items: flex-end;">
          <div style="font-size: 12px; color: #64748B;">
            Place: ${complaint.incident_location?.district || 'India'}<br>
            Date: ${new Date(complaint.created_at).toLocaleDateString('en-IN')}
          </div>
          <div style="text-align: center; border-top: 1px solid #0F172A; width: 220px; padding-top: 6px; font-size: 12px; font-weight: 700;">
            Complainant Signature
          </div>
        </div>
      </div>

      <!-- Authenticity Hash Stamp -->
      <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #E2E8F0; font-size: 11px; color: #94A3B8; display: flex; justify-content: space-between;">
        <span>Label Lens AI Statutory Inspection Engine • Smart India Hackathon 2026</span>
        <span style="font-family: monospace;">SHA-256: ${complaint.evidence_summary.digital_sha256_hash.substring(0, 32)}...</span>
      </div>

    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  triggerDownload(blob, `Statutory_Complaint_${complaint.complaint_id}.html`);
}

// ============================================================================
// 4. PRINT-READY PDF EXPORTS (.pdf)
// ============================================================================

/**
 * Generate & Download Executive Print-Ready PDF (.pdf) for Audit Dossier
 */
export function exportToPDF(report: ProductAuditReport, complaint?: LegalComplaint): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // 1. Navy Top Header Band
  doc.setFillColor(15, 23, 42); // Navy #0F172A
  doc.rect(0, 0, 210, 24, 'F');

  // Gold Accent Line
  doc.setFillColor(245, 158, 11); // Gold #F59E0B
  doc.rect(0, 24, 210, 1.5, 'F');

  // Brand Name & Subtitle
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('LABEL LENS AI', 14, 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('STATUTORY REGULATORY COMPLIANCE DOSSIER | PCR 2026 & FSSAI 2020', 14, 18);

  // Status Badge on Header Right
  const scoreBadge = `${report.overall_status.toUpperCase()} (${report.compliance_score}%)`;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  if (report.overall_status === 'Compliant') {
    doc.setTextColor(52, 211, 153);
  } else if (report.overall_status === 'Warning') {
    doc.setTextColor(251, 191, 36);
  } else {
    doc.setTextColor(248, 113, 113);
  }
  doc.text(scoreBadge, 196, 15, { align: 'right' });

  // 2. Metadata Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 29, 182, 26, 2, 2, 'FD');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Product: ${report.product_name}`, 18, 36);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Brand: ${report.brand_name} | Category: ${report.category} | Package Type: ${report.package_type}`, 18, 42);
  doc.text(`PDP Surface Area: ${report.principal_display_panel_area_sq_cm} cm² | Dossier ID: ${report.id} | Date: ${new Date(report.timestamp).toLocaleDateString('en-IN')}`, 18, 48);

  // 3. Findings Autotable
  const tableData = report.findings.map((f, i) => [
    `${i + 1}`,
    f.parameter_name,
    f.observed_value,
    f.regulatory_clause,
    f.status,
    f.why_correct_or_wrong
  ]);

  (doc as any).autoTable({
    startY: 59,
    head: [['#', 'Statutory Parameter', 'Observed Value', 'Regulatory Clause', 'Status', 'Legal Reasoning & Grounding']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.5,
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 32, fontStyle: 'bold' },
      2: { cellWidth: 26 },
      3: { cellWidth: 32, textColor: [67, 56, 202] },
      4: { cellWidth: 20, fontStyle: 'bold', halign: 'center' },
      5: { cellWidth: 64 }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didParseCell: (data: any) => {
      if (data.section === 'body' && data.column.index === 4) {
        const val = data.cell.raw;
        if (val === 'Compliant') {
          data.cell.styles.textColor = [5, 150, 105];
        } else if (val === 'Warning') {
          data.cell.styles.textColor = [217, 119, 6];
        } else {
          data.cell.styles.textColor = [220, 38, 38];
        }
      }
    }
  });

  let currentY = (doc as any).lastAutoTable.finalY + 8;

  // 4. Attached Statutory Complaint if present
  if (complaint && currentY < 240) {
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(14, currentY, 182, 34, 2, 2, 'FD');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(185, 28, 28);
    doc.text('OFFICIAL STATUTORY COMPLAINT SUMMARY', 18, currentY + 6);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(`Authority: ${complaint.authority_target}`, 18, currentY + 12);
    doc.text(`Subject: ${complaint.subject_line}`, 18, currentY + 17, { maxWidth: 174 });
    doc.text(`Respondent: ${complaint.respondent.brand_name} (${complaint.respondent.manufacturer_name})`, 18, currentY + 23);
    doc.setTextColor(67, 56, 202);
    doc.text(`Relief Demanded: Punitive action under Section 36 of Legal Metrology Act, 2009.`, 18, currentY + 29);
  }

  // 5. Official Government Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 285, 196, 285);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('Label Lens AI • Smart India Hackathon 2026 (PS 26034) • Statutory Regulatory Verification Engine', 14, 289);
    doc.text(`Page ${i} of ${totalPages}`, 196, 289, { align: 'right' });
  }

  doc.save(`Label_Lens_Audit_${report.id}.pdf`);
}

/**
 * Generate & Download Formal Legal Petition PDF (.pdf) for Statutory Complaint
 */
export function exportComplaintToPDF(complaint: LegalComplaint, _report?: ProductAuditReport): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Top Navy Band
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 24, 'F');
  doc.setFillColor(220, 38, 38); // Crimson accent for complaint
  doc.rect(0, 24, 210, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('LABEL LENS AI | STATUTORY LEGAL PETITION', 14, 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('OFFICIAL COMPLAINT UNDER SECTION 15 & 36 OF LEGAL METROLOGY ACT, 2009', 14, 18);

  doc.setTextColor(248, 113, 113);
  doc.setFont('helvetica', 'bold');
  doc.text(`REF: ${complaint.complaint_id}`, 196, 15, { align: 'right' });

  // Court Title Heading
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('BEFORE THE HON\'BLE CONTROLLER OF LEGAL METROLOGY / FSSAI DESIGNATED OFFICER', 105, 34, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setTextColor(67, 56, 202);
  doc.text(`Jurisdiction: ${complaint.authority_target}`, 105, 39, { align: 'center' });

  // Memo of Parties Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 43, 182, 34, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('COMPLAINANT:', 18, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(`${complaint.complainant.name} | Phone: ${complaint.complainant.phone}`, 18, 55);
  doc.text(`Address: ${complaint.complainant.address}`, 18, 60);

  doc.setFont('helvetica', 'bold');
  doc.text('RESPONDENT:', 18, 66);
  doc.setFont('helvetica', 'normal');
  doc.text(`${complaint.respondent.brand_name} - ${complaint.respondent.manufacturer_name}`, 18, 71);

  // Subject Box
  doc.setFillColor(254, 242, 242);
  doc.rect(14, 80, 182, 14, 'FD');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(185, 28, 28);
  doc.text('SUBJECT:', 18, 86);
  doc.setFont('helvetica', 'normal');
  doc.text(complaint.subject_line, 35, 86, { maxWidth: 156 });

  // Itemized Violations Table
  const violationsData = complaint.itemized_violations.map((v, i) => [
    `${i + 1}`,
    v.rule_title,
    v.violated_statute,
    v.observed_finding,
    v.legal_ramifications
  ]);

  (doc as any).autoTable({
    startY: 98,
    head: [['#', 'Rule Title', 'Statutory Clause', 'Observed Finding', 'Legal Ramification & Penalty']],
    body: violationsData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 2.5 },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 35, fontStyle: 'bold' },
      2: { cellWidth: 30, textColor: [185, 28, 28] },
      3: { cellWidth: 45 },
      4: { cellWidth: 64 }
    }
  });

  let nextY = (doc as any).lastAutoTable.finalY + 8;

  // Check page overflow for Prayers
  if (nextY > 210) {
    doc.addPage();
    nextY = 20;
  }

  // Formal Prayer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('STATUTORY PRAYER / RELIEF DEMANDED:', 14, nextY);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  complaint.formal_prayer.forEach((p, idx) => {
    nextY += 6;
    doc.text(`(${String.fromCharCode(97 + idx)}) ${p}`, 18, nextY, { maxWidth: 176 });
  });

  nextY += 14;
  if (nextY > 240) {
    doc.addPage();
    nextY = 20;
  }

  // Complainant Verification Block
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.rect(14, nextY, 182, 28, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('VERIFICATION & AFFIDAVIT', 18, nextY + 6);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`I, ${complaint.complainant.name}, do solemnly verify that the contents of this statutory petition are true to my knowledge and substantiated by AI-audited digital evidence.`, 18, nextY + 12, { maxWidth: 174 });

  doc.text(`Place: ${complaint.incident_location?.district || 'India'} | Date: ${new Date(complaint.created_at).toLocaleDateString('en-IN')}`, 18, nextY + 22);
  doc.text('_____________________________', 145, nextY + 20);
  doc.text('Complainant Signature', 150, nextY + 24);

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 285, 196, 285);
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Label Lens AI • Smart India Hackathon 2026 (PS 26034) • Statutory Legal Metrology Petition', 14, 289);
    doc.text(`Page ${i} of ${totalPages}`, 196, 289, { align: 'right' });
  }

  doc.save(`Statutory_Complaint_${complaint.complaint_id}.pdf`);
}

// ============================================================================
// 5. MICROSOFT WORD EXPORTS (.docx)
// ============================================================================

/**
 * Generate & Download Word Document (.docx) for Audit Dossier
 */
export async function exportToDOCX(report: ProductAuditReport, complaint?: LegalComplaint): Promise<void> {
  const tableRows = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({ width: { size: 6, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: "#", bold: true })] })] }),
        new TableCell({ width: { size: 24, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: "Statutory Parameter", bold: true })] })] }),
        new TableCell({ width: { size: 18, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: "Observed Value", bold: true })] })] }),
        new TableCell({ width: { size: 22, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: "Regulatory Clause", bold: true })] })] }),
        new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true })] })] }),
        new TableCell({ width: { size: 38, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: "Legal Grounding & Justification", bold: true })] })] }),
      ]
    }),
    ...report.findings.map((f, idx) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(String(idx + 1))] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: f.parameter_name, bold: true })] })] }),
          new TableCell({ children: [new Paragraph(f.observed_value)] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: f.regulatory_clause, color: "4338CA" })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: f.status, bold: true })] })] }),
          new TableCell({ children: [new Paragraph(f.why_correct_or_wrong)] }),
        ]
      })
    )
  ];

  const docChildren: any[] = [
    new Paragraph({
      text: "LABEL LENS AI — STATUTORY REGULATORY AUDIT DOSSIER",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER
    }),
    new Paragraph({
      text: "Ministry of Consumer Affairs, Food & Public Distribution | PCR 2026 & FSSAI 2020",
      heading: HeadingLevel.HEADING_3,
      alignment: AlignmentType.CENTER
    }),
    new Paragraph({ text: "" }),
    new Paragraph({
      children: [
        new TextRun({ text: `Product Name: `, bold: true }),
        new TextRun({ text: `${report.product_name}    ` }),
        new TextRun({ text: `Brand: `, bold: true }),
        new TextRun({ text: `${report.brand_name}    ` }),
        new TextRun({ text: `Score: `, bold: true }),
        new TextRun({ text: `${report.compliance_score}/100 (${report.overall_status})\n` }),
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Category: `, bold: true }),
        new TextRun({ text: `${report.category} | Package Type: ${report.package_type} | PDP Area: ${report.principal_display_panel_area_sq_cm} cm²\n` }),
        new TextRun({ text: `Dossier Reference ID: `, bold: true }),
        new TextRun({ text: `${report.id} | Timestamp: ${new Date(report.timestamp).toLocaleString('en-IN')}\n\n` })
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "EXECUTIVE AUDIT SUMMARY:\n", bold: true }),
        new TextRun({ text: `${report.summary}\n\n` })
      ]
    }),
    new Paragraph({
      text: "STATUTORY 5-POINT EVALUATION FINDINGS",
      heading: HeadingLevel.HEADING_2
    }),
    new Table({
      rows: tableRows,
      width: { size: 100, type: WidthType.PERCENTAGE }
    })
  ];

  if (complaint) {
    docChildren.push(
      new Paragraph({ text: "" }),
      new Paragraph({
        text: "ATTACHED STATUTORY COMPLAINT PETITION",
        heading: HeadingLevel.HEADING_2
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Authority Target: ", bold: true }),
          new TextRun({ text: `${complaint.authority_target}\n` }),
          new TextRun({ text: "Subject Line: ", bold: true }),
          new TextRun({ text: `${complaint.subject_line}\n` }),
          new TextRun({ text: "Complainant: ", bold: true }),
          new TextRun({ text: `${complaint.complainant.name} (${complaint.complainant.phone})\n` }),
          new TextRun({ text: "Respondent: ", bold: true }),
          new TextRun({ text: `${complaint.respondent.brand_name} - ${complaint.respondent.manufacturer_name}\n\n` }),
        ]
      })
    );
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: docChildren
    }]
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, `Label_Lens_Audit_${report.id}.docx`);
}

/**
 * Generate & Download Formal Legal Petition Word Document (.docx) for Statutory Complaint
 */
export async function exportComplaintToDOCX(complaint: LegalComplaint, _report?: ProductAuditReport): Promise<void> {
  const violationsRows = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: "#", bold: true })] })] }),
        new TableCell({ width: { size: 28, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: "Rule Title", bold: true })] })] }),
        new TableCell({ width: { size: 22, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: "Statute / Clause", bold: true })] })] }),
        new TableCell({ width: { size: 42, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: "Observed Finding & Ramification", bold: true })] })] }),
      ]
    }),
    ...complaint.itemized_violations.map((v, i) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(String(i + 1))] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: v.rule_title, bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: v.violated_statute, color: "DC2626" })] })] }),
          new TableCell({
            children: [
              new Paragraph({ children: [new TextRun({ text: "Finding: ", bold: true }), new TextRun({ text: v.observed_finding })] }),
              new Paragraph({ children: [new TextRun({ text: "Ramification: ", bold: true }), new TextRun({ text: v.legal_ramifications, color: "991B1B" })] })
            ]
          }),
        ]
      })
    )
  ];

  const prayersParagraphs = complaint.formal_prayer.map((p, idx) =>
    new Paragraph({
      children: [
        new TextRun({ text: `(${String.fromCharCode(97 + idx)}) `, bold: true }),
        new TextRun({ text: p })
      ]
    })
  );

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: "BEFORE THE HON'BLE CONTROLLER OF LEGAL METROLOGY & FOOD SAFETY",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          text: `Jurisdiction: ${complaint.authority_target}`,
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Docket Ref: ${complaint.complaint_id}  |  Date: ${new Date(complaint.created_at).toLocaleDateString('en-IN')}`, bold: true })
          ],
          alignment: AlignmentType.RIGHT
        }),
        new Paragraph({ text: "" }),
        new Paragraph({
          children: [
            new TextRun({ text: `IN THE MATTER OF:\n`, bold: true }),
            new TextRun({ text: `Complainant: ${complaint.complainant.name}\n` }),
            new TextRun({ text: `Address: ${complaint.complainant.address} | Contact: ${complaint.complainant.phone}\n` }),
            new TextRun({ text: `                                                                    ...COMPLAINANT\n\n`, bold: true }),
            new TextRun({ text: `                                        VERSUS\n\n`, bold: true }),
            new TextRun({ text: `Respondent: ${complaint.respondent.brand_name} (${complaint.respondent.manufacturer_name})\n` }),
            new TextRun({ text: `Premises: ${complaint.respondent.premises_address}\n` }),
            new TextRun({ text: `                                                                    ...RESPONDENT\n\n`, bold: true }),
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "SUBJECT: ", bold: true }),
            new TextRun({ text: `${complaint.subject_line}\n\n` })
          ]
        }),
        new Paragraph({
          text: "ITEMIZED STATUTORY VIOLATIONS",
          heading: HeadingLevel.HEADING_2
        }),
        new Table({
          rows: violationsRows,
          width: { size: 100, type: WidthType.PERCENTAGE }
        }),
        new Paragraph({ text: "" }),
        new Paragraph({
          text: "STATUTORY PRAYER / RELIEF SOUGHT",
          heading: HeadingLevel.HEADING_2
        }),
        ...prayersParagraphs,
        new Paragraph({ text: "" }),
        new Paragraph({
          text: "VERIFICATION & AFFIDAVIT",
          heading: HeadingLevel.HEADING_2
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `I, ${complaint.complainant.name}, the Complainant above-named, do hereby verify that the contents of this statutory complaint petition are true and correct to the best of my personal knowledge and statutory audit records.`
            })
          ]
        }),
        new Paragraph({ text: "\n\n" }),
        new Paragraph({
          children: [
            new TextRun({ text: `Place: ${complaint.incident_location?.district || 'India'}              Date: ${new Date(complaint.created_at).toLocaleDateString('en-IN')}              Complainant Signature: __________________`, bold: true })
          ]
        })
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, `Statutory_Complaint_${complaint.complaint_id}.docx`);
}
