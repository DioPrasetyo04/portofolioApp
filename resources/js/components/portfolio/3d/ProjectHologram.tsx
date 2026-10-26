import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function HologramShape() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5;
            meshRef.current.rotation.x += delta * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef}>
                <octahedronGeometry args={[2, 0]} />
                <meshStandardMaterial
                    color="#00f0ff"
                    wireframe
                    emissive="#00f0ff"
                    emissiveIntensity={2}
                    transparent
                    opacity={0.8}
                />
            </mesh>
            <mesh>
                <octahedronGeometry args={[1.5, 0]} />
                <meshStandardMaterial
                    color="#ff00ff"
                    wireframe
                    emissive="#ff00ff"
                    emissiveIntensity={1}
                    transparent
                    opacity={0.5}
                />
            </mesh>
        </Float>
    );
}

export default function ProjectHologram() {
    return (
        <div className="w-full h-full min-h-[300px] sm:min-h-[400px]">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#00f0ff" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />
                
                <HologramShape />
                
                <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2} far={4} color="#00f0ff" />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
}
