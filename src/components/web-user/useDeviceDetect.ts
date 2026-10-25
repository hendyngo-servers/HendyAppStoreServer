import { useState, useEffect } from 'react';
import { detectDevice, DeviceInfo } from '../../lib/device-detector.ts';

export function useDeviceDetect() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window !== 'undefined') {
      return detectDevice(navigator.userAgent);
    }
    return detectDevice('');
  });

  const [simulatedPlatform, setSimulatedPlatform] = useState<string | null>(null);

  useEffect(() => {
    if (simulatedPlatform) {
      let customUa = '';
      if (simulatedPlatform === 'ios') {
        customUa = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1';
      } else if (simulatedPlatform === 'android') {
        customUa = 'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 Chrome/124.0.0.0 Mobile Safari/537.36';
      } else if (simulatedPlatform === 'windows') {
        customUa = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0';
      } else if (simulatedPlatform === 'macos') {
        customUa = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15';
      }
      setDeviceInfo(detectDevice(customUa));
    } else {
      setDeviceInfo(detectDevice(navigator.userAgent));
    }
  }, [simulatedPlatform]);

  return {
    deviceInfo,
    simulatedPlatform,
    setSimulatedPlatform,
    resetToRealDevice: () => setSimulatedPlatform(null),
  };
}
