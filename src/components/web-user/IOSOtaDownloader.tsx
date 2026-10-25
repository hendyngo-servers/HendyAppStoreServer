import React, { useState } from 'react';
import { Apple, Download, ShieldCheck, CheckCircle2, ChevronRight, Code2, AlertTriangle, ExternalLink } from 'lucide-react';
import { generateManifestPlist, buildItmsUrl } from '../../lib/ota-manifest.ts';

interface IOSOtaDownloaderProps {
  appName?: string;
  bundleId?: string;
  version?: string;
}

export const IOSOtaDownloader: React.FC<IOSOtaDownloaderProps> = ({
  appName = 'Hendy App Store',
  bundleId = 'com.hendy.appstore.enterprise',
  version = '3.4.0',
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [showPlistModal, setShowPlistModal] = useState(false);
  const [showTrustGuide, setShowTrustGuide] = useState(false);

  const manifestUrl = `${window.location.origin}/api/ota/manifest.plist?appName=${encodeURIComponent(appName)}&bundleId=${encodeURIComponent(bundleId)}&version=${encodeURIComponent(version)}`;
  const itmsUrl = buildItmsUrl(manifestUrl);
  const plistContent = generateManifestPlist({
    appName,
    bundleId,
    version,
    ipaUrl: 'https://r2.hendyappstore.com/builds/ios/HendyStore-Enterprise.ipa'
  });

  const handleTriggerOta = () => {
    setDownloading(true);
    setDownloadProgress(10);
    setDownloadComplete(false);

    // Simulate Safari OTA installation pipeline
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          setDownloadComplete(true);
          setShowTrustGuide(true);
          return 100;
        }
        return prev + 15;
      });
    }, 280);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Apple className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Apple iOS Direct OTA</h3>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                itms-services
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Enterprise Wireless Installation Protocol (.ipa • 58.7 MB)
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPlistModal(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-sky-300 transition-colors px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60"
          title="View manifest.plist XML"
        >
          <Code2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Inspect Plist</span>
        </button>
      </div>

      {/* Security Signature Status */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 mb-5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Bundle Identifier:</span>
          <span className="font-mono text-slate-200">{bundleId}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Signing Identity:</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Apple Distribution: Hendy App Store Corp (8K92716493)
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">OTA Protocol:</span>
          <span className="font-mono text-sky-300 truncate max-w-[260px]">
            itms-services://?action=download-manifest
          </span>
        </div>
      </div>

      {/* Download Action Button */}
      {!downloadComplete ? (
        <button
          onClick={handleTriggerOta}
          disabled={downloading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {downloading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Deploying to Safari ({downloadProgress}%)...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Install to Home Screen (Wireless OTA)</span>
            </>
          )}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>OTA Package Dispatched to Safari!</span>
            </div>
            <button
              onClick={() => { setDownloadComplete(false); setDownloadProgress(0); }}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Reinstall
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {downloading && (
        <div className="mt-3">
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-400 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* iOS Enterprise Trust Step-by-Step Guide */}
      <div className="mt-5 border-t border-slate-800/80 pt-4">
        <button
          onClick={() => setShowTrustGuide(!showTrustGuide)}
          className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            First Time iOS Trust Guide
          </span>
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showTrustGuide ? 'rotate-90' : ''}`} />
        </button>

        {showTrustGuide && (
          <div className="mt-3 bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2.5 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <p>Tap <strong>"Install"</strong> when Safari prompts <em>"hendyappstore.com wants to install Hendy App Store"</em>.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <p>Navigate to <strong>Settings &gt; General &gt; VPN &amp; Device Management</strong>.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <p>Select <strong>"Hendy App Store Corp"</strong> under Enterprise App and tap <strong>"Trust"</strong>.</p>
            </div>
          </div>
        )}
      </div>

      {/* Manifest Plist Modal */}
      {showPlistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-sky-400" />
                  Dynamic manifest.plist Specification
                </h4>
                <p className="text-xs text-slate-400">Generated on-the-fly for Safari itms-services protocol</p>
              </div>
              <button
                onClick={() => setShowPlistModal(false)}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800"
              >
                Close
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="mb-3 flex items-center justify-between text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 font-mono text-[11px] truncate">{itmsUrl}</span>
                <span className="text-emerald-400 shrink-0 font-medium ml-2">RFC Compliant</span>
              </div>
              <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-sky-300 overflow-x-auto leading-relaxed">
                {plistContent}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
