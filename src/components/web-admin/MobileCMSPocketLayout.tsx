import React, { useState } from 'react';
import { SecretDefinition } from '../../lib/secrets-data.ts';
import { CertUploadSecure } from './CertUploadSecure.tsx';
import { ShieldCheck, Send, CheckCircle2, RefreshCw, Terminal, Lock, Globe, AlertTriangle } from 'lucide-react';

interface MobileCMSPocketLayoutProps {
  secrets: SecretDefinition[];
  onUpdateSecret: (id: string, newValue: string) => void;
  onSyncGitHub: () => void;
  syncing: boolean;
  syncLogs: Array<{ time: string; level: string; message: string }>;
  repository: string;
}

export const MobileCMSPocketLayout: React.FC<MobileCMSPocketLayoutProps> = ({
  secrets,
  onUpdateSecret,
  onSyncGitHub,
  syncing,
  syncLogs,
  repository,
}) => {
  const [activeTab, setActiveTab] = useState<'variables' | 'certificates' | 'logs'>('variables');
  const [filterType, setFilterType] = useState<'ALL' | 'SECRETS' | 'VARIABLES'>('ALL');

  const filtered = secrets.filter((s) => {
    if (filterType === 'SECRETS') return s.type === 'SECRET';
    if (filterType === 'VARIABLES') return s.type === 'VARIABLE';
    return true;
  });

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-16 font-sans">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
            CMS
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">Mobile CMS Pocket</h1>
            <p className="text-[10px] text-slate-400 font-mono truncate max-w-[170px]">{repository}</p>
          </div>
        </div>

        <button
          onClick={onSyncGitHub}
          disabled={syncing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md cursor-pointer disabled:opacity-50"
        >
          {syncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
          <span>{syncing ? 'Syncing...' : 'Sync'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 bg-slate-900 border-b border-slate-800 text-xs font-semibold text-center">
        <button
          onClick={() => setActiveTab('variables')}
          className={`py-2.5 transition-colors cursor-pointer ${
            activeTab === 'variables' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/40' : 'text-slate-400'
          }`}
        >
          Variables ({secrets.length})
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`py-2.5 transition-colors cursor-pointer ${
            activeTab === 'certificates' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/40' : 'text-slate-400'
          }`}
        >
          Cert Upload
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`py-2.5 transition-colors cursor-pointer ${
            activeTab === 'logs' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/40' : 'text-slate-400'
          }`}
        >
          Logs ({syncLogs.length})
        </button>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'variables' && (
          <div className="space-y-3">
            {/* Filter Pill Switcher */}
            <div className="flex gap-1.5 text-[11px] bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setFilterType('ALL')}
                className={`flex-1 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  filterType === 'ALL' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400'
                }`}
              >
                All (26+)
              </button>
              <button
                onClick={() => setFilterType('SECRETS')}
                className={`flex-1 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  filterType === 'SECRETS' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400'
                }`}
              >
                Secrets
              </button>
              <button
                onClick={() => setFilterType('VARIABLES')}
                className={`flex-1 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  filterType === 'VARIABLES' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400'
                }`}
              >
                Public Vars
              </button>
            </div>

            {/* List */}
            <div className="space-y-2.5">
              {filtered.map((s) => (
                <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-mono font-bold text-white">
                      {s.type === 'SECRET' ? (
                        <Lock className="w-3 h-3 text-amber-400" />
                      ) : (
                        <Globe className="w-3 h-3 text-emerald-400" />
                      )}
                      <span className="truncate max-w-[200px]">{s.name}</span>
                    </div>
                    {s.synced ? (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Synced
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-semibold">Pending</span>
                    )}
                  </div>

                  <input
                    type={s.type === 'SECRET' ? 'password' : 'text'}
                    value={s.value}
                    onChange={(e) => onUpdateSecret(s.id, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-slate-400 leading-tight">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <CertUploadSecure
            onApplyToBase64Secret={(id, val) => {
              onUpdateSecret(id, val);
            }}
          />
        )}

        {activeTab === 'logs' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-[10px] space-y-1.5 max-h-[75vh] overflow-y-auto">
            {syncLogs.length === 0 ? (
              <p className="text-slate-500 italic">No sync transactions yet.</p>
            ) : (
              syncLogs.map((l, i) => (
                <div key={i} className="flex flex-col gap-0.5 border-b border-slate-800/60 pb-1.5">
                  <div className="flex justify-between text-slate-500 text-[9px]">
                    <span>{new Date(l.time).toLocaleTimeString()}</span>
                    <span className="font-bold text-slate-400">{l.level}</span>
                  </div>
                  <span className="text-slate-300">{l.message}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
