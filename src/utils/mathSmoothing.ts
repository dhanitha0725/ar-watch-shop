import * as THREE from 'three';

/**
 * Default smoothing constants
 * Formula: smoothed = previous * SMOOTHING_FACTOR + current * (1 - SMOOTHING_FACTOR)
 * Alpha equivalent = 1 - SMOOTHING_FACTOR
 */
export const POSITION_SMOOTHING = 0.8; // alpha = 0.2
export const ROTATION_SMOOTHING = 0.85; // alpha = 0.15
export const SCALE_SMOOTHING = 0.8; // alpha = 0.2
export const OCCLUSION_BIAS = 0.005; // 5mm depth offset bias

/**
 * Exponential Moving Average (EMA) filter for 3D points
 */
export class Vector3Smoother {
  private current: THREE.Vector3 | null = null;
  private alpha: number;

  constructor(alpha: number = 0.2) {
    this.alpha = alpha;
  }

  public setSmoothing(factor: number): void {
    this.alpha = Math.max(0.01, Math.min(1.0, 1.0 - factor));
  }

  public update(target: THREE.Vector3): THREE.Vector3 {
    if (!this.current) {
      this.current = target.clone();
      return this.current;
    }
    this.current.lerp(target, this.alpha);
    return this.current;
  }

  public reset(): void {
    this.current = null;
  }
}

export class ScalarSmoother {
  private current: number | null = null;
  private alpha: number;

  constructor(alpha: number = 0.2) {
    this.alpha = alpha;
  }

  public setSmoothing(factor: number): void {
    this.alpha = Math.max(0.01, Math.min(1.0, 1.0 - factor));
  }

  public update(target: number): number {
    if (this.current === null) {
      this.current = target;
      return this.current;
    }
    this.current = this.alpha * target + (1 - this.alpha) * this.current;
    return this.current;
  }

  public reset(): void {
    this.current = null;
  }
}

export class QuaternionSmoother {
  private current: THREE.Quaternion | null = null;
  private alpha: number;

  constructor(alpha: number = 0.15) {
    this.alpha = alpha;
  }

  public setSmoothing(factor: number): void {
    this.alpha = Math.max(0.01, Math.min(1.0, 1.0 - factor));
  }

  public update(target: THREE.Quaternion): THREE.Quaternion {
    if (!this.current) {
      this.current = target.clone();
      return this.current;
    }
    this.current.slerp(target, this.alpha);
    return this.current;
  }

  public reset(): void {
    this.current = null;
  }
}

export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export interface WristPoseResult {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  quaternion: THREE.Quaternion;
  scaleFactor: number;
  isDetected: boolean;
  landmarks2D?: {
    wrist: { x: number; y: number };
    indexMCP: { x: number; y: number };
    pinkyMCP: { x: number; y: number };
    middleMCP: { x: number; y: number };
  };
}

/**
 * Calculate 2D/3D screen-space wrist pose from MediaPipe 21 Hand Landmarks
 * Landmark 0 = Wrist
 * Landmark 5 = Index Finger Knuckle (MCP)
 * Landmark 17 = Pinky Finger Knuckle (MCP)
 * Landmark 9 = Middle Knuckle (MCP)
 */
export function estimateWristPose(
  landmarks: Landmark[],
  canvasWidth: number,
  canvasHeight: number
): WristPoseResult {
  if (!landmarks || landmarks.length < 21) {
    return {
      position: new THREE.Vector3(),
      rotation: new THREE.Euler(),
      quaternion: new THREE.Quaternion(),
      scaleFactor: 1,
      isDetected: false,
    };
  }

  const wrist = landmarks[0];
  const indexMCP = landmarks[5];
  const pinkyMCP = landmarks[17];
  const middleMCP = landmarks[9];

  // Convert normalized [0,1] coordinates to screen-space pixel coordinates centered at (0,0)
  const wx = (wrist.x - 0.5) * canvasWidth;
  const wy = -(wrist.y - 0.5) * canvasHeight;
  const wz = (wrist.z || 0) * 100;

  const ix = (indexMCP.x - 0.5) * canvasWidth;
  const iy = -(indexMCP.y - 0.5) * canvasHeight;
  const px = (pinkyMCP.x - 0.5) * canvasWidth;
  const py = -(pinkyMCP.y - 0.5) * canvasHeight;
  const mx = (middleMCP.x - 0.5) * canvasWidth;
  const my = -(middleMCP.y - 0.5) * canvasHeight;

  // Palm width vector across knuckles (Pinky -> Index)
  const palmVector = new THREE.Vector2(ix - px, iy - py);
  const palmWidth = palmVector.length();

  // Forearm to wrist vector (Wrist -> Middle Knuckle)
  const handAxis = new THREE.Vector2(mx - wx, my - wy);
  const handAxisAngle = Math.atan2(handAxis.y, handAxis.x);

  // Position: place watch slightly behind the wrist joint along forearm
  const offsetDistance = palmWidth * 0.15;
  const watchPosX = wx - Math.cos(handAxisAngle) * offsetDistance;
  const watchPosY = wy - Math.sin(handAxisAngle) * offsetDistance;

  // Rotation: align watch face with palm plane and forearm orientation
  const angleZ = handAxisAngle - Math.PI / 2;
  const tiltX = (wrist.y - middleMCP.y) * 0.5;
  const tiltY = (pinkyMCP.x - indexMCP.x) * 0.5;

  const rotation = new THREE.Euler(tiltX, tiltY, angleZ, 'XYZ');
  const quaternion = new THREE.Quaternion().setFromEuler(rotation);
  const position = new THREE.Vector3(watchPosX, watchPosY, wz);

  // Dynamic scale proportional to detected palm width
  const basePalmRef = 120; // Reference pixel width
  const scaleFactor = Math.max(0.6, Math.min(2.5, palmWidth / basePalmRef));

  return {
    position,
    rotation,
    quaternion,
    scaleFactor,
    isDetected: true,
    landmarks2D: {
      wrist: { x: wrist.x, y: wrist.y },
      indexMCP: { x: indexMCP.x, y: indexMCP.y },
      pinkyMCP: { x: pinkyMCP.x, y: pinkyMCP.y },
      middleMCP: { x: middleMCP.x, y: middleMCP.y },
    },
  };
}

/**
 * Calculate 3D metric wrist pose for WebXR Immersive AR coordinate space (in meters)
 * Unprojects normalized screen coordinates using XR camera matrices at real wrist depth (~0.4m)
 */
export function estimateWristPoseMetric(
  landmarks: Landmark[],
  camera: THREE.Camera,
  depthDistanceMeters: number = 0.42
): WristPoseResult {
  if (!landmarks || landmarks.length < 21) {
    return {
      position: new THREE.Vector3(),
      rotation: new THREE.Euler(),
      quaternion: new THREE.Quaternion(),
      scaleFactor: 1,
      isDetected: false,
    };
  }

  const wrist = landmarks[0];
  const indexMCP = landmarks[5];
  const pinkyMCP = landmarks[17];
  const middleMCP = landmarks[9];

  // Normalized Device Coordinates (NDC) in range [-1, 1]
  // In mirrored camera feed, flip X coordinate for natural try-on interaction
  const ndcX = (1.0 - wrist.x) * 2.0 - 1.0;
  const ndcY = -(wrist.y * 2.0 - 1.0);

  // Unproject NDC ray through camera to the target depth distance in meters
  const ndcPoint = new THREE.Vector3(ndcX, ndcY, 0.5);
  ndcPoint.unproject(camera);

  // Camera world position
  const camPos = new THREE.Vector3();
  camera.getWorldPosition(camPos);

  const rayDir = ndcPoint.sub(camPos).normalize();
  const worldPos = camPos.clone().add(rayDir.multiplyScalar(depthDistanceMeters));

  // Hand orientation in 3D metric space
  const handVec2D = new THREE.Vector2(
    (1.0 - middleMCP.x) - (1.0 - wrist.x),
    -(middleMCP.y - wrist.y)
  );
  const handAngleZ = Math.atan2(handVec2D.y, handVec2D.x) - Math.PI / 2;

  const tiltX = (wrist.y - middleMCP.y) * 0.8;
  const tiltY = ((1.0 - pinkyMCP.x) - (1.0 - indexMCP.x)) * 0.8;

  const rotation = new THREE.Euler(tiltX, tiltY, handAngleZ, 'XYZ');
  const quaternion = new THREE.Quaternion().setFromEuler(rotation);

  // Palm width in normalized screen space
  const dx = (1.0 - indexMCP.x) - (1.0 - pinkyMCP.x);
  const dy = indexMCP.y - pinkyMCP.y;
  const normPalmWidth = Math.sqrt(dx * dx + dy * dy);

  // Scale in meters: reference palm width ~ 0.085m (8.5cm)
  const scaleFactor = Math.max(0.7, Math.min(1.6, normPalmWidth / 0.18));

  return {
    position: worldPos,
    rotation,
    quaternion,
    scaleFactor,
    isDetected: true,
    landmarks2D: {
      wrist: { x: wrist.x, y: wrist.y },
      indexMCP: { x: indexMCP.x, y: indexMCP.y },
      pinkyMCP: { x: pinkyMCP.x, y: pinkyMCP.y },
      middleMCP: { x: middleMCP.x, y: middleMCP.y },
    },
  };
}
