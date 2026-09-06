import React, { useState } from 'react';
import { MapPin, Navigation, Check, X } from 'lucide-react';

interface LocationPromptModalProps {
  isOpen: boolean;
  onConfirm: (locationData?: {
    latitude: number;
    longitude: number;
    formatted_address: string;
    state: string;
    district: string;
  }) => void;
  onClose: () => void;
}

export const LocationPromptModal: React.FC<LocationPromptModalProps> = ({
  isOpen,
  onConfirm,
  onClose
}) => {
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  if (!isOpen) return null;

  const handleAttachLocation = () => {
    setIsFetchingLocation(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Proceeding with default location.");
      onConfirm({
        latitude: 18.5204,
        longitude: 73.8567,
        formatted_address: "Senapati Bapat Road, Shivajinagar, Pune, Maharashtra 411016",
        state: "Maharashtra",
        district: "Pune"
      });
      setIsFetchingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsFetchingLocation(false);
        onConfirm({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          formatted_address: `Lat: ${position.coords.latitude.toFixed(4)}, Long: ${position.coords.longitude.toFixed(4)} (Verified via Device GPS)`,
          state: "Maharashtra",
          district: "Pune Division"
        });
      },
      (error) => {
        console.warn("Location access denied or unavailable:", error);
        setIsFetchingLocation(false);
        // Default fallback
        onConfirm({
          latitude: 18.5204,
          longitude: 73.8567,
          formatted_address: "Senapati Bapat Road, Shivajinagar, Pune, Maharashtra 411016 (Device Fallback)",
          state: "Maharashtra",
          district: "Pune"
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 mx-auto">
          <MapPin className="w-6 h-6 animate-bounce" />
        </div>

        <h3 className="text-lg font-black text-slate-900 text-center tracking-tight">
          Attach Live Incident Location?
        </h3>

        <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">
          Would you like to include your current live location in this official complaint?
          This enables enforcement officers from the Legal Metrology & Food Safety Department to
          pinpoint the retail store, supermarket, or vendor where the violation occurred.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={handleAttachLocation}
            disabled={isFetchingLocation}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition active:scale-95"
          >
            {isFetchingLocation ? (
              <>
                <Navigation className="w-4 h-4 animate-spin" />
                <span>Acquiring GPS Pinpoint...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Yes, Include My Live Location (Recommended)</span>
              </>
            )}
          </button>

          <button
            onClick={() => onConfirm(undefined)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
          >
            No, Generate Without Location
          </button>
        </div>

      </div>
    </div>
  );
};
