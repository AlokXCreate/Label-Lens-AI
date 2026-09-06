import React, { useState } from 'react';
import { PhoneCall, PhoneForwarded, Mic, MicOff, Shield, X, Building2, FileText, History } from 'lucide-react';
import { STATE_AUTHORITY_DIRECTORY, callAuthorityDirectly, callRecorder } from '../../services/callingService';
import { PostCallLogModal } from './PostCallLogModal';
import { CallHistoryDrawer } from './CallHistoryDrawer';
import { CallLogEntry } from '../../types/user';
import { sendAppNotification } from '../../services/notificationService';

interface QuickCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  userState?: string;
  auditId?: string;
  userUid?: string;
}

export const QuickCallModal: React.FC<QuickCallModalProps> = ({
  isOpen,
  onClose,
  userState = "Maharashtra",
  auditId,
  userUid
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>(userState);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  
  const [isPostCallModalOpen, setIsPostCallModalOpen] = useState<boolean>(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentAuthority = STATE_AUTHORITY_DIRECTORY[selectedRegion] || STATE_AUTHORITY_DIRECTORY["National"];

  const handlePlaceCall = () => {
    callAuthorityDirectly(currentAuthority.tollFree);
    // After triggering dialer, invite user to log the communication
    setTimeout(() => {
      setIsPostCallModalOpen(true);
    }, 1500);
  };

  const handleToggleCallRecording = async () => {
    if (isRecording) {
      const result = await callRecorder.stopRecording();
      setIsRecording(false);
      if (result) {
        setRecordedBlob(result.blob);
        setRecordingDuration(result.durationSeconds);
        const url = URL.createObjectURL(result.blob);
        setRecordedAudioUrl(url);
        // Prompt user to log details
        setIsPostCallModalOpen(true);
      }
    } else {
      const started = await callRecorder.startRecording();
      if (started) {
        setIsRecording(true);
        setRecordedBlob(null);
        setRecordedAudioUrl(null);
      } else {
        alert("Microphone permission denied. Please allow microphone access to record calls.");
      }
    }
  };

  const handleLogSaved = (newLog: CallLogEntry) => {
    sendAppNotification('CALL_LOGGED', true, {
      title: 'Regulatory Call Logged & Recorded',
      message: `Interaction with ${newLog.authorityName} (${newLog.phoneNumber}) saved.`,
      meta: {
        targetDesk: newLog.authorityName,
        docketId: newLog.docketNumber || undefined
      }
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
        <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <PhoneCall className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  One-Click Authority Calling & State Routing
                </h3>
                <p className="text-xs text-slate-500">
                  Official National & State Food Safety / Legal Metrology Directories
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsHistoryDrawerOpen(true)}
                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                title="View Call History"
              >
                <History className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Region / Jurisdiction Selector */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Jurisdiction / State:
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="National">National - Central FSSAI (All India)</option>
              <option value="Maharashtra">Maharashtra - Food and Drug Administration (FDA)</option>
              <option value="Maharashtra-LM">Maharashtra - Legal Metrology Dept (Vaidhanik Mapan)</option>
              <option value="Delhi">Delhi - Department of Food Safety</option>
              <option value="Karnataka">Karnataka - Food Safety & Standards Authority</option>
              <option value="Tamil Nadu">Tamil Nadu - Food Safety & Drug Admin</option>
              <option value="Gujarat">Gujarat - FDCA</option>
              <option value="Uttar Pradesh">Uttar Pradesh - FSDA</option>
              <option value="West Bengal">West Bengal - Food Safety Wing</option>
              <option value="Telangana">Telangana - IPM & Food Administration</option>
            </select>
          </div>

          {/* Authority Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
            <div className="flex items-start gap-2">
              <Building2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900 text-sm">{currentAuthority.department}</div>
                <div className="text-slate-500 text-[11px]">{currentAuthority.state}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Toll-Free Helpline:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">{currentAuthority.tollFree}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Direct Office:</span>
                <span className="font-mono text-slate-700 font-medium">{currentAuthority.directPhone}</span>
              </div>
            </div>
          </div>

          {/* Call Recording Module */}
          <div className="mt-4 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-indigo-950 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span>In-App Call Recording Subsystem</span>
              </div>
              <p className="text-[11px] text-indigo-700">
                {isRecording ? "🔴 Actively recording audio interaction..." : "Record conversation to attach to legal case profile"}
              </p>
            </div>

            <button
              onClick={handleToggleCallRecording}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95 ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse shadow-md'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isRecording ? "Stop Recording" : "Record Call"}</span>
            </button>
          </div>

          {/* Audio Playback & Manual Log Button */}
          {recordedAudioUrl && (
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Recorded Audio Evidence ({recordingDuration}s):</span>
                <button
                  onClick={() => setIsPostCallModalOpen(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  <span>Log Details</span>
                </button>
              </div>
              <audio src={recordedAudioUrl} controls className="w-full h-8" />
            </div>
          )}

          {/* Action Button: One-Click Direct Phone Call */}
          <div className="mt-5 space-y-2">
            <button
              onClick={handlePlaceCall}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <PhoneForwarded className="w-4 h-4" />
              <span>Call {currentAuthority.tollFree} Directly (1-Click)</span>
            </button>

            <button
              onClick={() => setIsPostCallModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Manual Post-Call Log Entry (Docket ID & Officer Notes)</span>
            </button>
          </div>

        </div>
      </div>

      {/* Post-Call Log Entry Modal */}
      <PostCallLogModal
        isOpen={isPostCallModalOpen}
        onClose={() => setIsPostCallModalOpen(false)}
        auditId={auditId}
        userUid={userUid}
        defaultAuthority={selectedRegion}
        defaultPhoneNumber={currentAuthority.tollFree}
        audioBlob={recordedBlob}
        audioUrl={recordedAudioUrl}
        durationSeconds={recordingDuration}
        onLogSaved={handleLogSaved}
      />

      {/* Historical Call Logs Drawer */}
      <CallHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        auditId={auditId}
      />
    </>
  );
};

