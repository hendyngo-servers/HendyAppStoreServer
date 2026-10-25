import React, { useState } from 'react';
import { Layers, ArrowRight, Shield, Globe, Cpu, Server, Terminal, Lock, HardDrive, CheckCircle2 } from 'lucide-react';

export const TotalArchitectureMap: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>('edge-router');

  const nodesInfo: Record<string, { title: string; layer: string; details: string; codeSnippet: string }> = {
    'admin-panel': {
      title: 'WEB-ADMIN (Bảng Điều Khiển Quản Trị)',
      layer: 'TẦNG 1: QUẢN LÝ QUẢN TRỊ (ADMIN MANAGEMENT LAYER)',
      details: 'Giao diện nhập liệu và xác thực tập trung cho toàn bộ 26 biến môi trường và khóa bí mật ký số. Hỗ trợ Mobile CMS Pocket để phê duyệt nhanh trên điện thoại và Full Dev Studio cho không gian làm việc máy tính.',
      codeSnippet: `// Đồng bộ 26 biến môi trường sang GitHub API\nawait fetch('/api/variables/sync', {\n  method: 'POST',\n  body: JSON.stringify({ repository, variables })\n});`
    },
    'edge-router': {
      title: 'CF WORKER: EDGE ROUTER (Định Tuyến Biên Mạng)',
      layer: 'TẦNG 2: ĐỊNH TUYẾN BIÊN (EDGE ROUTING LAYER)',
      details: 'Cloudflare Worker chạy tại các điểm biên gần người dùng nhất. Phân tích chuỗi User-Agent & Hostname để chèn header X-Target-App và X-Target-Layout, tự động tải layout kho ứng dụng di động dọc hoặc cổng web máy tính.',
      codeSnippet: `// workers/edge-router/src/index.js\nconst isMobile = /iphone|ipad|android/i.test(userAgent);\nconst targetLayout = isMobile ? 'MobileAppStoreLayout' : 'DesktopPortalLayout';`
    },
    'r2-storage': {
      title: 'KHO LƯU TRỮ CLOUDFLARE R2 (Binary Repository)',
      layer: 'TẦNG 2: KHO NHỊ PHÂN GỐC & CDN BIÊN',
      details: 'Lưu trữ đối tượng không phí tải ra (zero-egress) chứa các tệp nhị phân đã ký số an toàn: .apk (V2 scheme), .ipa (Enterprise OTA), .exe (Authenticode), và .dmg (Notarized).',
      codeSnippet: `[[r2_buckets]]\nbinding = "BINARY_REPO"\nbucket_name = "hendy-builds-binary-repo"`
    },
    'backend-api': {
      title: 'WORKERS / BACKEND-API (Mã Hóa & Điều Phối)',
      layer: 'TẦNG 3: API LÕI & ĐỒNG BỘ (CORE API & SYNC LAYER)',
      details: 'Nhận chuỗi và tệp chứng chỉ từ Web-Admin, lấy khóa công khai của kho từ GitHub API, thực hiện mã hóa hộp kín Libsodium (crypto_box_seal) và tự động ghi đè/tạo mới GitHub Secrets & Variables.',
      codeSnippet: `// workers/backend-api/src/index.js\nconst sealedCipher = sodium.crypto_box_seal(secretVal, repoPubKey);\nawait octokit.rest.actions.createOrUpdateRepoSecret({\n  encrypted_value: sealedCipher\n});`
    },
    'github-secrets': {
      title: 'GITHUB SECRETS & BIẾN MÔI TRƯỜNG',
      layer: 'TẦNG 3: BỘ NHỚ BIẾN TOÀN DỰ ÁN',
      details: 'Bộ nhớ đệm bảo mật của GitHub Actions lưu trữ các thông tin đăng nhập đã mã hóa và biến công khai. Tự động tiêm vào máy ảo runner cô lập khi kích hoạt quy trình.',
      codeSnippet: `env:\n  CF_ACCESS_AUD: \${{ vars.CF_ACCESS_AUD }}\n  ANDROID_KEYSTORE_BASE64: \${{ secrets.ANDROID_KEYSTORE_BASE64 }}`
    },
    'matrix-runners': {
      title: 'GITHUB ACTIONS BUILD MATRIX (Ma Trận Biên Dịch)',
      layer: 'TẦNG 4: MA TRẬN BIÊN DỊCH & XUẤT BẢN',
      details: 'Các runner cô lập chạy đồng thời: ubuntu-latest (ký số Android apksigner V2), macos-latest (ký số Apple codesign & tạo manifest.plist), windows-latest (Microsoft SignTool.exe).',
      codeSnippet: `jobs:\n  build-android: runs-on: ubuntu-latest\n  build-apple: runs-on: macos-latest\n  build-windows: runs-on: windows-latest`
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
          Sơ Đồ Kiến Trúc Hệ Thống Toàn Diện
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          Lõi Giao Diện Thích Ứng &amp; Pipeline Đồng Bộ Môi Trường Tự Động
        </h2>
        <p className="text-xs md:text-sm text-slate-400">
          Trực quan hóa tương tác 4 tầng kiến trúc: Quản lý Quản trị, Định tuyến Biên Cloudflare, API Lõi &amp; Đồng bộ GitHub, và Ma trận Biên dịch GitHub Actions.
        </p>
      </div>

      {/* 4 Layers Diagram Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Layer 1: Admin */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <Shield className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Tầng 1: Quản Trị</h4>
            </div>
            <p className="text-[11px] text-slate-400">Cấu hình Biến &amp; Quản lý Đồng bộ</p>
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
            <p className="text-[10px] text-slate-400">26 Bí mật &amp; Biến môi trường</p>
            <p className="text-[10px] text-emerald-400 mt-1">Nhật ký Đồng bộ Thời gian thực</p>
          </button>
        </div>

        {/* Layer 2: Edge Routing */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-sky-400">
              <Globe className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Tầng 2: Định Tuyến Biên</h4>
            </div>
            <p className="text-[11px] text-slate-400">Engine Cloudflare Edge Router</p>
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
              <p className="text-[10px] text-slate-400">Thích ứng Layout theo Thiết bị</p>
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
              <p className="text-[10px] text-slate-400">Kho Bản Dựng Nhị Phân Gốc</p>
            </button>
          </div>
        </div>

        {/* Layer 3: Core API & Sync */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-purple-400">
              <Server className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Tầng 3: API Lõi &amp; Đồng Bộ</h4>
            </div>
            <p className="text-[11px] text-slate-400">Engine Tác Vụ GitHub API</p>
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
              <p className="text-[10px] text-slate-400">Mã Hóa Hộp Kín Libsodium</p>
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
              <p className="text-[10px] text-slate-400">Biến Môi Trường Toàn Dự Án</p>
            </button>
          </div>
        </div>

        {/* Layer 4: Compilation Matrix */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Layers className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Tầng 4: Ma Trận Biên Dịch</h4>
            </div>
            <p className="text-[11px] text-slate-400">Agent Runner GitHub Actions</p>
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
            <p className="text-[10px] text-sky-400 mt-1">Xuất bản trực tiếp lên R2 Bucket</p>
          </button>
        </div>
      </div>

      {/* Detailed Node Inspector Box */}
      {selectedNode && nodesInfo[selectedNode] && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                {nodesInfo[selectedNode].layer}
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {nodesInfo[selectedNode].title}
              </h3>
            </div>
            <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
              Node Sản Xuất Đang Hoạt Động
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {nodesInfo[selectedNode].details}
          </p>

          <div>
            <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Đoạn Mã Xử Lý Mẫu (Implementation Logic)</span>
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

export default TotalArchitectureMap;
