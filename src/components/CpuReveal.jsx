import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import './CpuReveal.css';

useGLTF.preload('/models/cpu.glb');

function CpuModel({ scrollProgressRef }) {
  const { scene } = useGLTF('/models/cpu.glb');
  const chassisRef = useRef(null);
  const liftRef = useRef(null);

  const normalizedScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return 2.1 / maxDim;
  }, [scene]);

  useFrame((state, delta) => {
    const progress = scrollProgressRef.current;
    const eased = 1 - Math.pow(1 - progress, 2);
    const t = state.clock.getElapsedTime();

    if (chassisRef.current) {
      chassisRef.current.rotation.y += delta * (0.35 + eased * 0.35);
      chassisRef.current.rotation.x = Math.sin(t * 0.22) * 0.06 + THREE.MathUtils.lerp(-0.2, 0.08, eased);
      chassisRef.current.rotation.z = Math.sin(t * 0.31) * 0.04;
    }

    if (liftRef.current) {
      liftRef.current.position.y = Math.sin(t * 0.9) * 0.08 + THREE.MathUtils.lerp(-0.08, 0.05, eased);
    }
  });

  return (
    <group ref={chassisRef} scale={normalizedScale}>
      <group ref={liftRef}>
        <Center>
          <primitive object={scene} dispose={null} />
        </Center>
      </group>
    </group>
  );
}

function CpuReveal() {
  const sectionRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const [headingRevealed, setHeadingRevealed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * 0.2;
      const end = viewport * 0.8;
      const range = Math.max(end - start, 1);
      const raw = (start - rect.top) / range;
      const progress = THREE.MathUtils.clamp(raw, 0, 1);
      scrollProgressRef.current = progress;

      const shouldReveal = progress > 0.45;
      setHeadingRevealed((prev) => (prev === shouldReveal ? prev : shouldReveal));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="recent-builds" ref={sectionRef} className="cpu-stage">
      <div className="cpu-stage__sticky">
        <div className="cpu-stage__visual">
          <div className={`cpu-stage__heading ${headingRevealed ? 'cpu-stage__heading--revealed' : ''}`}>
            <span className={`section-badge cpu-stage__badge ${headingRevealed ? 'cpu-stage__badge--active' : ''}`}>
              Recent Builds
            </span>
            <h2>Recent builds lighting up CET</h2>
          </div>

          <div className="cpu-stage__canvas">
            <div className="cpu-stage__halo" aria-hidden="true" />
            <Canvas
              camera={{ position: [0.5, 0.45, 1.8], fov: 50, near: 0.1, far: 60 }}
              gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
              dpr={[1, 2]}
              aria-hidden="true"
            >
              <ambientLight intensity={0.28} />
              <hemisphereLight intensity={0.35} groundColor="#020617" color="#dbeafe" />
              <directionalLight position={[2.8, 3.4, 1.6]} intensity={1.6} color="#c084fc" />
              <directionalLight position={[-2.4, -3, -2]} intensity={0.9} color="#38bdf8" />
              <pointLight position={[0, 1.2, 0]} intensity={0.8} color="#f472b6" />

              <Suspense fallback={null}>
                <CpuModel scrollProgressRef={scrollProgressRef} />
                <Environment preset="studio" />
              </Suspense>
            </Canvas>
          </div>

          <p className="cpu-stage__caption">
            The CPU rig that parses CODE reCET telemetry floats center-stage so you feel the lab energy before the
            project blurbs scroll into view.
          </p>
        </div>
      </div>
    </section>
  );
}

export default CpuReveal;
