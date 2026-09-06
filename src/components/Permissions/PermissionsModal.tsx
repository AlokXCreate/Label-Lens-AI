import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Camera,
  Mic,
  MapPin,
  FolderOpen,
  PhoneCall,
  Mail,
  Download,
  X,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { AppPermissionStatus } from '../../types/user';
import {
  checkAllPermissions,
  requestCameraAccess,
  requestMicrophoneAccess,
  requestGeolocationAccess
} from '../../services/permissionsService';
import { sendAppNotification } from '../../services/notificationService';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({ isOpen, onClose }) => {
  const [permissions, setPermissions] = useState<AppPermissionStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      handleRefresh();
    }
  }, [isOpen]);

  const handleRefresh = async () => {
    setIsChecking(true);
    try {
      const perms = await checkAllPermissions();
      setPermissions(perms);
    } finally {
      setIsChecking(false);
    }
  };

  if (!isOpen) return null;

  const handleRequest = async (type: string) => {
    setActionFeedback(null);
    if (type === 'camera') {
      const res = await requestCameraAccess();
      if (res) {
        sendAppNotification('PERMISSION_GRANTED', true, {
          title: 'Camera Access Authorized',
          message: 'Packaging lens enabled for live barcode and PDP scanning.'
        });
      }
      setActionFeedback(res ? "✓ Camera access granted successfully!" : "Camera access was denied or cancelled.");
    } else if (type === 'microphone') {
      const res = await requestMicrophoneAccess();
      if (res) {
        sendAppNotification('PERMISSION_GRANTED', true, {
          title: 'Microphone Authorized',
          message: 'Voice transcription and regulatory call audio recording enabled.'
        });
      }
      setActionFeedback(res ? "✓ Microphone access granted successfully!" : "Microphone access was denied or cancelled.");
    } else if (type === 'geolocation') {
      const res = await requestGeolocationAccess();
      if (res) {
        sendAppNotification('PERMISSION_GRANTED', true, {
          title: 'Geo-Coordinates Acquired',
          message: 'Incident GPS coordinates and district office routing activated.'
        });
      }
      setActionFeedback(res ? "✓ GPS Location acquired successfully!" : "Location permission was denied or timed out.");
    }
    handleRefresh();
  };

  const getPermissionIcon = (type: string) => {
    switch (type) {
      case 'camera': return <Camera className="w-5 h-5 text-indigo-600" />;
      case 'microphone': return <Mic className="w-5 h-5 text-rose-600" />;
      case 'geolocation': return <MapPin className="w-5 h-5 text-blue-600" />;
      case 'files': return <FolderOpen className="w-5 h-5 text-amber-600" />;
      case 'calling': return <PhoneCall className="w-5 h-5 text-emerald-600" />;
      case 'email': return <Mail className="w-5 h-5 text-purple-600" />;
      case 'download': return <Download className="w-5 h-5 text-teal-600" />;
      default: return <ShieldCheck className="w-5 h-5 text-brand-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold shadow-md shadow-brand-900/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  System Permissions & Device Access Hub
                </h3>
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                  Active Security
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Statutory Camera, File, Call, Location, and Storage Access Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Refresh Permissions Status"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900 block mb-1">
              Statutory Transparency & Hardware Integration:
            </strong>
            Label Lens AI uses native device hardware intents to capture packaging labels, geotag legal violations, and record helpline docket numbers under the Legal Metrology Act, 2009. No private background recording is ever performed without user initiation.
          </div>

          <div className="space-y-2.5">
            {permissions.map((p) => {
              const isGranted = p.state === 'granted' || p.state === 'supported';
              const isDenied = p.state === 'denied';

              return (
                <div
                  key={p.type}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      {getPermissionIcon(p.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {p.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          isGranted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isDenied
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.state}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        {p.description}
                      </p>
                      <p className="text-[11px] text-brand-700 font-medium mt-1">
                        ⚖️ {p.statutoryReason}
                      </p>
                    </div>
                  </div>

                  {/* Request Trigger if prompt or denied */}
                  {['camera', 'microphone', 'geolocation'].includes(p.type) && (
                    <div className="shrink-0 sm:self-center">
                      <button
                        onClick={() => handleRequest(p.type)}
                        className="w-full sm:w-auto px-3 py-1.5 rounded-lg font-bold text-xs bg-slate-900 hover:bg-black text-white transition active:scale-95 shadow-xs"
                      >
                        {p.state === 'granted' ? 'Re-Verify' : 'Grant Access'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Supported by W3C Media Capture & HTML5 Geolocation API</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 transition text-xs shadow-xs"
          >
            Close Hub
          </button>
        </div>

      </div>
    </div>
  );
};
