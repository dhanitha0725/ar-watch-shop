import * as THREE from 'three';
import { Watch } from '../types/watch';

/**
 * Modifies materials on a Three.js Object3D hierarchy based on Watch config
 */
export function applyWatchMaterialCustomization(
  model: THREE.Object3D,
  watch: Watch,
  strapColorHex: string,
  dialColorHex: string,
  strapMaterialType: string = 'silicone'
): void {
  const strapColor = new THREE.Color(strapColorHex);
  const dialColor = new THREE.Color(dialColorHex);

  const strapMeshesLower = watch.strapMeshNames.map(m => m.toLowerCase());
  const dialMeshesLower = watch.dialMeshNames.map(m => m.toLowerCase());

  let roughness = 0.5;
  let metalness = 0.1;

  switch (strapMaterialType) {
    case 'leather':
      roughness = 0.75;
      metalness = 0.05;
      break;
    case 'steel':
      roughness = 0.18;
      metalness = 0.95;
      break;
    case 'titanium':
      roughness = 0.35;
      metalness = 0.85;
      break;
    case 'gold':
      roughness = 0.2;
      metalness = 0.9;
      break;
    case 'silicone':
    default:
      roughness = 0.55;
      metalness = 0.05;
      break;
  }

  model.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const meshNameLower = (mesh.name || '').toLowerCase();

      // Check if mesh or material matches strap definitions
      const isStrap = strapMeshesLower.some(name => 
        meshNameLower.includes(name) || 
        meshNameLower.includes('strap') || 
        meshNameLower.includes('belt')
      );

      // Check if mesh or material matches dial definitions
      const isDial = dialMeshesLower.some(name => 
        meshNameLower.includes(name) || 
        meshNameLower.includes('dial') || 
        meshNameLower.includes('face') || 
        meshNameLower.includes('screen')
      );

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

      materials.forEach((mat) => {
        if (!mat) return;
        const pbrMat = mat as THREE.MeshStandardMaterial;

        // If mesh matches strap or material name indicates strap
        if (isStrap || (pbrMat.name && (pbrMat.name.toLowerCase().includes('strap') || pbrMat.name.toLowerCase().includes('belt')))) {
          pbrMat.color = strapColor;
          pbrMat.roughness = roughness;
          pbrMat.metalness = metalness;
          pbrMat.needsUpdate = true;
        }

        // If mesh matches dial or material name indicates dial
        if (isDial || (pbrMat.name && (pbrMat.name.toLowerCase().includes('dial') || pbrMat.name.toLowerCase().includes('screen')))) {
          pbrMat.color = dialColor;
          if (pbrMat.emissive) {
            pbrMat.emissive = dialColor.clone().multiplyScalar(0.25);
          }
          pbrMat.needsUpdate = true;
        }
      });
    }
  });
}
