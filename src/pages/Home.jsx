import { useState } from 'react';
import { motion } from 'framer-motion';
import Prism from '../../Reactbits/Prism/Prism';
import PlugSection from '../components/PlugSection';
import './Home.css';

function Home() {
  const [isPlugged, setIsPlugged] = useState(false);

  return (
    <div className="home">
      <section className="hero">
        <div className="prism-background">
          <Prism 
          />
        </div>
        
        <div className="hero__container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero__content"
          >
            <span className="hero__badge">IET On Campus CET</span>
            <h1 className="hero__title">
              Welcome to IET CET
            </h1>
            <p className="hero__subtitle">
              College of Engineering, Trivandrum hosts an active student chapter of 
              The Institution of Engineering & Technology (IET). We inspire, inform, 
              and influence the engineering ecosystem through innovation and collaboration.
            </p>
            <div className="hero__cta">
              <a href="#about" className="btn btn--primary">Learn More</a>
              <a href="/events" className="btn btn--secondary">Explore Events</a>
            </div>
          </motion.div>
        </div>
      </section>

      <PlugSection onPlugChange={setIsPlugged} />

      {isPlugged && (
        <>
      <section id="about" className="power-hub">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-intro"
          >
            <span className="section-badge">Our Foundation</span>
            <h2 className="section-title">
              Powering Innovation Since 2008
            </h2>
            <p className="section-subtitle">
              As the first IET chapter in Kerala, inaugurated on November 14, 2008, 
              we've been at the forefront of engineering education and innovation.
            </p>
          </motion.div>

          <div className="stats-grid">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="stat-card"
            >
              <div className="stat-card__number">15+</div>
              <div className="stat-card__label">Years of Excellence</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="stat-card"
            >
              <div className="stat-card__number">100+</div>
              <div className="stat-card__label">Events Conducted</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="stat-card"
            >
              <div className="stat-card__number">500+</div>
              <div className="stat-card__label">Active Members</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="stat-card"
            >
              <div className="stat-card__number">#1</div>
              <div className="stat-card__label">First in Kerala</div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="highlights">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-intro"
          >
            <span className="section-badge">Recent Builds</span>
            <h2 className="section-title">
              Recent builds lighting up CET
            </h2>
            <p className="section-subtitle">
              A snapshot of the flagship experiments our squads are polishing for demo days, competitions, and community deployment.
            </p>
          </motion.div>

          <div className="projects-grid">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="project-card"
            >
              <span className="project-card__badge">Flagship Initiative</span>
              <h3 className="project-card__title">CODE reCET</h3>
              <p className="project-card__description">
                Our campus-wide coding league delivering adaptive missions, live leaderboards, 
                and mentorship for every skill tier across the semester.
              </p>
            </motion.article>
          </div>
        </div>
      </section>
        </>
      )}
    </div>
  );
}

export default Home;
