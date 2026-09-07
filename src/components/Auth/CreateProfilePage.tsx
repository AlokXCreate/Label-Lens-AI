import React, { useState } from 'react';
import {
  User,
  Mail,
  MapPin,
  Camera,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
  Sparkles,
  Loader2,
  Globe
} from 'lucide-react';
import { UserProfile, IndianLanguageCode } from '../../types/user';
import { completeUserProfile } from '../../services/firebaseService';
import { useLanguage } from '../../context/LanguageContext';

interface CreateProfilePageProps {
  initialUser: UserProfile;
  onProfileCompleted: (user: UserProfile) => void;
  onSignOut?: () => void;
}

// 6 Curated SVG/Vector Avatars for GovTech & Consumer Protection
const AVATAR_PRESETS = [
  { id: 'avatar_1', label: 'Citizen', emoji: '🧑‍💼', bg: 'from-blue-600 to-indigo-600' },
  { id: 'avatar_2', label: 'Inspector', emoji: '👮', bg: 'from-emerald-600 to-teal-600' },
  { id: 'avatar_3', label: 'Director', emoji: '👨‍⚖️', bg: 'from-purple-600 to-violet-600' },
  { id: 'avatar_4', label: 'Consumer', emoji: '👩‍💼', bg: 'from-rose-500 to-pink-600' },
  { id: 'avatar_5', label: 'Legal Counsel', emoji: '⚖️', bg: 'from-amber-500 to-orange-600' },
  { id: 'avatar_6', label: 'Analyst', emoji: '🔬', bg: 'from-cyan-600 to-blue-600' }
];

const INDIAN_STATES_DISTRICTS: Record<string, string[]> = {
  Maharashtra: ['Pune', 'Mumbai City', 'Mumbai Suburban', 'Thane', 'Nagpur', 'Nashik', 'Aurangabad'],
  Delhi: ['New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi'],
  Karnataka: ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Hubballi', 'Mangaluru'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
  'West Bengal': ['Kolkata', 'North 24 Parganas', 'Howrah', 'Darjeeling'],
  'Uttar Pradesh': ['Lucknow', 'Noida / Gautam Buddha Nagar', 'Kanpur', 'Varanasi', 'Agra'],
  Telangana: ['Hyderabad', 'Ranga Reddy', 'Warangal', 'Medchal'],
  Punjab: ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala']
};

export const CreateProfilePage: React.FC<CreateProfilePageProps> = ({
  initialUser,
  onProfileCompleted,
  onSignOut
}) => {
  const { currentLanguage, languages } = useLanguage();

  // Parse existing names if any
  const nameParts = (initialUser.displayName || '').split(' ');
  const initialFirst = initialUser.firstName || nameParts[0] || '';
  const initialLast = initialUser.lastName || nameParts.slice(1).join(' ') || '';

  const [firstName, setFirstName] = useState(initialFirst);
  const [lastName, setLastName] = useState(initialLast);
  const [email] = useState(initialUser.email || '');
  const [phone, setPhone] = useState(initialUser.phone || '9820012345');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'prefer_not_to_say'>(
    initialUser.gender || 'male'
  );
  const [selectedAvatar, setSelectedAvatar] = useState(
    initialUser.avatarPreset || 'avatar_1'
  );
  const [customPhotoUrl, setCustomPhotoUrl] = useState(initialUser.photoURL || '');
  const [role, setRole] = useState<'consumer' | 'inspector' | 'admin'>(
    initialUser.role || 'consumer'
  );
  const [selectedState, setSelectedState] = useState(initialUser.state || 'Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState(
    initialUser.district || 'Pune'
  );
  const [address, setAddress] = useState(initialUser.address || '');
  const [preferredLang, setPreferredLang] = useState<IndianLanguageCode>(
    initialUser.preferredLanguage || (currentLanguage as IndianLanguageCode) || 'en'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle custom photo file upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim()) {
      setErrorMsg("First Name is required.");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Contact Phone Number is required for statutory legal grievance verification.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const fullDisplayName = `${firstName.trim()} ${lastName.trim()}`.trim();

    const updatedProfile: UserProfile = {
      ...initialUser,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      displayName: fullDisplayName,
      email,
      phone: phone.trim(),
      gender,
      photoURL: customPhotoUrl || undefined,
      avatarPreset: selectedAvatar,
      role,
      state: selectedState,
      district: selectedDistrict,
      currentLocation: `${selectedDistrict}, ${selectedState}, India`,
      address: address.trim() || `${selectedDistrict}, ${selectedState}`,
      preferredLanguage: preferredLang,
      profileCompleted: true
    };

    try {
      const saved = await completeUserProfile(updatedProfile);
      onProfileCompleted(saved);
    } catch (err: any) {
      console.error("Profile save error:", err);
      setErrorMsg("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950 py-12">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 bg-slate-900/90 backdrop-blur-2xl border border-slate-700/70 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[11px] border border-emerald-500/30">
                Step 2 of 2
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Create Complainant Legal Identity
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Required by Section 15 of Legal Metrology Act, 2009 for valid statutory complaints
            </p>
          </div>

          <div className="w-9 h-9 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-400 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs text-slate-200">
          
          {/* Avatar & Photo Picker Section */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 block">
              Choose Identity Avatar or Upload Photo
            </span>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Custom Uploaded or Selected Preview */}
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 border-2 border-brand-500 shadow-md shrink-0 flex items-center justify-center text-2xl">
                {customPhotoUrl ? (
                  <img src={customPhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  AVATAR_PRESETS.find(a => a.id === selectedAvatar)?.emoji || '🧑‍💼'
                )}
              </div>

              {/* 6 Avatar Presets */}
              <div className="flex items-center gap-1.5 flex-wrap flex-1">
                {AVATAR_PRESETS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => { setSelectedAvatar(avatar.id); setCustomPhotoUrl(''); }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                      selectedAvatar === avatar.id && !customPhotoUrl
                        ? 'bg-gradient-to-tr ' + avatar.bg + ' ring-2 ring-white scale-105 shadow-md'
                        : 'bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300'
                    }`}
                    title={avatar.label}
                  >
                    {avatar.emoji}
                  </button>
                ))}

                {/* Upload Custom Image Button */}
                <label className="cursor-pointer px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-[11px] flex items-center gap-1.5 transition active:scale-95">
                  <Camera className="w-3.5 h-3.5 text-brand-400" />
                  <span>Upload Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
            </div>
          </div>

          {/* Name Row: First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1 text-[11px]">
                First Name *
              </label>
              <div className="flex items-center bg-slate-950/60 rounded-xl border border-slate-700/80 focus-within:border-brand-500">
                <User className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Masira"
                  required
                  className="w-full bg-transparent px-3 py-2.5 text-white outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1 text-[11px]">
                Last Name
              </label>
              <div className="flex items-center bg-slate-950/60 rounded-xl border border-slate-700/80 focus-within:border-brand-500">
                <User className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Kumar"
                  className="w-full bg-transparent px-3 py-2.5 text-white outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Email & Phone Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">
                  Verified Email Address
                </label>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>
              <div className="flex items-center bg-slate-950/80 rounded-xl border border-slate-800 text-slate-400">
                <Mail className="w-4 h-4 text-emerald-500 ml-3 shrink-0" />
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full bg-transparent px-3 py-2.5 text-slate-400 outline-none font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1 text-[11px]">
                Phone Number (SMS / Call Verification) *
              </label>
              <div className="flex items-center bg-slate-950/60 rounded-xl border border-slate-700/80 focus-within:border-brand-500">
                <span className="text-slate-400 ml-3 font-mono font-bold text-[11px]">+91</span>
                <input
                  type="tel"
                  value={phone.replace('+91', '').trim()}
                  onChange={(e) => setPhone('+91 ' + e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                  placeholder="98200 12345"
                  required
                  className="w-full bg-transparent px-2.5 py-2.5 text-white outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Gender Selector */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5 text-[11px]">
              Gender Identity
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['male', 'female', 'other', 'prefer_not_to_say'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`p-2 rounded-xl border text-center font-bold capitalize transition ${
                    gender === g
                      ? 'bg-brand-600/30 border-brand-500 text-white shadow-xs'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {g === 'prefer_not_to_say' ? 'Prefer not to say' : g}
                </button>
              ))}
            </div>
          </div>

          {/* Designated Role Cards */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5 text-[11px]">
              Designated Statutory Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('consumer')}
                className={`p-3 rounded-2xl border text-left transition ${
                  role === 'consumer'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-extrabold text-xs text-white">Citizen Complainant</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Consumer rights advocate</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('inspector')}
                className={`p-3 rounded-2xl border text-left transition ${
                  role === 'inspector'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300 shadow-md'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-extrabold text-xs text-white">LMPC Inspector</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Legal Metrology field officer</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-3 rounded-2xl border text-left transition ${
                  role === 'admin'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-md'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-extrabold text-xs text-white">Directorate Admin</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Ministry regulator / DoCA</div>
              </button>
            </div>
          </div>

          {/* State & District Jurisdictions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1 text-[11px]">
                State Jurisdiction *
              </label>
              <div className="flex items-center bg-slate-950/60 rounded-xl border border-slate-700/80 px-2.5">
                <MapPin className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <select
                  value={selectedState}
                  onChange={(e) => {
                    const newState = e.target.value;
                    setSelectedState(newState);
                    setSelectedDistrict(INDIAN_STATES_DISTRICTS[newState]?.[0] || 'District Headquarter');
                  }}
                  className="w-full bg-transparent py-2.5 text-white outline-none font-medium cursor-pointer"
                >
                  {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                    <option key={st} value={st} className="bg-slate-900 text-white">
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1 text-[11px]">
                District *
              </label>
              <div className="flex items-center bg-slate-950/60 rounded-xl border border-slate-700/80 px-2.5">
                <Building className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-transparent py-2.5 text-white outline-none font-medium cursor-pointer"
                >
                  {(INDIAN_STATES_DISTRICTS[selectedState] || ['Central']).map((dist) => (
                    <option key={dist} value={dist} className="bg-slate-900 text-white">
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Premises / Street Address */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1 text-[11px]">
              Premises / Street Address (Optional)
            </label>
            <div className="flex items-center bg-slate-950/60 rounded-xl border border-slate-700/80 px-3">
              <MapPin className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Flat 402, Shivam Enclave, Senapati Bapat Road"
                className="w-full bg-transparent py-2.5 text-white placeholder-slate-500 outline-none text-xs"
              />
            </div>
          </div>

          {/* Preferred Statutory Language */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1 text-[11px]">
              Preferred Language for Regulatory Reports & Dossiers
            </label>
            <div className="flex items-center bg-slate-950/60 rounded-xl border border-slate-700/80 px-2.5">
              <Globe className="w-4 h-4 text-brand-400 mr-2 shrink-0" />
              <select
                value={preferredLang}
                onChange={(e) => setPreferredLang(e.target.value as IndianLanguageCode)}
                className="w-full bg-transparent py-2.5 text-white outline-none font-medium cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.flag} {lang.name} ({lang.nativeName}) — {lang.region}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit & Complete Button */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-black text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Synchronizing Legal Identity...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Complete Profile & Enter Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {onSignOut && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={onSignOut}
                  className="text-xs font-semibold text-slate-400 hover:text-rose-400 transition cursor-pointer"
                >
                  ← Sign out or use another Google account
                </button>
              </div>
            )}
          </div>

        </form>

      </div>

    </div>
  );
};
