'use client';

import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function useStarGeometry() {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const outerRadius = 1;
    const innerRadius = 0.42;
    const points = 5;

    for (let i = 0; i < points * 2; i += 1) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }

    shape.closePath();

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.42,
      bevelEnabled: true,
      bevelSegments: 10,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.08,
      curveSegments: 16,
    });

    extrudeGeometry.center();
    return extrudeGeometry;
  }, []);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return geometry;
}

function MainStar({ geometry }: { geometry: THREE.ExtrudeGeometry }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y += delta * 0.35;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.45) * 0.12;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.06;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.9}>
      <group ref={groupRef}>
        <mesh geometry={geometry} castShadow receiveShadow scale={0.95}>
          <meshPhysicalMaterial
            color="#ff5db1"
            emissive="#ff3c96"
            emissiveIntensity={0.35}
            metalness={0.25}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.15}
          />
        </mesh>
      </group>
    </Float>
  );
}

function OrbitingStars({ geometry }: { geometry: THREE.ExtrudeGeometry }) {
  const orbitRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!orbitRef.current) {
      return;
    }

    orbitRef.current.rotation.y -= delta * 0.2;
    orbitRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.18;
  });

  return (
    <group ref={orbitRef}>
      <mesh geometry={geometry} position={[-1.9, 0.9, -0.7]} rotation={[0.2, 0.8, -0.3]} scale={0.18}>
        <meshStandardMaterial color="#ffd166" emissive="#ffcf6a" emissiveIntensity={0.25} roughness={0.3} />
      </mesh>
      <mesh geometry={geometry} position={[1.8, 0.3, -0.9]} rotation={[0.6, -0.4, 0.5]} scale={0.14}>
        <meshStandardMaterial color="#ffa3d7" emissive="#ff84c4" emissiveIntensity={0.25} roughness={0.28} />
      </mesh>
      <mesh geometry={geometry} position={[1.45, -1.1, 0.2]} rotation={[0.2, 0.4, -0.2]} scale={0.12}>
        <meshStandardMaterial color="#c9b6ff" emissive="#a88dff" emissiveIntensity={0.2} roughness={0.32} />
      </mesh>
      <mesh geometry={geometry} position={[-1.55, -0.95, 0.35]} rotation={[-0.4, -0.6, 0.2]} scale={0.16}>
        <meshStandardMaterial color="#ff8cc5" emissive="#ff70b7" emissiveIntensity={0.22} roughness={0.3} />
      </mesh>
    </group>
  );
}

function AccentRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ringRef.current) {
      return;
    }

    ringRef.current.rotation.z += delta * 0.18;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.45}>
      <mesh ref={ringRef} rotation={[1.25, 0.15, 0.4]} position={[0, -0.05, -0.35]}>
        <torusGeometry args={[1.35, 0.03, 24, 180]} />
        <meshStandardMaterial
          color="#ffc3e1"
          emissive="#ff8dcb"
          emissiveIntensity={0.18}
          roughness={0.25}
          metalness={0.35}
        />
      </mesh>
    </Float>
  );
}

export default function StarScene() {
  const geometry = useStarGeometry();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) {
      return;
    }

    if (document.fullscreenElement === containerRef.current) {
      await document.exitFullscreen();
      return;
    }

    await containerRef.current.requestFullscreen();
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-[radial-gradient(circle_at_top,_#38245d_0%,_#1d1633_45%,_#090711_100%)] shadow-[0_30px_80px_rgba(20,10,40,0.45)] ${
        isFullscreen
          ? 'h-screen min-h-screen rounded-none border-0'
          : 'h-[70vh] min-h-[460px] rounded-[28px] border border-fuchsia-200/30'
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-black/30 to-transparent" />
      <div className="absolute left-5 top-5 z-10">
        <p className="text-xs uppercase tracking-[0.35em] text-fuchsia-200/80">Preview</p>
        <h2 className="mt-2 text-xl font-semibold text-white md:text-2xl">Star Stage</h2>
        <p className="mt-2 max-w-sm text-sm text-fuchsia-100/75">
          拖拽查看细节，点击右上角按钮可以全屏沉浸预览。
        </p>
      </div>
      <button
        type="button"
        onClick={() => void toggleFullscreen()}
        className="absolute right-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
      >
        {isFullscreen ? (
          <ArrowsPointingInIcon className="h-4 w-4" />
        ) : (
          <ArrowsPointingOutIcon className="h-4 w-4" />
        )}
        {isFullscreen ? '退出全屏' : '全屏预览'}
      </button>
      <Canvas camera={{ position: [0, 0.1, 4.4], fov: 40 }} shadows>
        <fog attach="fog" args={['#090711', 5, 10]} />
        <color attach="background" args={['#090711']} />
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[2.5, 3, 2]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-2, 1.2, 2]} intensity={18} color="#ff74bc" distance={7} />
        <pointLight position={[2.5, -0.5, 1.5]} intensity={10} color="#7f6bff" distance={7} />
        <spotLight
          position={[0, 4, 1.5]}
          angle={0.35}
          penumbra={1}
          intensity={20}
          color="#ffd7f0"
          castShadow
        />
        <Sparkles count={80} scale={[5.5, 4, 5]} size={2.2} speed={0.35} noise={0.8} color="#ffd1ea" />
        <AccentRing />
        <MainStar geometry={geometry} />
        <OrbitingStars geometry={geometry} />
        <ContactShadows
          position={[0, -1.45, 0]}
          opacity={0.45}
          scale={7}
          blur={2.4}
          far={2.8}
          color="#1f1038"
        />
        <OrbitControls
          enablePan={false}
          minDistance={3.2}
          maxDistance={6}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.8}
        />
      </Canvas>
    </div>
  );
}
