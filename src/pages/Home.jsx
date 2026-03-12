import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { animate, stagger } from 'animejs';
import SpotlightCard from '../../Reactbits/SpotlightCard/SpotlightCard';
import DroneHero from '../components/DroneHero';
import ScrollLensShowcase from '../components/ScrollLensShowcase';
import './Home.css';

function Home() {
  const headingRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: '.recent-builds-word',
              translateY: [60, 0],
              opacity: [0, 1],
              rotateX: [-30, 0],
              scale: [0.8, 1],
              easing: 'easeOutElastic(1, .6)',
              duration: 1800,
              delay: anime.stagger(150),
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (headingRef.current) {
      observer.observe(headingRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home">
      <DroneHero />
      <div className="signal-splitter" aria-hidden="true">
        <div className="signal-splitter__line" />
        <div className="signal-splitter__scope">
          <svg className="signal-splitter__sine" viewBox="0 0 1200 40" preserveAspectRatio="none">
            <path d="M0 20 C 30 10, 60 10, 90 20 S 150 30, 180 20 S 240 10, 270 20 S 330 30, 360 20 S 420 10, 450 20 S 510 30, 540 20 S 600 10, 630 20 S 690 30, 720 20 S 780 10, 810 20 S 870 30, 900 20 S 960 10, 990 20 S 1050 30, 1080 20 S 1140 10, 1170 20 S 1230 30, 1260 20" />
          </svg>
          <span className="signal-splitter__pulse" />
        </div>
      </div>
      <ScrollLensShowcase />
      <section id="about" className="power-hub">
        <div className="container">
          <div className="power-hub__header">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="section-intro section-intro--side"
            >
             
            </motion.div>

          </div>

          <div className="stats-grid">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <SpotlightCard
                className="stat-card"
                spotlightColor="rgba(139, 92, 246, 0.3)"
              >
                <div className="stat-card__number">15+</div>
                <div className="stat-card__label">Years of Excellence</div>
              </SpotlightCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <SpotlightCard
                className="stat-card"
                spotlightColor="rgba(99, 102, 241, 0.3)"
              >
                <div className="stat-card__number">100+</div>
                <div className="stat-card__label">Events Conducted</div>
              </SpotlightCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SpotlightCard
                className="stat-card"
                spotlightColor="rgba(167, 139, 250, 0.3)"
              >
                <div className="stat-card__number">500+</div>
                <div className="stat-card__label">Active Members</div>
              </SpotlightCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <SpotlightCard
                className="stat-card"
                spotlightColor="rgba(139, 92, 246, 0.3)"
              >
                <div className="stat-card__number">#1</div>
                <div className="stat-card__label">First in Kerala</div>
              </SpotlightCard>
            </motion.div>
          </div>

          <div className="recent-builds-heading" ref={headingRef}>
            <h2>
              <div className="recent-builds-word" style={{ display: 'inline-block', opacity: 0 }}>RECENT</div>
              <br />
              <div className="recent-builds-word" style={{ display: 'inline-block', opacity: 0 }}>BUILDS</div>
              <br />
              <div className="recent-builds-word" style={{ display: 'inline-block', opacity: 0 }}>LIGHTING UP</div>
              <br />
              <div className="recent-builds-word" style={{ display: 'inline-block', opacity: 0 }}>CET</div>
            </h2>
          </div>
        </div>
      </section>

      <section className="highlights">
        <div className="container">
          <div className="projects-grid">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="project-card project-card--feature"
            >
              <span className="project-card__badge">Flagship Initiative</span>
              <h3 className="project-card__title">CODE reCET</h3>
              <p className="project-card__description">
                Our campus-wide coding league delivering adaptive missions, live leaderboards, 
                and mentorship for every skill tier across the semester.
              </p>
              <div className="project-card__stats">
                <div>
                  <span>36</span>
                  hours
                </div>
                <div>
                  <span>100+</span>
                  live participants
                </div>
                <div>
                  <span>24/7</span>
                  mentor support
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
