import { SecretDefinition } from './secrets-data';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

export function isValidBase64(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  // Strip trailing whitespace or newlines common in pasted keys
  const cleaned = str.trim().replace(/\r?\n|\r/g, '');
  if (cleaned.length % 4 !== 0) return false;
  return /^[A-Za-z0-9+/]+={0,2}$/.test(cleaned);
}

export function validateAllSecrets(secrets: SecretDefinition[]): ValidationResult {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  for (const s of secrets) {
    const val = s.value ? s.value.trim() : '';

    if (s.required && !val) {
      errors[s.id] = `${s.name} is a required field.`;
      continue;
    }

    if (s.isBase64File && val) {
      // Validate Base64 formatting for certificate files
      if (!isValidBase64(val) && !val.includes('...')) {
        warnings[s.id] = `${s.name} does not appear to be standard Base64 encoding.`;
      }
    }

    if (s.id === 'CF_ACCESS_ADMIN_EMAILS' && val) {
      const emails = val.split(',').map(e => e.trim());
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalid = emails.filter(e => !emailRegex.test(e));
      if (invalid.length > 0) {
        warnings[s.id] = `Invalid email formatting in: ${invalid.join(', ')}`;
      }
    }

    if (s.id === 'AUTO_HEAL_ENABLED' && val) {
      if (val.toLowerCase() !== 'true' && val.toLowerCase() !== 'false') {
        errors[s.id] = 'AUTO_HEAL_ENABLED must be either "true" or "false".';
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
}

export interface GitHubSyncPayload {
  repository: string;
  timestamp: string;
  totalVariables: number;
  publicVariables: { name: string; value: string }[];
  encryptedSecrets: { name: string; maskedValue: string; bytesLength: number }[];
  summary: {
    group1Count: number;
    group2Count: number;
    group3Count: number;
    group4Count: number;
  };
}

export function prepareGitHubSyncPayload(
  secrets: SecretDefinition[],
  repository: string = 'hendy-org/HendyAppStore'
): GitHubSyncPayload {
  const publicVars: { name: string; value: string }[] = [];
  const encryptedSecs: { name: string; maskedValue: string; bytesLength: number }[] = [];

  let g1 = 0, g2 = 0, g3 = 0, g4 = 0;

  for (const s of secrets) {
    if (s.group === 'GROUP_1_SYSTEM_NETWORK') g1++;
    else if (s.group === 'GROUP_2_AUTOMATION_WEBHOOKS') g2++;
    else if (s.group === 'GROUP_3_MOBILE_SIGNING') g3++;
    else if (s.group === 'GROUP_4_DESKTOP_SIGNING') g4++;

    if (s.type === 'VARIABLE') {
      publicVars.push({
        name: s.name,
        value: s.value
      });
    } else {
      const len = s.value ? s.value.length : 0;
      const masked = len > 8
        ? `${s.value.slice(0, 3)}••••••••${s.value.slice(-3)}`
        : '••••••••';

      encryptedSecs.push({
        name: s.name,
        maskedValue: masked,
        bytesLength: len
      });
    }
  }

  return {
    repository,
    timestamp: new Date().toISOString(),
    totalVariables: secrets.length,
    publicVariables: publicVars,
    encryptedSecrets: encryptedSecs,
    summary: {
      group1Count: g1,
      group2Count: g2,
      group3Count: g3,
      group4Count: g4
    }
  };
}
