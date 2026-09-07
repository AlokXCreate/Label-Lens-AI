import React, { useState } from 'react';
import { Key, ShieldCheck, X, Check, Save, HardDrive, Volume2, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Zap, Languages, Sun, Moon, Monitor } from 'lucide-react';
import { AppSettings, AIProvider, IndianLanguageCode } from '../../types/user';
import { saveAppSettings } from '../../services/storageService';
import { testApiConnectivity, ApiTestResult } from '../../services/aiProviderService';
import { sendAppNotification } from '../../services/notificationService';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  onClose: () => void;
  onSaveSettings: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSaveSettings
}) => {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState<AppSettings>({
    ...settings,
    language: settings.language || currentLanguage
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<ApiTestResult | null>(null);

  if (!isOpen) return null;

  const handleProviderChange = (provider: AIProvider) => {
    let defaultModel = 'gemini-2.0-flash';
    if (provider === 'openai') defaultModel = 'gpt-4o-mini';
    else if (provider === 'openrouter') defaultModel = 'google/gemini-2.0-flash-001';

    setFormData({
      ...formData,
      aiProvider: provider,
      preferredModel: defaultModel
    });
    setTestResult(null);
  };

  const handleTestKey = async () => {
    setIsTesting(true);
    setTestResult(null);

    let activeKey = formData.geminiApiKey;
    if (formData.aiProvider === 'openai') activeKey = formData.openaiApiKey || '';
    else if (formData.aiProvider === 'openrouter') activeKey = formData.openrouterApiKey || '';

    const result = await testApiConnectivity(
      formData.aiProvider,
      activeKey,
      formData.preferredModel,
      formData.customEndpointUrl
    );

    setTestResult(result);
    setIsTesting(false);

    if (result.success) {
      sendAppNotification('API_KEY_VERIFIED', true, {
        title: `${formData.aiProvider.toUpperCase()} AI Engine Online`,
        message: `${result.message} Latency: ${result.latencyMs}ms. Model: ${formData.preferredModel}`,
        meta: {
          latencyMs: result.latencyMs
        }
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveAppSettings(formData);
    onSaveSettings(formData);
    setSavedSuccess(true);
    sendAppNotification('CUSTOM_INFO', true, {
      title: 'Configuration Settings Saved',
      message: `Active provider: ${formData.aiProvider.toUpperCase()} (${formData.preferredModel}). Audio alerts ${formData.soundAlertsEnabled ? 'enabled' : 'disabled'}.`
    });
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleLanguageChange = (lang: IndianLanguageCode) => {
    setLanguage(lang);
    setFormData((prev) => ({ ...prev, language: lang }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 overflow-y-auto max-h-[92vh] transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-100 dark:border-brand-800/60">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                {t('settingsTitle')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('settingsSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          {/* Theme Appearance Mode Selection */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Theme Appearance</span>
              </label>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800">
                {theme.toUpperCase()} MODE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Choose between high-contrast statutory Light theme, dark Night HUD, or automatic System device preference.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'light', label: 'Light', icon: Sun, desc: 'High Contrast' },
                { id: 'dark', label: 'Dark', icon: Moon, desc: 'Night HUD' },
                { id: 'system', label: 'System', icon: Monitor, desc: 'Auto Device' }
              ].map((tMode) => {
                const isSelected = theme === tMode.id;
                const IconComponent = tMode.icon;
                return (
                  <button
                    type="button"
                    key={tMode.id}
                    onClick={() => setTheme(tMode.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-brand-500 bg-white dark:bg-slate-900 ring-2 ring-brand-500/30 text-brand-600 dark:text-brand-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:border-brand-300 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mb-1" />
                    <span className="text-xs font-bold leading-tight">{tMode.label}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">{tMode.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Regional Indian Language Selection */}
          <div className="p-3.5 bg-gradient-to-br from-indigo-50/60 via-slate-50 to-emerald-50/40 dark:from-slate-800/60 dark:via-slate-800/40 dark:to-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>{t('languageSectionTitle')} ({languages.length})</span>
              </label>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-950/80 text-brand-800 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                100% Native
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Select your preferred Indian language. All statutory clauses, parameters, dossiers, and petitions render in this language.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
              {languages.map((l) => {
                const isSelected = currentLanguage === l.code;
                return (
                  <button
                    type="button"
                    key={l.code}
                    onClick={() => handleLanguageChange(l.code)}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-brand-500 bg-white dark:bg-slate-900 ring-2 ring-brand-500/20 text-brand-700 dark:text-brand-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:border-brand-300 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-base leading-none select-none">{l.flag}</span>
                    <span className={`text-xs font-bold mt-1 ${isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-slate-800 dark:text-slate-200'}`}>
                      {l.nativeName}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500">
                      {l.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Provider Selection Tabs */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              AI Provider & Inference Engine
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'gemini' as AIProvider, label: 'Google Gemini', desc: 'Fast multimodal' },
                { id: 'openai' as AIProvider, label: 'OpenAI', desc: 'GPT-4o / Mini' },
                { id: 'openrouter' as AIProvider, label: 'Custom / Router', desc: 'Any endpoint' }
              ].map(tab => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => handleProviderChange(tab.id)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    formData.aiProvider === tab.id
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/50 ring-1 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className={`font-bold ${formData.aiProvider === tab.id ? 'text-brand-700 dark:text-brand-300' : 'text-slate-800 dark:text-slate-200'}`}>
                    {tab.label}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">{tab.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Key Input per Provider */}
          {formData.aiProvider === 'gemini' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Google Gemini API Key</span>
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline font-semibold"
                >
                  Get Gemini Key →
                </a>
              </div>
              <input
                type="password"
                value={formData.geminiApiKey}
                onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
                placeholder="AIzaSy... (Paste Google Gemini Key)"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none font-mono"
              />
            </div>
          )}

          {formData.aiProvider === 'openai' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                  <span>OpenAI API Key</span>
                </label>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline font-semibold"
                >
                  Get OpenAI Key →
                </a>
              </div>
              <input
                type="password"
                value={formData.openaiApiKey || ''}
                onChange={(e) => setFormData({ ...formData, openaiApiKey: e.target.value })}
                placeholder="sk-proj-... (Paste OpenAI Key)"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none font-mono"
              />
            </div>
          )}

          {formData.aiProvider === 'openrouter' && (
            <div className="space-y-2.5">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  OpenRouter / Custom API Key
                </label>
                <input
                  type="password"
                  value={formData.openrouterApiKey || ''}
                  onChange={(e) => setFormData({ ...formData, openrouterApiKey: e.target.value })}
                  placeholder="sk-or-v1-... (Paste OpenRouter Key)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Custom Base URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.customEndpointUrl || ''}
                  onChange={(e) => setFormData({ ...formData, customEndpointUrl: e.target.value })}
                  placeholder="https://openrouter.ai/api/v1"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none font-mono text-[11px]"
                />
              </div>
            </div>
          )}

          {/* Model Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Select Inference Model
              </label>
              <span className="text-[10px] text-brand-600 dark:text-brand-300 font-semibold bg-brand-50 dark:bg-brand-950/60 px-1.5 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                Next-Gen 3.7 / 2.5 Compatible
              </span>
            </div>
            <select
              value={formData.preferredModel}
              onChange={(e) => setFormData({ ...formData, preferredModel: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {formData.aiProvider === 'gemini' && (
                <>
                  <option value="gemini-3.7-flash">Gemini 3.7 Flash (Next-Gen Multimodal & Reasoning)</option>
                  <option value="gemini-3.7-pro">Gemini 3.7 Pro (Advanced Statutory Analysis)</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (Fastest & Stable)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  <option value="custom">Custom Model Identifier...</option>
                </>
              )}
              {formData.aiProvider === 'openai' && (
                <>
                  <option value="gpt-4o-mini">GPT-4o Mini (High Speed Multimodal)</option>
                  <option value="gpt-4o">GPT-4o (Omni Multimodal Flagship)</option>
                  <option value="custom">Custom OpenAI Model...</option>
                </>
              )}
              {formData.aiProvider === 'openrouter' && (
                <>
                  <option value="google/gemini-2.0-flash-001">google/gemini-2.0-flash-001</option>
                  <option value="openai/gpt-4o-mini">openai/gpt-4o-mini</option>
                  <option value="anthropic/claude-3.5-sonnet">anthropic/claude-3.5-sonnet</option>
                  <option value="custom">Custom Model...</option>
                </>
              )}
            </select>

            {/* Custom Model Input if custom is chosen or typed */}
            {(formData.preferredModel === 'custom' || !['gemini-3.7-flash', 'gemini-3.7-pro', 'gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gpt-4o-mini', 'gpt-4o', 'google/gemini-2.0-flash-001', 'openai/gpt-4o-mini', 'anthropic/claude-3.5-sonnet'].includes(formData.preferredModel)) && (
              <div className="mt-2">
                <input
                  type="text"
                  value={formData.preferredModel === 'custom' ? '' : formData.preferredModel}
                  onChange={(e) => setFormData({ ...formData, preferredModel: e.target.value })}
                  placeholder="e.g. gemini-3.7-flash, gemini-3.8-exp, or custom model"
                  className="w-full p-2.5 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/20 dark:bg-brand-950/30 text-slate-900 dark:text-slate-100 font-mono text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            )}
          </div>


          {/* Ping / Verification Button */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Instant Connection Test</span>
              <span className="text-[11px] text-slate-400 dark:text-slate-400">Verifies key validity and response latency</span>
            </div>
            <button
              type="button"
              onClick={handleTestKey}
              disabled={isTesting}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-400 text-brand-600 dark:text-brand-400 font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95 disabled:opacity-50"
            >
              {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              <span>{isTesting ? 'Testing...' : 'Test Key'}</span>
            </button>
          </div>

          {/* Test Feedback Result */}
          {testResult && (
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 animate-in fade-in ${
              testResult.success 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' 
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold block">{testResult.success ? 'Key Verified Successfully' : 'Verification Failed'}</span>
                <span className="text-[11px] leading-relaxed">{testResult.message}</span>
              </div>
            </div>
          )}

          {/* Statutory Grounding Guarantee Banner */}
          <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Grounded Knowledge Base Active (Zero Hallucination)</span>
            </div>
            <p className="text-[11px] text-amber-800 dark:text-amber-300/90 leading-relaxed">
              All evaluations are strictly constrained to cite sections from the Legal Metrology Act 2009, PCR Rules 2011/2026, and FSSAI 2020 regulations.
            </p>
          </div>

          {/* Toggle Preferences */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
              <span className="text-slate-700 dark:text-slate-200 font-medium flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>Auditory Synthetic Chimes & Toast HUD</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sendAppNotification('FILE_DOWNLOADED', true, {
                      title: 'Sample Compliance Dossier Exported',
                      message: 'Testing Label Lens AI notification HUD with official emblem & sound.',
                      meta: {
                        fileName: 'Sample_Dossier_PCR2026.pdf',
                        fileFormat: 'PDF',
                        fileSizeBytes: 64200,
                        score: 95
                      },
                      actionLabel: 'Preview',
                      onAction: () => alert('Label Lens AI Notification Action Triggered!')
                    });
                  }}
                  className="px-2 py-0.5 text-[10px] font-bold text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 rounded-md border border-brand-200 dark:border-brand-800 transition active:scale-95 cursor-pointer"
                  title="Preview pop-up notification with sound"
                >
                  Test Pop-up
                </button>
                <input
                  type="checkbox"
                  checked={formData.soundAlertsEnabled}
                  onChange={(e) => setFormData({ ...formData, soundAlertsEnabled: e.target.checked })}
                  className="w-4 h-4 text-brand-600 rounded border-slate-300 dark:border-slate-700 focus:ring-brand-500 cursor-pointer"
                />
              </div>
            </div>

            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer">
              <span className="text-slate-700 dark:text-slate-200 font-medium flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>Auto-backup dossiers to Firebase & Google Drive</span>
              </span>
              <input
                type="checkbox"
                checked={formData.saveToGoogleDrive}
                onChange={(e) => setFormData({ ...formData, saveToGoogleDrive: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 dark:border-slate-700 focus:ring-brand-500"
              />
            </label>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold flex items-center gap-2 shadow-md shadow-brand-500/20 active:scale-95 transition"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Settings Saved!' : 'Save Preferences'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
