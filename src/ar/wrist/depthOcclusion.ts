import * as THREE from 'three';

export interface DepthOcclusionUniforms {
  uDepthTexture: { value: THREE.Texture | null };
  uNormDepthBufferFromNormView: { value: THREE.Matrix4 };
  uRawValueToMeters: { value: number };
  uOcclusionBias: { value: number };
  uDepthFormat: { value: number }; // 0 = float32, 1 = luminance-alpha 16bit, 2 = uint16
  uDepthActive: { value: boolean };
  uDepthResolution: { value: THREE.Vector2 };
}

export interface DepthOcclusionManager {
  uniforms: DepthOcclusionUniforms;
  patchMaterial: (material: THREE.Material) => void;
  updateFromXRFrame: (
    frame: any,
    view: any,
    glBinding: any,
    renderer: THREE.WebGLRenderer
  ) => boolean;
  setOcclusionBias: (bias: number) => void;
  dispose: () => void;
}

export type DepthSensingStatus =
  | 'checking'
  | 'supported-gpu'
  | 'supported-cpu'
  | 'unavailable'
  | 'active'
  | 'fallback';

/**
 * Checks if the browser and device support WebXR immersive-ar with depth sensing
 */
export async function checkWebXRDepthSupport(): Promise<{
  isSupported: boolean;
  usagePreference: string[];
  dataFormatPreference: string[];
  reason?: string;
}> {
  if (typeof window === 'undefined' || !('xr' in navigator)) {
    return {
      isSupported: false,
      usagePreference: [],
      dataFormatPreference: [],
      reason: 'WebXR Device API is not available.',
    };
  }

  const xr = (navigator as any).xr;
  if (!xr || typeof xr.isSessionSupported !== 'function') {
    return {
      isSupported: false,
      usagePreference: [],
      dataFormatPreference: [],
      reason: 'WebXR isSessionSupported is not a function.',
    };
  }

  try {
    const isArSupported = await xr.isSessionSupported('immersive-ar');
    if (!isArSupported) {
      return {
        isSupported: false,
        usagePreference: [],
        dataFormatPreference: [],
        reason: 'immersive-ar mode is not supported on this device.',
      };
    }

    return {
      isSupported: true,
      usagePreference: ['gpu-optimized', 'cpu-optimized'],
      dataFormatPreference: ['float32', 'luminance-alpha'],
    };
  } catch (err) {
    console.warn('[WristAR] Error checking WebXR depth support:', err);
    return {
      isSupported: false,
      usagePreference: [],
      dataFormatPreference: [],
      reason: 'Error checking WebXR support.',
    };
  }
}

/**
 * Creates and manages depth occlusion resources and shader patching for Three.js
 */
export function createDepthOcclusionManager(): DepthOcclusionManager {
  // Create a placeholder 1x1 depth texture to prevent WebGL shader compilation issues when depth is inactive
  const placeholderCanvas = document.createElement('canvas');
  placeholderCanvas.width = 1;
  placeholderCanvas.height = 1;
  const ctx = placeholderCanvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
    ctx.fillRect(0, 0, 1, 1);
  }
  const placeholderTexture = new THREE.CanvasTexture(placeholderCanvas);
  placeholderTexture.minFilter = THREE.NearestFilter;
  placeholderTexture.magFilter = THREE.NearestFilter;

  // Wrapped Three.js depth texture object for WebGLTexture binding
  let xrDepthTextureWrapper: THREE.Texture | null = null;
  let customWebGLTexture: WebGLTexture | null = null;

  const uniforms: DepthOcclusionUniforms = {
    uDepthTexture: { value: placeholderTexture },
    uNormDepthBufferFromNormView: { value: new THREE.Matrix4().identity() },
    uRawValueToMeters: { value: 1.0 },
    uOcclusionBias: { value: 0.005 }, // 5mm default bias to prevent z-fighting near wrist skin
    uDepthFormat: { value: 0 }, // 0 = float32, 1 = luminance-alpha
    uDepthActive: { value: false },
    uDepthResolution: { value: new THREE.Vector2(1, 1) },
  };

  /**
   * Patches a Three.js material using onBeforeCompile to inject depth occlusion logic
   */
  const patchMaterial = (material: THREE.Material) => {
    // Preserve custom shader code if already patched
    if ((material as any).__depthOcclusionPatched) return;
    (material as any).__depthOcclusionPatched = true;

    const originalOnBeforeCompile = material.onBeforeCompile;

    material.onBeforeCompile = (shader, renderer) => {
      if (originalOnBeforeCompile) {
        originalOnBeforeCompile(shader, renderer);
      }

      // 1. Link manager uniforms to shader uniforms
      shader.uniforms.uDepthTexture = uniforms.uDepthTexture;
      shader.uniforms.uNormDepthBufferFromNormView = uniforms.uNormDepthBufferFromNormView;
      shader.uniforms.uRawValueToMeters = uniforms.uRawValueToMeters;
      shader.uniforms.uOcclusionBias = uniforms.uOcclusionBias;
      shader.uniforms.uDepthFormat = uniforms.uDepthFormat;
      shader.uniforms.uDepthActive = uniforms.uDepthActive;
      shader.uniforms.uDepthResolution = uniforms.uDepthResolution;

      // 2. Vertex Shader Injection
      // We pass the view-space position and clip position to fragment shader
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        varying vec4 vOcclusionClipPos;
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <project_vertex>',
        `
        #include <project_vertex>
        vOcclusionClipPos = gl_Position;
        `
      );

      // 3. Fragment Shader Injection
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
        #include <common>
        varying vec4 vOcclusionClipPos;
        
        uniform sampler2D uDepthTexture;
        uniform mat4 uNormDepthBufferFromNormView;
        uniform float uRawValueToMeters;
        uniform float uOcclusionBias;
        uniform int uDepthFormat;
        uniform bool uDepthActive;
        uniform vec2 uDepthResolution;

        float sampleWebXRRealWorldDepth(vec2 normViewCoords) {
          // Transform normalized view coordinate (0..1) to depth buffer UV
          vec4 depthUV4 = uNormDepthBufferFromNormView * vec4(normViewCoords.x, normViewCoords.y, 0.0, 1.0);
          vec2 depthUV = depthUV4.xy / depthUV4.w;

          if (depthUV.x < 0.0 || depthUV.x > 1.0 || depthUV.y < 0.0 || depthUV.y > 1.0) {
            return 0.0; // Outside depth sensor boundary
          }

          vec4 depthSample = texture2D(uDepthTexture, depthUV);

          if (uDepthFormat == 0) {
            // Float32 format: red channel holds depth in meters directly
            return depthSample.r * uRawValueToMeters;
          } else if (uDepthFormat == 1) {
            // Luminance-Alpha 16-bit format: (R + A * 256.0) / 1000.0 or standard pack
            float depthRaw = (depthSample.r * 255.0) + (depthSample.a * 255.0 * 256.0);
            return depthRaw * uRawValueToMeters;
          } else {
            return depthSample.r * uRawValueToMeters;
          }
        }
        `
      );

      // Occlusion test at the beginning of the fragment shader
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <clipping_planes_fragment>',
        `
        #include <clipping_planes_fragment>

        if (uDepthActive) {
          // Normalized Device Coordinates (-1..1) to Normalized View Coordinates (0..1)
          vec2 ndc = vOcclusionClipPos.xy / vOcclusionClipPos.w;
          vec2 normViewCoords = ndc * 0.5 + 0.5;

          // In view space, camera looks down -Z axis, so depth from camera is -vViewPosition.z
          float virtualWatchDepthInMeters = -vViewPosition.z;

          float realWorldDepthInMeters = sampleWebXRRealWorldDepth(normViewCoords);

          // If real-world surface is valid and is closer than virtual watch (minus bias), occlude!
          if (realWorldDepthInMeters > 0.05 && realWorldDepthInMeters < (virtualWatchDepthInMeters - uOcclusionBias)) {
            discard;
          }
        }
        `
      );
    };

    material.needsUpdate = true;
  };

  /**
   * Updates depth resources each WebXR frame using XRWebGLBinding / XRFrame depth APIs
   */
  const updateFromXRFrame = (
    frame: any,
    view: any,
    glBinding: any,
    renderer: THREE.WebGLRenderer
  ): boolean => {
    if (!frame || !view) {
      uniforms.uDepthActive.value = false;
      return false;
    }

    try {
      let depthInfo: any = null;

      // Primary: GPU-optimized depth via XRWebGLBinding
      if (glBinding && typeof glBinding.getDepthInformation === 'function') {
        depthInfo = glBinding.getDepthInformation(view);
      }

      // Secondary / Fallback: frame.getDepthInformation(view)
      if (!depthInfo && typeof frame.getDepthInformation === 'function') {
        depthInfo = frame.getDepthInformation(view);
      }

      if (!depthInfo) {
        uniforms.uDepthActive.value = false;
        return false;
      }

      // Update depth transform matrix (normDepthBufferFromNormView)
      if (depthInfo.normDepthBufferFromNormView) {
        const matrixRaw = depthInfo.normDepthBufferFromNormView.matrix;
        if (matrixRaw && matrixRaw.length === 16) {
          uniforms.uNormDepthBufferFromNormView.value.fromArray(matrixRaw);
        }
      }

      // Update rawValueToMeters scaling factor
      if (typeof depthInfo.rawValueToMeters === 'number') {
        uniforms.uRawValueToMeters.value = depthInfo.rawValueToMeters;
      }

      // Update format
      const dataFormat = (depthInfo as any).dataFormat || 'float32';
      if (dataFormat === 'luminance-alpha') {
        uniforms.uDepthFormat.value = 1;
      } else {
        uniforms.uDepthFormat.value = 0;
      }

      // Update resolution
      if (depthInfo.width && depthInfo.height) {
        uniforms.uDepthResolution.value.set(depthInfo.width, depthInfo.height);
      }

      // Handle GPU depth WebGLTexture
      if (depthInfo.texture) {
        customWebGLTexture = depthInfo.texture;

        if (!xrDepthTextureWrapper) {
          xrDepthTextureWrapper = new THREE.Texture();
          xrDepthTextureWrapper.minFilter = THREE.NearestFilter;
          xrDepthTextureWrapper.magFilter = THREE.NearestFilter;
        }

        // Bind the WebXR depth WebGLTexture directly into Three.js texture state
        const textureProperties = (renderer as any).properties?.get(xrDepthTextureWrapper);
        if (textureProperties) {
          textureProperties.__webglTexture = customWebGLTexture;
          textureProperties.__webglInit = true;
        }

        uniforms.uDepthTexture.value = xrDepthTextureWrapper;
        uniforms.uDepthActive.value = true;
        return true;
      } else if (depthInfo.data) {
        // CPU Depth Information fallback - pack data into DataTexture if available
        const width = depthInfo.width;
        const height = depthInfo.height;
        const cpuData = depthInfo.data;

        let dataTexture = uniforms.uDepthTexture.value as THREE.DataTexture;
        if (!dataTexture || dataTexture.image.width !== width || dataTexture.image.height !== height) {
          if (cpuData instanceof Float32Array) {
            dataTexture = new THREE.DataTexture(
              cpuData,
              width,
              height,
              THREE.RedFormat,
              THREE.FloatType
            );
          } else {
            dataTexture = new THREE.DataTexture(
              new Uint8Array(cpuData.buffer),
              width,
              height,
              THREE.RGBAFormat,
              THREE.UnsignedByteType
            );
          }
          dataTexture.minFilter = THREE.NearestFilter;
          dataTexture.magFilter = THREE.NearestFilter;
          uniforms.uDepthTexture.value = dataTexture;
        } else {
          dataTexture.image.data = cpuData;
          dataTexture.needsUpdate = true;
        }

        uniforms.uDepthActive.value = true;
        return true;
      }

      uniforms.uDepthActive.value = false;
      return false;
    } catch (err) {
      console.warn('[WristAR] Depth frame update error:', err);
      uniforms.uDepthActive.value = false;
      return false;
    }
  };

  const setOcclusionBias = (bias: number) => {
    uniforms.uOcclusionBias.value = Math.max(0.001, Math.min(0.05, bias));
  };

  const dispose = () => {
    placeholderTexture.dispose();
    if (xrDepthTextureWrapper) {
      xrDepthTextureWrapper.dispose();
      xrDepthTextureWrapper = null;
    }
    uniforms.uDepthActive.value = false;
  };

  return {
    uniforms,
    patchMaterial,
    updateFromXRFrame,
    setOcclusionBias,
    dispose,
  };
}
