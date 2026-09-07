import React, { useState, useRef } from 'react';
import { Camera, Upload, Mic, MicOff, RefreshCw, Sparkles, CheckCircle2, AlertTriangle, XCircle, FileText, Video, Eye, Plus, Trash2 } from 'lucide-react';
import { optimizeImageForAnalysis } from '../../services/aiProviderService';
import { useLanguage } from '../../context/LanguageContext';

interface CameraScannerProps {
  onStartAnalysis: (input: {
    imagesBase64?: string[];
    voiceTranscript?: string;
    textDescription?: string;
    pdpAreaSqCm?: number;
    barcode?: string;
    documentText?: string;
  }) => void;
  isAnalyzing: boolean;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onStartAnalysis, isAnalyzing }) => {
  const { t } = useLanguage();
  // Multi-image state (Front, Back, MRP/Sticker)
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [voiceText, setVoiceText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [textDescription, setTextDescription] = useState('');
  const [documentText, setDocumentText] = useState('');
  const [pdpArea, setPdpArea] = useState<number>(160);
  const [barcodeInput, setBarcodeInput] = useState('');
  
  // Live Camera Viewfinder State
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Handle image file selection with instant optimization
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = async () => {
          const rawBase64 = reader.result as string;
          const optimized = await optimizeImageForAnalysis(rawBase64);
          setCapturedImages(prev => [...prev.slice(0, 3), optimized]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Handle Document / PDF text specification upload
  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.includes('image')) {
        const reader = new FileReader();
        reader.onload = async () => {
          const optimized = await optimizeImageForAnalysis(reader.result as string);
          setCapturedImages(prev => [...prev, optimized]);
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result as string;
          setDocumentText(`[Uploaded Spec Document: ${file.name}]\n${text.slice(0, 3000)}`);
        };
        reader.readAsText(file);
      }
    }
  };

  // Live Camera Activation & Snapshot Capture
  const startLiveCamera = async () => {
    try {
      setIsLiveCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Unable to open device camera. Please grant camera permission or use file upload.");
      setIsLiveCameraActive(false);
    }
  };

  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsLiveCameraActive(false);
  };

  const captureCameraSnapshot = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 1280;
      canvas.height = videoRef.current.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const optimized = await optimizeImageForAnalysis(dataUrl);
        setCapturedImages(prev => [...prev.slice(0, 3), optimized]);
      }
    }
    stopLiveCamera();
  };

  // Toggle voice recognition
  const toggleVoiceRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      alert("Speech recognition is not supported in this browser. Please type observations directly.");
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      setVoiceText(transcript);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  // Load sample test commodities with statutory infractions
  const loadPreset = (type: 'compliant' | 'non_compliant' | 'contraband' | 'unlicensed') => {
    if (type === 'compliant') {
      setCapturedImages(['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80']);
      setTextDescription('Aashirvaad Superior MP Whole Wheat Atta. Net Qty: 5 kg. MRP: ₹ 245.00 (inclusive of all taxes). Unit Sale Price: ₹ 49.00 / kg. Mfd: 08/2026. FSSAI Lic No: 10012022000452. Contains: Wheat (Gluten). Veg Logo green circle diameter 6mm. Country of Origin: India.');
      setPdpArea(650);
      setBarcodeInput('8901030889123');
    } else if (type === 'non_compliant') {
      setCapturedImages(['https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80']);
      setTextDescription('PureCold Cold-Pressed Mustard & Sesame Oil Blend. Claims: "100% Heart Healthy, Lowers Cholesterol in 14 Days, Prevents Cardiac Arrest". Net Qty: 1 Litre. MRP: ₹ 280. Unit Sale Price not declared. FSSAI Lic: 10019011002341. Prohibited curative health claim under Section 24 of FSSA 2006 & FSSAI Advertising & Claims Regulations, 2018.');
      setPdpArea(220);
      setBarcodeInput('8901030992314');
    } else if (type === 'contraband') {
      setCapturedImages(['https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&auto=format&fit=crop&q=80']);
      setTextDescription('Swiss Noir 85% Imported Dark Chocolate. Net Weight: 100g. Barcode: 7610400012345. No Indian Importer Name/Address declared. Price sticker pasted: "$4.50". No MRP in Indian Rupees (INR) as mandated by PCR 2011 Rule 6(1)(e). Missing FSSAI Logo and green vegetarian dot.');
      setPdpArea(120);
      setBarcodeInput('7610400012345');
    } else {
      setCapturedImages(['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80']);
      setTextDescription('Crunchy Salted Potato Chips Big Pack. Declared Net Qty: 75 g. MRP: ₹ 30 (USP: ₹ 0.40/g). Actual Net Weight Measured: 58 g. Deficiency: 17 g (22.6% deficit, exceeding 4.5g Maximum Permissible Error tolerance under First Schedule of PCR 2011). Slack fill / underfilled packaging.');
      setPdpArea(180);
      setBarcodeInput('8903322110099');
    }
  };

  const handleRunAudit = () => {
    onStartAnalysis({
      imagesBase64: capturedImages.length > 0 ? capturedImages : undefined,
      voiceTranscript: voiceText.trim() || undefined,
      textDescription: textDescription.trim() || undefined,
      documentText: documentText.trim() || undefined,
      pdpAreaSqCm: pdpArea,
      barcode: barcodeInput.trim() || undefined
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md overflow-hidden transition-colors">
      
      {/* Top Banner / Ingestion Selector */}
      <div className="p-3.5 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-300 shadow-sm shrink-0">
              <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            </div>
            <h2 className="font-extrabold text-white text-sm sm:text-lg tracking-tight truncate">
              {t('scannerTitle')}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] sm:text-[10px] font-mono font-bold border border-emerald-500/30 shrink-0">
              Rule 6 Vision
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 sm:mt-1">
            {t('scannerSubtitle')}
          </p>
        </div>

        {/* Preset Quick Loaders for Demonstrations - Scrollable pill ribbon on mobile */}
        <div className="w-full sm:w-auto overflow-x-auto no-scrollbar py-0.5 flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 mr-0.5 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Presets:
          </span>
          <button
            onClick={() => loadPreset('compliant')}
            className="text-[11px] px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-bold border border-emerald-500/30 flex items-center gap-1 transition active:scale-95 shadow-xs shrink-0 tap-transparent cursor-pointer"
            title="Load Compliant Whole Wheat Atta Pack (100/100)"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Compliant</span>
          </button>
          <button
            onClick={() => loadPreset('non_compliant')}
            className="text-[11px] px-2.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold border border-amber-500/30 flex items-center gap-1 transition active:scale-95 shadow-xs shrink-0 tap-transparent cursor-pointer"
            title="Load Misleading Health Claims Oil"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Misleading Oil</span>
          </button>
          <button
            onClick={() => loadPreset('contraband')}
            className="text-[11px] px-2.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 font-bold border border-rose-500/30 flex items-center gap-1 transition active:scale-95 shadow-xs shrink-0 tap-transparent cursor-pointer"
            title="Load Imported Chocolate Missing Indian MRP / Declarations"
          >
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Import Pack</span>
          </button>
          <button
            onClick={() => loadPreset('unlicensed')}
            className="text-[11px] px-2.5 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 font-bold border border-purple-500/30 flex items-center gap-1 transition active:scale-95 shadow-xs shrink-0 tap-transparent cursor-pointer"
            title="Load Underfilled Potato Chips Pack (Violates First Schedule MPE)"
          >
            <Eye className="w-3.5 h-3.5 text-purple-400" />
            <span>Underfilled</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Scanner Viewfinder & Image Carousel */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="relative aspect-[4/3] w-full rounded-xl bg-slate-900 overflow-hidden border border-slate-800 flex items-center justify-center group shadow-inner">
            
            {/* Live Camera Stream View */}
            {isLiveCameraActive ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Visual Viewfinder Reticle */}
                <div className="absolute inset-6 sm:inset-8 border-2 border-dashed border-emerald-400/60 rounded-2xl pointer-events-none flex flex-col items-center justify-between p-3">
                  <div className="w-full flex justify-between">
                    <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                    <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                  </div>
                  <div className="flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-full border border-emerald-500/40 backdrop-blur-sm shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[10px] text-emerald-300 font-mono font-bold tracking-wider uppercase">
                      Rule 6 PDP Target Viewfinder
                    </span>
                  </div>
                  <div className="w-full flex justify-between">
                    <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                    <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                  </div>
                </div>

                {/* Snap & Cancel Controls */}
                <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3">
                  <button
                    onClick={captureCameraSnapshot}
                    className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/40 flex items-center gap-2 transition active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Snap Photo</span>
                  </button>
                  <button
                    onClick={stopLiveCamera}
                    className="px-4 py-2.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-medium text-xs transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : capturedImages.length > 0 ? (
              <>
                <img
                  src={capturedImages[0]}
                  alt="Packaging Target"
                  className="w-full h-full object-contain"
                />

                {/* Animated Radar Scanning Line during Evaluation */}
                {isAnalyzing && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] animate-bounce" />
                    <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px]" />
                  </div>
                )}

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() => setCapturedImages([])}
                    className="bg-black/70 hover:bg-black text-white px-2.5 py-1.5 rounded-lg text-xs backdrop-blur-sm transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Images</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 sm:p-6 text-center text-slate-400">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full max-w-sm sm:max-w-md mb-3.5">
                  <button
                    onClick={startLiveCamera}
                    className="py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-500/25 transition active:scale-95 tap-transparent cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-emerald-300" />
                    <span>Open Camera</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition active:scale-95 tap-transparent cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-brand-400" />
                    <span>Upload Image</span>
                  </button>
                  <button
                    onClick={() => docInputRef.current?.click()}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition active:scale-95 tap-transparent cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Upload Doc</span>
                  </button>
                </div>
                <span className="font-semibold text-xs text-slate-300">
                  Instant scanning with client-side image optimization
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 mt-1">
                  Supports Multi-Panel JPG, PNG, WEBP, and PDF label specifications
                </span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
            <input
              ref={docInputRef}
              type="file"
              accept=".pdf,.txt,image/*"
              className="hidden"
              onChange={handleDocUpload}
            />
          </div>

          {/* Thumbnails of multi-angle captured panels */}
          {capturedImages.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">Attached Panels:</span>
              {capturedImages.map((img, idx) => (
                <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 shrink-0">
                  <img src={img} alt={`Panel ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center font-bold">
                    P{idx + 1}
                  </span>
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-14 h-14 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-400 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 flex items-center justify-center transition shrink-0"
                title="Add Another Angle / Label"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Principal Display Panel (PDP) Area Slider */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-200">
                Principal Display Panel (PDP) Surface Area:
              </span>
              <span className="font-mono font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                {pdpArea} cm²
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="1500"
              step="10"
              value={pdpArea}
              onChange={(e) => setPdpArea(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-400 mt-1">
              <span>Small pouch (≤50 cm²)</span>
              <span>Medium box (100–500 cm²)</span>
              <span>Bulk pack (500–2500 cm²)</span>
            </div>
          </div>

        </div>

        {/* Right Column: Multimodal Inputs (Voice, Text, Documents, Barcode) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            {/* Live Voice-to-Text Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  <span>Voice Observation Dictation</span>
                </label>
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`text-xs px-2 py-1 rounded-md font-bold transition flex items-center gap-1 ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                  <span>{isRecording ? 'Stop Recording' : 'Dictate'}</span>
                </button>
              </div>
              <textarea
                rows={2}
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                placeholder={isRecording ? 'Listening in real-time... speak observations...' : 'Voice notes dictate here, or type observations...'}
                className={`w-full text-xs p-2.5 rounded-xl border focus:ring-2 focus:ring-brand-500 outline-none resize-none transition ${
                  isRecording 
                    ? 'border-rose-400 bg-rose-50/30 dark:bg-rose-950/30' 
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500'
                }`}
              />
            </div>

            {/* Product Text Description & Claims */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Product Declarations, Claims & Ingredients
              </label>
              <textarea
                rows={3}
                value={textDescription}
                onChange={(e) => setTextDescription(e.target.value)}
                placeholder="e.g. Brand Name, Net Qty 500g, MRP ₹ 95, Mfd 08/2026, Ingredients list, FSSAI lic 14 digits..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
              />
            </div>

            {/* Document Spec Text Preview if Uploaded */}
            {documentText && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-xs">
                <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300 text-[11px] mb-1">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Attached Spec Sheet
                  </span>
                  <button onClick={() => setDocumentText('')} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200">Clear</button>
                </div>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-300/90 line-clamp-2">{documentText}</p>
              </div>
            )}

            {/* Barcode / QR Code Quick Entry */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                EAN-13 Barcode / QR Code Payload (Optional)
              </label>
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="e.g. 8901030889123"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          {/* Action Trigger Button */}
          <div>
            <button
              onClick={handleRunAudit}
              disabled={isAnalyzing || (!capturedImages.length && !textDescription.trim() && !voiceText.trim())}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t('analyzingButton')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t('analyzeButton')}</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 text-center mt-2">
              Analyzes MRP, font heights, USP, Net Qty tolerances, FSSAI 14-digit license, allergens & claims.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
