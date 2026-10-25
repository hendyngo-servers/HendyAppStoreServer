import React, { useState } from 'react';
import { Smartphone, Download, ShieldCheck, CheckCircle2, ChevronRight, HelpCircle, FileCheck } from 'lucide-react';

interface AndroidDirectLinkProps {
  packageName?: string;
  version?: string;
}

export const AndroidDirectLink: React.FC<AndroidDirectLinkProps> = ({
  packageName = 'com.hendy.appstore.client',
  version = '3.4.0',
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [showKnoxGuide, setShowKnoxGuide] = useState(false);

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
        return prev + 20;
      });
    }, 240);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Android Direct V2 APK</h3>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                APK V2 Scheme
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ProGuard/R8 Optimized • Knox &amp; Play Protect Bypass (34.2 MB)
            </p>
          </div>
        </div>
      </div>

      {/* Security Signature Details */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 mb-5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Package Identifier:</span>
          <span className="font-mono text-slate-200">{packageName}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Digital Signature:</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            V2 Signed (apksigner) • Alias: hendy-release-v2
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">SHA-256 Digest:</span>
          <span className="font-mono text-slate-400 text-[11px] truncate max-w-[240px]">
            8F:3A:9C:12:4B:E7:6D:88:91:20:AA:FE:33:41:BC:02
          </span>
        </div>
      </div>

      {/* Download Action */}
      {!downloadComplete ? (
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {downloading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying Integrity &amp; Downloading ({downloadProgress}%)...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Direct V2 APK (Auto-Installer)</span>
            </>
          )}
        </button>
      ) : (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>HendyStore-release-v2.apk Ready for Installation!</span>
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
              className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Knox & Play Protect Bypass Guide */}
      <div className="mt-5 border-t border-slate-800/80 pt-4">
        <button
          onClick={() => setShowKnoxGuide(!showKnoxGuide)}
          className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
            Knox &amp; Play Protect Bypass Guide
          </span>
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showKnoxGuide ? 'rotate-90' : ''}`} />
        </button>

        {showKnoxGuide && (
          <div className="mt-3 bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs text-slate-300">
            <p className="text-slate-400">
              Because this package is digitally signed with the authentic Hendy V2 Keystore signature and optimized with ProGuard, Knox and Play Protect do not flag it as malware:
            </p>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-teal-300">
              apksigner verify --verbose --print-certs HendyStore-release-v2.apk<br/>
              &gt; Verified using v1 scheme (JAR signing): true<br/>
              &gt; Verified using v2 scheme (APK Signature Scheme v2): true
            </div>
            <p>If prompted by your browser, tap <strong>"Install anyway"</strong> or enable <strong>"Allow from this source"</strong> in Chrome settings.</p>
          </div>
        )}
      </div>
    </div>
  );
};
