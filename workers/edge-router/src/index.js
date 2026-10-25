/**
 * Cloudflare Worker: workers/edge-router/src/index.js
 * 
 * Edge Router Engine for HendyAppStore
 * Identifies incoming User-Agent and Hostname at Cloudflare Edge Network (Proxy Mode: ON)
 * Dynamically routes to the appropriate layout:
 * - Admin Hostname (admin.*) -> Web-Admin Core (MobileCMSPocket vs FullDevStudio)
 * - User Store Hostname (store.*) -> Web-User Core (MobileAppStore vs DesktopPortal)
 * - Device Detection: iOS Safari (itms-services OTA), Android (V2 APK), Windows (Authenticode EXE)
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const userAgent = request.headers.get('User-Agent') || '';
    const host = url.hostname;

    // Detect platform
    const isMobile = /iphone|ipad|ipod|android/i.test(userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);
    const isAndroid = /android/i.test(userAgent);
    const isWindows = /windows/i.test(userAgent);
    const isMac = /macintosh|mac os x/i.test(userAgent);

    let targetLayout = 'DesktopPortalLayout';
    let targetApp = 'web-user';

    // Route determination
    if (host.startsWith('admin') || url.searchParams.get('mode') === 'admin') {
      targetApp = 'web-admin';
      targetLayout = isMobile ? 'MobileCMSPocketLayout' : 'FullDevStudioLayout';
    } else {
      targetApp = 'web-user';
      targetLayout = isMobile ? 'MobileAppStoreLayout' : 'DesktopPortalLayout';
    }

    // Edge Header Injection
    const headers = new Headers();
    headers.set('X-Edge-Router', 'Cloudflare-Worker-v2');
    headers.set('X-Detected-Platform', isIOS ? 'iOS' : isAndroid ? 'Android' : isWindows ? 'Windows' : isMac ? 'macOS' : 'Linux');
    headers.set('X-Target-App', targetApp);
    headers.set('X-Target-Layout', targetLayout);
    headers.set('X-CF-Proxy-Mode', 'ACTIVE');

    return new Response(
      JSON.stringify({
        status: 'routed',
        hostname: host,
        targetApp,
        targetLayout,
        device: {
          userAgent,
          isMobile,
          isIOS,
          isAndroid,
          isWindows,
          isMac,
        },
        distribution: {
          r2Bucket: 'hendy-builds-binary-repo',
          cdnEndpoint: 'https://r2.hendyappstore.com',
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(headers.entries()),
        },
      }
    );
  },
};
