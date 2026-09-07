import React, { useState } from 'react';
import {
  AlertOctagon,
  FileWarning,
  Send,
  ExternalLink,
  Copy,
  Check,
  Building2,
  ChevronRight,
  ShieldAlert,
  Scale
} from 'lucide-react';
import { ProductAuditReport } from '../../types/audit';
import { LegalComplaint } from '../../types/complaint';
import {
  generateOfficialLegalText,
  generatePreFilledEmailUrl,
  OFFICIAL_GOVT_PORTALS,
  STATE_FOOD_SAFETY_DESKS
} from '../../services/complaintService';
import { sendAppNotification } from '../../services/notificationService';

interface StatutoryComplaintBannerProps {
  report: ProductAuditReport;
  complaint?: LegalComplaint | null;
  onOpenComplaintDrawer: () => void;
  className?: string;
}

export const StatutoryComplaintBanner: React.FC<StatutoryComplaintBannerProps> = ({
  report,
  complaint,
  onOpenComplaintDrawer,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedDeskKey, setSelectedDeskKey] = useState('central');

  const violations = report.findings.filter(f => f.status === 'Non-Compliant');
  const violationCount = violations.length;

  if (violationCount === 0 && report.compliance_score >= 90) {
    return null;
  }

  const activeDesk = STATE_FOOD_SAFETY_DESKS.find(d => d.key === selectedDeskKey) || STATE_FOOD_SAFETY_DESKS[0];

  // 1-Click Fast Email Dispatch
  const handleFastEmailDispatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!complaint) {
      onOpenComplaintDrawer();
      return;
    }

    const mailUrl = generatePreFilledEmailUrl(complaint, activeDesk.primaryEmail, activeDesk.ccEmails);
    window.open(mailUrl, '_blank');

    sendAppNotification('COMPLAINT_FILED', true, {
      title: 'Statutory Complaint Pre-Filled via Email',
      message: `Docket #${complaint.complaint_id} launched for ${activeDesk.department} (${activeDesk.primaryEmail}).`,
      meta: {
        docketId: complaint.complaint_id,
        targetDesk: activeDesk.department
      }
    });
  };

  // 1-Click Portal Open with Auto-Copy
  const handlePortalOneClick = (e: React.MouseEvent, portalUrl: string, portalName: string) => {
    e.stopPropagation();
    if (complaint) {
      const text = generateOfficialLegalText(complaint);
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }

    window.open(portalUrl, '_blank');

    sendAppNotification('CUSTOM_INFO', true, {
      title: `${portalName} Opened (1-Click)`,
      message: `Official legal petition copied to clipboard! Paste directly into the grievance form.`,
      meta: { linkUrl: portalUrl }
    });
  };

  // 1-Click Copy Petition Text
  const handleCopyLegalText = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!complaint) {
      onOpenComplaintDrawer();
      return;
    }

    const text = generateOfficialLegalText(complaint);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    sendAppNotification('CUSTOM_INFO', true, {
      title: 'Legal Complaint Copied',
      message: 'Formal petition with court-style headers copied to clipboard.'
    });
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-rose-300 dark:border-rose-900/70 bg-gradient-to-br from-rose-50 via-white to-red-50/50 dark:from-rose-950/40 dark:via-slate-900 dark:to-slate-900/90 shadow-lg shadow-rose-500/10 p-5 sm:p-6 transition-all ${className}`}
    >
      {/* Decorative accent background badge */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        
        {/* Left: Defect Alert Information & Statutory Ramifications */}
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs shadow-rose-600/30 animate-pulse">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>{violationCount} Statutory Breaches Detected</span>
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800/60">
              <Scale className="w-3 h-3" />
              <span>Sec 36 LMPC & FSSA 2006</span>
            </span>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              File Official Statutory Complaint to Food Safety Authorities
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              This product (<span className="font-bold text-slate-900 dark:text-white">{report.brand_name} - {report.product_name}</span>) violates mandatory labelling requirements. You can transmit a legally grounded petition to the Food Safety Department and FSSAI portals in just 1 click.
            </p>
          </div>

          {/* Quick Authority Desk Selector */}
          <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Target Department:
            </span>
            <select
              value={selectedDeskKey}
              onChange={(e) => setSelectedDeskKey(e.target.value)}
              className="text-xs font-bold py-1 px-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500 outline-none shadow-2xs"
            >
              {STATE_FOOD_SAFETY_DESKS.map(desk => (
                <option key={desk.key} value={desk.key}>
                  {desk.state} — {desk.primaryEmail}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Primary Complaint Trigger & 1-Click Multi-Channel Options */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2.5 w-full lg:w-auto shrink-0">
          
          {/* Main Primary Button: Open Full Formal Legal Petition */}
          <button
            onClick={onOpenComplaintDrawer}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-700 hover:to-red-800 text-white font-black text-xs sm:text-sm shadow-lg shadow-rose-600/30 hover:shadow-rose-600/40 flex items-center justify-center gap-2.5 transition active:scale-95 group cursor-pointer"
          >
            <FileWarning className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>File Official Legal Complaint</span>
            <ChevronRight className="w-4 h-4 ml-auto lg:ml-0 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* 1-Click Action Group */}
          <div className="grid grid-cols-2 gap-2">
            
            {/* 1-Click Direct Email */}
            <button
              onClick={handleFastEmailDispatch}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer"
              title={`Send pre-filled statutory notice directly to ${activeDesk.primaryEmail}`}
            >
              <Send className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span className="truncate">Email Dept (1-Click)</span>
            </button>

            {/* 1-Click Copy Petition */}
            <button
              onClick={handleCopyLegalText}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer"
              title="Copy official court-ready legal affidavit to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Copy Petition</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>

      {/* Quick 1-Click Official Portal Badges */}
      <div className="mt-4 pt-3.5 border-t border-rose-200/60 dark:border-rose-900/40 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          <span>Official 1-Click Portals (Auto-copies petition):</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {OFFICIAL_GOVT_PORTALS.map(portal => (
            <button
              key={portal.id}
              onClick={(e) => handlePortalOneClick(e, portal.url, portal.name)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition shadow-2xs cursor-pointer active:scale-95"
              title={`${portal.name} - ${portal.description}`}
            >
              <span>{portal.shortName}</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-brand-500" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
