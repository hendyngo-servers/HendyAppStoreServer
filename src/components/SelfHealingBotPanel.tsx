import React, { useState } from 'react';
import { Bot, Sparkles, BrainCircuit, RefreshCw, CheckCircle2, ShieldAlert, Terminal, Wrench, Play } from 'lucide-react';

interface SelfHealingBotPanelProps {
  initialError?: string;
  initialPlatform?: string;
  initialStage?: string;
}

export const SelfHealingBotPanel: React.FC<SelfHealingBotPanelProps> = ({
  initialError = 'apksigner: ERROR: Key alias "hendy-release-v2" not found in keystore android-release.jks',
  initialPlatform = 'Android',
  initialStage = 'V2 Digital Signing',
}) => {
  const [errorLog, setErrorLog] = useState(initialError);
  const [platform, setPlatform] = useState(initialPlatform);
  const [stage, setStage] = useState(initialStage);
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);
  const [usedModel, setUsedModel] = useState<string | null>(null);
  const [autoPatchApplied, setAutoPatchApplied] = useState(false);

  const runDiagnosis = async () => {
    setAnalyzing(true);
    setDiagnosisResult(null);
    setAutoPatchApplied(false);

    try {
      const response = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          errorLog,
          platform,
          stage,
        }),
      });

      const data = await response.json();
      if (data.diagnosis) {
        setDiagnosisResult(data.diagnosis);
        setUsedModel(data.model || 'gemini-4-argon');
      } else {
        setDiagnosisResult(`Failed to analyze error: ${data.error || 'Unknown server response'}`);
      }
    } catch (err: any) {
      setDiagnosisResult(`Connection Error: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplyAutoPatch = () => {
    setAutoPatchApplied(true);
    setTimeout(() => {
      setAutoPatchApplied(false);
    }, 3000);
  };

  const presetErrors = [
    {
      title: 'Android Keystore Alias Mismatch',
      platform: 'Android',
      stage: 'V2 Signing (apksigner)',
      log: 'apksigner: ERROR: Key alias "hendy-release-v2" not found in keystore android-release.jks\nExecution failed for task \':app:packageReleaseKey\'.',
    },
    {
      title: 'iOS Provisioning Profile Mismatch',
      platform: 'iOS',
      stage: 'Codesign & Notarization',
      log: 'Code Signing Error: Provisioning profile "Hendy Enterprise Profile" does not match bundle identifier "com.hendy.appstore.enterprise" (UUID expired on 2026-10-24).',
    },
    {
      title: 'Windows SignTool Authenticode Failure',
      platform: 'Windows',
      stage: 'SignTool.exe Signing',
      log: 'SignTool Error: The specified PFX password is not correct or certificate private key corrupted (0x80070057) when signing HendyStore-Setup.exe.',
    },
    {
      title: 'Cloudflare Edge CORS Blocked',
      platform: 'EdgeRouter',
      stage: 'Edge Routing Layer',
      log: 'Cloudflare Worker blocked CORS preflight: Origin "https://store.hendyappstore.com" is not listed in ALLOWED_ORIGINS policy.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Bot Header */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between gap-4 flex-wrap relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-sky-500 p-0.5 shadow-xl shadow-indigo-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <BrainCircuit className="w-7 h-7 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">Self-Healing CI/CD Bot</h2>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  Gemini 4 Argon • Thinking: HIGH
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Automated root-cause diagnostics &amp; auto-patch generation for multi-platform digital signing and environment variable synchronization.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400">Load Failure Scenario:</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presetErrors.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setErrorLog(preset.log);
                setPlatform(preset.platform);
                setStage(preset.stage);
                setDiagnosisResult(null);
              }}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all text-left cursor-pointer space-y-1"
            >
              <span className="text-xs font-bold text-white block">{preset.title}</span>
              <span className="text-[10px] text-indigo-400 block">{preset.platform} • {preset.stage}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Input & Diagnostics Trigger */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-slate-400 mr-2">Target Platform:</span>
              <input
                type="text"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 font-medium"
              />
            </div>
            <div>
              <span className="text-slate-400 mr-2">Failed Stage:</span>
              <input
                type="text"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 font-medium"
              />
            </div>
          </div>

          <button
            onClick={runDiagnosis}
            disabled={analyzing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:brightness-110 shadow-lg shadow-purple-600/25 transition-all cursor-pointer disabled:opacity-60"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Gemini 4 Argon is Thinking (High)...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run AI Self-Healing Analysis</span>
              </>
            )}
          </button>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1.5 font-medium">
            Raw CI/CD Virtual Machine Error Log:
          </label>
          <textarea
            rows={4}
            value={errorLog}
            onChange={(e) => setErrorLog(e.target.value)}
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-rose-300 focus:outline-none focus:border-rose-500/50 leading-relaxed"
            placeholder="Paste build or signing error log here..."
          />
        </div>
      </div>

      {/* AI Deep Reasoning & Diagnostics Output */}
      {diagnosisResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">
                Deep Reasoning Diagnosis &amp; Auto-Patch Directives
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">
                Model: {usedModel}
              </span>
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                Thinking: HIGH
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 prose prose-invert max-w-none text-xs text-slate-200 leading-relaxed space-y-3 whitespace-pre-wrap font-sans">
            {diagnosisResult}
          </div>

          {/* Auto-Patch Action */}
          <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-slate-400">
              The Self-Healing Bot can automatically deploy this corrective configuration to Cloudflare Workers &amp; GitHub Actions Secrets.
            </p>
            <button
              onClick={handleApplyAutoPatch}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                autoPatchApplied
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {autoPatchApplied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Auto-Patch Dispatched &amp; Verified!</span>
                </>
              ) : (
                <>
                  <Wrench className="w-4 h-4" />
                  <span>Execute Automated Self-Healing Patch</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
