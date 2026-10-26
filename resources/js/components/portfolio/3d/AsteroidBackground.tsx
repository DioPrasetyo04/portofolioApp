import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Asteroid component
const Asteroid = ({ position, scale, color, speed, distort }: any) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += speed * 0.01;
    mesh.current.rotation.y += speed * 0.01;
  });

  return (
    <Float speed={speed * 2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={mesh} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          envMapIntensity={0.5}
          clearcoat={0.2}
          clearcoatRoughness={0.8}
          roughness={0.9}
          metalness={0.1}
          distort={distort}
          radius={1}
        />
      </mesh>
    </Float>
  );
};

// Mouse Parallax effect
const Rig = () => {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();
  
  return useFrame(() => {
    camera.position.lerp(vec.set(mouse.x * 2, mouse.y * 2, camera.position.z), 0.05);
    camera.lookAt(0, 0, 0);
  });
};

export default function AsteroidBackground() {
  const [isDark, setIsDark] = useState(true);

  // Sync with theme
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    setIsDark(document.documentElement.classList.contains('dark'));
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);
  
  // Define asteroid colors based on theme
  const asteroidColors = isDark 
    ? ['#2a2a35', '#3f3f5a', '#1e1e24', '#4a4a6a']
    : ['#e5e5eb', '#d4d4e0', '#f4f4f5', '#c0c0cf'];

  const asteroids = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 40; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 20 - 10
        ],
        scale: Math.random() * 1.5 + 0.2,
        color: asteroidColors[Math.floor(Math.random() * asteroidColors.length)],
        speed: Math.random() * 0.5 + 0.1,
        distort: Math.random() * 0.4 + 0.1
      });
    }
    return temp;
  }, [asteroidColors]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-colors duration-700">
      <div className={`absolute inset-0 transition-colors duration-700 ${isDark ? 'bg-[#0a0a0f]' : 'bg-[#fafafa]'}`} />
      
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }} dpr={[1, 2]}>
        <ambientLight intensity={isDark ? 0.2 : 0.8} />
        <directionalLight position={[10, 10, 10]} intensity={isDark ? 1 : 1.5} color={isDark ? "#8B5CF6" : "#ffffff"} />
        <directionalLight position={[-10, -10, -10]} intensity={isDark ? 0.5 : 0.2} color="#22D3EE" />
        
        {isDark && (
          <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        )}

        {asteroids.map((props, i) => (
          <Asteroid key={i} {...props} />
        ))}
        
        <Rig />
      </Canvas>

      {/* Gradient Overlays for smooth blending */}
      <div className={`absolute inset-0 bg-gradient-to-b transition-colors duration-700 ${isDark ? 'from-[#0a0a0f]/80 via-transparent to-[#0a0a0f]' : 'from-[#fafafa]/80 via-transparent to-[#fafafa]'} pointer-events-none`} />
    </div>
  );
}
