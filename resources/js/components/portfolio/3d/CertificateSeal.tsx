import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function SealShape() {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1}>
            <group ref={meshRef}>
                <mesh castShadow receiveShadow>
                    <cylinderGeometry args={[2, 2, 0.2, 64]} />
                    <meshStandardMaterial 
                        color="#ffd700" 
                        metalness={1} 
                        roughness={0.2}
                        envMapIntensity={2}
                    />
                </mesh>
                <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[1.7, 1.9, 64]} />
                    <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.4} />
                </mesh>
                <mesh position={[0, -0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[1.7, 1.9, 64]} />
                    <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.4} />
                </mesh>
            </group>
        </Float>
    );
}

export default function CertificateSeal() {
    return (
        <div className="w-full h-full min-h-[300px] sm:min-h-[400px]">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1.5} />
                <directionalLight position={[-5, -5, 5]} intensity={0.5} color="#ffebba" />
                
                <Environment preset="city" />
                
                <SealShape />
                
                <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} color="#000000" />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} maxPolarAngle={Math.PI / 2 + 0.2} minPolarAngle={Math.PI / 2 - 0.2} />
            </Canvas>
        </div>
    );
}
