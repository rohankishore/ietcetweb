import { useEffect, useRef } from 'react';
import { animate, random, remove, stagger } from 'animejs';
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

      const hud = 1 - segment(progress, 0.22, 0.36);
      const assembled = segment(progress, 0.16, 0.32) * (1 - segment(progress, 0.58, 0.72));
      const exploded = segment(progress, 0.56, 0.82);
      const outro = segment(progress, 0.84, 1);
      const spin = progress * 220;

      stage.style.setProperty('--show-progress', progress.toFixed(4));
      stage.style.setProperty('--scene-hud', hud.toFixed(4));
      stage.style.setProperty('--scene-assembled', assembled.toFixed(4));
      stage.style.setProperty('--scene-exploded', exploded.toFixed(4));
      stage.style.setProperty('--scene-outro', outro.toFixed(4));
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
    const assemblyCoils = stage.querySelectorAll('.lens-assembly__coil');
    const explodedParts = stage.querySelectorAll('.lens-explode__part');
    const labels = stage.querySelectorAll('.lens-copy__line');

    const animations = [
      animate(hudTicks, {
        opacity: [0.18, 0.7, 0.22],
        scaleY: [0.9, 1.2, 1],
        easing: 'inOutSine',
        delay: stagger(14),
        duration: 1200,
        loop: true,
      }),
      animate(hudDots, {
        translateY: [10, -12],
        translateX: () => random(-5, 5),
        opacity: [0, 1, 0],
        scale: [0.8, 1.25, 0.7],
        easing: 'outSine',
        delay: stagger(120, { from: 'center' }),
        duration: 1400,
        loop: true,
      }),
      animate(hudBands, {
        rotate: (el, idx) => (idx % 2 === 0 ? [0, 8, 0] : [0, -10, 0]),
        opacity: [0.3, 0.9, 0.3],
        easing: 'inOutQuad',
        delay: stagger(180),
        duration: 2600,
        loop: true,
      }),
      animate(hudScan, {
        translateX: ['-120%', '130%'],
        easing: 'inOutQuart',
        duration: 2000,
        loop: true,
      }),
      animate(assemblyRings, {
        rotate: (el, idx) => (idx % 2 === 0 ? [0, 360] : [0, -360]),
        easing: 'linear',
        duration: 9000,
        loop: true,
      }),
      animate(assemblyCoils, {
        translateY: [0, -8, 0],
        scale: [1, 1.04, 1],
        easing: 'inOutSine',
        delay: stagger(140),
        duration: 2200,
        loop: true,
      }),
      animate(explodedParts, {
        translateY: () => random(-16, 16),
        translateX: () => random(-18, 18),
        rotate: () => random(-6, 6),
        easing: 'inOutSine',
        duration: 3400,
        direction: 'alternate',
        loop: true,
      }),
      animate(labels, {
        opacity: [0.2, 1, 0.4],
        translateX: [0, 8, 0],
        easing: 'inOutSine',
        delay: stagger(160),
        duration: 1700,
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
        assemblyCoils,
        explodedParts,
        labels,
      ]);
    };
  }, []);

  return (
    <section ref={sectionRef} className="lens-scroll" aria-label="Engineering animation showcase">
      <div className="lens-scroll__sticky">
        <div className="lens-scroll__stage" ref={stageRef}>
          <header className="lens-copy">
            <p className="lens-copy__kicker">Engineering Motion Stack</p>
            <h2>Scroll through a live modular animation pipeline</h2>
            <p className="lens-copy__desc">
              Original Anime.js-powered sequence with layered HUD telemetry, assembled optics,
              and exploded module choreography.
            </p>
            <div className="lens-copy__rails" aria-hidden="true">
              <span className="lens-copy__line">waapi</span>
              <span className="lens-copy__line">timeline</span>
              <span className="lens-copy__line">stagger</span>
              <span className="lens-copy__line">svg</span>
              <span className="lens-copy__line">animation</span>
            </div>
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
                {Array.from({ length: 96 }).map((_, idx) => (
                  <span
                    key={`tick-${idx}`}
                    className="lens-hud__tick"
                    style={{ '--angle': `${(idx / 96) * 360}deg` }}
                  />
                ))}
              </div>
              <div className="lens-hud__dots">
                {Array.from({ length: 24 }).map((_, idx) => (
                  <span
                    key={`dot-${idx}`}
                    className="lens-hud__dot"
                    style={{ '--angle': `${(idx / 24) * 360}deg` }}
                  />
                ))}
              </div>
            </div>

            <div className="lens-assembly" aria-hidden="true">
              <span className="lens-assembly__ring lens-assembly__ring--a" />
              <span className="lens-assembly__ring lens-assembly__ring--b" />
              <span className="lens-assembly__ring lens-assembly__ring--c" />
              <span className="lens-assembly__coil lens-assembly__coil--1" />
              <span className="lens-assembly__coil lens-assembly__coil--2" />
              <span className="lens-assembly__coil lens-assembly__coil--3" />
              <span className="lens-assembly__body" />
              <span className="lens-assembly__front" />
              <span className="lens-assembly__rear" />
            </div>

            <div className="lens-explode" aria-hidden="true">
              {Array.from({ length: 11 }).map((_, idx) => (
                <span key={`part-${idx}`} className={`lens-explode__part lens-explode__part--${idx + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScrollLensShowcase;
