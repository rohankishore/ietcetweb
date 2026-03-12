import { motion } from 'framer-motion';
import SpotlightCard from '../../Reactbits/SpotlightCard/SpotlightCard';
import DroneHero from '../components/DroneHero';
import CpuReveal from '../components/CpuReveal';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <DroneHero />
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
        </div>
      </section>

      <CpuReveal />

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
