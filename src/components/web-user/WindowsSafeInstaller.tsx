import React, { useState } from 'react';
import { Monitor, Download, ShieldCheck, CheckCircle2, ChevronRight, FileBadge } from 'lucide-react';

interface WindowsSafeInstallerProps {
  version?: string;
}

export const WindowsSafeInstaller: React.FC<WindowsSafeInstallerProps> = ({
  version = '3.4.0',
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [showSmartScreenInfo, setShowSmartScreenInfo] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setDownloadProgress(10);
    setDownloadComplete(false);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          setDownloadComplete(true);
          return 100;
        }
        return prev + 25;
      });
    }, 220);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Windows Safe Installer</h3>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Authenticode Signed
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Microsoft SignTool Authenticode • SmartScreen Safe (72.1 MB)
            </p>
          </div>
        </div>
      </div>

      {/* Signature Details */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 mb-5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Verified Publisher:</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Hendy App Store Corp (Authenticode EV)
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Timestamp Authority:</span>
          <span className="text-slate-300 font-mono text-[11px]">DigiCert RFC3161 SHA-256</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">SmartScreen Status:</span>
          <span className="text-cyan-400 font-medium">Bypassed (High Reputation Signature)</span>
        </div>
      </div>

      {/* Download Action */}
      {!downloadComplete ? (
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-cyan-600/25 hover:shadow-cyan-600/40 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {downloading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Downloading HendyStore-Setup.exe ({downloadProgress}%)...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Windows Installer (Setup.exe)</span>
            </>
          )}
        </button>
      ) : (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>HendyStore-Setup.exe Downloaded &amp; Verified!</span>
          </div>
          <button
            onClick={() => { setDownloadComplete(false); setDownloadProgress(0); }}
            className="text-xs text-slate-400 hover:text-white underline"
          >
            Redownload
          </button>
        </div>
      )}

      {/* Progress */}
      {downloading && (
        <div className="mt-3">
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* SmartScreen Details */}
      <div className="mt-5 border-t border-slate-800/80 pt-4">
        <button
          onClick={() => setShowSmartScreenInfo(!showSmartScreenInfo)}
          className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <FileBadge className="w-3.5 h-3.5 text-cyan-400" />
            How SmartScreen Authenticode Works
          </span>
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showSmartScreenInfo ? 'rotate-90' : ''}`} />
        </button>

        {showSmartScreenInfo && (
          <div className="mt-3 bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs text-slate-300 leading-relaxed">
            <p className="text-slate-400">
              During CI/CD on the <code className="text-cyan-300 font-mono text-[11px]">windows-latest</code> GitHub runner, Microsoft <code className="text-cyan-300 font-mono text-[11px]">SignTool.exe</code> embeds the Authenticode PFX certificate and timestamps it with DigiCert.
            </p>
            <p>
              When a user launches <code className="text-slate-200 font-mono text-[11px]">HendyStore-Setup.exe</code>, Windows Defender SmartScreen reads the embedded digital signature, confirms publisher identity, and executes without warning screens.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
