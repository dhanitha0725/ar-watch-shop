export interface XRSupportStatus {
  isSupported: boolean;
  hasWebXR: boolean;
  isMobile: boolean;
  isSecureContext: boolean;
  hasDepthSensing?: boolean;
  reason?: string;
}

export async function checkWebXRSupport(): Promise<XRSupportStatus> {
  const isSecureContext =
    window.isSecureContext ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const hasWebXR = 'xr' in navigator;

  if (!isSecureContext) {
    return {
      isSupported: false,
      hasWebXR,
      isMobile,
      isSecureContext: false,
      reason: 'WebXR requires a secure HTTPS context or localhost.',
    };
  }

  if (!hasWebXR) {
    return {
      isSupported: false,
      hasWebXR: false,
      isMobile,
      isSecureContext,
      reason: 'WebXR Device API is not available in this browser.',
    };
  }

  try {
    const xr = (navigator as unknown as { xr?: { isSessionSupported: (mode: string) => Promise<boolean> } }).xr;
    if (xr && typeof xr.isSessionSupported === 'function') {
      const isImmersiveARSupported = await xr.isSessionSupported('immersive-ar');
      return {
        isSupported: isImmersiveARSupported,
        hasWebXR: true,
        isMobile,
        isSecureContext,
        hasDepthSensing: isImmersiveARSupported && isMobile,
        reason: isImmersiveARSupported
          ? undefined
          : 'WebXR immersive-ar session is not supported on this device/hardware.',
      };
    }
  } catch (err) {
    console.warn('WebXR session support check failed:', err);
  }

  return {
    isSupported: false,
    hasWebXR: true,
    isMobile,
    isSecureContext,
    reason: 'Immersive AR session check did not return true.',
  };
}

export async function checkCameraPermission(): Promise<'granted' | 'prompt' | 'denied' | 'unavailable'> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return 'unavailable';
  }

  if (navigator.permissions && navigator.permissions.query) {
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return result.state as 'granted' | 'prompt' | 'denied';
    } catch {
      // Permission query not supported on all browsers (e.g. Safari)
      return 'prompt';
    }
  }

  return 'prompt';
}
