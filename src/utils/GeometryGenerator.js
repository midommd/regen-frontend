import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// 🎨 1. PRO TEXTURE GENERATOR
const createProTexture = (type, colorHex) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Base Fill
    ctx.fillStyle = colorHex;
    ctx.fillRect(0, 0, 1024, 1024);

    if (type.includes('wood')) {
        // REALISTIC WOOD GRAIN
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        // Create 20 big rings
        for(let i=0; i<30; i++) {
            const x = Math.random() * 1024;
            const w = 5 + Math.random() * 50;
            ctx.fillRect(x, 0, w, 1024); 
        }
        // Fine grain
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        for(let i=0; i<1024; i+=2) {
            if(Math.random()>0.5) ctx.fillRect(i, 0, 1, 1024);
        }
    } else if (type.includes('denim')) {
        // REALISTIC DENIM TWILL
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        // Noise base
        for(let i=0; i<10000; i++) ctx.fillRect(Math.random()*1024, Math.random()*1024, 2, 2);
        
        // Diagonal Lines
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 2;
        for(let i=-1024; i<1024; i+=4) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i+1024, 1024);
            ctx.stroke();
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
};

// 🧵 2. SMART STITCHING (Strictly Filtered)
const addSmartStitches = (scene, w, h, d, pos, rot, materialType) => {
    // ⛔ SECURITY CHECK: NEVER STITCH WOOD OR METAL
    if (materialType.includes('wood') || materialType.includes('metal') || materialType.includes('plastic')) {
        return; 
    }

    const stitchGeom = new THREE.CapsuleGeometry(0.002, 0.01, 4, 8);
    const stitchMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, roughness: 0.8 });
    const group = new THREE.Group();
    group.position.set(pos[0], pos[1], pos[2]);
    group.rotation.set(rot[0], rot[1], rot[2]);

    const margin = 0.015; // 1.5cm margin
    // Perimeter path
    const path = [
        [-w/2+margin, h/2-margin], [w/2-margin, h/2-margin],
        [w/2-margin, -h/2+margin], [-w/2+margin, -h/2+margin],
        [-w/2+margin, h/2-margin]
    ];

    for(let i=0; i<path.length-1; i++) {
        const start = path[i];
        const end = path[i+1];
        const dist = Math.hypot(end[0]-start[0], end[1]-start[1]);
        const steps = Math.floor(dist / 0.02); // 2cm spacing
        
        for(let j=0; j<=steps; j++) {
            const t = j/steps;
            const x = start[0] + (end[0]-start[0])*t;
            const y = start[1] + (end[1]-start[1])*t;
            const stitch = new THREE.Mesh(stitchGeom, stitchMat);
            
            if(Math.abs(end[0]-start[0]) > Math.abs(end[1]-start[1])) stitch.rotation.z = Math.PI/2;
            
            stitch.position.set(x, y, d/2 + 0.001);
            group.add(stitch);
        }
    }
    scene.add(group);
};

// ⚙️ 3. GEOMETRY BUILDER
export const generateProceduralModel = (geoData) => {
    return new Promise((resolve, reject) => {
        if (!geoData || !geoData.components) { reject("No components"); return; }

        const scene = new THREE.Scene();

        geoData.components.forEach(part => {
            const w = (part.dims[0] || 10) / 100;
            const h = (part.dims[1] || 10) / 100;
            const d = (part.dims[2] || 10) / 100;
            const mods = part.modifiers || {};
            
            let geometry;

            // --- 📐 ADVANCED SHAPE LOGIC ---
            if (part.type === 'cone' || (part.type === 'cylinder' && mods.radius_bottom)) {
                // TAPERED LEG LOGIC (Real Architect Style)
                // If radius_top/bottom provided in CM, convert to Meters
                const rTop = (mods.radius_top || (w*100)/2) / 100;
                const rBot = (mods.radius_bottom || (w*100)/2) / 100;
                geometry = new THREE.CylinderGeometry(rTop, rBot, h, 32);
            } 
            else if (part.type === 'cylinder') {
                geometry = new THREE.CylinderGeometry(w/2, w/2, h, 32);
            } 
            else if (part.type === 'tube') {
                // Hollow Tube (Simulated with thin cylinder)
                geometry = new THREE.CylinderGeometry(w/2, w/2, h, 32, 1, true); // Open ended
                // To make it look real, we usually need 'thickness', but for now use DoubleSide material
            }
            else {
                // BOXES
                if (part.material.includes('denim') || part.material.includes('leather')) {
                    geometry = new RoundedBoxGeometry(w, h, d, 4, 0.02); // Soft edges
                } else {
                    // Wood/Metal gets sharp(er) edges but slightly beveled for realism
                    geometry = new RoundedBoxGeometry(w, h, d, 2, 0.002); 
                }
            }

            // --- 🎨 MATERIAL LOGIC ---
            const matType = part.material || 'plastic';
            const color = part.color || '#888888';
            let material;

            if (matType.includes('metal')) {
                material = new THREE.MeshStandardMaterial({
                    color: color, roughness: 0.2, metalness: 0.9,
                    envMapIntensity: 1.0
                });
            } else {
                const texture = createProTexture(matType, color);
                material = new THREE.MeshStandardMaterial({
                    map: texture,
                    color: 0xffffff,
                    roughness: matType.includes('wood') ? 0.6 : 0.9,
                    metalness: 0.0,
                    side: THREE.DoubleSide
                });
            }

            const mesh = new THREE.Mesh(geometry, material);
            const pos = [ (part.pos[0]||0)/100, (part.pos[1]||0)/100, (part.pos[2]||0)/100 ];
            const rot = [ (part.rot[0]||0)*(Math.PI/180), (part.rot[1]||0)*(Math.PI/180), (part.rot[2]||0)*(Math.PI/180) ];

            mesh.position.set(pos[0], pos[1], pos[2]);
            mesh.rotation.set(rot[0], rot[1], rot[2]);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            scene.add(mesh);

            // --- 🧵 STITCHING CALL ---
            if (part.type !== 'cylinder' && part.type !== 'cone') {
                addSmartStitches(scene, w, h, d, pos, rot, matType);
            }
        });

        const exporter = new GLTFExporter();
        exporter.parse(scene, (gltf) => {
            const blob = new Blob([gltf], { type: 'application/octet-stream' });
            resolve(URL.createObjectURL(blob));
        }, (e) => reject(e), { binary: true });
    });
};