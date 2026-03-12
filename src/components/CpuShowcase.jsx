import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import './CpuShowcase.css';

useGLTF.preload('/models/cpu.glb');

function CpuCore() {
  const { scene } = useGLTF('/models/cpu.glb');
  const groupRef = useRef(null);
  const liftRef = useRef(null);

  const normalizedScale = useMemo(() => {
    const bounds = new THREE.Box3().setFromObject(scene);
    const size = bounds.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return 2.3 / maxDim;
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current || !liftRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y += delta * 0.4;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.08;
    liftRef.current.position.y = Math.sin(t * 0.85) * 0.05;
    liftRef.current.rotation.y -= delta * 0.18;
  });

  return (
    <group ref={groupRef} scale={normalizedScale}>
      <group ref={liftRef}>
        <Center>
          <primitive object={scene} dispose={null} />
        </Center>
      </group>
    </group>
  );
}

function CpuShowcase({ className = '' }) {
  return (
    <div className={`cpu-showcase ${className}`}>
      <Canvas
        camera={{ position: [0.5, 0.6, 1.8], fov: 42, near: 0.1, far: 50 }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[2, 3, 2]} intensity={1.3} color="#c4b5fd" />
        <directionalLight position={[-2, -3, -2]} intensity={0.7} color="#60a5fa" />
        <pointLight position={[0, 2, 0]} intensity={0.9} color="#f472b6" />

        <Suspense fallback={null}>
          <CpuCore />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default CpuShowcase;
