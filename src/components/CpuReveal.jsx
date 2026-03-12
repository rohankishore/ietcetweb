import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import './CpuReveal.css';

useGLTF.preload('/models/cpu.glb');

function CpuModel({ scrollProgressRef }) {
  const { scene } = useGLTF('/models/cpu.glb');
  const tiltRef = useRef(null);
  const chassisRef = useRef(null);
  const liftRef = useRef(null);

  const normalizedScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return 1.9 / maxDim;
  }, [scene]);

  useFrame((state, delta) => {
    const progress = scrollProgressRef.current;
    const eased = 1 - Math.pow(1 - progress, 2);
    const t = state.clock.getElapsedTime();

    if (tiltRef.current) {
      const targetTiltX = THREE.MathUtils.lerp(0.28, -0.08, eased);
      const targetTiltZ = THREE.MathUtils.lerp(-0.14, 0.05, eased);
      const lerpFactor = Math.min(delta * 3, 1);
      tiltRef.current.rotation.x += (targetTiltX - tiltRef.current.rotation.x) * lerpFactor;
      tiltRef.current.rotation.z += (targetTiltZ - tiltRef.current.rotation.z) * lerpFactor;
    }

    if (chassisRef.current) {
      chassisRef.current.rotation.y += delta * (0.35 + eased * 0.35);
      chassisRef.current.rotation.x = Math.sin(t * 0.22) * 0.06;
      chassisRef.current.rotation.z = Math.sin(t * 0.31) * 0.04;
    }

    if (liftRef.current) {
      liftRef.current.position.y = Math.sin(t * 0.9) * 0.08 + THREE.MathUtils.lerp(-0.08, 0.05, eased);
    }
  });

  return (
    <group ref={tiltRef}>
      <group ref={chassisRef} scale={normalizedScale}>
        <group ref={liftRef}>
          <Center>
            <primitive object={scene} dispose={null} />
          </Center>
        </group>
      </group>
    </group>
  );
}

function CpuReveal() {
  const sectionRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const [headingRevealed, setHeadingRevealed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;

      // Enter phase: start animating as section enters from below (immersive)
      const enterStart = viewport * 0.85;
      const enterEnd = viewport * 0.15;
      const progress = THREE.MathUtils.clamp(
        (enterStart - rect.top) / (enterStart - enterEnd),
        0,
        1
      );
      scrollProgressRef.current = progress;

      // Exit phase: fade out after section scrolls past the top
      const exitProgress = THREE.MathUtils.clamp(-rect.top / (viewport * 0.65), 0, 1);
      if (canvasWrapperRef.current) {
        canvasWrapperRef.current.style.opacity = 1 - exitProgress;
      }

      const shouldReveal = progress > 0.5 && exitProgress < 0.3;
      setHeadingRevealed((prev) => (prev === shouldReveal ? prev : shouldReveal));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="recent-builds" ref={sectionRef} className="cpu-flight">
      <div className="cpu-flight__sticky">
        <div className="cpu-flight__stage">
          <div className={`cpu-flight__heading ${headingRevealed ? 'cpu-flight__heading--show' : ''}`}>
            <span className="cpu-flight__label">Recent Builds</span>
            <h2>Recent builds lighting up CET</h2>
          </div>

          <div className="cpu-flight__canvas" ref={canvasWrapperRef}>
            <Canvas
              camera={{ position: [0.45, 0.38, 1.9], fov: 52, near: 0.1, far: 70 }}
              gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
              dpr={[1, 2]}
              aria-hidden="true"
            >
              <ambientLight intensity={0.25} />
              <hemisphereLight intensity={0.35} groundColor="#020617" color="#dbeafe" />
              <directionalLight position={[3.2, 3.6, 1.4]} intensity={1.8} color="#c084fc" />
              <directionalLight position={[-2.6, -3.2, -1.8]} intensity={0.85} color="#38bdf8" />
              <pointLight position={[0, 1.4, 0]} intensity={0.8} color="#f472b6" />

              <Suspense fallback={null}>
                <CpuModel scrollProgressRef={scrollProgressRef} />
                <Environment preset="studio" />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CpuReveal;
