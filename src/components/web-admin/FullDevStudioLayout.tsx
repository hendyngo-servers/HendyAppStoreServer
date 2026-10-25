import React, { useState } from 'react';
import { SecretDefinition } from '../../lib/secrets-data.ts';
import { AutomationSecretsForm } from './AutomationSecretsForm.tsx';
import { CertUploadSecure } from './CertUploadSecure.tsx';
import { Shield, Key, Database, RefreshCw, Terminal, CheckCircle2, Lock, GitPullRequest } from 'lucide-react';

interface FullDevStudioLayoutProps {
  secrets: SecretDefinition[];
  onUpdateSecret: (id: string, newValue: string) => void;
  onSyncGitHub: () => void;
  syncing: boolean;
  syncLogs: Array<{ time: string; level: string; message: string }>;
  repository: string;
  setRepository: (repo: string) => void;
}

export const FullDevStudioLayout: React.FC<FullDevStudioLayoutProps> = ({
  secrets,
  onUpdateSecret,
  onSyncGitHub,
  syncing,
  syncLogs,
  repository,
  setRepository,
}) => {
  const [activePane, setActivePane] = useState<'variables' | 'cert-vault'>('variables');

  const secretCount = secrets.filter((s) => s.type === 'SECRET').length;
  const variableCount = secrets.filter((s) => s.type === 'VARIABLE').length;
  const syncedCount = secrets.filter((s) => s.synced).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Top Dev Studio Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Full Dev Studio &amp; Environment Sync Hub
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Web-Admin Core
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Centralized input &amp; automated Libsodium encryption for 26 security variables synchronized to GitHub API Endpoints.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Encrypted Secrets:</span>
            <strong className="text-white">{secretCount}</strong>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Public Vars:</span>
            <strong className="text-white">{variableCount}</strong>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">Synced:</span>
            <strong className="text-indigo-300">{syncedCount}/{secrets.length}</strong>
          </div>
        </div>
      </div>

      {/* Pane Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActivePane('variables')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activePane === 'variables'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>26 Secrets &amp; Variables Matrix</span>
        </button>

        <button
          onClick={() => setActivePane('cert-vault')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activePane === 'cert-vault'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>CertUploadSecure™ Base64 Vault</span>
        </button>
      </div>

      {/* Active Pane Rendering */}
      {activePane === 'variables' && (
        <AutomationSecretsForm
          secrets={secrets}
          onUpdateSecret={onUpdateSecret}
          onSyncGitHub={onSyncGitHub}
          syncing={syncing}
          syncLogs={syncLogs}
          repository={repository}
          setRepository={setRepository}
        />
      )}

      {activePane === 'cert-vault' && (
        <div className="space-y-6">
          <CertUploadSecure
            onApplyToBase64Secret={(id, val) => {
              onUpdateSecret(id, val);
            }}
          />
        </div>
      )}
    </div>
  );
};
