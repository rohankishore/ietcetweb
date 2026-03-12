import { useEffect, useRef, useState } from 'react';
import anime from 'animejs/lib/anime.es.js';
import './MoboReveal.css';

const clamp01 = (value) => Math.max(0, Math.min(1, value));

function MoboReveal() {
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
        sceneRef.current.style.setProperty('--mobo-progress', eased.toFixed(4));
        sceneRef.current.style.setProperty('--mobo-enter', progress.toFixed(4));
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

    const board = root.querySelector('.mobo-anim__board');
    const glow = root.querySelector('.mobo-anim__board-glow');
    const buses = root.querySelectorAll('.mobo-anim__bus');
    const nodes = root.querySelectorAll('.mobo-anim__node');
    const chips = root.querySelectorAll('.mobo-anim__chip');
    const packets = root.querySelectorAll('.mobo-anim__packet');

    const animations = [
      anime({
        targets: board,
        rotate: [0, -2, 3, -1, 0],
        translateY: [0, -8, 4, -2, 0],
        scale: [1, 1.02, 0.998, 1],
        easing: 'easeInOutSine',
        duration: 5200,
        loop: true,
      }),
      anime({
        targets: glow,
        opacity: [0.2, 0.52, 0.25],
        scale: [0.92, 1.16],
        easing: 'easeInOutQuad',
        duration: 2800,
        direction: 'alternate',
        loop: true,
      }),
      anime({
        targets: buses,
        opacity: [0.25, 0.86],
        scaleX: [0.82, 1.12],
        easing: 'easeInOutSine',
        delay: anime.stagger(90),
        duration: 1700,
        direction: 'alternate',
        loop: true,
      }),
      anime({
        targets: nodes,
        scale: [0.78, 1.28, 0.86],
        opacity: [0.45, 1, 0.5],
        easing: 'easeInOutSine',
        delay: anime.stagger(70, { grid: [6, 4], from: 'center' }),
        duration: 1500,
        loop: true,
      }),
      anime({
        targets: chips,
        translateY: [0, -5, 0],
        rotate: [0, 2, -2, 0],
        easing: 'easeInOutQuad',
        delay: anime.stagger(140),
        duration: 1900,
        loop: true,
      }),
      anime({
        targets: packets,
        translateX: ['-12%', '112%'],
        opacity: [0, 1, 0],
        easing: 'linear',
        delay: anime.stagger(240),
        duration: 1800,
        loop: true,
      }),
    ];

    return () => {
      animations.forEach((instance) => instance.pause());
      anime.remove([board, glow, buses, nodes, chips, packets]);
    };
  }, []);

  return (
    <section id="powering-innovation" ref={sectionRef} className="mobo-flight">
      <div className="mobo-flight__sticky">
        <div className="mobo-flight__stage">
          <div className={`mobo-flight__heading ${headingRevealed ? 'mobo-flight__heading--show' : ''}`}>
            <span className="mobo-flight__label">Our Foundation</span>
            <h2>Powering Innovation Since 2008</h2>
          </div>

          <div className="mobo-flight__canvas" ref={animationWrapperRef}>
            <div className="mobo-anim" ref={sceneRef} aria-hidden="true">
              <div className="mobo-anim__bg" />
              <div className="mobo-anim__board-glow" />

              <div className="mobo-anim__board">
                <div className="mobo-anim__buses">
                  {Array.from({ length: 14 }).map((_, idx) => (
                    <span key={`bus-${idx}`} className="mobo-anim__bus" />
                  ))}
                </div>

                <div className="mobo-anim__nodes">
                  {Array.from({ length: 24 }).map((_, idx) => (
                    <span key={`node-${idx}`} className="mobo-anim__node" />
                  ))}
                </div>

                <div className="mobo-anim__chips">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <span key={`chip-${idx}`} className="mobo-anim__chip" />
                  ))}
                </div>

                <div className="mobo-anim__packets">
                  {Array.from({ length: 9 }).map((_, idx) => (
                    <span key={`packet-${idx}`} className="mobo-anim__packet" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MoboReveal;
