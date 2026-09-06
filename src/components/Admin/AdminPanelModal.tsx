import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  FileCheck,
  FileWarning,
  PhoneCall,
  FolderArchive,
  Search,
  X,
  RefreshCw,
  Trash2,
  Shield,
  FileSpreadsheet
} from 'lucide-react';
import { UserProfile, ArchivedDocument } from '../../types/user';
import { ProductAuditReport } from '../../types/audit';
import { LegalComplaint } from '../../types/complaint';
import { CallLogEntry } from '../../types/user';
import {
  getAllUserAccounts,
  deleteUserAccount,
  updateUserRole,
  getArchivedDocuments,
  getAdminSystemStats,
  exportAdminDataToExcel
} from '../../services/firebaseService';
import { getStoredReports } from '../../services/storageService';
import { getStoredComplaints } from '../../services/storageService';
import { getStoredCallLogs } from '../../services/callingService';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'audits' | 'complaints' | 'calls' | 'docs'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [audits, setAudits] = useState<ProductAuditReport[]>([]);
  const [complaints, setComplaints] = useState<LegalComplaint[]>([]);
  const [calls, setCalls] = useState<CallLogEntry[]>([]);
  const [docs, setDocs] = useState<ArchivedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAllData();
    }
  }, [isOpen]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const uList = await getAllUserAccounts();
      setUsers(uList);
      setAudits(getStoredReports());
      setComplaints(getStoredComplaints());
      setCalls(getStoredCallLogs());
      setDocs(getArchivedDocuments());
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const stats = getAdminSystemStats();

  const handleDeleteUser = async (uid: string) => {
    if (confirm("Are you sure you want to remove this user account from the registry?")) {
      await deleteUserAccount(uid);
      setUsers(prev => prev.filter(u => u.uid !== uid));
    }
  };

  const handleRoleChange = async (uid: string, role: 'admin' | 'inspector' | 'consumer') => {
    await updateUserRole(uid, role);
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role } : u));
  };

  const handleExportExcel = () => {
    exportAdminDataToExcel();
  };

  // Filtered queries
  const q = searchQuery.toLowerCase();
  const filteredUsers = users.filter(u => u.displayName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.uid.toLowerCase().includes(q));
  const filteredAudits = audits.filter(a => a.product_name.toLowerCase().includes(q) || a.brand_name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q));
  const filteredComplaints = complaints.filter(c => c.subject_line.toLowerCase().includes(q) || c.complaint_id.toLowerCase().includes(q) || c.authority_target.toLowerCase().includes(q));
  const filteredCalls = calls.filter(cl => cl.authorityName.toLowerCase().includes(q) || cl.phoneNumber.includes(q) || cl.state.toLowerCase().includes(q));
  const filteredDocs = docs.filter(d => d.fileName.toLowerCase().includes(q) || d.userEmail.toLowerCase().includes(q) || d.title.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-6xl w-full h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-emerald-500 flex items-center justify-center font-bold text-white shadow-md shadow-brand-900/40">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  Directorate Admin Command Center
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
                  Director Access
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Department of Consumer Affairs (MoCAF&PD) • User Accounts & Inspection Registry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Export All to Excel Button */}
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition active:scale-95"
              title="Download All Users & Entries as Multi-Sheet Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Export Excel (.xlsx)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-slate-50 border-b border-slate-200">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-brand-600" /> Accounts
            </span>
            <div className="text-xl font-black text-slate-900 mt-1">{stats.totalUsers}</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Audits Run
            </span>
            <div className="text-xl font-black text-slate-900 mt-1">{stats.totalAudits}</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Violations
            </span>
            <div className="text-xl font-black text-rose-600 mt-1">{stats.criticalViolationsCount}</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <FileWarning className="w-3.5 h-3.5 text-amber-600" /> Complaints
            </span>
            <div className="text-xl font-black text-slate-900 mt-1">{stats.totalComplaints}</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <FolderArchive className="w-3.5 h-3.5 text-indigo-600" /> Archived Files
            </span>
            <div className="text-xl font-black text-indigo-600 mt-1">{stats.totalArchivedDocuments}</div>
          </div>
        </div>

        {/* Tab & Search Controls */}
        <div className="p-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 overflow-x-auto">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
            >
              <Users className="w-3.5 h-3.5 text-brand-600" />
              <span>User Accounts ({users.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('audits')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${activeTab === 'audits' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Audits ({audits.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('complaints')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${activeTab === 'complaints' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
            >
              <FileWarning className="w-3.5 h-3.5 text-rose-600" />
              <span>Complaints ({complaints.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('calls')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${activeTab === 'calls' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              <span>Helpline Calls ({calls.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${activeTab === 'docs' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
            >
              <FolderArchive className="w-3.5 h-3.5 text-indigo-600" />
              <span>Archive ({docs.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs w-full sm:w-64 focus-within:ring-2 focus-within:ring-brand-500">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search accounts, products, dockets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-800 text-xs"
              />
            </div>
            <button
              onClick={loadAllData}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition border border-slate-200"
              title="Refresh Registry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Data Grid Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          
          {/* TAB 1: User Accounts */}
          {activeTab === 'users' && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Verified Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Auth Provider</th>
                    <th className="p-3">Last Active</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(u => (
                    <tr key={u.uid} className="hover:bg-slate-50/80 transition">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{u.displayName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{u.uid}</div>
                      </td>
                      <td className="p-3 text-slate-700 font-medium">{u.email}</td>
                      <td className="p-3">
                        <select
                          value={u.role || 'consumer'}
                          onChange={(e) => handleRoleChange(u.uid, e.target.value as any)}
                          className="px-2 py-1 rounded-md border border-slate-200 font-bold text-[11px] bg-white cursor-pointer"
                        >
                          <option value="consumer">Citizen / Consumer</option>
                          <option value="inspector">LMPC Inspector</option>
                          <option value="admin">Directorate Admin</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {u.authProvider || 'google'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('en-IN') : 'Recent'}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.uid)}
                          disabled={u.uid === currentUser.uid}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition disabled:opacity-30"
                          title="Remove Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: Product Audits */}
          {activeTab === 'audits' && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">Dossier ID</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Brand</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAudits.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-mono font-bold text-brand-700">{a.id}</td>
                      <td className="p-3 font-bold text-slate-900">{a.product_name}</td>
                      <td className="p-3 text-slate-700">{a.brand_name}</td>
                      <td className="p-3 text-slate-500">{a.category}</td>
                      <td className="p-3 font-extrabold text-slate-900">{a.compliance_score}/100</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          a.overall_status === 'Compliant'
                            ? 'bg-emerald-100 text-emerald-800'
                            : a.overall_status === 'Warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {a.overall_status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{new Date(a.timestamp).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: Statutory Complaints */}
          {activeTab === 'complaints' && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">Docket ID</th>
                    <th className="p-3">Target Authority</th>
                    <th className="p-3">Respondent</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Violations</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.map(c => (
                    <tr key={c.complaint_id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-mono font-bold text-rose-700">{c.complaint_id}</td>
                      <td className="p-3 font-bold text-slate-900">{c.authority_target}</td>
                      <td className="p-3 text-slate-700">{c.respondent.brand_name}</td>
                      <td className="p-3 text-slate-600 truncate max-w-xs">{c.subject_line}</td>
                      <td className="p-3 font-bold text-rose-600">{c.itemized_violations.length}</td>
                      <td className="p-3 text-slate-500">{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: Helpline Calls */}
          {activeTab === 'calls' && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">Desk Target</th>
                    <th className="p-3">State</th>
                    <th className="p-3">Helpline</th>
                    <th className="p-3">Docket Issued</th>
                    <th className="p-3">Officer</th>
                    <th className="p-3">Outcome</th>
                    <th className="p-3">Recording</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCalls.map(cl => (
                    <tr key={cl.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-bold text-slate-900">{cl.authorityName}</td>
                      <td className="p-3 text-slate-600">{cl.state}</td>
                      <td className="p-3 font-mono text-slate-700">{cl.phoneNumber}</td>
                      <td className="p-3 font-mono font-bold text-brand-700">{cl.docketNumber || 'N/A'}</td>
                      <td className="p-3 text-slate-700">{cl.officerName || 'Duty Desk'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                          {cl.outcomeStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        {cl.audioRecordingBlobUrl ? (
                          <audio src={cl.audioRecordingBlobUrl} controls className="h-7 w-32" />
                        ) : (
                          <span className="text-slate-400 text-[11px]">No audio</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: Document Archive */}
          {activeTab === 'docs' && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">File Name</th>
                    <th className="p-3">Document Type</th>
                    <th className="p-3">Format</th>
                    <th className="p-3">Downloaded By</th>
                    <th className="p-3">Downloaded At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-bold text-slate-900">{d.fileName}</td>
                      <td className="p-3 text-slate-600 uppercase text-[10px]">{d.documentType.replace('_', ' ')}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          .{d.format}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700">{d.userEmail}</td>
                      <td className="p-3 text-slate-500">{new Date(d.downloadedAt).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
