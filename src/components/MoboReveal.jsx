import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import './MoboReveal.css';

useGLTF.preload('/models/mobo.glb');

function MoboModel({ scrollProgressRef }) {
  const { scene } = useGLTF('/models/mobo.glb');
  const tiltRef = useRef(null);
  const chassisRef = useRef(null);
  const liftRef = useRef(null);

  const normalizedScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return 2.0 / maxDim;
  }, [scene]);

  useFrame((state, delta) => {
    const progress = scrollProgressRef.current;
    const eased = 1 - Math.pow(1 - progress, 2);
    const t = state.clock.getElapsedTime();

    if (tiltRef.current) {
      // Start tilted to show the board face, flatten slightly as we scroll
      const targetTiltX = THREE.MathUtils.lerp(0.55, 0.18, eased);
      const targetTiltZ = THREE.MathUtils.lerp(0.18, -0.06, eased);
      const lerpFactor = Math.min(delta * 3, 1);
      tiltRef.current.rotation.x += (targetTiltX - tiltRef.current.rotation.x) * lerpFactor;
      tiltRef.current.rotation.z += (targetTiltZ - tiltRef.current.rotation.z) * lerpFactor;
    }

    if (chassisRef.current) {
      chassisRef.current.rotation.y += delta * (0.28 + eased * 0.28);
      chassisRef.current.rotation.x = Math.sin(t * 0.19) * 0.05;
      chassisRef.current.rotation.z = Math.sin(t * 0.27) * 0.035;
    }

    if (liftRef.current) {
      liftRef.current.position.y = Math.sin(t * 0.85) * 0.07 + THREE.MathUtils.lerp(-0.1, 0.06, eased);
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

function MoboReveal() {
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

      const enterStart = viewport * 0.85;
      const enterEnd = viewport * 0.15;
      const progress = THREE.MathUtils.clamp(
        (enterStart - rect.top) / (enterStart - enterEnd),
        0,
        1
      );
      scrollProgressRef.current = progress;

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
    <section id="powering-innovation" ref={sectionRef} className="mobo-flight">
      <div className="mobo-flight__sticky">
        <div className="mobo-flight__stage">
          <div className={`mobo-flight__heading ${headingRevealed ? 'mobo-flight__heading--show' : ''}`}>
            <span className="mobo-flight__label">Our Foundation</span>
            <h2>Powering Innovation Since 2008</h2>
          </div>

          <div className="mobo-flight__canvas" ref={canvasWrapperRef}>
            <Canvas
              camera={{ position: [0.45, 0.55, 2.1], fov: 52, near: 0.1, far: 70 }}
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
                <MoboModel scrollProgressRef={scrollProgressRef} />
                <Environment preset="studio" />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MoboReveal;
