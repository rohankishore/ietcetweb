import { motion } from 'framer-motion';
import './About.css';

function About() {
  const introParagraphs = [
    'College of Engineering, Trivandrum hosts an active student chapter of The Institution of Engineering & Technology (IET), the international professional society of engineers. The IET CET chapter was inaugurated on 14 November 2008 as the first of its kind in Kerala.',
    'We aim to engineer a better world by inspiring the next generation, informing the wider engineering community about emerging advancements, and conducting seminars and workshops for students of CET and neighbouring colleges.'
  ];

  const aboutCards = [
    {
      id: 'vision',
      title: 'Vision',
      description: 'Working to engineer a better world by nurturing creative problem solvers and collaborative leaders within our campus community.'
    },
    {
      id: 'mission',
      title: 'Mission',
      description: 'To inspire, inform, and influence the engineering ecosystem by making emerging technologies accessible through events, mentorship, and inclusive opportunities.',
      highlights: [
        'Hands-on workshops tailored for CET students',
        'Seminars that simplify emerging technologies',
        'Collaborations that connect innovators across Kerala'
      ]
    }
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="about-hero__content"
          >
            <span className="section-badge">About IET CET</span>
            <h1 className="page-title">Engineering a Better Future from Our Campus</h1>
          </motion.div>
        </div>
      </section>

      <section className="about-intro">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="about-intro__content"
          >
            {introParagraphs.map((paragraph, index) => (
              <p key={index} className="about-intro__text">{paragraph}</p>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mission-vision">
        <div className="container">
          <div className="mv-grid">
            {aboutCards.map((card, index) => (
              <motion.article
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="mv-card"
              >
                <div className="mv-card__icon">{card.title[0]}</div>
                <h3 className="mv-card__title">{card.title}</h3>
                <p className="mv-card__description">{card.description}</p>
                {card.highlights && (
                  <ul className="mv-card__list">
                    {card.highlights.map((highlight, itemIndex) => (
                      <li key={itemIndex}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="values">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-intro"
          >
            <span className="section-badge">Our Values</span>
            <h2 className="section-title">What Drives Us</h2>
          </motion.div>

          <div className="values-grid">
            {[
              { icon: '🚀', title: 'Innovation', description: 'Pushing boundaries and exploring new technologies' },
              { icon: '🤝', title: 'Collaboration', description: 'Building a strong community of engineers' },
              { icon: '📚', title: 'Learning', description: 'Continuous growth and knowledge sharing' },
              { icon: '🌟', title: 'Excellence', description: 'Striving for the highest standards' }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="value-card"
              >
                <div className="value-card__icon">{value.icon}</div>
                <h4 className="value-card__title">{value.title}</h4>
                <p className="value-card__description">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
