import React, { useState } from 'react';
import {
  Download,
  FileText,
  Globe,
  Code,
  FileCode,
  Mail,
  Cloud,
  ExternalLink,
  CheckCircle2,
  Loader2,
  Sparkles
} from 'lucide-react';
import { ProductAuditReport } from '../../types/audit';
import { LegalComplaint } from '../../types/complaint';
import {
  exportToPDF,
  exportToHTML,
  exportToJSON,
  exportToDOCX,
  exportToTXT
} from '../../services/exportService';
import { exportAuditToGoogleDrive } from '../../services/googleDriveService';
import { sendAppNotification } from '../../services/notificationService';
import { useLanguage } from '../../context/LanguageContext';

interface ExportBarProps {
  report: ProductAuditReport;
  complaint?: LegalComplaint;
  googleAccessToken?: string | null;
}

export const ExportBar: React.FC<ExportBarProps> = ({
  report,
  complaint,
  googleAccessToken = null
}) => {
  const { t } = useLanguage();
  const [isExportingDrive, setIsExportingDrive] = useState<boolean>(false);
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);
  const [driveResultUrl, setDriveResultUrl] = useState<string | null>(null);

  const handleExport = async (format: 'pdf' | 'html' | 'json' | 'docx' | 'txt') => {
    if (format === 'pdf') {
      exportToPDF(report, complaint);
    } else if (format === 'html') {
      exportToHTML(report, complaint);
    } else if (format === 'json') {
      exportToJSON(report, complaint);
    } else if (format === 'docx') {
      setIsExportingDocx(true);
      try {
        await exportToDOCX(report, complaint);
      } finally {
        setIsExportingDocx(false);
      }
    } else if (format === 'txt') {
      exportToTXT(report, complaint);
    }
  };

  const handleGoogleDriveExport = async () => {
    setIsExportingDrive(true);
    try {
      const pdfBlob = new Blob(
        [
          `Label Lens AI Audit Dossier\nProduct: ${report.product_name}\nScore: ${report.compliance_score}/100\nStatus: ${report.overall_status}\nTimestamp: ${report.timestamp}`
        ],
        { type: 'application/pdf' }
      );
      const htmlBlob = new Blob(
        [
          `<html><body><h1>Label Lens AI Report</h1><p>${report.product_name}</p></body></html>`
        ],
        { type: 'text/html' }
      );

      const res = await exportAuditToGoogleDrive(
        googleAccessToken,
        report.id,
        report.product_name,
        pdfBlob,
        htmlBlob
      );

      const firstFileLink = res.files[0]?.webViewLink || res.folderWebViewLink || null;
      setDriveResultUrl(firstFileLink);
      sendAppNotification('DRIVE_SYNCED', true, {
        title: 'Exported to Google Drive',
        message: `Dossier for "${report.product_name}" synced to your Drive folder.`,
        actionLabel: 'Open in Drive',
        onAction: () => {
          if (firstFileLink) window.open(firstFileLink, '_blank');
        },
        meta: {
          linkUrl: firstFileLink || undefined,
          fileName: `${report.product_name}_Dossier.pdf`
        }
      });
    } catch (err) {
      console.error('Google Drive export error:', err);
      alert('Failed to export to Google Drive. Please ensure Google Drive permissions are granted.');
    } finally {
      setIsExportingDrive(false);
    }
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Regulatory Audit Report: ${report.product_name} (${report.compliance_score}/100)`);
    const body = encodeURIComponent(
      `Hello,\n\nPlease review the regulatory compliance audit conducted via Label Lens AI:\n\nProduct: ${report.product_name}\nBrand: ${report.brand_name}\nCompliance Score: ${report.compliance_score}/100\nStatus: ${report.overall_status}\n\nSummary:\n${report.summary}\n\nTo view the full 5-point statutory parameter findings, please open the attached report.`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5 space-y-4 transition-colors">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 flex items-center justify-center font-bold border border-brand-200/50 dark:border-brand-800/60">
              <Download className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 tracking-tight">
              {t('exportDossier')}
            </h3>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 rounded-full">
              <Sparkles className="w-3 h-3 text-brand-500" />
              5 Multi-Formats
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Download comprehensive audit reports in PDF, DOCX, interactive HTML with logo, JSON, or plain text
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* One-Click Google Drive Export */}
          <button
            onClick={handleGoogleDriveExport}
            disabled={isExportingDrive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs transition active:scale-95 disabled:opacity-50 shadow-xs"
            title="Export Dossier directly to Google Drive"
          >
            {isExportingDrive ? (
              <Loader2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-spin" />
            ) : (
              <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            )}
            <span>{isExportingDrive ? 'Syncing...' : t('exportToDrive')}</span>
          </button>

          {/* Share via Email */}
          <button
            onClick={handleShareEmail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition active:scale-95 shadow-xs border border-slate-200/60 dark:border-slate-700"
            title="Share Audit via Email"
          >
            <Mail className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>{t('shareEmail')}</span>
          </button>
        </div>
      </div>

      {/* Google Drive Export Success Notification */}
      {driveResultUrl && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Dossier successfully saved to your Google Drive "Label Lens AI" folder!</span>
          </div>
          <a
            href={driveResultUrl}
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 text-[11px] shrink-0"
          >
            <span>Open in Drive</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* 5-Format Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        
        {/* PDF Export */}
        <button
          onClick={() => handleExport('pdf')}
          className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/75 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-700 text-slate-700 dark:text-slate-200 transition active:scale-95 group shadow-xs"
          title="Download Print-Ready PDF with executive styling"
        >
          <FileText className="w-5 h-5 text-rose-600 group-hover:scale-110 transition" />
          <span className="text-xs font-bold mt-1.5 text-slate-900 dark:text-slate-100 group-hover:text-rose-700 dark:group-hover:text-rose-400">{t('downloadPdf')}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-400">Print-Ready (.pdf)</span>
        </button>

        {/* Word Document (.docx) */}
        <button
          onClick={() => handleExport('docx')}
          disabled={isExportingDocx}
          className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/75 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:border-sky-300 dark:hover:border-sky-700 hover:text-sky-800 text-slate-700 dark:text-slate-200 transition active:scale-95 group shadow-xs disabled:opacity-50"
          title="Download Editable Word Document (.docx)"
        >
          {isExportingDocx ? (
            <Loader2 className="w-5 h-5 text-sky-600 animate-spin" />
          ) : (
            <FileCode className="w-5 h-5 text-sky-600 group-hover:scale-110 transition" />
          )}
          <span className="text-xs font-bold mt-1.5 text-slate-900 dark:text-slate-100 group-hover:text-sky-800 dark:group-hover:text-sky-300">{t('downloadWord')}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-400">Editable Brief</span>
        </button>

        {/* Branded Interactive HTML with Logo */}
        <button
          onClick={() => handleExport('html')}
          className="flex flex-col items-center justify-center p-3 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/60 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900/50 hover:text-brand-900 text-brand-700 dark:text-brand-300 transition active:scale-95 group shadow-xs"
          title="Download Branded Application with Logo & App Name (.html)"
        >
          <Globe className="w-5 h-5 text-brand-600 group-hover:scale-110 transition" />
          <span className="text-xs font-bold mt-1.5 text-brand-900 dark:text-brand-200 font-extrabold">{t('downloadHtml')}</span>
          <span className="text-[10px] text-brand-600 dark:text-brand-400 font-bold">App with Logo</span>
        </button>

        {/* Structured JSON */}
        <button
          onClick={() => handleExport('json')}
          className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/75 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-800 text-slate-700 dark:text-slate-200 transition active:scale-95 group shadow-xs"
          title="Download Structured JSON for APIs and Databases"
        >
          <Code className="w-5 h-5 text-amber-600 group-hover:scale-110 transition" />
          <span className="text-xs font-bold mt-1.5 text-slate-900 dark:text-slate-100 group-hover:text-amber-800 dark:group-hover:text-amber-300">{t('downloadJson')}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-400">Schema Verified</span>
        </button>

        {/* Plain Text (.txt) */}
        <button
          onClick={() => handleExport('txt')}
          className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/75 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition active:scale-95 group shadow-xs"
          title="Download Plain Text for National Consumer Helpline"
        >
          <FileText className="w-5 h-5 text-slate-600 group-hover:scale-110 transition" />
          <span className="text-xs font-bold mt-1.5 text-slate-900 dark:text-slate-100">{t('downloadTxt')}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-400">Portal / SMS</span>
        </button>

      </div>
    </div>
  );
};
