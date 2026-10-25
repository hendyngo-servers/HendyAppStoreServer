import test from 'node:test';
import assert from 'node:assert/strict';
import { detectDevice } from './device-detector';
import { generateManifestPlist, buildItmsUrl } from './ota-manifest';
import { validateAllSecrets, isValidBase64, prepareGitHubSyncPayload } from './secrets-validator';
import { INITIAL_SECRETS_DATA } from './secrets-data';

test('detectDevice accurately identifies iOS Safari UA', () => {
  const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
  const info = detectDevice(ua);
  assert.equal(info.platform, 'ios');
  assert.equal(info.isMobile, true);
  assert.equal(info.isApple, true);
  assert.equal(info.recommendedLayout, 'mobile');
  assert.equal(info.extension, '.ipa');
});

test('detectDevice accurately identifies Android UA', () => {
  const ua = 'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36';
  const info = detectDevice(ua);
  assert.equal(info.platform, 'android');
  assert.equal(info.isMobile, true);
  assert.equal(info.isApple, false);
  assert.equal(info.recommendedLayout, 'mobile');
  assert.equal(info.extension, '.apk');
});

test('detectDevice accurately identifies Windows 11 PC UA', () => {
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0';
  const info = detectDevice(ua);
  assert.equal(info.platform, 'windows');
  assert.equal(info.isMobile, false);
  assert.equal(info.recommendedLayout, 'desktop');
  assert.equal(info.extension, '.exe');
});

test('detectDevice accurately identifies macOS UA', () => {
  const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15';
  const info = detectDevice(ua);
  assert.equal(info.platform, 'macos');
  assert.equal(info.isMobile, false);
  assert.equal(info.isApple, true);
  assert.equal(info.recommendedLayout, 'desktop');
  assert.equal(info.extension, '.dmg');
});

test('generateManifestPlist generates compliant Apple itms-services XML', () => {
  const plist = generateManifestPlist({
    appName: 'Hendy Store',
    bundleId: 'com.hendy.appstore',
    version: '3.4.0',
    ipaUrl: 'https://r2.hendyappstore.com/builds/ios/HendyStore.ipa'
  });

  assert.ok(plist.includes('software-package'));
  assert.ok(plist.includes('<string>com.hendy.appstore</string>'));
  assert.ok(plist.includes('<string>3.4.0</string>'));
  assert.ok(plist.includes('https://r2.hendyappstore.com/builds/ios/HendyStore.ipa'));
  assert.ok(plist.includes('<!DOCTYPE plist PUBLIC'));
});

test('buildItmsUrl prefixes with proper itms-services protocol', () => {
  const manifestUrl = 'https://store.hendyappstore.com/api/manifest.plist';
  const itms = buildItmsUrl(manifestUrl);
  assert.ok(itms.startsWith('itms-services://?action=download-manifest&url='));
  assert.ok(itms.includes(encodeURIComponent(manifestUrl)));
});

test('isValidBase64 validates standard base64 strings', () => {
  assert.equal(isValidBase64('SGVsbG8gV29ybGQ='), true);
  assert.equal(isValidBase64('U29tZVRlc3REYXRh'), true);
  assert.equal(isValidBase64('Invalid!!$#%'), false);
  assert.equal(isValidBase64(''), false);
});

test('validateAllSecrets and prepareGitHubSyncPayload handles all 26+ environment variables', () => {
  assert.equal(INITIAL_SECRETS_DATA.length, 27);
  const validation = validateAllSecrets(INITIAL_SECRETS_DATA);
  assert.equal(validation.valid, true);

  const payload = prepareGitHubSyncPayload(INITIAL_SECRETS_DATA, 'hendy-corp/HendyAppStore');
  assert.equal(payload.totalVariables, 27);
  assert.equal(payload.summary.group1Count, 3);
  assert.equal(payload.summary.group2Count, 6);
  assert.equal(payload.summary.group3Count, 16);
  assert.equal(payload.summary.group4Count, 2);
  assert.ok(payload.publicVariables.length > 0);
  assert.ok(payload.encryptedSecrets.length > 0);
});
