export type SecretGroup = 
  | 'GROUP_1_SYSTEM_NETWORK'
  | 'GROUP_2_AUTOMATION_WEBHOOKS'
  | 'GROUP_3_MOBILE_SIGNING'
  | 'GROUP_4_DESKTOP_SIGNING';

export type VariableType = 'VARIABLE' | 'SECRET';

export interface SecretDefinition {
  id: string;
  name: string;
  type: VariableType;
  group: SecretGroup;
  subGroup?: string;
  description: string;
  placeholder: string;
  isBase64File?: boolean;
  fileExtension?: string;
  required: boolean;
  value: string;
  synced: boolean;
  lastUpdated?: string;
}

export const INITIAL_SECRETS_DATA: SecretDefinition[] = [
  // GROUP 1: SYSTEM & NETWORK SECURITY (VARIABLES - PUBLIC VALUES)
  {
    id: 'CF_ACCESS_AUD',
    name: 'CF_ACCESS_AUD',
    type: 'VARIABLE',
    group: 'GROUP_1_SYSTEM_NETWORK',
    description: 'Client ID used for Cloudflare Access authentication to secure resources.',
    placeholder: 'e.g. 7f89d3a2b1c0456e890123456789abcdef0123456789abcdef0123456789abcdef',
    required: true,
    value: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b.access.cloudflare.com',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'CF_ACCESS_ADMIN_EMAILS',
    name: 'CF_ACCESS_ADMIN_EMAILS',
    type: 'VARIABLE',
    group: 'GROUP_1_SYSTEM_NETWORK',
    description: 'A comma-separated list of administrator email addresses authorized to access the system.',
    placeholder: 'admin@hendyappstore.com, devops@hendyappstore.com',
    required: true,
    value: 'ngogiaidy3@gmail.com, security@hendyappstore.io',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'ALLOWED_ORIGINS',
    name: 'ALLOWED_ORIGINS',
    type: 'VARIABLE',
    group: 'GROUP_1_SYSTEM_NETWORK',
    description: 'A list of domains permitted to perform cross-origin resource sharing (CORS) requests to the Workers layer.',
    placeholder: 'https://store.hendyappstore.com, https://admin.hendyappstore.com',
    required: true,
    value: 'https://store.hendyappstore.com, https://admin.hendyappstore.com, https://localhost:3000',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },

  // GROUP 2: AUTOMATION & WEBHOOKS (SECRETS - ENCRYPTED VALUES)
  {
    id: 'GITHUB_SYNC_TOKEN',
    name: 'GITHUB_SYNC_TOKEN',
    type: 'SECRET',
    group: 'GROUP_2_AUTOMATION_WEBHOOKS',
    description: 'A Personal Access Token (PAT) with write permissions (repo, workflow), used for triggering Git repository synchronization via API.',
    placeholder: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    required: true,
    value: 'ghp_91KjA8vL92mZxQeRtYuIopLkMnBvCxZaQwEr',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'LLM_API_KEY',
    name: 'LLM_API_KEY',
    type: 'SECRET',
    group: 'GROUP_2_AUTOMATION_WEBHOOKS',
    description: 'An AI API key used for reading and analyzing build error logs from the virtual machine.',
    placeholder: 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    required: true,
    value: 'AIzaSyD_8f93JaK0L2mN3oP4qR5sT6uV7wX8yZ',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'AUTO_HEAL_ENABLED',
    name: 'AUTO_HEAL_ENABLED',
    type: 'VARIABLE',
    group: 'GROUP_2_AUTOMATION_WEBHOOKS',
    description: 'A configuration flag (true/false) to enable or disable the automated self-healing bot system.',
    placeholder: 'true or false',
    required: true,
    value: 'true',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'SELF_HEAL_WEBHOOK_SECRET',
    name: 'SELF_HEAL_WEBHOOK_SECRET',
    type: 'SECRET',
    group: 'GROUP_2_AUTOMATION_WEBHOOKS',
    description: 'A secure authentication signature (secret) for Webhook data packets transmitted between internal workers.',
    placeholder: 'whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    required: true,
    value: 'whsec_90fa8bc34de123479a8e01bfca921470e83',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'BUILD_STATUS_WEBHOOK_URL',
    name: 'BUILD_STATUS_WEBHOOK_URL',
    type: 'SECRET',
    group: 'GROUP_2_AUTOMATION_WEBHOOKS',
    description: 'The URL endpoint for receiving real-time build progress updates from the GitHub virtual machine.',
    placeholder: 'https://backend-api.hendyappstore.workers.dev/api/webhook/build-status',
    required: true,
    value: 'https://backend-api.hendyappstore.workers.dev/api/webhook/build-status',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'DISCORD_WEBHOOK_URL',
    name: 'DISCORD_WEBHOOK_URL',
    type: 'SECRET',
    group: 'GROUP_2_AUTOMATION_WEBHOOKS',
    description: 'A Webhook URL used to send software release status notifications directly to the team chat group.',
    placeholder: 'https://discord.com/api/webhooks/xxxx/xxxx',
    required: false,
    value: 'https://discord.com/api/webhooks/1293847291029384/aZbYcXwV-ReleaseChannel',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },

  // GROUP 3: MOBILE APPLICATION DIGITAL SIGNING (ANDROID & IOS/MACOS)
  // Android
  {
    id: 'ANDROID_PACKAGE_NAME',
    name: 'ANDROID_PACKAGE_NAME',
    type: 'VARIABLE',
    group: 'GROUP_3_MOBILE_SIGNING',
    subGroup: 'Android Platform',
    description: 'The unique package identifier configured for the Android application (e.g., com.company.userapp).',
    placeholder: 'com.hendy.appstore',
    required: true,
    value: 'com.hendy.appstore.client',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'ANDROID_KEYSTORE_BASE64',
    name: 'ANDROID_KEYSTORE_BASE64',
    type: 'SECRET',
    group: 'GROUP_3_MOBILE_SIGNING',
    subGroup: 'Android Platform',
    description: 'The complete release Keystore certificate file (.jks), encoded as a secure Base64 string.',
    placeholder: 'Base64 encoded .jks file',
    isBase64File: true,
    fileExtension: '.jks,.keystore',
    required: true,
    value: 'MIIDdTCCAl2gAwIBAgIEAQIDBDANBgkqhkiG9w0BAQsFADBLMQswCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEQMA4GA1UEBxMHU2FuIEpvc2UxFDASBgNVBAoTC0hlbmR5QXBwU3RvcmUwHhcNMjQwMTAxMDAwMDAwWhcNNTAwMTAxMDAwMDAwWjBLMQswCQYDVQQGEwJVUzET...',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'ANDROID_KEYSTORE_PASSWORD',
    name: 'ANDROID_KEYSTORE_PASSWORD',
    type: 'SECRET',
    group: 'GROUP_3_MOBILE_SIGNING',
    subGroup: 'Android Platform',
    description: 'The master password protecting the Android Keystore file.',
    placeholder: 'Master Keystore Password',
    required: true,
    value: 'K$7xP!99StoreRelease#KeyPass2026',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'ANDROID_KEY_ALIAS',
    name: 'ANDROID_KEY_ALIAS',
    type: 'VARIABLE',
    group: 'GROUP_3_MOBILE_SIGNING',
    subGroup: 'Android Platform',
    description: 'The alias identifier for the digital signing key contained within the Keystore file.',
    placeholder: 'e.g. hendy-release-key',
    required: true,
    value: 'hendy-release-v2',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'ANDROID_KEY_PASSWORD',
    name: 'ANDROID_KEY_PASSWORD',
    type: 'SECRET',
    group: 'GROUP_3_MOBILE_SIGNING',
    subGroup: 'Android Platform',
    description: 'The specific password used to unlock the Android digital signing key alias.',
    placeholder: 'Key Alias Password',
    required: true,
    value: 'A!iasKeySecureP@ss2026_V2',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },

  // iOS & macOS
  {
    id: 'IOS_APP_IDENTIFIER',
    name: 'IOS_APP_IDENTIFIER',
    type: 'VARIABLE',
    group: 'GROUP_3_MOBILE_SIGNING',
    subGroup: 'Apple Platform',
    description: 'The unique bundle identifier configured for the iOS application (e.g., com.company.userapp).',
    placeholder: 'com.hendy.appstore.ios',
    required: true,
    value: 'com.hendy.appstore.enterprise',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'IOS_CERTIFICATE_P12_BASE64',
    name: 'IOS_CERTIFICATE_P12_BASE64',
    type: 'SECRET',
    group: 'GROUP_3_MOBILE_SIGNING',
    subGroup: 'Apple Platform',
    description: 'Apple Distribution Certificate (.p12) encoded as a Base64 text string.',
    placeholder: 'Base64 encoded .p12 certificate',
    isBase64File: true,
    fileExtension: '.p12',
    required: true,
    value: 'MIIKmwIBAzCCCp8GCSqGSIb3DQEHAaCCCpAEggqMMIIKiDCCBicGCSqGSIb3DQEHAaCCBhkEggYVMIIGETCCBA0GCyqGSIb3DQEMCgECoIIE7jCCBOowHAYKKoZIhvcNAQwBAzAOBAiZ79o3f45...',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'IOS_CERTIFICATE_PASSWORD',
    name: 'IOS_CERTIFICATE_PASSWORD',
    type: 'SECRET',
    group: 'GROUP_3_MOBILE_SIGNING',
    subGroup: 'Apple Platform',
    description: 'Password used to decrypt and unlock the Apple .p12 certificate file on the virtual machine.',
    placeholder: 'Apple P12 Certificate Password',
    required: true,
    value: 'AppleDistCert#2026$Encrypted',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'IOS_PROVISION_PROFILE_BASE64',
    name: 'IOS_PROVISION_PROFILE_BASE64',
    type: 'SECRET',
    group: 'GROUP_3_MOBILE_SIGNING',
    subGroup: 'Apple Platform',
    description: 'Provisioning profile file (.mobileprovision) encoded as a Base64 string.',
    placeholder: 'Base64 encoded .mobileprovision file',
    isBase64File: true,
    fileExtension: '.mobileprovision',
    required: true,
    value: 'MIIS1gYJKoZIhvcNAQcCoIISxzCCErsCAQExADALBgkqhkiG9w0BBwGgghKyMIIEEzCCAvugAwIBAgIIc6W5X...PayloadProvisioningProfileEnterpriseUUID...',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'IOS_SIGNING_IDENTITY',
    name: 'IOS_SIGNING_IDENTITY',
    type: 'VARIABLE',
    group: 'GROUP_3_MOBILE_SIGNING',
    subGroup: 'Apple Platform',
    description: 'Identifier string for the iOS digital signing certificate (e.g., Apple Distribution: Company Name (ID)).',
    placeholder: 'Apple Distribution: Hendy App Store Corp (9X39485721)',
    required: true,
    value: 'Apple Distribution: Hendy App Store Corp (8K92716493)',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'MACOS_CERTIFICATE_P12_BASE64',
    name: 'MACOS_CERTIFICATE_P12_BASE64',
    type: 'SECRET',
    group: 'GROUP_3_MOBILE_SIGNING',
    subGroup: 'Apple Platform',
    description: 'Certificate for packaging and authenticating applications for the macOS operating system (.p12).',
    placeholder: 'Base64 encoded macOS .p12 certificate',
    isBase64File: true,
    fileExtension: '.p12',
    required: true,
    value: 'MIIKzgYJKoZIhvcNAQcCoIIKvzCCCrsCAQExADALBgkqhkiG9w0BBwGgggpwMIIFbDCCBFSgAwIBAgIIC93...',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'MACOS_CERTIFICATE_PASSWORD',
    name: 'MACOS_CERTIFICATE_PASSWORD',
    type: 'SECRET',
    group: 'GROUP_3_MOBILE_SIGNING',
    subGroup: 'Apple Platform',
    description: 'Password to unlock the macOS digital signing certificate.',
    placeholder: 'macOS Certificate Password',
    required: true,
    value: 'MacDevIdCert_Pass2026!Secure',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'MACOS_SIGNING_IDENTITY',
    name: 'MACOS_SIGNING_IDENTITY',
    type: 'VARIABLE',
    group: 'GROUP_3_MOBILE_SIGNING',
    subGroup: 'Apple Platform',
    description: 'Identifier string for the digital signing certificate for the macOS environment.',
    placeholder: 'Developer ID Application: Hendy App Store Corp (8K92716493)',
    required: true,
    value: 'Developer ID Application: Hendy App Store Corp (8K92716493)',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },

  // Apple Connection Account
  {
    id: 'APPLE_ID',
    name: 'APPLE_ID',
    type: 'VARIABLE',
    group: 'GROUP_3_MOBILE_SIGNING',
    subGroup: 'Apple Account',
    description: 'Email address used to log in to the Apple Developer Program portal.',
    placeholder: 'developer@hendyappstore.com',
    required: true,
    value: 'apple-dev@hendyappstore.internal',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'APPLE_TEAM_ID',
    name: 'APPLE_TEAM_ID',
    type: 'VARIABLE',
    group: 'GROUP_3_MOBILE_SIGNING',
    subGroup: 'Apple Account',
    description: 'Unique developer team identifier assigned by Apple to manage the organization.',
    placeholder: '10-character Team ID, e.g. 8K92716493',
    required: true,
    value: '8K92716493',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'APPLE_APP_SPECIFIC_PASSWORD',
    name: 'APPLE_APP_SPECIFIC_PASSWORD',
    type: 'SECRET',
    group: 'GROUP_3_MOBILE_SIGNING',
    subGroup: 'Apple Account',
    description: 'Apple app-specific password used to bypass two-factor authentication (OTP) when running CLI notarization tools.',
    placeholder: 'xxxx-xxxx-xxxx-xxxx',
    required: true,
    value: 'jklm-nopq-rstu-vwxy',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },

  // GROUP 4: DESKTOP APPLICATION SIGNING (WINDOWS DESKTOP CREDENTIALS)
  {
    id: 'WINDOWS_CERT_PFX_BASE64',
    name: 'WINDOWS_CERT_PFX_BASE64',
    type: 'SECRET',
    group: 'GROUP_4_DESKTOP_SIGNING',
    description: 'Code Signing Certificate file (.pfx) encoded as a Base64 text string for Authenticode.',
    placeholder: 'Base64 encoded .pfx or .p12 file',
    isBase64File: true,
    fileExtension: '.pfx,.p12',
    required: true,
    value: 'MIIKmgIBAzCCCp8GCSqGSIb3DQEHAaCCCpAEggqMMIIKiDCCBicGCSqGSIb3DQEHAaCCBhkEggYVMIIGETCCBA0GCyqGSIb3DQEMCgECoIIE7jCCBOowHAYKKoZIhvcNAQwBAzAOBAi...',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  },
  {
    id: 'WINDOWS_CERT_PASSWORD',
    name: 'WINDOWS_CERT_PASSWORD',
    type: 'SECRET',
    group: 'GROUP_4_DESKTOP_SIGNING',
    description: 'The password used to unlock the PFX certificate for the Microsoft SignTool.exe utility on the virtual machine.',
    placeholder: 'PFX Certificate Password',
    required: true,
    value: 'WinSignTool#2026Authenticode$Pass',
    synced: true,
    lastUpdated: '2026-10-24 18:20 UTC'
  }
];

export const GROUP_META = {
  GROUP_1_SYSTEM_NETWORK: {
    title: 'NHÓM 1: Bảo Mật Hệ Thống & Mạng (System & Network Security)',
    badge: '3 Biến Công Khai',
    color: 'emerald',
    description: 'Các biến công khai chi phối xác thực Cloudflare Access, chính sách CORS và danh sách email quản trị viên được phân quyền.'
  },
  GROUP_2_AUTOMATION_WEBHOOKS: {
    title: 'NHÓM 2: Tự Động Hóa & Webhook (Automation & Webhooks)',
    badge: '6 Bí Mật & Biến',
    color: 'amber',
    description: 'Các token mã hóa, URL webhook và khóa AI API kích hoạt bot tự chữa lành và các runner ma trận GitHub Actions.'
  },
  GROUP_3_MOBILE_SIGNING: {
    title: 'NHÓM 3: Ký Số Ứng Dụng Di Động (Android & iOS/macOS Signing)',
    badge: '16 Bí Mật & Biến',
    color: 'indigo',
    description: 'Keystore, chứng chỉ Apple .p12, hồ sơ cấu hình MobileProvision và tài khoản kết nối cho quy trình đóng gói ký số tự động.'
  },
  GROUP_4_DESKTOP_SIGNING: {
    title: 'NHÓM 4: Ký Số Ứng Dụng Máy Tính (Windows SignTool Authenticode)',
    badge: '2 Thông Số Mã Hóa',
    color: 'cyan',
    description: 'Chứng chỉ Authenticode PFX và mật khẩu SignTool.exe giúp bộ cài đặt Windows vượt qua cảnh báo SmartScreen.'
  }
};

