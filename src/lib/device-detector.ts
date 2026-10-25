export type PlatformType = 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown';

export interface DeviceInfo {
  platform: PlatformType;
  isMobile: boolean;
  isApple: boolean;
  recommendedFormat: string;
  extension: string;
  recommendedLayout: 'mobile' | 'desktop';
  osDisplayName: string;
  browserName: string;
  securityFeature: string;
}

export function detectDevice(userAgent: string = ''): DeviceInfo {
  const ua = userAgent.toLowerCase();

  // iOS detection
  if (/iphone|ipad|ipod/.test(ua) || (ua.includes('mac') && typeof navigator !== 'undefined' && (navigator as any).maxTouchPoints > 1)) {
    return {
      platform: 'ios',
      isMobile: true,
      isApple: true,
      recommendedFormat: 'iOS OTA itms-services',
      extension: '.ipa',
      recommendedLayout: 'mobile',
      osDisplayName: 'Apple iOS (Safari OTA Engine)',
      browserName: ua.includes('crios') ? 'Chrome for iOS' : 'Mobile Safari',
      securityFeature: 'Dynamic manifest.plist direct home screen OTA installation'
    };
  }

  // Android detection
  if (/android/.test(ua)) {
    return {
      platform: 'android',
      isMobile: true,
      isApple: false,
      recommendedFormat: 'V2 APK (ProGuard Optimized)',
      extension: '.apk',
      recommendedLayout: 'mobile',
      osDisplayName: 'Google Android (V2 Scheme)',
      browserName: ua.includes('samsungbrowser') ? 'Samsung Internet' : 'Chrome Mobile',
      securityFeature: 'ProGuard/R8 optimized V2 digital signing to bypass Knox & Play Protect'
    };
  }

  // Windows detection
  if (/windows|win32|win64/.test(ua)) {
    return {
      platform: 'windows',
      isMobile: false,
      isApple: false,
      recommendedFormat: 'Windows Safe Installer (Authenticode Signed)',
      extension: '.exe',
      recommendedLayout: 'desktop',
      osDisplayName: 'Microsoft Windows 11/10',
      browserName: ua.includes('edg') ? 'Microsoft Edge' : 'Chrome / Firefox',
      securityFeature: 'Authenticode PFX Code Signing to smoothly bypass Windows SmartScreen warnings'
    };
  }

  // macOS detection
  if (/macintosh|mac os x/.test(ua)) {
    return {
      platform: 'macos',
      isMobile: false,
      isApple: true,
      recommendedFormat: 'Apple Notarized Universal DMG',
      extension: '.dmg',
      recommendedLayout: 'desktop',
      osDisplayName: 'Apple macOS (Apple Silicon / Intel)',
      browserName: ua.includes('safari') && !ua.includes('chrome') ? 'Desktop Safari' : 'Chrome for Mac',
      securityFeature: 'Developer ID Notarization and Gatekeeper ticket stapling'
    };
  }

  // Linux detection
  if (/linux/.test(ua)) {
    return {
      platform: 'linux',
      isMobile: false,
      isApple: false,
      recommendedFormat: 'AppImage / Deb Package',
      extension: '.AppImage',
      recommendedLayout: 'desktop',
      osDisplayName: 'Linux Desktop',
      browserName: 'Linux Browser',
      securityFeature: 'GPG detached signature and SHA-256 integrity verification'
    };
  }

  return {
    platform: 'unknown',
    isMobile: false,
    isApple: false,
    recommendedFormat: 'Universal Multi-Platform Hub',
    extension: '.zip',
    recommendedLayout: 'desktop',
    osDisplayName: 'Universal Client Engine',
    browserName: 'Modern Web Browser',
    securityFeature: 'Adaptive edge routing fallback'
  };
}
