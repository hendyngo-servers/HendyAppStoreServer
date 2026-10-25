import React, { useState } from 'react';
import { Play, RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert, Terminal, Layers, UploadCloud } from 'lucide-react';

interface MatrixBuildRunnerProps {
  onSendToSelfHealing?: (errorLog: string, platform: string, stage: string) => void;
}

export const MatrixBuildRunner: React.FC<MatrixBuildRunnerProps> = ({ onSendToSelfHealing }) => {
  const [running, setRunning] = useState(false);
  const [selectedRunner, setSelectedRunner] = useState<'all' | 'android' | 'apple' | 'windows'>('all');
  const [buildLogs, setBuildLogs] = useState<Array<{ time: string; runner: string; msg: string; status: 'info' | 'success' | 'warn' | 'error' }>>([]);
  const [buildStatus, setBuildStatus] = useState<'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [injectedFailure, setInjectedFailure] = useState<string>('NONE');

  const runBuild = (failureType: string = injectedFailure) => {
    setRunning(true);
    setBuildStatus('RUNNING');
    setBuildLogs([]);

    const steps = [
      { runner: 'INIT', msg: 'Dispatching GitHub Actions Matrix Workflow: matrix-build.yml', status: 'info', delay: 200 },
      { runner: 'INIT', msg: 'Loading 26 synchronized repository secrets and variables from GitHub cache...', status: 'info', delay: 400 },
      
      // Android Runner
      { runner: 'ubuntu-latest', msg: '[Android] Setting up JDK 17 (temurin)...', status: 'info', delay: 600 },
      { runner: 'ubuntu-latest', msg: '[Android] Decoding ANDROID_KEYSTORE_BASE64 to android-release.jks...', status: 'info', delay: 900 },
      { runner: 'ubuntu-latest', msg: '[Android] Compiling APK with ProGuard/R8 dead-code optimization...', status: 'info', delay: 1200 },
      ...(failureType === 'ANDROID_KEY_ALIAS_ERROR' ? [
        { runner: 'ubuntu-latest', msg: 'apksigner: ERROR: Key alias "hendy-release-v2" not found in keystore android-release.jks', status: 'error', delay: 1500 },
        { runner: 'ubuntu-latest', msg: 'Process completed with exit code 1. [Build Failed]', status: 'error', delay: 1700 }
      ] : [
        { runner: 'ubuntu-latest', msg: '[Android] apksigner sign --v2-signing-enabled true -> HendyStore-release-v2.apk signed!', status: 'success', delay: 1500 }
      ]),

      // Apple Runner
      { runner: 'macos-latest', msg: '[Apple] Setting up CI Keychain & decoding IOS_CERTIFICATE_P12_BASE64...', status: 'info', delay: 1800 },
      { runner: 'macos-latest', msg: '[Apple] Decoding embedded.mobileprovision from IOS_PROVISION_PROFILE_BASE64...', status: 'info', delay: 2100 },
      ...(failureType === 'IOS_PROVISIONING_ERROR' ? [
        { runner: 'macos-latest', msg: 'Code Signing Error: Provisioning profile "Hendy Enterprise" does not match bundle identifier "com.hendy.appstore.enterprise" (UUID expired)', status: 'error', delay: 2400 },
        { runner: 'macos-latest', msg: 'Process completed with exit code 65. [Build Failed]', status: 'error', delay: 2600 }
      ] : [
        { runner: 'macos-latest', msg: '[Apple] Codesign verified with identity: Apple Distribution: Hendy App Store Corp -> HendyStore-Enterprise.ipa', status: 'success', delay: 2400 },
        { runner: 'macos-latest', msg: '[Apple] Generated dynamic itms-services manifest.plist for wireless Safari installation', status: 'success', delay: 2600 }
      ]),

      // Windows Runner
      { runner: 'windows-latest', msg: '[Windows] Decoding Authenticode PFX Certificate with PowerShell...', status: 'info', delay: 2800 },
      ...(failureType === 'WINDOWS_PFX_PASSWORD_ERROR' ? [
        { runner: 'windows-latest', msg: 'SignTool Error: The specified PFX password is not correct or certificate private key corrupted (0x80070057)', status: 'error', delay: 3100 },
        { runner: 'windows-latest', msg: 'Process completed with exit code 1. [Build Failed]', status: 'error', delay: 3300 }
      ] : [
        { runner: 'windows-latest', msg: '[Windows] SignTool.exe /tr http://timestamp.digicert.com /td sha256 /fd sha256 HendyStore-Setup.exe', status: 'success', delay: 3100 },
        { runner: 'windows-latest', msg: '[Windows] Digital signature embedded. SmartScreen reputation threshold satisfied!', status: 'success', delay: 3300 }
      ]),

      // Deploy to R2
      ...(failureType === 'NONE' ? [
        { runner: 'R2-DEPLOY', msg: 'All 3 OS runners passed cleanly! Streaming final binaries to Cloudflare R2 bucket: hendy-builds-binary-repo...', status: 'success', delay: 3600 },
        { runner: 'R2-DEPLOY', msg: 'Artifacts published: .apk (34.2 MB), .ipa (58.7 MB), .exe (72.1 MB). CDN edge cache purged.', status: 'success', delay: 3900 }
      ] : [])
    ];

    let currentTimeout = 0;
    steps.forEach((step, index) => {
      setTimeout(() => {
        setBuildLogs((prev) => [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            runner: step.runner,
            msg: step.msg,
            status: step.status as any,
          },
        ]);

        if (index === steps.length - 1) {
          setRunning(false);
          const hasError = steps.some((s) => s.status === 'error');
          setBuildStatus(hasError ? 'FAILED' : 'SUCCESS');

          if (hasError && onSendToSelfHealing) {
            const errorStep = steps.find((s) => s.status === 'error');
            const platformName = errorStep?.runner === 'ubuntu-latest' ? 'Android' : errorStep?.runner === 'macos-latest' ? 'iOS' : 'Windows';
            onSendToSelfHealing(errorStep?.msg || 'Build failure occurred', platformName, 'Digital Signing Stage');
          }
        }
      }, step.delay);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 font-sans">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">GitHub Actions Matrix Build Runner</h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              matrix-build.yml
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Concurrent multi-OS isolated compilation runners (Ubuntu, macOS, Windows) consuming the 26 synchronized variables.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Inject Failure Scenario Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Simulate Scenario:</span>
            <select
              value={injectedFailure}
              onChange={(e) => setInjectedFailure(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="NONE">✅ Clean Successful Matrix Run</option>
              <option value="ANDROID_KEY_ALIAS_ERROR">⚠️ Android Keystore Alias Mismatch</option>
              <option value="IOS_PROVISIONING_ERROR">⚠️ iOS MobileProvision UUID Mismatch</option>
              <option value="WINDOWS_PFX_PASSWORD_ERROR">⚠️ Windows SignTool PFX Password Error</option>
            </select>
          </div>

          <button
            onClick={() => runBuild()}
            disabled={running}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
              running
                ? 'bg-slate-700 opacity-60 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 shadow-lg shadow-emerald-500/20'
            }`}
          >
            {running ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Executing Matrix Build...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Run Matrix Pipeline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Runner Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-white">Runner 1: ubuntu-latest</span>
            <span className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full font-mono">
              Android V2 APK
            </span>
          </div>
          <p className="text-xs text-slate-400">
            apksigner V2 scheme with <code className="text-slate-300">ANDROID_KEY_ALIAS</code> &amp; ProGuard R8
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-white">Runner 2: macos-latest</span>
            <span className="text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full font-mono">
              Apple Codesign &amp; OTA
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Distribution .p12 unlock &amp; dynamic <code className="text-slate-300">manifest.plist</code> for Safari
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-white">Runner 3: windows-latest</span>
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full font-mono">
              SignTool Authenticode
            </span>
          </div>
          <p className="text-xs text-slate-400">
            DigiCert RFC3161 SHA-256 timestamping for SmartScreen safe exe
          </p>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs font-mono text-slate-400 ml-2">matrix-runner-console.log</span>
          </div>

          <div className="flex items-center gap-2">
            {buildStatus === 'RUNNING' && (
              <span className="text-xs text-amber-400 font-semibold animate-pulse">Running Matrix Jobs...</span>
            )}
            {buildStatus === 'SUCCESS' && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Build Passed &amp; Published to R2
              </span>
            )}
            {buildStatus === 'FAILED' && (
              <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Build Failed (Self-Healing Diagnosis Ready)
              </span>
            )}
          </div>
        </div>

        <div className="p-4 font-mono text-xs max-h-96 overflow-y-auto space-y-1.5 bg-slate-950">
          {buildLogs.length === 0 ? (
            <p className="text-slate-600 italic">No matrix build logs. Click "Run Matrix Pipeline".</p>
          ) : (
            buildLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-slate-500 shrink-0 text-[11px]">{log.time}</span>
                <span className="text-indigo-400 shrink-0 font-bold text-[11px]">[{log.runner}]</span>
                <span
                  className={
                    log.status === 'error'
                      ? 'text-rose-400 font-bold'
                      : log.status === 'success'
                      ? 'text-emerald-400'
                      : log.status === 'warn'
                      ? 'text-amber-400'
                      : 'text-slate-300'
                  }
                >
                  {log.msg}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
