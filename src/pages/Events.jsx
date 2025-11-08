import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { workshops, competitions, seminars } from '../data/events';
import './Events.css';

const extractYearsFromEvents = (collection) => {
  const years = new Set();
  collection.forEach((event) => {
    if (!event || !event.date) return;
    const matches = `${event.date}`.match(/\b(20\d{2})\b/g);
    if (matches) {
      matches.forEach((year) => years.add(year.trim()));
    }
  });
  return years;
};

function EventCard({ event, index, type }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="event-card"
    >
      {event.img && (
        <div className="event-card__image">
          <img src={`/${event.img}`} alt={event.title} />
        </div>
      )}
      <div className="event-card__content">
        <div className="event-card__header">
          <span className="event-card__type">{type}</span>
          {event.date && <span className="event-card__date">{event.date}</span>}
        </div>
        <h3 className="event-card__title">{event.title}</h3>
        {event.quote && <p className="event-card__quote">{event.quote}</p>}
        <p className="event-card__description">{event.content}</p>
        {event.resource && (
          <a
            href={`/${event.resource}`}
            target="_blank"
            rel="noopener noreferrer"
            className="event-card__link"
          >
            {event.resourceLabel || 'View Resource'} →
          </a>
        )}
      </div>
    </motion.div>
  );
}

function EventSection({ title, events, type, activeYear }) {
  const filteredEvents = useMemo(() => {
    if (activeYear === 'all') return events;
    return events.filter(event => event.date && event.date.includes(activeYear));
  }, [events, activeYear]);

  if (filteredEvents.length === 0) return null;

  return (
    <div className="event-section">
      <h2 className="event-section__title">{title}</h2>
      <div className="event-section__grid">
        {filteredEvents.map((event, index) => (
          <EventCard
            key={`${event.title}-${index}`}
            event={event}
            index={index}
            type={type}
          />
        ))}
      </div>
    </div>
  );
}

function Events() {
  const allYears = useMemo(() => {
    const collected = new Set();
    [workshops, competitions, seminars || []].forEach((group) => {
      extractYearsFromEvents(group).forEach((year) => collected.add(year));
    });
    return Array.from(collected).sort((a, b) => Number(b) - Number(a));
  }, []);

  const [activeYear, setActiveYear] = useState('all');

  return (
    <div className="events-page">
      <section className="events-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="events-hero__content"
          >
            <span className="section-badge">Our Programming</span>
            <h1 className="page-title">Signature Events That Power Future-Ready Engineers</h1>
            <p className="events-hero__subtitle">
              From intensive workshops to inspiring talks and competitive showcases, 
              every experience is crafted to strengthen skills, spark ideas, and connect 
              you with the IET community.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="events-content">
        <div className="container">
          <div className="event-year-filter">
            <button
              className={`event-year-chip ${activeYear === 'all' ? 'event-year-chip--active' : ''}`}
              onClick={() => setActiveYear('all')}
            >
              All
            </button>
            {allYears.map((year) => (
              <button
                key={year}
                className={`event-year-chip ${activeYear === year ? 'event-year-chip--active' : ''}`}
                onClick={() => setActiveYear(year)}
              >
                {year}
              </button>
            ))}
          </div>

          <div className="events-stack">
            <EventSection
              title="Workshops"
              events={workshops}
              type="Workshop"
              activeYear={activeYear}
            />
            <EventSection
              title="Competitions"
              events={competitions}
              type="Competition"
              activeYear={activeYear}
            />
            {seminars && seminars.length > 0 && (
              <EventSection
                title="Seminars"
                events={seminars}
                type="Seminar"
                activeYear={activeYear}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Events;
