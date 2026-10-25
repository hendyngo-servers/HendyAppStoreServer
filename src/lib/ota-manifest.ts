export interface ManifestConfig {
  appName: string;
  bundleId: string;
  version: string;
  ipaUrl: string;
  iconUrl?: string;
  fullSizeImage?: string;
}

/**
 * Dynamically generates a standard Apple enterprise OTA manifest.plist XML file.
 * This file is requested by Safari via itms-services://?action=download-manifest&url=...
 * to trigger wireless installation directly onto the iOS home screen.
 */
export function generateManifestPlist(config: ManifestConfig): string {
  const {
    appName,
    bundleId,
    version,
    ipaUrl,
    iconUrl = 'https://hendyappstore.com/assets/icon-512.png',
    fullSizeImage = 'https://hendyappstore.com/assets/icon-512.png'
  } = config;

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>items</key>
  <array>
    <dict>
      <key>assets</key>
      <array>
        <dict>
          <key>kind</key>
          <string>software-package</string>
          <key>url</key>
          <string>${ipaUrl}</string>
        </dict>
        <dict>
          <key>kind</key>
          <string>display-image</string>
          <key>need-shine</key>
          <false/>
          <key>url</key>
          <string>${iconUrl}</string>
        </dict>
        <dict>
          <key>kind</key>
          <string>full-size-image</string>
          <key>need-shine</key>
          <false/>
          <key>url</key>
          <string>${fullSizeImage}</string>
        </dict>
      </array>
      <key>metadata</key>
      <dict>
        <key>bundle-identifier</key>
        <string>${bundleId}</string>
        <key>bundle-version</key>
        <string>${version}</string>
        <key>kind</key>
        <string>software</string>
        <key>title</key>
        <string>${appName}</string>
      </dict>
    </dict>
  </array>
</dict>
</plist>`.trim();
}

/**
 * Builds the itms-services protocol URI for Apple iOS Safari.
 */
export function buildItmsUrl(manifestUrl: string): string {
  return `itms-services://?action=download-manifest&url=${encodeURIComponent(manifestUrl)}`;
}
