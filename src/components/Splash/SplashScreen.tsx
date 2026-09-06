import React, { useState, useEffect } from 'react';
import { Scale, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

const INIT_STEPS = [
  { progress: 20, message: "⚡ Initializing Rule 6 Statutory Metrology Engine..." },
  { progress: 50, message: "⚖️ Synchronizing Legal Metrology (PCR 2026) & FSSAI Standards..." },
  { progress: 80, message: "🛡️ Securing Google Cloud & Firebase Compliance Vault..." },
  { progress: 100, message: "✨ Compliance Engine Ready • Launching Portal..." }
];

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 2800
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      if (pct >= 80) setCurrentStepIndex(3);
      else if (pct >= 50) setCurrentStepIndex(2);
      else if (pct >= 20) setCurrentStepIndex(1);
      else setCurrentStepIndex(0);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        handleTriggerExit();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [durationMs]);

  const handleTriggerExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      onFinish();
    }, 450);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between p-6 sm:p-12 overflow-hidden bg-slate-950 text-white transition-all duration-500 ease-out select-none ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-brand-600/30 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-emerald-500/25 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/15 rounded-full blur-[180px] pointer-events-none" />

      {/* Subtle Micro-Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Top Header: Government & Hackathon Identity */}
      <header className="w-full max-w-5xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg">
          <Scale className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-black tracking-wide text-slate-200">
            SIH 2026 Problem Statement 26034
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-[11px] text-slate-400 font-medium">
            Dept. of Consumer Affairs (MoCAF&PD)
          </span>
        </div>

        {/* Skip Intro Button */}
        <button
          onClick={handleTriggerExit}
          className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 px-3 py-1.5 rounded-full backdrop-blur-md transition active:scale-95 shadow-sm"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Center Stage: Animated Shield Logo & App Title */}
      <main className="flex flex-col items-center text-center my-auto z-10 max-w-2xl px-4 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Glowing Shield Emblem with Outer Rotating Ring */}
        <div className="relative mb-6 sm:mb-8 flex items-center justify-center">
          {/* Outer Pulsing Glow */}
          <div className="absolute w-36 h-36 sm:w-44 sm:h-44 bg-gradient-to-tr from-brand-600/40 via-emerald-500/30 to-indigo-500/40 rounded-full blur-2xl animate-pulse" />

          {/* Rotating Radar Ring */}
          <div className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-dashed border-emerald-500/40 animate-[spin_10s_linear_infinite]" />

          {/* Central Glassmorphic Shield Housing */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-slate-900/90 via-slate-800/90 to-slate-900/90 border-2 border-emerald-500/50 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.35)] backdrop-blur-xl">
            {/* SVG Shield Emblem */}
            <svg
              className="w-14 h-14 sm:w-18 sm:h-18 text-emerald-400 drop-shadow-[0_4px_12px_rgba(16,185,129,0.5)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>

            {/* Glowing Corner Accents */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full blur-[2px] animate-ping" />
          </div>
        </div>

        {/* App Title */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400 drop-shadow-sm">
            Label Lens AI
          </span>
          <span className="ml-2.5 inline-block text-[11px] sm:text-xs uppercase font-mono font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 align-middle">
            v1.0 Ready
          </span>
        </h1>

        {/* Primary Tagline */}
        <p className="text-base sm:text-xl font-bold text-slate-200 tracking-tight max-w-xl mb-3">
          Statutory Legal Metrology & Food Safety Compliance Engine
        </p>

        {/* Secondary Sub-Tagline */}
        <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-lg leading-relaxed mb-6">
          Automated Computer Vision, OCR & Rules Audit strictly grounded in the Legal Metrology Act, 2009 (PCR 2026) and FSSAI 2020 Regulations.
        </p>

        {/* Regulatory Pillars Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] font-bold text-slate-300">
          <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rule 6 (16 Statutory Norms)</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>FSSAI Labelling Compliant</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Firebase & Cloud Vault</span>
          </span>
        </div>

      </main>

      {/* Bottom Footer: Progress Bar & Initialization Status */}
      <footer className="w-full max-w-md flex flex-col items-center text-center z-10">
        {/* Progress Bar Container */}
        <div className="w-full bg-slate-900/80 border border-slate-800/80 rounded-full h-2 p-0.5 mb-3 shadow-inner backdrop-blur-md overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_rgba(52,211,153,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic Status Text & Percentage */}
        <div className="w-full flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
          <span className="truncate max-w-[280px] text-left text-slate-300 font-medium">
            {INIT_STEPS[currentStepIndex].message}
          </span>
          <span className="font-bold text-emerald-400 ml-2 shrink-0">
            {progress}%
          </span>
        </div>
      </footer>

    </div>
  );
};
