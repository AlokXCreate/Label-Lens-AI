import React, { useState, useEffect } from 'react';
import { Smartphone, Maximize2, Wifi, BatteryCharging, Signal } from 'lucide-react';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
  deviceFrame: 'frame' | 'fullscreen';
  onToggleFrame: (mode: 'frame' | 'fullscreen') => void;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({
  children,
  deviceFrame,
  onToggleFrame
}) => {
  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (deviceFrame === 'fullscreen') {
    return (
      <div className="w-full min-h-screen bg-slate-100 flex flex-col items-center">
        {/* Floating Switcher Controls */}
        <div className="sticky top-2 z-50 flex items-center gap-2 bg-slate-900/90 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl backdrop-blur-md mb-2">
          <Smartphone className="w-3.5 h-3.5 text-brand-400" />
          <span>Mobile APK View (Fullscreen)</span>
          <button
            onClick={() => onToggleFrame('frame')}
            className="ml-2 px-2 py-0.5 rounded-full bg-brand-600 hover:bg-brand-500 text-[10px] uppercase tracking-wider font-extrabold flex items-center gap-1 transition"
          >
            <Smartphone className="w-3 h-3" />
            <span>Show Phone Frame</span>
          </button>
        </div>

        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 py-6 sm:py-10 px-3 flex flex-col items-center justify-center">
      
      {/* Device Frame Top Control Bar */}
      <div className="mb-4 flex items-center gap-3 bg-slate-800/90 border border-slate-700/80 px-4 py-2 rounded-2xl shadow-lg backdrop-blur-md text-xs text-white">
        <div className="flex items-center gap-2 font-extrabold text-slate-200">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>Android Mobile APK Simulator</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
            Pixel 8 Pro / Galaxy S24
          </span>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        <button
          onClick={() => onToggleFrame('fullscreen')}
          className="flex items-center gap-1 text-slate-300 hover:text-white font-bold transition hover:bg-slate-700/50 px-2.5 py-1 rounded-lg"
          title="Switch to edge-to-edge view"
        >
          <Maximize2 className="w-3.5 h-3.5 text-brand-400" />
          <span>Edge-to-Edge</span>
        </button>
      </div>

      {/* Realistic Smartphone Chassis */}
      <div className="relative w-full max-w-[412px] h-[860px] bg-slate-950 rounded-[48px] p-3 shadow-[0_25px_70px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.1),inset_0_0_0_2px_rgba(100,116,139,0.3)] flex flex-col transition-all duration-300">
        
        {/* Metallic Edge Highlight */}
        <div className="absolute inset-0 rounded-[48px] border-2 border-slate-700/60 pointer-events-none" />

        {/* Outer Bezel Buttons (Power & Volume) */}
        <div className="absolute -left-[3px] top-28 w-[3px] h-10 bg-slate-700 rounded-l-sm" />
        <div className="absolute -left-[3px] top-42 w-[3px] h-14 bg-slate-700 rounded-l-sm" />
        <div className="absolute -right-[3px] top-32 w-[3px] h-12 bg-slate-700 rounded-r-sm" />

        {/* Screen Bezel and Inner Display */}
        <div className="relative w-full h-full bg-white rounded-[38px] overflow-hidden flex flex-col shadow-inner">
          
          {/* Android System Status Bar */}
          <div className="h-9 w-full bg-slate-900 text-white px-6 flex items-center justify-between text-xs font-semibold select-none shrink-0 z-50">
            {/* Clock */}
            <span className="font-mono text-[11px] font-bold text-slate-200">
              {currentTime}
            </span>

            {/* Centered Punch Hole Front Camera */}
            <div className="w-4 h-4 rounded-full bg-black border border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            </div>

            {/* Android Status Icons */}
            <div className="flex items-center gap-2 text-slate-300">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5 text-[10px] font-mono">
                <span>98%</span>
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* App Screen Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col bg-slate-50 relative pb-16">
            {children}
          </div>

          {/* Android Bottom Gesture Navigation Pill */}
          <div className="absolute bottom-1 inset-x-0 h-3 flex items-center justify-center pointer-events-none z-50">
            <div className="w-28 h-1 bg-slate-400/80 rounded-full" />
          </div>

        </div>

      </div>

      <p className="text-slate-400 text-xs mt-4 text-center">
        Interactive Mobile Preview • Single React/Capacitor Codebase running as Web & APK
      </p>

    </div>
  );
};
