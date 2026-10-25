import React, { useState, useRef } from 'react';
import { UploadCloud, FileCode2, CheckCircle2, ShieldCheck, Copy, Check, ArrowRight, AlertCircle } from 'lucide-react';
import { isValidBase64 } from '../../lib/secrets-validator.ts';

interface CertUploadSecureProps {
  onApplyToBase64Secret?: (secretId: string, base64Value: string) => void;
}

export const CertUploadSecure: React.FC<CertUploadSecureProps> = ({ onApplyToBase64Secret }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [base64Result, setBase64Result] = useState<string>('');
  const [targetSecret, setTargetSecret] = useState<string>('ANDROID_KEYSTORE_BASE64');
  const [applied, setApplied] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setFileSize(file.size);
    setApplied(false);

    // Auto-select target secret based on extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'jks' || ext === 'keystore') {
      setTargetSecret('ANDROID_KEYSTORE_BASE64');
    } else if (ext === 'p12' && file.name.toLowerCase().includes('mac')) {
      setTargetSecret('MACOS_CERTIFICATE_P12_BASE64');
    } else if (ext === 'p12') {
      setTargetSecret('IOS_CERTIFICATE_P12_BASE64');
    } else if (ext === 'mobileprovision') {
      setTargetSecret('IOS_PROVISION_PROFILE_BASE64');
    } else if (ext === 'pfx') {
      setTargetSecret('WINDOWS_CERT_PFX_BASE64');
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const b64 = btoa(binary);
      setBase64Result(b64);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleApply = () => {
    if (onApplyToBase64Secret && base64Result) {
      onApplyToBase64Secret(targetSecret, base64Result);
      setApplied(true);
      setTimeout(() => setApplied(false), 2500);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(base64Result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">CertUploadSecure™ Encoder</h3>
            <p className="text-xs text-slate-400">
              Auto-encode Keystore (.jks), Apple Distribution (.p12), Provisioning (.mobileprovision) &amp; Windows (.pfx)
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          Client-Side Zero-Leak
        </span>
      </div>

      {/* Drag & Drop Surface */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-slate-700/80 bg-slate-950/60 hover:border-slate-600 hover:bg-slate-950/90'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jks,.keystore,.p12,.mobileprovision,.pfx"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
            <UploadCloud className="w-6 h-6 text-indigo-400" />
          </div>
          <p className="text-sm font-semibold text-white">
            Click to upload or drag &amp; drop certificate file
          </p>
          <p className="text-xs text-slate-400">
            Supports .jks, .keystore, .p12, .mobileprovision, .pfx (Clean Base64 conversion)
          </p>
        </div>
      </div>

      {/* Result Section */}
      {base64Result && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">{fileName}</span>
              <span className="text-slate-400">({(fileSize! / 1024).toFixed(1)} KB)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-medium">Valid Base64</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-mono text-[11px]">{base64Result.length} chars</span>
            </div>
          </div>

          {/* Target Secret Selector & Auto-Apply */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80 flex-wrap">
            <label className="text-xs text-slate-400 shrink-0">Map to Secret Variable:</label>
            <select
              value={targetSecret}
              onChange={(e) => setTargetSecret(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="ANDROID_KEYSTORE_BASE64">ANDROID_KEYSTORE_BASE64 (Android Keystore)</option>
              <option value="IOS_CERTIFICATE_P12_BASE64">IOS_CERTIFICATE_P12_BASE64 (Apple Distribution)</option>
              <option value="IOS_PROVISION_PROFILE_BASE64">IOS_PROVISION_PROFILE_BASE64 (iOS Provisioning Profile)</option>
              <option value="MACOS_CERTIFICATE_P12_BASE64">MACOS_CERTIFICATE_P12_BASE64 (macOS Developer ID)</option>
              <option value="WINDOWS_CERT_PFX_BASE64">WINDOWS_CERT_PFX_BASE64 (Windows Authenticode PFX)</option>
            </select>

            <button
              onClick={handleApply}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                applied
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {applied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Injected into Secret!</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Inject into Secret Variable</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:text-white transition-colors cursor-pointer ml-auto"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Base64'}</span>
            </button>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 font-mono text-[10px] text-slate-400 break-all max-h-20 overflow-y-auto border border-slate-800">
            {base64Result}
          </div>
        </div>
      )}
    </div>
  );
};
