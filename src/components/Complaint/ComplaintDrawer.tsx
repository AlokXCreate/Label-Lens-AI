import React, { useState } from 'react';
import {
  X,
  Send,
  Copy,
  FileWarning,
  ExternalLink,
  MapPin,
  Check,
  FileText,
  Globe,
  Code,
  FileCode,
  Download,
  Loader2,
  ShieldCheck,
  Building2,
  PhoneCall
} from 'lucide-react';
import { LegalComplaint } from '../../types/complaint';
import { ProductAuditReport } from '../../types/audit';
import {
  exportComplaintToPDF,
  exportComplaintToDOCX,
  exportComplaintToHTML,
  exportComplaintToTXT,
  exportComplaintToJSON
} from '../../services/exportService';
import { sendAppNotification } from '../../services/notificationService';
import { useLanguage } from '../../context/LanguageContext';
import {
  generateOfficialLegalText,
  generatePreFilledEmailUrl,
  OFFICIAL_GOVT_PORTALS,
  STATE_FOOD_SAFETY_DESKS
} from '../../services/complaintService';

interface ComplaintDrawerProps {
  isOpen: boolean;
  complaint: LegalComplaint | null;
  report?: ProductAuditReport | null;
  onClose: () => void;
  onDispatched: () => void;
}

export const ComplaintDrawer: React.FC<ComplaintDrawerProps> = ({
  isOpen,
  complaint,
  report,
  onClose,
  onDispatched
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [selectedDeskKey, setSelectedDeskKey] = useState('central');

  if (!isOpen || !complaint) return null;

  const activeDesk = STATE_FOOD_SAFETY_DESKS.find(d => d.key === selectedDeskKey) || STATE_FOOD_SAFETY_DESKS[0];

  const handleCopy = () => {
    const text = generateOfficialLegalText(complaint);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    sendAppNotification('CUSTOM_INFO', true, {
      title: 'Formal Legal Petition Copied',
      message: 'Full court-formatted petition with statutory charges copied to clipboard.'
    });
  };

  const handleDownload = async (format: 'pdf' | 'docx' | 'html' | 'txt' | 'json') => {
    const rep = report || undefined;
    if (format === 'pdf') {
      exportComplaintToPDF(complaint, rep);
    } else if (format === 'docx') {
      setIsExportingDocx(true);
      try {
        await exportComplaintToDOCX(complaint, rep);
      } finally {
        setIsExportingDocx(false);
      }
    } else if (format === 'html') {
      exportComplaintToHTML(complaint, rep);
    } else if (format === 'txt') {
      exportComplaintToTXT(complaint, rep);
    } else if (format === 'json') {
      exportComplaintToJSON(complaint, rep);
    }
  };

  const handleEmailDispatch = () => {
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
    onDispatched();
  };

  const handleOpenPortal = (portalUrl: string, portalName: string) => {
    // 1-Click: auto-copy official legal text so user can paste it immediately
    const text = generateOfficialLegalText(complaint);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);

    window.open(portalUrl, '_blank');

    sendAppNotification('CUSTOM_INFO', true, {
      title: `${portalName} Opened (1-Click)`,
      message: 'Official legal petition auto-copied to clipboard! Paste directly into the complaint portal form.',
      meta: { linkUrl: portalUrl }
    });
    onDispatched();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 transition-colors">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-bold text-white shadow-md shadow-rose-900/30">
              <FileWarning className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  Official Statutory Complaint Dossier
                </h3>
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded">
                  Legal Form
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Grounded in Legal Metrology Act, 2009 & Food Safety and Standards Act (FSSA), 2006
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dossier Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans">
          
          {/* 1-CLICK DISPATCH COMMAND CENTER */}
          <div className="p-4 bg-gradient-to-br from-rose-50 via-white to-amber-50/40 dark:from-rose-950/40 dark:via-slate-900 dark:to-slate-800/60 rounded-2xl border border-rose-200 dark:border-rose-900/60 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                  1-Click Dispatch to Food Safety Authorities
                </h4>
              </div>
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/50 px-2 py-0.5 rounded-full">
                Instant Transmission
              </span>
            </div>

            {/* Department Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Select Target Food Safety Authority:
              </label>
              <select
                value={selectedDeskKey}
                onChange={(e) => setSelectedDeskKey(e.target.value)}
                className="w-full text-xs font-bold py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none shadow-2xs"
              >
                {STATE_FOOD_SAFETY_DESKS.map(desk => (
                  <option key={desk.key} value={desk.key}>
                    {desk.state} — {desk.department}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="truncate">
                  <strong>Official Email: </strong>
                  <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">{activeDesk.primaryEmail}</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <PhoneCall className="w-3 h-3" />
                  <span>Toll-Free: {activeDesk.helpline}</span>
                </div>
              </div>
            </div>

            {/* Main 1-Click Email Trigger */}
            <button
              onClick={handleEmailDispatch}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-xs sm:text-sm shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Statutory Complaint via Email in Just 1 Click</span>
            </button>

            {/* Official Portals Grid */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                Official FSSAI & Central Grievance Portals (1-Click Auto-Copies Petition):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {OFFICIAL_GOVT_PORTALS.map(portal => (
                  <button
                    key={portal.id}
                    onClick={() => handleOpenPortal(portal.url, portal.name)}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-left transition active:scale-95 group shadow-2xs cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
                        {portal.shortName}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 transition" />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {portal.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Multi-Format Download Options Bar */}
          <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-slate-800/60 dark:to-slate-800/40 p-4 rounded-2xl border border-indigo-100 dark:border-slate-700 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                <Download className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>{t('exportDossier')}</span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                Formal Government Docket
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              
              {/* PDF Format */}
              <button
                onClick={() => handleDownload('pdf')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-rose-200 dark:border-rose-800/60 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 transition active:scale-95 group shadow-xs cursor-pointer"
                title="Download Print-Ready Legal Petition PDF"
              >
                <FileText className="w-4 h-4 text-rose-600 group-hover:scale-110 transition" />
                <span className="text-xs font-bold mt-1 text-slate-900 dark:text-slate-100">{t('downloadPdf')}</span>
                <span className="text-[9px] text-slate-400">Court Format</span>
              </button>

              {/* Word DOCX Format */}
              <button
                onClick={() => handleDownload('docx')}
                disabled={isExportingDocx}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-sky-200 dark:border-sky-800/60 bg-white dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-slate-700 dark:text-slate-200 transition active:scale-95 group shadow-xs disabled:opacity-50 cursor-pointer"
                title="Download Editable Word Document (.docx)"
              >
                {isExportingDocx ? (
                  <Loader2 className="w-4 h-4 text-sky-600 animate-spin" />
                ) : (
                  <FileCode className="w-4 h-4 text-sky-600 group-hover:scale-110 transition" />
                )}
                <span className="text-xs font-bold mt-1 text-slate-900 dark:text-slate-100">{t('downloadWord')}</span>
                <span className="text-[9px] text-slate-400">Editable Brief</span>
              </button>

              {/* Interactive Branded HTML */}
              <button
                onClick={() => handleDownload('html')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/70 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900/50 text-brand-900 dark:text-brand-300 transition active:scale-95 group shadow-xs cursor-pointer"
                title="Download Branded Application with Logo (.html)"
              >
                <Globe className="w-4 h-4 text-brand-600 group-hover:scale-110 transition" />
                <span className="text-xs font-bold mt-1 text-brand-900 dark:text-brand-200">{t('downloadHtml')}</span>
                <span className="text-[9px] text-brand-600 dark:text-brand-400 font-semibold">With Logo</span>
              </button>

              {/* JSON Data */}
              <button
                onClick={() => handleDownload('json')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 transition active:scale-95 group shadow-xs cursor-pointer"
                title="Download Structured JSON Schema"
              >
                <Code className="w-4 h-4 text-amber-600 group-hover:scale-110 transition" />
                <span className="text-xs font-bold mt-1 text-slate-900 dark:text-slate-100">{t('downloadJson')}</span>
                <span className="text-[9px] text-slate-400">API / Database</span>
              </button>

              {/* Plain Text */}
              <button
                onClick={() => handleDownload('txt')}
                className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition active:scale-95 group shadow-xs cursor-pointer"
                title="Download Plain Text for Grievance Forms"
              >
                <FileText className="w-4 h-4 text-slate-600 group-hover:scale-110 transition" />
                <span className="text-xs font-bold mt-1 text-slate-900 dark:text-slate-100">{t('downloadTxt')}</span>
                <span className="text-[9px] text-slate-400">NCH Portal</span>
              </button>

            </div>
          </div>

          {/* Legal Formal Header & Target */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Competent Statutory Forum / Authority:
            </span>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
              {complaint.authority_target}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
              <span>Docket ID: {complaint.complaint_id}</span>
              <span>
                Date: {(() => {
                  try {
                    const d = new Date(complaint.created_at);
                    return isNaN(d.getTime())
                      ? complaint.created_at
                      : d.toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        });
                  } catch {
                    return complaint.created_at;
                  }
                })()}
              </span>
            </div>
          </div>

          {/* Subject Line */}
          <div className="p-3.5 bg-rose-50/70 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800/60">
            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">
              Formal Subject Line:
            </span>
            <div className="font-bold text-rose-950 dark:text-rose-200 mt-0.5 leading-snug">
              {complaint.subject_line}
            </div>
          </div>

          {/* Parties Particulars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Complainant Particulars:
              </span>
              <div className="font-bold text-slate-900 dark:text-slate-100 mt-1">{complaint.complainant.name}</div>
              <div className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">{complaint.complainant.email}</div>
              <div className="text-slate-600 dark:text-slate-300 text-xs">{complaint.complainant.phone}</div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 line-clamp-2">{complaint.complainant.address}</div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Respondent Particulars:
              </span>
              <div className="font-bold text-slate-900 dark:text-slate-100 mt-1">{complaint.respondent.brand_name}</div>
              <div className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">{complaint.respondent.manufacturer_name}</div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 line-clamp-2">{complaint.respondent.premises_address}</div>
              {complaint.respondent.fssai_license_number && (
                <div className="text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[11px] mt-1">
                  FSSAI Lic: {complaint.respondent.fssai_license_number}
                </div>
              )}
            </div>
          </div>

          {/* Geo-Tagged Incident Location if present */}
          {complaint.incident_location && (
            <div className="p-3.5 bg-sky-50 dark:bg-sky-950/30 rounded-xl border border-sky-200 dark:border-sky-800/60 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <div className="text-xs flex-1">
                <span className="font-bold text-sky-950 dark:text-sky-200 block">Geo-Tagged Location Attached:</span>
                <span className="text-sky-800 dark:text-sky-300">{complaint.incident_location.formatted_address}</span>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="font-mono text-[11px] text-sky-700 dark:text-sky-400">
                    GPS: {complaint.incident_location.latitude.toFixed(4)}, {complaint.incident_location.longitude.toFixed(4)}
                  </span>
                  <a
                    href={complaint.incident_location.maps_link}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-sky-700 dark:text-sky-400 hover:text-sky-900 underline inline-flex items-center gap-1"
                  >
                    <span>View on Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Itemized Statutory Violations */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
                Itemized Statutory Violations & Charges ({complaint.itemized_violations.length})
              </h4>
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800/60">
                Non-Compliance Evidence
              </span>
            </div>
            <div className="space-y-2.5">
              {complaint.itemized_violations.map((v, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{i + 1}. {v.rule_title}</span>
                    <span className="font-mono text-[11px] text-rose-700 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800/60 shrink-0">
                      {v.violated_statute}
                    </span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed">
                    <strong className="text-slate-900 dark:text-slate-100">Finding:</strong> {v.observed_finding}
                  </div>
                  <div className="text-rose-700 dark:text-rose-300 mt-1 leading-relaxed bg-white dark:bg-slate-900 p-2 rounded-lg border border-rose-100 dark:border-rose-900/50">
                    <strong>Statutory Ramification:</strong> {v.legal_ramifications}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formal Prayer */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider mb-2">
              Formal Prayer / Statutory Relief Demanded
            </h4>
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3.5">
              <ul className="space-y-2 list-none text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {complaint.formal_prayer.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-brand-700 dark:text-brand-400 shrink-0">({String.fromCharCode(97 + i)})</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Digital Forensic Verification Seal */}
          <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-emerald-950 dark:text-emerald-200">Cryptographic Integrity Stamp:</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-800 dark:text-emerald-300">
              {complaint.evidence_summary.digital_sha256_hash.substring(0, 20)}...
            </span>
          </div>

        </div>

        {/* Drawer Action Bar */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-safe">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-xs active:scale-95 cursor-pointer tap-transparent"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> : <Copy className="w-4 h-4 shrink-0" />}
            <span>{copied ? "Copied Official Petition!" : t('copyPetition')}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleOpenPortal('https://foscos.fssai.gov.in/consumergrievance', 'FoSCoS Grievance Portal')}
              className="flex items-center justify-center gap-1 px-3 py-2.5 text-[11px] sm:text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm active:scale-95 cursor-pointer tap-transparent"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">FoSCoS Portal</span>
            </button>

            <button
              onClick={handleEmailDispatch}
              className="flex items-center justify-center gap-1 px-3 py-2.5 text-[11px] sm:text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/25 transition active:scale-95 cursor-pointer tap-transparent"
            >
              <Send className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Send Email</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
