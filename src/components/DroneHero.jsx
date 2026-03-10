import { useRef, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center, Environment } from '@react-three/drei';
import * as THREE from 'three';
import './DroneHero.css';

// Kick off GLTF fetch as early as possible
useGLTF.preload('/models/drone.glb');

// ─── Drone mesh ──────────────────────────────────────────────────────────────

function DroneModel() {
  const { scene } = useGLTF('/models/drone.glb');
  const groupRef = useRef();

  // Compute a uniform scale so the longest axis of the drone equals 2 world units.
  // We read the bounding box of the raw scene before any group transforms apply.
  const normalizedScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    return 2 / (maxDim || 1);
  }, [scene]);

  // Slow Y-axis rotation for a cinematic "orbit" feel
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  // <Center> auto-offsets children so their bounding box is at the group origin.
  // The outer <group> then applies the normalised scale.
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

    // Z: 1.5 (very close, drone fills/overflows frame) → 5.5 (full overview)
    const targetZ = 1.5 + p * 4;
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
  const sectionRef       = useRef(null);
  const textRef          = useRef(null);
  const scrollHintRef    = useRef(null);
  const scrollProgressRef = useRef(0);

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

      // Fade + rise the title text in once progress > 70 %
      if (textRef.current) {
        const t = Math.max(0, Math.min(1, (progress - 0.70) / 0.25));
        textRef.current.style.opacity = t;
        textRef.current.style.transform = `translateY(${(1 - t) * 24}px)`;
      }

      // Fade the scroll hint out quickly
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = Math.max(0, 1 - progress * 5);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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

        {/* ── Three.js canvas ─────────────────────────────────────── */}
        <Canvas
          camera={{ position: [0, 0.28, 1.5], fov: 60, near: 0.1, far: 100 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          aria-hidden="true"
        >
          {/* Deep-space background matching the site palette */}
          <color attach="background" args={['#090614']} />

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

        {/* ── Text overlay — appears after 70 % scroll ────────────── */}
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
