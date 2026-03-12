import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import './CpuReveal.css';

useGLTF.preload('/models/cpu.glb');

function CpuModel({ scrollProgressRef }) {
  const { scene } = useGLTF('/models/cpu.glb');
  const chassisRef = useRef(null);
  const spinRef = useRef(null);
  const liftRef = useRef(null);

  const normalizedScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return 2.2 / maxDim;
  }, [scene]);

  useFrame((state, delta) => {
    const progress = scrollProgressRef.current;
    const eased = 1 - Math.pow(1 - progress, 2);
    const time = state.clock.getElapsedTime();

    if (chassisRef.current) {
      chassisRef.current.rotation.x = THREE.MathUtils.lerp(-0.35, 0.1, eased);
      chassisRef.current.rotation.z = THREE.MathUtils.lerp(0.35, -0.05, eased);
      chassisRef.current.position.y = THREE.MathUtils.lerp(-0.15, 0.06, eased);
      chassisRef.current.scale.setScalar(THREE.MathUtils.lerp(0.9, 1, eased));
    }

    if (spinRef.current) {
      spinRef.current.rotation.y += delta * (0.25 + eased * 0.9);
      spinRef.current.rotation.x = Math.sin(time * 0.35) * 0.05;
    }

    if (liftRef.current) {
      liftRef.current.position.y = Math.sin(time * 1.4) * 0.05;
      liftRef.current.rotation.y -= delta * 0.15;
    }
  });

  return (
    <group ref={chassisRef} scale={normalizedScale}>
      <group ref={spinRef}>
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
  const copyRefs = useRef([]);
  const accentRef = useRef(null);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const total = Math.max(section.offsetHeight - viewport * 0.6, 1);
      const start = Math.min(Math.max(viewport * 0.2 - rect.top, 0), total);
      const progress = start / total;
      scrollProgressRef.current = progress;

      copyRefs.current.forEach((node, index) => {
        if (!node) return;
        const delay = index * 0.12;
        const fade = THREE.MathUtils.clamp((progress - delay) / 0.35, 0, 1);
        node.style.opacity = fade;
        node.style.transform = `translateY(${(1 - fade) * 24}px)`;
      });

      if (accentRef.current) {
        accentRef.current.style.opacity = `${0.15 + progress * 0.55}`;
        accentRef.current.style.transform = `scale(${1 + progress * 0.25})`;
      }
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  const setCopyRef = (el, index) => {
    if (el) {
      copyRefs.current[index] = el;
    }
  };

  return (
    <section id="recent-events" ref={sectionRef} className="cpu-reveal">
      <div className="cpu-reveal__sticky">
        <div className="cpu-reveal__copy">
          <span ref={(el) => setCopyRef(el, 0)} className="section-badge cpu-reveal__badge">Recent Events</span>
          <h2 ref={(el) => setCopyRef(el, 1)} className="cpu-reveal__title">
            Where silicon stress-tests collide with campus nights
          </h2>
          <p ref={(el) => setCopyRef(el, 2)} className="cpu-reveal__subtitle">
            The telemetry stack that powers CODE reCET also drives our field trials—every packet, voltage spike, and
            throttled core is visualized live so squads can iterate before sunrise.
          </p>
          <div ref={(el) => setCopyRef(el, 3)} className="cpu-reveal__facts">
            <div>
              <span>48 hr</span>
              burn window
            </div>
            <div>
              <span>12</span>
              firmware patches
            </div>
            <div>
              <span>4 TB</span>
              data captured
            </div>
          </div>
        </div>

        <div className="cpu-reveal__visual">
          <div className="cpu-reveal__glow" ref={accentRef} aria-hidden="true" />
          <Canvas
            camera={{ position: [0.6, 0.5, 1.8], fov: 48, near: 0.1, far: 50 }}
            gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
            dpr={[1, 2]}
            aria-hidden="true"
          >
            <ambientLight intensity={0.3} />
            <hemisphereLight intensity={0.35} groundColor="#0f172a" color="#e0e7ff" />
            <directionalLight position={[2, 3, 2]} intensity={1.6} color="#c084fc" />
            <directionalLight position={[-2, -4, -1]} intensity={0.8} color="#38bdf8" />
            <pointLight position={[0, 2, 0]} intensity={0.9} color="#f472b6" />

            <Suspense fallback={null}>
              <CpuModel scrollProgressRef={scrollProgressRef} />
              <Environment preset="studio" />
            </Suspense>
          </Canvas>
          <div className="cpu-reveal__tag">Telemetry Trials · 2024</div>
        </div>
      </div>
    </section>
  );
}

export default CpuReveal;
