/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useDeviceDetect } from './components/web-user/useDeviceDetect.ts';
import { MobileAppStoreLayout } from './components/web-user/MobileAppStoreLayout.tsx';
import { DesktopPortalLayout } from './components/web-user/DesktopPortalLayout.tsx';
import { FullDevStudioLayout } from './components/web-admin/FullDevStudioLayout.tsx';
import { MobileCMSPocketLayout } from './components/web-admin/MobileCMSPocketLayout.tsx';
import { TotalArchitectureMap } from './components/TotalArchitectureMap.tsx';
import { MatrixBuildRunner } from './components/MatrixBuildRunner.tsx';
import { SelfHealingBotPanel } from './components/SelfHealingBotPanel.tsx';
import { MonorepoExplorer } from './components/MonorepoExplorer.tsx';
import { OneClickDeployModal } from './components/OneClickDeployModal.tsx';
import { INITIAL_SECRETS_DATA, SecretDefinition } from './lib/secrets-data.ts';
import { translations, Language } from './lib/i18n.ts';
import {
  Layers,
  Shield,
  Smartphone,
  Play,
  BrainCircuit,
  FolderTree,
  Monitor,
  Apple,
  RotateCcw,
  Sparkles,
  Server,
  Lock,
  Globe,
  Radio,
  Rocket,
  Languages,
} from 'lucide-react';

export default function App() {
  const { deviceInfo, simulatedPlatform, setSimulatedPlatform, resetToRealDevice } = useDeviceDetect();

  const [activeTab, setActiveTab] = useState<'architecture' | 'web-admin' | 'web-user' | 'matrix-build' | 'self-healing' | 'monorepo'>('architecture');
  const [secrets, setSecrets] = useState<SecretDefinition[]>(INITIAL_SECRETS_DATA);
  const [repository, setRepository] = useState<string>('hendy-org/HendyAppStore');
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncLogs, setSyncLogs] = useState<Array<{ time: string; level: string; message: string }>>([
    {
      time: new Date().toISOString(),
      level: 'INFO',
      message: '[INIT] HendyAppStore Environment Pipeline initialized with 26+ core variables.',
    },
    {
      time: new Date().toISOString(),
      level: 'SUCCESS',
      message: '[READY] Libsodium public key encryption & GitHub Actions matrix runners connected.',
    },
  ]);

  // Context passing for Self-Healing Bot
  const [selfHealingContext, setSelfHealingContext] = useState<{
    errorLog: string;
    platform: string;
    stage: string;
  }>({
    errorLog: 'apksigner: ERROR: Key alias "hendy-release-v2" not found in keystore android-release.jks',
    platform: 'Android',
    stage: 'V2 Digital Signing',
  });

  const [lang, setLang] = useState<Language>('vi');
  const t = translations[lang];

  const [showDeployModal, setShowDeployModal] = useState(false);

  // Fetch initial variables from server if available
  useEffect(() => {
    fetch('/api/variables')
      .then((res) => res.json())
      .then((data) => {
        if (data.variables && Array.isArray(data.variables) && data.variables.length > 0) {
          setSecrets(data.variables);
        }
      })
      .catch(() => {
        // Fall back to default INITIAL_SECRETS_DATA
      });
  }, []);

  const handleUpdateSecret = (id: string, newValue: string) => {
    setSecrets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value: newValue, synced: false } : s))
    );
  };

  const handleSyncGitHub = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/variables/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repository,
          variables: secrets,
        }),
      });
      const data = await response.json();
      if (data.logs) {
        setSyncLogs(data.logs);
      }
      if (data.variables) {
        setSecrets(data.variables);
      }
    } catch (err: any) {
      setSyncLogs((prev) => [
        ...prev,
        {
          time: new Date().toISOString(),
          level: 'ERROR',
          message: `[FAIL] Synchronization request error: ${err.message}`,
        },
      ]);
    } finally {
      setSyncing(false);
    }
  };

  const handleTriggerSelfHealingFromBuild = (errorLog: string, platform: string, stage: string) => {
    setSelfHealingContext({ errorLog, platform, stage });
    setActiveTab('self-healing');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top System Status & Topology Banner */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          {/* Brand & Active Stack */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-sky-500 to-purple-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-indigo-500/25">
              H
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white tracking-tight text-sm md:text-base">
                  HendyAppStore
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {t.proxyOn}
                </span>
                <span className="hidden md:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {t.r2Cdn}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                {t.brandSub}
              </p>
            </div>
          </div>

          {/* Controls: Language Switcher, Viewport Simulator, One-Click Deploy */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:border-indigo-500 transition-all cursor-pointer shadow-sm"
              title="Chuyển đổi Ngôn ngữ (Tiếng Việt / English)"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇺🇸 English'}</span>
            </button>

            {/* Device Detection Simulator Widget */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 font-medium px-2 hidden sm:inline">
                {t.viewport}
              </span>

              <button
                onClick={() => resetToRealDevice()}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  simulatedPlatform === null
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Real Browser User Agent"
              >
                {t.auto} ({deviceInfo.platform.toUpperCase()})
              </button>

              <button
                onClick={() => setSimulatedPlatform('ios')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  simulatedPlatform === 'ios'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Simulate iPhone (iOS Safari OTA)"
              >
                <Apple className="w-3 h-3" />
                <span>iOS</span>
              </button>

              <button
                onClick={() => setSimulatedPlatform('android')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  simulatedPlatform === 'android'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Simulate Samsung Galaxy (Android V2 APK)"
              >
                <Smartphone className="w-3 h-3" />
                <span>Android</span>
              </button>

              <button
                onClick={() => setSimulatedPlatform('windows')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  simulatedPlatform === 'windows'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Simulate Windows 11 PC (Authenticode EXE)"
              >
                <Monitor className="w-3 h-3" />
                <span>Windows</span>
              </button>
            </div>

            {/* One-Click Deploy Action Button */}
            <button
              onClick={() => setShowDeployModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-600 hover:brightness-110 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              title="Deploy to Cloudflare Pages & Shareable URL"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>{t.deployAndShare}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-300" />
            <span>{t.tabArchitecture}</span>
          </button>

          <button
            onClick={() => setActiveTab('web-admin')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'web-admin'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.tabAdmin}</span>
          </button>

          <button
            onClick={() => setActiveTab('web-user')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'web-user'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t.tabUser}</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix-build')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'matrix-build'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-sky-300" />
            <span>{t.tabMatrix}</span>
          </button>

          <button
            onClick={() => setActiveTab('self-healing')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'self-healing'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-purple-300" />
            <span>{t.tabSelfHealing}</span>
          </button>

          <button
            onClick={() => setActiveTab('monorepo')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'monorepo'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5 text-indigo-300" />
            <span>{t.tabMonorepo}</span>
          </button>
        </div>
      </header>

      {/* Main App Content Body */}
      <main className="flex-1 py-4">
        {activeTab === 'architecture' && <TotalArchitectureMap />}

        {activeTab === 'web-admin' && (
          <div>
            {deviceInfo.recommendedLayout === 'mobile' ? (
              <MobileCMSPocketLayout
                secrets={secrets}
                onUpdateSecret={handleUpdateSecret}
                onSyncGitHub={handleSyncGitHub}
                syncing={syncing}
                syncLogs={syncLogs}
                repository={repository}
              />
            ) : (
              <FullDevStudioLayout
                secrets={secrets}
                onUpdateSecret={handleUpdateSecret}
                onSyncGitHub={handleSyncGitHub}
                syncing={syncing}
                syncLogs={syncLogs}
                repository={repository}
                setRepository={setRepository}
              />
            )}
          </div>
        )}

        {activeTab === 'web-user' && (
          <div>
            {deviceInfo.recommendedLayout === 'mobile' ? (
              <MobileAppStoreLayout deviceInfo={deviceInfo} />
            ) : (
              <DesktopPortalLayout deviceInfo={deviceInfo} />
            )}
          </div>
        )}

        {activeTab === 'matrix-build' && (
          <MatrixBuildRunner onSendToSelfHealing={handleTriggerSelfHealingFromBuild} />
        )}

        {activeTab === 'self-healing' && (
          <SelfHealingBotPanel
            initialError={selfHealingContext.errorLog}
            initialPlatform={selfHealingContext.platform}
            initialStage={selfHealingContext.stage}
          />
        )}

        {activeTab === 'monorepo' && <MonorepoExplorer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4 text-[11px]">
          <div className="flex items-center gap-2 text-slate-400">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{t.networkActive}</span>
          </div>
          <p>{t.footerCopyright}</p>
        </div>
      </footer>

      {/* One-Click Production Deployment Modal */}
      <OneClickDeployModal
        isOpen={showDeployModal}
        onClose={() => setShowDeployModal(false)}
      />
    </div>
  );
}
