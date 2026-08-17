import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Octahedron, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function FloatingMesh() {
    const mainMesh = useRef<THREE.Mesh>(null);
    const ringMesh = useRef<THREE.Mesh>(null);
    const octaMesh = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (mainMesh.current) {
            mainMesh.current.rotation.x = t * 0.2;
            mainMesh.current.rotation.y = t * 0.3;
        }
        if (ringMesh.current) {
            ringMesh.current.rotation.x = t * 0.4;
            ringMesh.current.rotation.y = t * 0.2;
        }
        if (octaMesh.current) {
            octaMesh.current.rotation.y = t * 0.5;
            octaMesh.current.rotation.z = t * 0.3;
        }
    });

    return (
        <group>
            {/* Core Glowing Sphere */}
            <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
                <Sphere ref={mainMesh} args={[1.2, 64, 64]} position={[0, 0, 0]}>
                    <MeshDistortMaterial
                        color="#8B5CF6"
                        attach="material"
                        distort={0.4}
                        speed={2.5}
                        roughness={0.15}
                        metalness={0.8}
                        emissive="#4C1D95"
                        emissiveIntensity={0.6}
                    />
                </Sphere>
            </Float>

            {/* Orbiting Futuristic Torus Ring */}
            <Float speed={3} rotationIntensity={2} floatIntensity={2}>
                <Torus ref={ringMesh} args={[2.2, 0.06, 32, 100]} position={[0, 0, 0]}>
                    <meshStandardMaterial
                        color="#22D3EE"
                        emissive="#06B6D4"
                        emissiveIntensity={0.8}
                        roughness={0.1}
                        metalness={0.9}
                    />
                </Torus>
            </Float>

            {/* Orbiting Satellite Geometric Mesh */}
            <Float speed={2.5} rotationIntensity={1.8} floatIntensity={2.2}>
                <Octahedron ref={octaMesh} args={[0.5]} position={[2.2, 1.4, 0.5]}>
                    <meshStandardMaterial
                        color="#F59E0B"
                        emissive="#D97706"
                        emissiveIntensity={0.7}
                        roughness={0.2}
                        metalness={0.8}
                    />
                </Octahedron>
            </Float>

            {/* Ambient Star Particles */}
            <Sparkles count={80} scale={6} size={3} speed={0.4} color="#22D3EE" />
            <Sparkles count={50} scale={5} size={4} speed={0.6} color="#8B5CF6" />
        </group>
    );
}

export default function ThreeCanvas() {
    return (
        <div className="w-full h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[560px] relative">
            <Canvas
                camera={{ position: [0, 0, 5.5], fov: 45 }}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFFFFF" />
                <pointLight position={[-6, -6, -4]} intensity={2.5} color="#8B5CF6" />
                <pointLight position={[6, 6, 4]} intensity={2.5} color="#22D3EE" />
                <pointLight position={[0, -4, 2]} intensity={1.5} color="#F59E0B" />

                <FloatingMesh />
            </Canvas>
        </div>
    );
}
