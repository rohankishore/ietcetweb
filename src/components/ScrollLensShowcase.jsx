import { useEffect, useRef } from 'react';
import { animate, remove, stagger } from 'animejs';
import './ScrollLensShowcase.css';

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const segment = (value, start, end) => clamp01((value - start) / (end - start));

function ScrollLensShowcase() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return undefined;

    const updateScrollDrivenState = () => {
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const travel = Math.max(rect.height - viewport, 1);
      const progress = clamp01(-rect.top / travel);

      // Keep animation in the disc-rotation phase, then let page flow onward.
      const rotationPhase = segment(progress, 0.02, 0.28);
      const exitPhase = segment(progress, 0.3, 0.52);
      const hud = 1 - exitPhase * 0.9;
      const glow = 0.25 + rotationPhase * 0.55;
      const spin = rotationPhase * 210;

      stage.style.setProperty('--show-progress', progress.toFixed(4));
      stage.style.setProperty('--scene-hud', hud.toFixed(4));
      stage.style.setProperty('--scene-assembled', '0');
      stage.style.setProperty('--scene-exploded', '0');
      stage.style.setProperty('--scene-glow', glow.toFixed(4));
      stage.style.setProperty('--scroll-spin', `${spin.toFixed(2)}deg`);
    };

    updateScrollDrivenState();
    window.addEventListener('scroll', updateScrollDrivenState, { passive: true });
    window.addEventListener('resize', updateScrollDrivenState);

    return () => {
      window.removeEventListener('scroll', updateScrollDrivenState);
      window.removeEventListener('resize', updateScrollDrivenState);
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const hudTicks = stage.querySelectorAll('.lens-hud__tick');
    const hudDots = stage.querySelectorAll('.lens-hud__dot');
    const hudBands = stage.querySelectorAll('.lens-hud__band');
    const hudScan = stage.querySelector('.lens-hud__scan');
    const assemblyRings = stage.querySelectorAll('.lens-assembly__ring');


    const animations = [
      animate(hudTicks, {
        opacity: [0.22, 0.78, 0.22],
        scaleY: [0.85, 1.2, 1],
        easing: 'inOutSine',
        delay: stagger(10),
        duration: 1200,
        loop: true,
      }),
      animate(hudDots, {
        translateY: [8, -10],
        opacity: [0, 1, 0],
        scale: [0.8, 1.2, 0.75],
        easing: 'outSine',
        delay: stagger(100, { from: 'center' }),
        duration: 1400,
        loop: true,
      }),
      animate(hudBands, {
        rotate: (el, idx) => (idx % 2 === 0 ? [0, 8, 0] : [0, -10, 0]),
        opacity: [0.3, 0.88, 0.3],
        easing: 'inOutQuad',
        delay: stagger(180),
        duration: 2400,
        loop: true,
      }),
      animate(hudScan, {
        translateX: ['-120%', '130%'],
        easing: 'inOutQuart',
        duration: 1900,
        loop: true,
      }),
      animate(assemblyRings, {
        rotate: (el, idx) => (idx % 2 === 0 ? [0, 360] : [0, -360]),
        easing: 'linear',
        duration: 9200,
        loop: true,
      }),
    ];

    return () => {
      animations.forEach((instance) => instance.pause());
      remove([
        hudTicks,
        hudDots,
        hudBands,
        hudScan,
        assemblyRings,
      ]);
    };
  }, []);

  return (
    <section ref={sectionRef} className="lens-scroll" aria-label="IET animation showcase">
      <div className="lens-scroll__sticky">
        <div className="lens-scroll__stage" ref={stageRef}>
          <header className="lens-copy">
            <p className="lens-copy__kicker">Our Foundation</p>
            <h2>Powering Innovation Since 2008</h2>
            <p className="lens-copy__desc">
              As the first IET chapter in Kerala, inaugurated on November 14, 2008,
              we continue building immersive engineering experiences through bold execution.
            </p>
          </header>

          <div className="lens-view">
            <div className="lens-hud" aria-hidden="true">
              <div className="lens-hud__ring lens-hud__ring--outer" />
              <div className="lens-hud__ring lens-hud__ring--inner" />
              <div className="lens-hud__bands">
                <span className="lens-hud__band" />
                <span className="lens-hud__band" />
                <span className="lens-hud__band" />
                <span className="lens-hud__band" />
              </div>
              <div className="lens-hud__wave" />
              <div className="lens-hud__scan" />
              <div className="lens-hud__ticks">
                {Array.from({ length: 104 }).map((_, idx) => (
                  <span
                    key={`tick-${idx}`}
                    className="lens-hud__tick"
                    style={{ '--angle': `${(idx / 104) * 360}deg` }}
                  />
                ))}
              </div>
              <div className="lens-hud__dots">
                {Array.from({ length: 26 }).map((_, idx) => (
                  <span
                    key={`dot-${idx}`}
                    className="lens-hud__dot"
                    style={{ '--angle': `${(idx / 26) * 360}deg` }}
                  />
                ))}
              </div>
            </div>

            <div className="lens-assembly" aria-hidden="true">
              <span className="lens-assembly__ring lens-assembly__ring--a" />
              <span className="lens-assembly__ring lens-assembly__ring--b" />
              <span className="lens-assembly__ring lens-assembly__ring--c" />
              <span className="lens-assembly__shell" />
              <span className="lens-assembly__core" />
              <span className="lens-assembly__front" />
              <span className="lens-assembly__rear" />
              <div className="lens-assembly__ribs">
                {Array.from({ length: 22 }).map((_, idx) => (
                  <span key={`rib-${idx}`} className="lens-assembly__rib" />
                ))}
              </div>
            </div>

            <div className="lens-explode" aria-hidden="true">
              <div className="lens-explode__cluster">
                <span className="lens-explode__pill lens-explode__pill--top" />
                <span className="lens-explode__pill lens-explode__pill--mid-a" />
                <span className="lens-explode__pill lens-explode__pill--mid-b" />
                <span className="lens-explode__pill lens-explode__pill--bot" />
                <span className="lens-explode__slab" />
                <div className="lens-explode__stripes">
                  {Array.from({ length: 22 }).map((_, idx) => (
                    <span key={`stripe-${idx}`} className="lens-explode__stripe" />
                  ))}
                </div>
                <span className="lens-explode__disk" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ScrollLensShowcase;
