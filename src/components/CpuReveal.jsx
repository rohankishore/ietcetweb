import { useEffect, useRef, useState } from 'react';
import { animate, random, remove, stagger } from 'animejs';
import './CpuReveal.css';

const clamp01 = (value) => Math.max(0, Math.min(1, value));

function CpuReveal() {
  const sectionRef = useRef(null);
  const animationWrapperRef = useRef(null);
  const sceneRef = useRef(null);
  const [headingRevealed, setHeadingRevealed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;

      const enterStart = viewport * 0.85;
      const enterEnd = viewport * 0.15;
      const progress = clamp01(
        (enterStart - rect.top) / (enterStart - enterEnd),
      );

      const exitProgress = clamp01(-rect.top / (viewport * 0.65));
      const eased = 1 - Math.pow(1 - progress, 3);

      if (animationWrapperRef.current) {
        animationWrapperRef.current.style.opacity = 1 - exitProgress;
      }
      if (sceneRef.current) {
        sceneRef.current.style.setProperty('--cpu-progress', eased.toFixed(4));
        sceneRef.current.style.setProperty('--cpu-enter', progress.toFixed(4));
      }

      const shouldReveal = progress > 0.5 && exitProgress < 0.3;
      setHeadingRevealed((prev) => (prev === shouldReveal ? prev : shouldReveal));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const root = sceneRef.current;
    if (!root) return undefined;

    const chip = root.querySelector('.cpu-anim__chip');
    const halo = root.querySelector('.cpu-anim__halo');
    const shine = root.querySelector('.cpu-anim__shine');
    const traces = root.querySelectorAll('.cpu-anim__trace');
    const sparks = root.querySelectorAll('.cpu-anim__spark');
    const pins = root.querySelectorAll('.cpu-anim__pin');

    const animations = [
      animate(chip, {
        rotate: [0, 3, -2, 1, 0],
        translateY: [0, -10, 6, -4, 0],
        scale: [1, 1.03, 0.995, 1],
        easing: 'easeInOutSine',
        duration: 4800,
        loop: true,
      }),
      animate(halo, {
        scale: [0.9, 1.18],
        opacity: [0.28, 0.5, 0.2],
        easing: 'easeInOutQuad',
        duration: 2500,
        direction: 'alternate',
        loop: true,
      }),
      animate(shine, {
        translateX: ['-130%', '130%'],
        easing: 'easeInOutQuart',
        duration: 2300,
        loop: true,
      }),
      animate(traces, {
        opacity: [0.18, 0.72],
        scaleX: [0.88, 1.08],
        easing: 'easeInOutSine',
        delay: stagger(110),
        duration: 1500,
        direction: 'alternate',
        loop: true,
      }),
      animate(sparks, {
        translateY: [12, -26],
        translateX: () => random(-8, 8),
        opacity: [0, 0.95, 0],
        scale: [0.6, 1.3, 0.8],
        easing: 'easeOutSine',
        delay: stagger(120, { from: 'center' }),
        duration: 1750,
        loop: true,
      }),
      animate(pins, {
        translateY: [0, -4, 0],
        opacity: [0.5, 1, 0.5],
        easing: 'easeInOutSine',
        delay: stagger(40),
        duration: 900,
        loop: true,
      }),
    ];

    return () => {
      animations.forEach((instance) => instance.pause());
      remove([chip, halo, shine, traces, sparks, pins]);
    };
  }, []);

  return (
    <section id="recent-builds" ref={sectionRef} className="cpu-flight">
      <div className="cpu-flight__sticky">
        <div className="cpu-flight__stage">
          <div className={`cpu-flight__heading ${headingRevealed ? 'cpu-flight__heading--show' : ''}`}>
            <span className="cpu-flight__label">Recent Builds</span>
            <h2>Recent builds lighting up CET</h2>
          </div>

          <div className="cpu-flight__canvas" ref={animationWrapperRef}>
            <div className="cpu-anim" ref={sceneRef} aria-hidden="true">
              <div className="cpu-anim__backdrop" />
              <div className="cpu-anim__halo" />

              <div className="cpu-anim__grid">
                {Array.from({ length: 9 }).map((_, idx) => (
                  <span key={`grid-${idx}`} className="cpu-anim__trace" />
                ))}
              </div>

              <div className="cpu-anim__chip-wrap">
                <div className="cpu-anim__chip">
                  <div className="cpu-anim__shine" />
                  <div className="cpu-anim__inner-core" />
                  <div className="cpu-anim__pinband cpu-anim__pinband--top">
                    {Array.from({ length: 14 }).map((_, idx) => (
                      <span key={`top-pin-${idx}`} className="cpu-anim__pin" />
                    ))}
                  </div>
                  <div className="cpu-anim__pinband cpu-anim__pinband--bottom">
                    {Array.from({ length: 14 }).map((_, idx) => (
                      <span key={`bottom-pin-${idx}`} className="cpu-anim__pin" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="cpu-anim__sparks">
                {Array.from({ length: 18 }).map((_, idx) => (
                  <span key={`spark-${idx}`} className="cpu-anim__spark" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CpuReveal;
