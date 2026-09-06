import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, School, X, Save, Check, LogOut, KeyRound, Languages } from 'lucide-react';
import { UserProfile } from '../../types/user';
import { syncUserProfileToBackend, logoutUser } from '../../services/firebaseService';
import { useLanguage } from '../../context/LanguageContext';

interface ProfileModalProps {
  isOpen: boolean;
  userProfile: UserProfile;
  onClose: () => void;
  onSaveProfile: (profile: UserProfile) => void;
  onOpenAuthModal?: () => void;
  onSignOut?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  userProfile,
  onClose,
  onSaveProfile,
  onOpenAuthModal,
  onSignOut
}) => {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await syncUserProfileToBackend(formData);
    onSaveProfile(formData);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handleSignOut = async () => {
    await logoutUser();
    onClose();
    if (onSignOut) {
      onSignOut();
    } else if (onOpenAuthModal) {
      onOpenAuthModal();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-emerald-500 text-white flex items-center justify-center font-black text-base shadow-md shadow-brand-500/20">
              {formData.displayName ? formData.displayName.charAt(0) : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">
                  User Profile & Legal Identity
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                  formData.role === 'admin'
                    ? 'bg-purple-100 text-purple-800 border-purple-200'
                    : formData.role === 'inspector'
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {formData.role === 'admin' ? 'Directorate Admin' : formData.role === 'inspector' ? 'LMPC Inspector' : 'Verified Citizen'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Official Complainant Identity backed by Google Cloud & Firebase
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

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* Full Name */}
          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
              {t('fullName')}
            </label>
            <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-brand-500">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                required
                className="w-full outline-none text-slate-800 font-medium"
              />
            </div>
          </div>

          {/* Email (Google Authenticated) & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                {t('emailAddress')} (Gmail)
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="w-full outline-none text-slate-700 bg-transparent text-[11px] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Contact Phone Number
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-brand-500">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98200 12345"
                  className="w-full outline-none text-slate-800 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Inspection Role Selector */}
          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Statutory Role / Authority
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'consumer' as const, label: 'Citizen / Buyer' },
                { id: 'inspector' as const, label: 'LMPC Inspector' },
                { id: 'admin' as const, label: 'Directorate Admin' }
              ].map(r => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setFormData({ ...formData, role: r.id })}
                  className={`p-2 rounded-xl border font-bold text-center transition text-[11px] ${
                    formData.role === r.id
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* College / Institution Name */}
          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
              College / Institution / Department
            </label>
            <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-brand-500">
              <School className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={formData.institutionName || ''}
                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                placeholder="e.g. Symbiosis Institute / Legal Metrology Directorate"
                className="w-full outline-none text-slate-800"
              />
            </div>
          </div>
          {/* Preferred Indian Regional Language */}
          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Preferred Regional Language / पसंदीदा भाषा
            </label>
            <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-brand-500">
              <Languages className="w-4 h-4 text-brand-600 shrink-0" />
              <select
                value={formData.preferredLanguage || currentLanguage}
                onChange={(e) => {
                  const lang = e.target.value as any;
                  setFormData((prev) => ({ ...prev, preferredLanguage: lang }));
                  setLanguage(lang);
                }}
                className="w-full text-xs font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.nativeName} ({l.name}) — {l.region}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Address & Current Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Permanent / Official Address
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-brand-500">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Address for court summons"
                  className="w-full outline-none text-slate-800 text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Audit City & State
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-brand-500">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <input
                  type="text"
                  value={formData.currentLocation || ''}
                  onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                  placeholder="e.g. Pune, Maharashtra"
                  className="w-full outline-none text-slate-800 text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons: Save & Sign In with Another Account */}
          <div className="pt-3 space-y-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition active:scale-95"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Profile Synchronized to Firebase!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{t('saveProfile')}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              {onOpenAuthModal && (
                <button
                  type="button"
                  onClick={() => { onClose(); onOpenAuthModal(); }}
                  className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1.5 transition"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Switch / Sign In with Another Google ID</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition ml-auto"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('signOut')}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
