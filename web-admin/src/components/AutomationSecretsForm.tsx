/**
 * web-admin/src/components/AutomationSecretsForm.tsx
 * 
 * Centralized control panel for data entry, status tracking, and automated
 * Libsodium encryption of 26 secrets and variables synchronized to GitHub API Endpoints.
 */

import React, { useState } from 'react';
import {
  Shield,
  Eye,
  EyeOff,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Send,
  Lock,
  Globe,
  Terminal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SecretDefinition, GROUP_META, SecretGroup } from '../../../src/lib/secrets-data.ts';

export interface AutomationSecretsFormProps {
  secrets: SecretDefinition[];
  onUpdateSecret: (id: string, newValue: string) => void;
  onSyncGitHub: () => void;
  syncing: boolean;
  syncLogs: Array<{ time: string; level: string; message: string }>;
  repository: string;
  setRepository: (repo: string) => void;
  className?: string;
}

export const AutomationSecretsForm: React.FC<AutomationSecretsFormProps> = ({
  secrets,
  onUpdateSecret,
  onSyncGitHub,
  syncing,
  syncLogs,
  repository,
  setRepository,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
  const [showLogsDrawer, setShowLogsDrawer] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCollapse = (grp: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [grp]: !prev[grp] }));
  };

  const filteredSecrets = secrets.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.subGroup && s.subGroup.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGroup = selectedGroup === 'ALL' || s.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const groups: SecretGroup[] = [
    'GROUP_1_SYSTEM_NETWORK',
    'GROUP_2_AUTOMATION_WEBHOOKS',
    'GROUP_3_MOBILE_SIGNING',
    'GROUP_4_DESKTOP_SIGNING',
  ];

  return (
    <div className={`space-y-6 font-sans ${className}`}>
      {/* Top Action Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Target GitHub Repo:</span>
            <input
              type="text"
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500 w-64"
              placeholder="owner/repo"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search 26 variables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48"
              />
            </div>

            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Groups ({secrets.length})</option>
              <option value="GROUP_1_SYSTEM_NETWORK">Group 1: System &amp; Network (3)</option>
              <option value="GROUP_2_AUTOMATION_WEBHOOKS">Group 2: Automation &amp; Webhooks (6)</option>
              <option value="GROUP_3_MOBILE_SIGNING">Group 3: Mobile Signing (16)</option>
              <option value="GROUP_4_DESKTOP_SIGNING">Group 4: Desktop Signing (2)</option>
            </select>
          </div>
        </div>

        {/* Sync Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLogsDrawer(!showLogsDrawer)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700"
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sync Logs ({syncLogs.length})</span>
          </button>

          <button
            onClick={onSyncGitHub}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-500 via-sky-600 to-blue-600 hover:brightness-110 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-60"
          >
            {syncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Encrypting via Libsodium &amp; Syncing...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Synchronize All 26 Variables to GitHub API</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sync Logs Drawer (when open) */}
      {showLogsDrawer && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl animate-fade-in space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Real-Time GitHub Actions API &amp; Libsodium Sealed-Box Terminal</span>
            </div>
            <button
              onClick={() => setShowLogsDrawer(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Hide Terminal
            </button>
          </div>
          <div className="bg-slate-900 rounded-xl p-3 font-mono text-[11px] max-h-60 overflow-y-auto space-y-1">
            {syncLogs.length === 0 ? (
              <p className="text-slate-500 italic">No sync transactions recorded yet. Click "Synchronize All 26 Variables".</p>
            ) : (
              syncLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-500 shrink-0 text-[10px]">
                    {new Date(log.time).toLocaleTimeString()}
                  </span>
                  <span
                    className={`font-semibold shrink-0 text-[10px] px-1 rounded ${
                      log.level === 'SUCCESS'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : log.level === 'WARN'
                        ? 'bg-amber-500/20 text-amber-400'
                        : log.level === 'DEBUG'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-sky-500/20 text-sky-400'
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="text-slate-200">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Group Sections */}
      <div className="space-y-6">
        {groups.map((grpKey) => {
          if (selectedGroup !== 'ALL' && selectedGroup !== grpKey) return null;

          const meta = GROUP_META[grpKey];
          const groupSecrets = filteredSecrets.filter((s) => s.group === grpKey);
          if (groupSecrets.length === 0 && searchQuery) return null;

          const isCollapsed = collapsedGroups[grpKey];

          return (
            <div key={grpKey} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              {/* Group Header */}
              <div
                onClick={() => toggleCollapse(grpKey)}
                className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      meta.color === 'emerald'
                        ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                        : meta.color === 'amber'
                        ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                        : meta.color === 'indigo'
                        ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50'
                        : 'bg-cyan-500 shadow-sm shadow-cyan-500/50'
                    }`}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{meta.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{meta.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {groupSecrets.length} items
                  </span>
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Group Items Table / List */}
              {!isCollapsed && (
                <div className="divide-y divide-slate-800/60">
                  {groupSecrets.map((s) => {
                    const isSecret = s.type === 'SECRET';
                    const isRevealed = revealedSecrets[s.id];

                    return (
                      <div key={s.id} className="p-4 hover:bg-slate-800/25 transition-colors space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`p-1 rounded ${
                                isSecret ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                              }`}
                            >
                              {isSecret ? <Lock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                            </span>
                            <span className="text-xs font-bold font-mono text-white">{s.name}</span>
                            {s.subGroup && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 font-medium">
                                {s.subGroup}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {s.synced ? (
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" />
                                Synchronized
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                                Pending Sync
                              </span>
                            )}

                            {isSecret && (
                              <button
                                onClick={() => toggleReveal(s.id)}
                                className="p-1 text-slate-400 hover:text-white transition-colors"
                                title={isRevealed ? 'Mask value' : 'Show value'}
                              >
                                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-400">{s.description}</p>

                        <div className="relative">
                          <input
                            type={isSecret && !isRevealed ? 'password' : 'text'}
                            value={s.value}
                            onChange={(e) => onUpdateSecret(s.id, e.target.value)}
                            placeholder={s.placeholder}
                            className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-xs font-mono transition-all focus:outline-none ${
                              isSecret
                                ? 'border-slate-800 text-amber-200 focus:border-amber-500/50'
                                : 'border-slate-800 text-emerald-200 focus:border-emerald-500/50'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AutomationSecretsForm;
