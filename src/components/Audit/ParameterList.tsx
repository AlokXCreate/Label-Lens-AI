import React, { useState } from 'react';
import { ParameterFinding } from '../../types/audit';
import { CheckCircle2, AlertTriangle, XCircle, FileWarning, HelpCircle, Search, Copy, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ParameterListProps {
  findings: ParameterFinding[];
  onOpenComplaintDrawer: () => void;
}

export const ParameterList: React.FC<ParameterListProps> = ({ findings, onOpenComplaintDrawer }) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'ALL' | 'NON_COMPLIANT' | 'COMPLIANT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const filteredFindings = findings.filter(f => {
    if (filter === 'NON_COMPLIANT' && f.status === 'Compliant') return false;
    if (filter === 'COMPLIANT' && f.status !== 'Compliant') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.parameter_name.toLowerCase().includes(q) ||
        f.observed_value.toLowerCase().includes(q) ||
        f.regulatory_clause.toLowerCase().includes(q) ||
        f.why_correct_or_wrong.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const violationCount = findings.filter(f => f.status === 'Non-Compliant').length;
  const compliantCount = findings.filter(f => f.status === 'Compliant').length;

  const handleCopyFinding = (item: ParameterFinding, idx: number) => {
    const text = `Parameter: ${item.parameter_name}\nStatus: ${item.status}\nObserved Value: ${item.observed_value}\nStatutory Clause: ${item.regulatory_clause}\nRationale: ${item.why_correct_or_wrong}`;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md overflow-hidden transition-colors">
      
      {/* Header & Filter Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg flex items-center gap-2">
            <span>{t('fivePointEvaluation')}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold border border-slate-200/60 dark:border-slate-700">
              {findings.length} Items Checked
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Strictly mapped to Legal Metrology PCR 2011/2026 & FSSAI 2020 Regulations
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          {/* Quick Search & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-40">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search findings..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-brand-500 outline-none transition"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700 flex-1 sm:flex-initial">
                <button
                  onClick={() => setFilter('ALL')}
                  className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-lg transition tap-transparent ${filter === 'ALL' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  All ({findings.length})
                </button>
                <button
                  onClick={() => setFilter('NON_COMPLIANT')}
                  className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-lg transition tap-transparent ${filter === 'NON_COMPLIANT' ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs' : 'hover:text-rose-600 dark:hover:text-rose-400'}`}
                >
                  Violations ({violationCount})
                </button>
                <button
                  onClick={() => setFilter('COMPLIANT')}
                  className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-lg transition tap-transparent ${filter === 'COMPLIANT' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                >
                  Compliant ({compliantCount})
                </button>
              </div>

              {violationCount > 0 && (
                <button
                  onClick={onOpenComplaintDrawer}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 transition active:scale-95 cursor-pointer tap-transparent shrink-0"
                  title="File official statutory complaint"
                >
                  <FileWarning className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">File Complaint</span>
                  <span>({violationCount})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Parameter Cards List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {filteredFindings.map((item, idx) => {
          const isCompliant = item.status === 'Compliant';
          const isWarning = item.status === 'Warning';

          return (
            <div
              key={idx}
              className={`p-3.5 sm:p-5 transition hover:bg-slate-50/75 dark:hover:bg-slate-800/40 ${
                !isCompliant && !isWarning ? 'bg-rose-50/20 dark:bg-rose-950/20' : ''
              }`}
            >
              {/* Point 1: Parameter Name & Status */}
              <div className="flex items-start justify-between gap-2.5 mb-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500 shrink-0">
                    #{idx + 1}
                  </span>
                  <h4 className="font-bold text-xs sm:text-base text-slate-900 dark:text-slate-100 truncate">
                    {item.parameter_name}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopyFinding(item, idx)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition tap-transparent"
                    title="Copy Finding & Rationale"
                  >
                    {copiedIdx === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Point 4: Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-extrabold tracking-wide border shrink-0 ${
                      isCompliant
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : isWarning
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    {isCompliant ? (
                      <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-600 dark:text-rose-400" />
                    )}
                    {item.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Point 2 & Point 3: Observed Value and Regulatory Clause */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 my-2.5 text-xs">
                <div className="md:col-span-6 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/80">
                  <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-0.5">
                    2. {t('observedValue')}:
                  </span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200 break-words">
                    {item.observed_value}
                  </span>
                </div>

                <div className="md:col-span-6 bg-indigo-50/50 dark:bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900/60">
                  <span className="font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block mb-0.5">
                    3. {t('regulatoryClause')}:
                  </span>
                  <span className="font-semibold text-indigo-950 dark:text-indigo-200">
                    {item.regulatory_clause}
                  </span>
                </div>
              </div>

              {/* Point 5: Why It Is Correct / Wrong */}
              <div className="mt-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-l-4 border-slate-300 dark:border-slate-600 text-xs sm:text-sm leading-relaxed"
                style={{
                  borderLeftColor: isCompliant ? '#10B981' : (isWarning ? '#F59E0B' : '#EF4444')
                }}
              >
                <div className="font-bold text-slate-700 dark:text-slate-200 mb-0.5 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400" />
                  <span>5. {isCompliant ? t('correctExplanation') : t('violationExplanation')}:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                  {item.why_correct_or_wrong}
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
