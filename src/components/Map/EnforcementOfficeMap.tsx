import React, { useState } from 'react';
import { MapPin, Navigation, Phone, ExternalLink, ShieldCheck, Building2, FlaskConical, Search, Clock, ArrowRight, X } from 'lucide-react';
import {
  findNearestEnforcementOffices,
  OfficeDistanceResult,
  generateGoogleMapsEmbedUrl
} from '../../services/googleMapsService';
import { callAuthorityDirectly } from '../../services/callingService';

interface EnforcementOfficeMapProps {
  isOpen: boolean;
  onClose: () => void;
  userLat?: number;
  userLon?: number;
  userAddress?: string;
  onSelectOfficeForComplaint?: (officeName: string, officeAddress: string) => void;
}

export const EnforcementOfficeMap: React.FC<EnforcementOfficeMapProps> = ({
  isOpen,
  onClose,
  userLat = 18.5204, // Default to Pune, Maharashtra
  userLon = 73.8567,
  userAddress = "Pune, Maharashtra, India",
  onSelectOfficeForComplaint
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOffice, setSelectedOffice] = useState<OfficeDistanceResult | null>(null);

  if (!isOpen) return null;

  const categoryFilter = activeCategory === 'All' ? undefined : activeCategory;
  const allOffices = findNearestEnforcementOffices(userLat, userLon, categoryFilter);

  const filteredOffices = allOffices.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.office.name.toLowerCase().includes(q) ||
      item.office.district.toLowerCase().includes(q) ||
      item.office.state.toLowerCase().includes(q) ||
      item.office.jurisdiction.toLowerCase().includes(q)
    );
  });

  const activeOffice = selectedOffice || filteredOffices[0] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span>Google Maps Enforcement & Testing Lab Locator</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live GPS
                </span>
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <span>Nearest to:</span>
                <span className="font-semibold text-slate-700 truncate max-w-sm">{userAddress}</span>
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

        {/* Filter Bar & Search */}
        <div className="p-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-2.5">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'All', label: 'All Offices & Labs', icon: Building2 },
              { id: 'Legal Metrology Department', label: 'Legal Metrology', icon: ShieldCheck },
              { id: 'FSSAI Regional Office', label: 'FSSAI Desks', icon: Building2 },
              { id: 'NABL Accredited Food Testing Lab', label: 'NABL Testing Labs', icon: FlaskConical }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveCategory(tab.id);
                    setSelectedOffice(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search district, city or officer..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

        </div>

        {/* Main Split Layout: Left List + Right Interactive Map Preview */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Left: Ranked Office Cards */}
          <div className="md:col-span-6 lg:col-span-5 border-r border-slate-100 overflow-y-auto p-3 space-y-2.5">
            {filteredOffices.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No enforcement offices matching your criteria.
              </div>
            ) : (
              filteredOffices.map((item) => {
                const isSelected = activeOffice?.office.id === item.office.id;
                return (
                  <div
                    key={item.office.id}
                    onClick={() => setSelectedOffice(item)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 text-xs ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/40 shadow-sm ring-1 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {/* Badge & Distance */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.office.category === 'Legal Metrology Department'
                          ? 'bg-amber-100 text-amber-800'
                          : item.office.category === 'NABL Accredited Food Testing Lab'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.office.category}
                      </span>
                      <div className="text-right">
                        <span className="font-extrabold text-blue-700 text-xs">{item.distanceKm} km</span>
                        <span className="text-[10px] text-slate-400 block">~{item.estimatedMinutes} mins drive</span>
                      </div>
                    </div>

                    {/* Office Name */}
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      {item.office.name}
                    </h4>

                    {/* Address snippet */}
                    <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                      {item.office.address}
                    </p>

                    {/* Quick actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          callAuthorityDirectly(item.office.phone);
                        }}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{item.office.phone}</span>
                      </button>

                      <a
                        href={item.navigationUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                      >
                        <span>Directions</span>
                        <Navigation className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>

                  </div>
                );
              })
            )}
          </div>

          {/* Right: Active Office Detail & Google Maps Embed */}
          <div className="md:col-span-6 lg:col-span-7 bg-slate-50 flex flex-col h-full overflow-y-auto">
            {activeOffice ? (
              <div className="flex-1 flex flex-col p-4 sm:p-5 space-y-4">
                
                {/* Office Meta Details */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-2.5 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-bold text-blue-600 uppercase">
                        {activeOffice.office.jurisdiction}
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">
                        {activeOffice.office.name}
                      </h3>
                      <p className="text-slate-600 text-xs mt-1">
                        {activeOffice.office.address}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                    <div>
                      <span className="text-slate-400 font-bold block">Officer in Charge:</span>
                      <span className="font-semibold text-slate-800">{activeOffice.office.officerInCharge}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block">Working Timings:</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {activeOffice.office.workingHours}
                      </span>
                    </div>
                  </div>

                  {/* Complaint Attachment Button */}
                  {onSelectOfficeForComplaint && (
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          onSelectOfficeForComplaint(activeOffice.office.name, activeOffice.office.address);
                          onClose();
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition border border-indigo-200"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Target this Office for Official Statutory Complaint</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                </div>

                {/* Google Maps Embed / Navigation Preview */}
                <div className="flex-1 min-h-[220px] rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-200 relative">
                  <iframe
                    title="Google Maps Office Location"
                    src={generateGoogleMapsEmbedUrl(
                      activeOffice.office.latitude,
                      activeOffice.office.longitude,
                      activeOffice.office.name
                    )}
                    className="w-full h-full border-0 min-h-[260px]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Direct Google Maps Action Bar */}
                <div className="flex items-center gap-2">
                  <a
                    href={activeOffice.navigationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm shadow-blue-500/20"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open Driving Directions in Google Maps</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>

                  <button
                    onClick={() => callAuthorityDirectly(activeOffice.office.phone)}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition shadow-sm shadow-emerald-500/20"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Office</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
                Select an office from the directory to view details and Google Maps directions.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
