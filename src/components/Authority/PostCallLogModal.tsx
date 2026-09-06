import React, { useState } from 'react';
import { ShieldCheck, FileCheck, Mic, Calendar, User, Hash, X, Save, AlertCircle } from 'lucide-react';
import { CallLogEntry } from '../../types/user';
import { STATE_AUTHORITY_DIRECTORY, saveCallLogInStorage } from '../../services/callingService';
import { uploadCallRecordingToFirebaseStorage } from '../../services/firebaseStorageService';

interface PostCallLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditId?: string;
  userUid?: string;
  defaultPhoneNumber?: string;
  defaultAuthority?: string;
  audioBlob?: Blob | null;
  audioUrl?: string | null;
  durationSeconds?: number;
  onLogSaved?: (newLog: CallLogEntry) => void;
}

export const PostCallLogModal: React.FC<PostCallLogModalProps> = ({
  isOpen,
  onClose,
  auditId,
  userUid = 'usr_guest_google_01',
  defaultPhoneNumber = '1800-11-2100',
  defaultAuthority = 'National',
  audioBlob,
  audioUrl,
  durationSeconds = 0,
  onLogSaved
}) => {
  const [authorityKey, setAuthorityKey] = useState<string>(defaultAuthority);
  const [officerName, setOfficerName] = useState<string>('');
  const [officerDesignation, setOfficerDesignation] = useState<string>('Inspector of Legal Metrology');
  const [docketNumber, setDocketNumber] = useState<string>('');
  const [outcomeStatus, setOutcomeStatus] = useState<CallLogEntry['outcomeStatus']>('docket_issued');
  const [notes, setNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentAuth = STATE_AUTHORITY_DIRECTORY[authorityKey] || STATE_AUTHORITY_DIRECTORY['National'];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const callId = `call_${Date.now()}`;
    let firebaseStorageUri: string | undefined = undefined;

    if (audioBlob && auditId) {
      try {
        const uploadRes = await uploadCallRecordingToFirebaseStorage(
          userUid,
          auditId,
          audioBlob,
          callId
        );
        firebaseStorageUri = uploadRes.storagePath;
      } catch (err) {
        console.warn('Firebase storage upload fallback:', err);
      }
    }

    const newLog: CallLogEntry = {
      id: callId,
      auditId: auditId || 'general_helpline',
      timestamp: new Date().toISOString(),
      authorityName: currentAuth.state,
      department: currentAuth.department,
      phoneNumber: defaultPhoneNumber || currentAuth.tollFree,
      state: currentAuth.state,
      officerName: officerName.trim() || undefined,
      officerDesignation: officerDesignation.trim() || undefined,
      docketNumber: docketNumber.trim() || undefined,
      callDurationSeconds: durationSeconds,
      outcomeStatus,
      notes: notes.trim() || 'Official communication logged via Label Lens AI Helpline subsystem.',
      audioRecordingBlobUrl: audioUrl || undefined,
      audioRecordingBlob: audioBlob || undefined,
      firebaseStorageUri
    };

    saveCallLogInStorage(newLog);
    if (onLogSaved) onLogSaved(newLog);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Post-Call Official Verification Log
              </h3>
              <p className="text-xs text-slate-500">
                Create an immutable legal record of your communication with authorities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5 text-xs">
          
          {/* Authority Selection */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Contacted Authority / Department
            </label>
            <select
              value={authorityKey}
              onChange={(e) => setAuthorityKey(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {Object.entries(STATE_AUTHORITY_DIRECTORY).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.department} ({val.state}) - {val.tollFree}
                </option>
              ))}
            </select>
          </div>

          {/* Officer Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Officer / Desk Representative</span>
              </label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                placeholder="e.g. Shri V. K. Patil"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Designation</span>
              </label>
              <input
                type="text"
                value={officerDesignation}
                onChange={(e) => setOfficerDesignation(e.target.value)}
                placeholder="e.g. Legal Metrology Officer"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          {/* Docket / Complaint Reference & Outcome */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span>Statutory Docket / Token ID</span>
              </label>
              <input
                type="text"
                value={docketNumber}
                onChange={(e) => setDocketNumber(e.target.value)}
                placeholder="e.g. LM-MAH-2026-8831"
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-brand-500 outline-none uppercase"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Call Outcome Status</span>
              </label>
              <select
                value={outcomeStatus}
                onChange={(e) => setOutcomeStatus(e.target.value as CallLogEntry['outcomeStatus'])}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="docket_issued">Official Docket ID Issued</option>
                <option value="inspection_scheduled">On-Site Inspection Scheduled</option>
                <option value="advisory_issued">Advisory / Rectification Notice Given</option>
                <option value="transferred">Transferred to District Officer</option>
                <option value="in_progress">Investigation In Progress</option>
                <option value="unanswered">Line Busy / Unanswered</option>
              </select>
            </div>
          </div>

          {/* Audio Evidence Attachment Preview */}
          {audioUrl && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800">
                <span className="flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  Recorded Audio Evidence ({durationSeconds}s duration)
                </span>
                <span className="text-[10px] text-emerald-600 uppercase bg-emerald-100 px-2 py-0.5 rounded-md font-mono">
                  Linked to Google UID
                </span>
              </div>
              <audio src={audioUrl} controls className="w-full h-8" />
            </div>
          )}

          {/* Conversation Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Officer Directives & Incident Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Summary of discussion: officer instructed to preserve original product packaging, send batch number photos, and note verification token..."
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
            />
          </div>

          {/* Legal Notice */}
          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-[11px] text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              This log will be appended to your formal Legal Metrology Dossier and backed up under your Google UID in Firebase Cloud Storage.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 shadow-md shadow-indigo-500/20 active:scale-95 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Persisting Evidence...' : 'Save & Link to Audit'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
