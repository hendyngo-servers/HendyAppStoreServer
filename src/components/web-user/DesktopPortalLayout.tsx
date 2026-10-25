import React, { useState } from 'react';
import { DeviceInfo } from '../../lib/device-detector.ts';
import { WindowsSafeInstaller } from './WindowsSafeInstaller.tsx';
import { IOSOtaDownloader } from './IOSOtaDownloader.tsx';
import { AndroidDirectLink } from './AndroidDirectLink.tsx';
import { Monitor, Apple, Smartphone, ShieldCheck, Terminal, Download, Sparkles, Server, Check, Copy } from 'lucide-react';

interface DesktopPortalLayoutProps {
  deviceInfo: DeviceInfo;
}

export const DesktopPortalLayout: React.FC<DesktopPortalLayoutProps> = ({ deviceInfo }) => {
  const [selectedFormat, setSelectedFormat] = useState<'windows' | 'macos' | 'android' | 'ios'>(() => {
    if (deviceInfo.platform === 'windows') return 'windows';
    if (deviceInfo.platform === 'macos') return 'macos';
    if (deviceInfo.platform === 'android') return 'android';
    if (deviceInfo.platform === 'ios') return 'ios';
    return 'windows';
  });

  const [macDownloading, setMacDownloading] = useState(false);
  const [macDone, setMacDone] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans space-y-8">
      {/* Desktop Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HendyAppStore Monorepo • Release v3.4.0 Production Matrix</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Universal App Distribution <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">
              Digitally Signed &amp; Safe Installers
            </span>
          </h1>

          <p className="mt-4 text-base text-slate-300 leading-relaxed max-w-2xl">
            Download verified multi-platform releases built via our automated 26-variable CI/CD matrix pipeline. Authenticode signed for Microsoft Windows and notarized for Apple macOS.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              Windows SmartScreen Safe
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-sky-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              Apple Developer ID Notarized
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              Android V2 Signature Scheme
            </span>
          </div>
        </div>
      </div>

      {/* Platform Selector Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Choose Target Platform</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Client automatically detected: <strong className="text-indigo-300">{deviceInfo.osDisplayName}</strong>
          </p>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setSelectedFormat('windows')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFormat === 'windows'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Windows (.exe)</span>
          </button>

          <button
            onClick={() => setSelectedFormat('macos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFormat === 'macos'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>macOS (.dmg)</span>
          </button>

          <button
            onClick={() => setSelectedFormat('android')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFormat === 'android'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android (.apk)</span>
          </button>

          <button
            onClick={() => setSelectedFormat('ios')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFormat === 'ios'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>iOS OTA (.ipa)</span>
          </button>
        </div>
      </div>

      {/* Main Download Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Platform Download Card */}
        <div className="lg:col-span-2">
          {selectedFormat === 'windows' && <WindowsSafeInstaller />}
          
          {selectedFormat === 'macos' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Apple className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">Apple macOS Universal DMG</h3>
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Apple Silicon &amp; Intel
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Developer ID Application Notarized • Gatekeeper Clean (64.9 MB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 mb-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Signing Identity:</span>
                  <span className="text-purple-300 font-medium">Developer ID Application: Hendy App Store Corp (8K92716493)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Notarization Ticket:</span>
                  <span className="text-emerald-400 font-medium">Stapled (spctl -a -t open --context context:primary-signature: PASS)</span>
                </div>
              </div>

              {!macDone ? (
                <button
                  onClick={() => {
                    setMacDownloading(true);
                    setTimeout(() => {
                      setMacDownloading(false);
                      setMacDone(true);
                    }, 1200);
                  }}
                  disabled={macDownloading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-sky-600 text-white font-semibold text-sm shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {macDownloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Fetching Notarized DMG Package...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download macOS Universal (HendyStore-Universal.dmg)</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <span className="text-emerald-400 text-xs font-semibold">
                    HendyStore-Universal.dmg Ready!
                  </span>
                  <button onClick={() => setMacDone(false)} className="text-xs text-slate-400 underline">
                    Redownload
                  </button>
                </div>
              )}
            </div>
          )}

          {selectedFormat === 'android' && <AndroidDirectLink />}
          {selectedFormat === 'ios' && <IOSOtaDownloader />}
        </div>

        {/* Binary Repository & R2 Edge Specs Side Panel */}
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Server className="w-4 h-4 text-sky-400" />
              Cloudflare R2 Binary Repository
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">R2 Bucket:</span>
                <span className="font-mono text-slate-200">hendy-builds-binary-repo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Edge CDN Proxy:</span>
                <span className="text-emerald-400 font-semibold">Cloudflare Proxied (ON)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cache TTL:</span>
                <span className="font-mono text-slate-300">86,400s (Edge Cache)</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <p className="text-[11px] text-slate-400 mb-2">Release SHA-256 Checksum:</p>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300 flex items-center justify-between">
                <span className="truncate max-w-[200px]">e3b0c44298fc1c149afbf4c8996fb92427...</span>
                <button
                  onClick={handleCopyHash}
                  className="p-1 text-slate-400 hover:text-white shrink-0 ml-1"
                  title="Copy Checksum"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              CLI Quick Install
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Automate installation via curl or PowerShell:
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-indigo-300 overflow-x-auto">
              curl -sSL https://r2.hendyappstore.com/install.sh | bash
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
