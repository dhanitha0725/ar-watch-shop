import * as THREE from 'three';

/**
 * Exponential Moving Average (EMA) filter for 3D points and rotations
 * S_t = alpha * X_t + (1 - alpha) * S_{t-1}
 */
export class Vector3Smoother {
  private current: THREE.Vector3 | null = null;
  private alpha: number;

  constructor(alpha: number = 0.25) {
    this.alpha = alpha;
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

  constructor(alpha: number = 0.25) {
    this.alpha = alpha;
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

  constructor(alpha: number = 0.2) {
    this.alpha = alpha;
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

/**
 * Calculate 3D wrist pose from MediaPipe 21 Hand Landmarks
 * Landmark 0 = Wrist
 * Landmark 5 = Index Finger Knuckle (MCP)
 * Landmark 17 = Pinky Finger Knuckle (MCP)
 * Landmark 9 = Middle Knuckle (MCP)
 */
export function estimateWristPose(
  landmarks: Landmark[],
  canvasWidth: number,
  canvasHeight: number
): {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scaleFactor: number;
  isDetected: boolean;
} {
  if (!landmarks || landmarks.length < 21) {
    return {
      position: new THREE.Vector3(),
      rotation: new THREE.Euler(),
      scaleFactor: 1,
      isDetected: false
    };
  }

  const wrist = landmarks[0];
  const indexMCP = landmarks[5];
  const pinkyMCP = landmarks[17];
  const middleMCP = landmarks[9];

  // Convert normalized [0,1] coordinates to screen-space pixel coordinates centered at 0,0
  // In Three.js overlay, (0,0) is center of screen
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
  const position = new THREE.Vector3(watchPosX, watchPosY, wz);

  // Dynamic scale proportional to detected palm width
  const basePalmRef = 120; // Reference pixel width
  const scaleFactor = Math.max(0.6, Math.min(2.5, palmWidth / basePalmRef));

  return {
    position,
    rotation,
    scaleFactor,
    isDetected: true
  };
}
