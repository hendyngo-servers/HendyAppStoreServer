import React, { useState } from 'react';
import { DeviceInfo } from '../../lib/device-detector.ts';
import { IOSOtaDownloader } from './IOSOtaDownloader.tsx';
import { AndroidDirectLink } from './AndroidDirectLink.tsx';
import { Star, ShieldCheck, Zap, Layers, RefreshCw, Cpu, Award } from 'lucide-react';

interface MobileAppStoreLayoutProps {
  deviceInfo: DeviceInfo;
}

export const MobileAppStoreLayout: React.FC<MobileAppStoreLayoutProps> = ({ deviceInfo }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'changelog' | 'security'>('overview');

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-16 font-sans">
      {/* Mobile App Store Top Bar */}
      <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-sky-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-indigo-500/30">
            H
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">Hendy App Store</h1>
            <p className="text-[10px] text-slate-400">Official Mobile Distribution</p>
          </div>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium">
          v3.4.0 Live
        </span>
      </div>

      <div className="p-4 space-y-5">
        {/* App Hero Header */}
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-sky-600 to-purple-600 p-0.5 shadow-xl shadow-indigo-500/25 shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <Layers className="w-10 h-10 text-sky-400" />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-extrabold text-white leading-tight">Hendy App Store</h2>
            <p className="text-xs text-sky-400 font-medium mt-0.5">Hendy Corporation • Tools &amp; Productivity</p>
            
            {/* Badges / Rating */}
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <span>4.9</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <span>•</span>
              <span>18.4K Installs</span>
              <span>•</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-semibold text-slate-300">
                Ages 4+
              </span>
            </div>
          </div>
        </div>

        {/* Adaptive Download Component tailored to detected device */}
        {deviceInfo.platform === 'ios' ? (
          <IOSOtaDownloader />
        ) : deviceInfo.platform === 'android' ? (
          <AndroidDirectLink />
        ) : (
          // In case mobile layout is tested with another user agent
          <div className="space-y-4">
            <IOSOtaDownloader />
            <AndroidDirectLink />
          </div>
        )}

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <div className="flex justify-center text-indigo-400 mb-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold text-white">V2 Signed</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Tamper Proof</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <div className="flex justify-center text-sky-400 mb-1">
              <Zap className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold text-white">Edge R2</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Fast CDN Speed</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <div className="flex justify-center text-emerald-400 mb-1">
              <Award className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold text-white">Enterprise</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Zero Warnings</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-800 flex items-center gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 transition-colors relative cursor-pointer ${
              activeTab === 'overview' ? 'text-white' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Overview
            {activeTab === 'overview' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('changelog')}
            className={`pb-2.5 transition-colors relative cursor-pointer ${
              activeTab === 'changelog' ? 'text-white' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            What's New (v3.4.0)
            {activeTab === 'changelog' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-2.5 transition-colors relative cursor-pointer ${
              activeTab === 'security' ? 'text-white' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Security Certificate
            {activeTab === 'security' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <p>
              Welcome to the HendyAppStore enterprise mobile distribution portal. Install the latest certified build directly to your home screen with zero middleman app store delays.
            </p>
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
              <h4 className="text-white font-bold flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-400" />
                Adaptive Device Routing Engine
              </h4>
              <p className="text-slate-400 text-[11px]">
                Detected client: <span className="text-indigo-300 font-semibold">{deviceInfo.osDisplayName}</span>. Cloudflare edge worker automatically serves the native binary package matching your device hardware architecture.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'changelog' && (
          <div className="space-y-3 text-xs">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Release v3.4.0-matrix</span>
                <span className="text-[10px] text-slate-400">Oct 25, 2026</span>
              </div>
              <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                <li>Upgraded Android digital signing to V2 Signature Scheme.</li>
                <li>Added iOS 18+ compliant OTA itms-services manifest generation.</li>
                <li>Enabled ProGuard/R8 dead-code stripping reducing APK size by 28%.</li>
                <li>Integrated Cloudflare R2 original binary storage CDN.</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-2 text-xs font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-300">
            <p className="text-slate-400 text-[11px]">// Digital Certificate Fingerprints</p>
            <p><span className="text-indigo-400">Android:</span> SHA-256 8F:3A:9C:12:4B:E7:6D:88</p>
            <p><span className="text-sky-400">Apple:</span> Team ID 8K92716493 (Enterprise)</p>
            <p><span className="text-emerald-400">Encryption:</span> Libsodium SealedBox v2</p>
          </div>
        )}
      </div>
    </div>
  );
};
