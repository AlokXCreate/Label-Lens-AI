import React, { useState } from 'react';
import { PhoneCall, Calendar, Clock, User, Hash, Mic, Trash2, X, AlertCircle, Building2, CheckCircle2 } from 'lucide-react';
import { CallLogEntry } from '../../types/user';
import { getStoredCallLogs, deleteCallLogFromStorage } from '../../services/callingService';

interface CallHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  auditId?: string;
  onSelectLog?: (log: CallLogEntry) => void;
}

export const CallHistoryDrawer: React.FC<CallHistoryDrawerProps> = ({
  isOpen,
  onClose,
  auditId,
  onSelectLog
}) => {
  const [logs, setLogs] = useState<CallLogEntry[]>(() => getStoredCallLogs(auditId));

  if (!isOpen) return null;

  const refreshLogs = () => {
    setLogs(getStoredCallLogs(auditId));
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this official call log?")) {
      deleteCallLogFromStorage(id);
      refreshLogs();
    }
  };

  const getStatusBadge = (status: CallLogEntry['outcomeStatus']) => {
    switch (status) {
      case 'docket_issued':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Docket Issued</span>;
      case 'inspection_scheduled':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Inspection Scheduled</span>;
      case 'advisory_issued':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Advisory Issued</span>;
      case 'transferred':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Transferred</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">In Progress</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Helpline & Authority Call Logs
              </h3>
              <p className="text-xs text-slate-500">
                {logs.length} Recorded interactions & legal tokens
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logs Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {logs.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-700 text-sm mb-1">No Helpline Calls Logged Yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Use the One-Click Authority Calling button to dial FSSAI or Legal Metrology desks, record instructions, and log docket numbers here.
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                onClick={() => onSelectLog && onSelectLog(log)}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-brand-400 shadow-xs hover:shadow-md transition cursor-pointer space-y-2.5 text-xs group"
              >
                {/* Authority & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-brand-600" />
                      <span>{log.department}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">{log.authorityName} • {log.phoneNumber}</div>
                  </div>
                  {getStatusBadge(log.outcomeStatus)}
                </div>

                {/* Docket Number Highlight */}
                {log.docketNumber && (
                  <div className="p-2 bg-indigo-50/70 rounded-lg border border-indigo-100 flex items-center justify-between text-indigo-950 font-mono text-[11px]">
                    <span className="flex items-center gap-1 font-bold">
                      <Hash className="w-3.5 h-3.5 text-indigo-600" />
                      Docket ID:
                    </span>
                    <span className="font-bold text-indigo-700">{log.docketNumber}</span>
                  </div>
                )}

                {/* Officer & Time metadata */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                  {log.officerName && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{log.officerName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{log.callDurationSeconds || 0}s duration</span>
                  </div>
                  <div className="flex items-center gap-1 col-span-2 text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(log.timestamp).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Audio Player if present */}
                {log.audioRecordingBlobUrl && (
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <Mic className="w-3 h-3 text-emerald-600" />
                      Recorded Audio Evidence
                    </div>
                    <audio src={log.audioRecordingBlobUrl} controls className="w-full h-7" />
                  </div>
                )}

                {/* Notes */}
                {log.notes && (
                  <p className="text-slate-600 bg-slate-50 p-2 rounded-lg text-[11px] leading-relaxed line-clamp-3">
                    "{log.notes}"
                  </p>
                )}

                {/* Footer action */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Firebase UID Attached
                  </span>
                  <button
                    onClick={(e) => handleDelete(log.id, e)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                    title="Delete log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
