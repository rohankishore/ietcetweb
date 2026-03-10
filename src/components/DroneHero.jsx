import { useRef, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center, Environment } from '@react-three/drei';
import * as THREE from 'three';
import './DroneHero.css';

useGLTF.preload('/models/drone.glb');

function fade(p, i0, i1, o0, o1) {
  if (p < i0) return 0;
  if (p < i1) return (p - i0) / (i1 - i0);
  if (o0 === null) return 1;
  if (p < o0) return 1;
  if (p < o1) return 1 - (p - o0) / (o1 - o0);
  return 0;
}

function DroneModel({ scrollProgressRef }) {
  const { scene } = useGLTF('/models/drone.glb');
  const outerRef = useRef();
  const innerRef = useRef();
  const clockRef = useRef(0);

  const normalizedScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    return 2 / (maxDim || 1);
  }, [scene]);

  useFrame((_, delta) => {
    if (!outerRef.current || !innerRef.current) return;
    clockRef.current += delta;
    const t = clockRef.current;
    const p = scrollProgressRef.current;
    const ep = 1 - Math.pow(1 - p, 3);

    const targetTiltX = -0.38 * (1 - ep);
    const targetTiltZ =  0.22 * (1 - ep);
    outerRef.current.rotation.x += (targetTiltX - outerRef.current.rotation.x) * Math.min(delta * 2.5, 1);
    outerRef.current.rotation.z += (targetTiltZ - outerRef.current.rotation.z) * Math.min(delta * 2.5, 1);

    const spinSpeed = 1.4 - ep * 1.15;
    innerRef.current.rotation.y += delta * spinSpeed;

    innerRef.current.position.y = Math.sin(t * 0.72) * 0.06;
    innerRef.current.rotation.z = Math.sin(t * 0.51) * 0.025;
    innerRef.current.rotation.x = Math.sin(t * 0.38) * 0.018;
  });

  return (
    <group ref={outerRef} scale={normalizedScale}>
      <group ref={innerRef}>
        <Center>
          <primitive object={scene} dispose={null} />
        </Center>
      </group>
    </group>
  );
}

function OrbitLight({ scrollProgressRef }) {
  const lightRef = useRef();
  const clockRef = useRef(0);

  useFrame((_, delta) => {
    if (!lightRef.current) return;
    clockRef.current += delta;
    const t = clockRef.current;
    const p = scrollProgressRef.current;
    const r = 5 + p * 2;
    lightRef.current.position.x = Math.cos(t * 0.4) * r;
    lightRef.current.position.z = Math.sin(t * 0.4) * r;
    lightRef.current.position.y = 3 + Math.sin(t * 0.2) * 1.5;
    lightRef.current.intensity = 1.8 + Math.sin(t * 0.6) * 0.4;
  });

  return <pointLight ref={lightRef} color="#a78bfa" />;
}

function CameraRig({ scrollProgressRef }) {
  useFrame((state, delta) => {
    const p = scrollProgressRef.current;
    const ep = 1 - Math.pow(1 - p, 3);

    const targetZ = 0.8 + ep * 2.2;
    const targetY = 0.28 * (1 - ep);
    const targetX = -0.3 * (1 - ep);

    const targetFov = 55 - ep * 12;

    const lf = Math.min(delta * 3.2, 1);
    state.camera.position.z += (targetZ - state.camera.position.z) * lf;
    state.camera.position.y += (targetY - state.camera.position.y) * lf;
    state.camera.position.x += (targetX - state.camera.position.x) * lf;
    state.camera.fov += (targetFov - state.camera.fov) * lf;
    state.camera.updateProjectionMatrix();
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

function DroneHero() {
  const sectionRef       = useRef(null);
  const phrase1Ref       = useRef(null);
  const phrase2Ref       = useRef(null);
  const phrase3Ref       = useRef(null);
  const scrollHintRef    = useRef(null);
  const canvasWrapperRef = useRef(null);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const scrollable = section.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -section.getBoundingClientRect().top);
      const progress = Math.min(1, scrolled / scrollable);

      scrollProgressRef.current = progress;

      if (phrase1Ref.current) {
        const o = progress < 0.40 ? 1 : Math.max(0, 1 - (progress - 0.40) / 0.12);
        phrase1Ref.current.style.opacity = o;
        phrase1Ref.current.style.transform = 'translateY(0px)';
      }

      if (phrase2Ref.current) {
        const o = fade(progress, 0.45, 0.55, 0.70, 0.82);
        phrase2Ref.current.style.opacity = o;
        phrase2Ref.current.style.transform = `translateY(${(1 - Math.min(o * 3, 1)) * 28}px)`;
      }

      if (phrase3Ref.current) {
        const o = fade(progress, 0.75, 0.87, null, null);
        phrase3Ref.current.style.opacity = o;
        const lift = o < 1 ? (1 - Math.min(o * 3, 1)) * 32 : 0;
        phrase3Ref.current.style.transform = lift === 0 ? 'none' : `translateY(${lift}px)`;
      }

      if (canvasWrapperRef.current) {
        const cv = Math.max(0, 1 - (progress - 0.93) / 0.07);
        canvasWrapperRef.current.style.opacity = cv;
      }

      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = Math.max(0, 1 - progress * 5);
      }

      if (progress < 1) {
        document.body.classList.add('drone-hero-active');
      } else {
        document.body.classList.remove('drone-hero-active');
      }
    };

    document.body.classList.add('drone-hero-active');
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.body.classList.remove('drone-hero-active');
    };
  }, []);

  return (
    <div ref={sectionRef} className="drone-hero">
      <div className="drone-hero__sticky">

        <div ref={phrase1Ref} className="drone-hero__phrase" style={{ opacity: 1 }}>
          Machines take flight.
        </div>
        <div ref={phrase2Ref} className="drone-hero__phrase" style={{ opacity: 0 }}>
          Engineering meets ambition.
        </div>
        <div ref={phrase3Ref} className="drone-hero__phrase drone-hero__phrase--final" style={{ opacity: 0 }}>
          This is IET On-Campus CET.
        </div>

        <div className="drone-hero__canvas-wrapper" ref={canvasWrapperRef}>
          <Canvas
            camera={{ position: [-0.3, 0.28, 0.8], fov: 55, near: 0.1, far: 100 }}
            gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
            dpr={[1, 2]}
            aria-hidden="true"
          >
            <ambientLight intensity={0.25} />
            <directionalLight position={[6, 10, 5]} intensity={2.2} />
            <directionalLight position={[-5, -3, -5]} intensity={0.6} color="#8b5cf6" />
            <pointLight position={[3, 3, 2]} intensity={1.4} color="#6366f1" />

            <Suspense fallback={null}>
              <DroneModel scrollProgressRef={scrollProgressRef} />
              <OrbitLight scrollProgressRef={scrollProgressRef} />
              <Environment preset="studio" />
            </Suspense>

            <CameraRig scrollProgressRef={scrollProgressRef} />
          </Canvas>
        </div>

        <div ref={scrollHintRef} className="drone-hero__scroll-hint">
          <span className="drone-hero__scroll-text">Scroll to reveal</span>
          <div className="drone-hero__scroll-chevrons">
            <div className="drone-hero__chevron" />
            <div className="drone-hero__chevron" />
          </div>
        </div>

      </div>
    </div>
  );
}

export default DroneHero;
