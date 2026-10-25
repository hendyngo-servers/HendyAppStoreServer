import React, { useState } from 'react';
import { Layers, ArrowRight, Shield, Globe, Cpu, Server, Terminal, Lock, HardDrive, CheckCircle2 } from 'lucide-react';

export const TotalArchitectureMap: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>('edge-router');

  const nodesInfo: Record<string, { title: string; layer: string; details: string; codeSnippet: string }> = {
    'admin-panel': {
      title: 'WEB-ADMIN (Admin Panel)',
      layer: 'ADMIN MANAGEMENT LAYER',
      details: 'Centralized input and validation for all 26 environment variables and signing secrets. Supports Mobile CMS Pocket for mobile approval and Full Dev Studio for desktop configuration.',
      codeSnippet: `// Synchronize 26 variables to GitHub API\nawait fetch('/api/variables/sync', {\n  method: 'POST',\n  body: JSON.stringify({ repository, variables })\n});`
    },
    'edge-router': {
      title: 'CF WORKER: EDGE ROUTER',
      layer: 'EDGE ROUTING LAYER',
      details: 'Cloudflare Edge Worker running at nearest edge location. Evaluates incoming User-Agent & Hostname. Injects X-Target-App and X-Target-Layout headers to serve mobile vertical store or desktop portal.',
      codeSnippet: `// workers/edge-router/src/index.js\nconst isMobile = /iphone|ipad|android/i.test(userAgent);\nconst targetLayout = isMobile ? 'MobileAppStoreLayout' : 'DesktopPortalLayout';`
    },
    'r2-storage': {
      title: 'CLOUDFLARE R2 STORAGE',
      layer: 'EDGE ROUTING & BINARY REPO',
      details: 'Zero egress fee object storage hosting original digitally signed release binaries: .apk (V2 signed), .ipa (Enterprise OTA), .exe (Authenticode), and .dmg (Notarized).',
      codeSnippet: `[[r2_buckets]]\nbinding = "BINARY_REPO"\nbucket_name = "hendy-builds-binary-repo"`
    },
    'backend-api': {
      title: 'WORKERS / BACKEND-API',
      layer: 'CORE API & SYNC LAYER',
      details: 'Receives strings and certificate files from Web-Admin, retrieves repository public key from GitHub API, performs Libsodium crypto_box_seal encryption, and dispatches to GitHub Actions Secrets.',
      codeSnippet: `// workers/backend-api/src/index.js\nconst sealedCipher = sodium.crypto_box_seal(secretVal, repoPubKey);\nawait octokit.rest.actions.createOrUpdateRepoSecret({\n  encrypted_value: sealedCipher\n});`
    },
    'github-secrets': {
      title: 'GITHUB SECRETS & REPO VARS',
      layer: 'CORE API & SYNC LAYER',
      details: 'GitHub Actions repository cache storing project-wide encrypted credentials and public variables. Injected on-demand into isolated runner virtual machines.',
      codeSnippet: `env:\n  CF_ACCESS_AUD: \${{ vars.CF_ACCESS_AUD }}\n  ANDROID_KEYSTORE_BASE64: \${{ secrets.ANDROID_KEYSTORE_BASE64 }}`
    },
    'matrix-runners': {
      title: 'GITHUB ACTIONS BUILD MATRIX',
      layer: 'COMPILATION & PUBLISHING MATRIX LAYER',
      details: 'Isolated runners executing concurrently: ubuntu-latest (Android apksigner V2 scheme), macos-latest (Apple codesign & itms-services manifest), windows-latest (Microsoft SignTool.exe).',
      codeSnippet: `jobs:\n  build-android: runs-on: ubuntu-latest\n  build-apple: runs-on: macos-latest\n  build-windows: runs-on: windows-latest`
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
          Complete System Architecture Map
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          Adaptive UI Core &amp; Automation Environment Sync Pipeline
        </h2>
        <p className="text-xs md:text-sm text-slate-400">
          Interactive visualization of the 4 synchronized architectural layers: Admin Management, Edge Routing, Core API &amp; Sync, and Compilation Matrix.
        </p>
      </div>

      {/* 4 Layers Diagram Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Layer 1: Admin */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <Shield className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Layer 1: Admin</h4>
            </div>
            <p className="text-[11px] text-slate-400">Variable Configuration &amp; Sync Management</p>
          </div>

          <button
            onClick={() => setSelectedNode('admin-panel')}
            className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedNode === 'admin-panel'
                ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/20'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
              <span>WEB-ADMIN</span>
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-[10px] text-slate-400">26 Secrets &amp; Variables</p>
            <p className="text-[10px] text-emerald-400 mt-1">Live Sync Logs</p>
          </button>
        </div>

        {/* Layer 2: Edge Routing */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-sky-400">
              <Globe className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Layer 2: Edge</h4>
            </div>
            <p className="text-[11px] text-slate-400">Cloudflare Edge Router Engine</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setSelectedNode('edge-router')}
              className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedNode === 'edge-router'
                  ? 'bg-sky-600/20 border-sky-500 shadow-md shadow-sky-500/20'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-white mb-0.5">
                <span>CF EDGE ROUTER</span>
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <p className="text-[10px] text-slate-400">User-Agent Dynamic Layouts</p>
            </button>

            <button
              onClick={() => setSelectedNode('r2-storage')}
              className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedNode === 'r2-storage'
                  ? 'bg-sky-600/20 border-sky-500 shadow-md shadow-sky-500/20'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-white mb-0.5">
                <span>CLOUDFLARE R2</span>
                <HardDrive className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <p className="text-[10px] text-slate-400">Original Binary Repository</p>
            </button>
          </div>
        </div>

        {/* Layer 3: Core API & Sync */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-purple-400">
              <Server className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Layer 3: Core API</h4>
            </div>
            <p className="text-[11px] text-slate-400">GitHub API Operations Engine</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setSelectedNode('backend-api')}
              className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedNode === 'backend-api'
                  ? 'bg-purple-600/20 border-purple-500 shadow-md shadow-purple-500/20'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-white mb-0.5">
                <span>WORKERS/BACKEND-API</span>
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className="text-[10px] text-slate-400">Sodium Public-Key Cipher</p>
            </button>

            <button
              onClick={() => setSelectedNode('github-secrets')}
              className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedNode === 'github-secrets'
                  ? 'bg-purple-600/20 border-purple-500 shadow-md shadow-purple-500/20'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-white mb-0.5">
                <span>GITHUB SECRETS &amp; VARS</span>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[10px] text-slate-400">Project-Wide Environment</p>
            </button>
          </div>
        </div>

        {/* Layer 4: Compilation Matrix */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Layers className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Layer 4: Matrix</h4>
            </div>
            <p className="text-[11px] text-slate-400">GitHub Actions Build Runners</p>
          </div>

          <button
            onClick={() => setSelectedNode('matrix-runners')}
            className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedNode === 'matrix-runners'
                ? 'bg-emerald-600/20 border-emerald-500 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
              <span>MATRIX AGENTS</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-[10px] text-slate-400">Android V2 • iOS P12 • SignTool</p>
            <p className="text-[10px] text-sky-400 mt-1">Direct upload to R2 Bucket</p>
          </button>
        </div>
      </div>

      {/* Detailed Node Inspector Box */}
      {selectedNode && nodesInfo[selectedNode] && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                {nodesInfo[selectedNode].layer}
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {nodesInfo[selectedNode].title}
              </h3>
            </div>
            <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
              Active Production Node
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {nodesInfo[selectedNode].details}
          </p>

          <div>
            <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Reference Implementation Logic</span>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-indigo-300 overflow-x-auto leading-relaxed">
              {nodesInfo[selectedNode].codeSnippet}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
