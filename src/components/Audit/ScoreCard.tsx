import React from 'react';
import { AlertTriangle, XCircle, CheckCircle2, Scale, Layers } from 'lucide-react';
import { ProductAuditReport } from '../../types/audit';
import { getRequiredFontHeightMm } from '../../services/rulesEngine';
import { useLanguage } from '../../context/LanguageContext';

interface ScoreCardProps {
  report: ProductAuditReport;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ report }) => {
  const { t } = useLanguage();
  const reqFontHeight = getRequiredFontHeightMm(report.principal_display_panel_area_sq_cm);

  const getStatusLabel = () => {
    if (report.overall_status === 'Compliant') return t('statusCompliant');
    if (report.overall_status === 'Warning') return t('statusCaution');
    return t('statusNonCompliant');
  };

  const getStatusColor = () => {
    if (report.overall_status === 'Compliant') return 'text-emerald-600 bg-emerald-50 border-emerald-300';
    if (report.overall_status === 'Warning') return 'text-amber-600 bg-amber-50 border-amber-300';
    return 'text-rose-600 bg-rose-50 border-rose-300';
  };

  const getStatusIcon = () => {
    if (report.overall_status === 'Compliant') return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    if (report.overall_status === 'Warning') return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    return <XCircle className="w-5 h-5 text-rose-600" />;
  };

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (report.compliance_score / 100) * circumference;

  const scoreRingColor =
    report.compliance_score >= 85
      ? '#10b981'
      : report.compliance_score >= 60
      ? '#f59e0b'
      : '#f43f5e';

  const isViolative = report.compliance_score < 85;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-5 sm:p-6 transition hover:shadow-lg">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-b border-slate-100 pb-5">
        
        {/* Product Identity */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200 uppercase tracking-wider">
              {report.category}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {report.id}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {report.product_name}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Brand / Manufacturer: <span className="text-slate-900 font-bold">{report.brand_name}</span>
          </p>
        </div>

        {/* Circular Radial Gauge & Overall Score Badge */}
        <div className="flex items-center gap-5 self-center sm:self-auto">
          {/* Animated Circular Score Gauge */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
              {/* Background track */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="text-slate-100 stroke-current"
                strokeWidth="7"
                fill="transparent"
              />
              {/* Progress ring */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke={scoreRingColor}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-black text-slate-900 leading-none">
                {report.compliance_score}
              </span>
              <span className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase">Score</span>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end">
            <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 font-black text-xs sm:text-sm tracking-wide shadow-xs ${getStatusColor()}`}>
              {getStatusIcon()}
              <span>{getStatusLabel()}</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-1.5">
              {t('complianceScore')}
            </span>
          </div>
        </div>

      </div>

      {/* Statutory Penalty Estimator Chip under LM Act 2009 */}
      <div className={`mt-4 p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold ${
        isViolative
          ? 'bg-rose-50/80 border-rose-200 text-rose-950'
          : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
      }`}>
        <div className="flex items-center gap-2">
          <Scale className={`w-4 h-4 shrink-0 ${isViolative ? 'text-rose-600' : 'text-emerald-600'}`} />
          <span>
            {isViolative ? (
              <>
                <strong className="text-rose-900 font-extrabold">Section 36 LMPC Liability: </strong>
                ₹25,000 for 1st offense • Up to ₹50,000 or 1-year imprisonment for repeat violation
              </>
            ) : (
              <>
                <strong className="text-emerald-900 font-extrabold">Statutory Verification: </strong>
                All mandatory PCR 2011/2026 declarations observed with zero pecuniary liability
              </>
            )}
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase self-start sm:self-auto ${
          isViolative ? 'bg-rose-200/60 text-rose-800' : 'bg-emerald-200/60 text-emerald-800'
        }`}>
          {isViolative ? 'Statutory Breach' : 'Fully Compliant'}
        </span>
      </div>

      {/* Summary Narrative */}
      <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <strong>{t('executiveSummary')}:</strong> {report.summary}
      </div>

      {/* Key Technical Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-brand-500" /> PDP Area
          </div>
          <div className="text-sm font-bold text-slate-800 mt-0.5 font-mono">
            {report.principal_display_panel_area_sq_cm} cm²
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-brand-500" /> Table-I Min Font
          </div>
          <div className="text-sm font-bold text-slate-800 mt-0.5 font-mono">
            {reqFontHeight} mm
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400">Form Factor</div>
          <div className="text-sm font-bold text-slate-800 mt-0.5 truncate">
            {report.package_type}
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400">Evaluated Norms</div>
          <div className="text-sm font-bold text-emerald-700 mt-0.5">
            LMPC '26 & FSSAI
          </div>
        </div>
      </div>

    </div>
  );
};
