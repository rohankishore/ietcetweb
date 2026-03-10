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


function DroneModel() {
  const { scene } = useGLTF('/models/drone.glb');
  const groupRef = useRef();

  const normalizedScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    return 2 / (maxDim || 1);
  }, [scene]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group ref={groupRef} scale={normalizedScale}>
      <Center>
        <primitive object={scene} dispose={null} />
      </Center>
    </group>
  );
}

// ─── Camera animation ────────────────────────────────────────────────────────

/**
 * Each frame, lerp the camera toward the target position derived from the
 * current scroll progress stored in scrollProgressRef.  Using a ref (instead
 * of state) means the scroll handler never triggers a React re-render.
 */
function CameraRig({ scrollProgressRef }) {
  useFrame((state, delta) => {
    const p = scrollProgressRef.current;

    // Z: 0.8 (close macro shot) → 3.0 (comfortable full-drone view)
    const targetZ = 0.8 + p * 2.2;
    // Y: slight downward tilt at start that levels off as we pull back
    const targetY = 0.28 * (1 - p);

    const lerpFactor = Math.min(delta * 5, 1);
    state.camera.position.z += (targetZ - state.camera.position.z) * lerpFactor;
    state.camera.position.y += (targetY - state.camera.position.y) * lerpFactor;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Hero section ────────────────────────────────────────────────────────────

function DroneHero() {
  const sectionRef         = useRef(null);
  const phrase1Ref          = useRef(null);
  const phrase2Ref          = useRef(null);
  const phrase3Ref          = useRef(null);
  const textRef             = useRef(null);
  const scrollHintRef       = useRef(null);
  const canvasWrapperRef    = useRef(null);
  const scrollProgressRef   = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      // Scrollable height = total section height − one viewport
      const scrollable = section.offsetHeight - window.innerHeight;
      // How far has the top of the section moved above the viewport top?
      const scrolled = Math.max(0, -section.getBoundingClientRect().top);
      const progress = Math.min(1, scrolled / scrollable);

      scrollProgressRef.current = progress;

      // ── Phrase 1: visible immediately, fades out 40–52 %
      if (phrase1Ref.current) {
        const o = progress < 0.40 ? 1 : Math.max(0, 1 - (progress - 0.40) / 0.12);
        phrase1Ref.current.style.opacity = o;
        phrase1Ref.current.style.transform = `translateY(0px)`;
      }

      // ── Phrase 2: fades in 45–55 %, stays until 70 %, fades out 70–82 %
      if (phrase2Ref.current) {
        const o = fade(progress, 0.45, 0.55, 0.70, 0.82);
        phrase2Ref.current.style.opacity = o;
        phrase2Ref.current.style.transform = `translateY(${(1 - Math.min(o * 3, 1)) * 28}px)`;
      }

      // ── Phrase 3: fades in 75–85 %, stays until 92 %, fades out 92–98 %
      if (phrase3Ref.current) {
        const o = fade(progress, 0.75, 0.85, 0.92, 0.98);
        phrase3Ref.current.style.opacity = o;
        phrase3Ref.current.style.transform = `translateY(${(1 - Math.min(o * 3, 1)) * 28}px)`;
      }

      // ── Final CTA block: fades in from 88 %
      if (textRef.current) {
        const t = Math.max(0, Math.min(1, (progress - 0.88) / 0.10));
        textRef.current.style.opacity = t;
        textRef.current.style.transform = `translateY(${(1 - t) * 24}px)`;
      }

      // ── Drone canvas: fade out 93–100 %
      if (canvasWrapperRef.current) {
        const cv = Math.max(0, 1 - (progress - 0.93) / 0.07);
        canvasWrapperRef.current.style.opacity = cv;
      }

      // Fade the scroll hint out quickly
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = Math.max(0, 1 - progress * 5);
      }

      // Hide the navbar while inside the drone hero scroll; restore after
      if (progress < 1) {
        document.body.classList.add('drone-hero-active');
      } else {
        document.body.classList.remove('drone-hero-active');
      }
    };

    // Hide navbar immediately on mount
    document.body.classList.add('drone-hero-active');

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.body.classList.remove('drone-hero-active');
    };
  }, []);

  return (
    /*
     * Outer div — 300 vh tall — provides the scroll "runway".
     * Inner sticky div — 100 vh — stays pinned while the user scrolls through
     * the extra 200 vh, driving the camera animation.
     * After 300 vh, the sticky element unpins and normal page flow continues.
     */
    <div ref={sectionRef} className="drone-hero">
      <div className="drone-hero__sticky">

        {/* ── Phrases — rendered at z:1, below the canvas at z:2.          */}
        {/* Transparent canvas pixels let them show through; drone geometry  */}
        {/* paints over them, giving a true "behind the drone" layering.     */}
        <div ref={phrase1Ref} className="drone-hero__phrase" style={{ opacity: 1 }}>
          Machines take flight.
        </div>
        <div ref={phrase2Ref} className="drone-hero__phrase" style={{ opacity: 0 }}>
          Engineering meets ambition.
        </div>
        <div ref={phrase3Ref} className="drone-hero__phrase drone-hero__phrase--accent" style={{ opacity: 0 }}>
          This is IET On-Campus CET.
        </div>

        {/* ── Three.js canvas — z:2 with alpha:true so phrases show through  */}
        <div className="drone-hero__canvas-wrapper" ref={canvasWrapperRef}>
        <Canvas
          camera={{ position: [0, 0.28, 0.8], fov: 60, near: 0.1, far: 100 }}
          gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
          dpr={[1, 2]}
          aria-hidden="true"
        >
          {/* No <color> attachment — keep background transparent */}

          {/* Ambient fill */}
          <ambientLight intensity={0.35} />

          {/* Key light — top-right, warm white */}
          <directionalLight position={[5, 8, 5]} intensity={1.8} />

          {/* Rim light — brand purple */}
          <directionalLight position={[-4, -2, -4]} intensity={0.5} color="#8b5cf6" />

          {/* Accent points for reflective surfaces */}
          <pointLight position={[3, 3, 2]}   intensity={1.2} color="#6366f1" />
          <pointLight position={[-3, 1, -2]} intensity={0.8} color="#a78bfa" />

          <Suspense fallback={null}>
            <DroneModel />
            {/* PBR environment map — gives the drone metallic reflections */}
            <Environment preset="studio" />
          </Suspense>

          <CameraRig scrollProgressRef={scrollProgressRef} />
        </Canvas>
        </div>{/* end .drone-hero__canvas-wrapper */}

        {/* ── Text overlay — appears after 75 % scroll ────────────── */}
        <div
          ref={textRef}
          className="drone-hero__text"
          style={{ opacity: 0 }}
        >
          <span className="drone-hero__badge">IET On-Campus CET</span>
          <h1 className="drone-hero__title">
            Institution of Engineering<br />& Technology
          </h1>
          <p className="drone-hero__subtitle">
            College of Engineering Trivandrum
          </p>
          <div className="drone-hero__cta">
            <a href="#about" className="btn btn--primary">Learn More</a>
            <a href="/events" className="btn btn--secondary">Explore Events</a>
          </div>
        </div>

        {/* ── Scroll hint — fades out as user starts scrolling ───── */}
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
