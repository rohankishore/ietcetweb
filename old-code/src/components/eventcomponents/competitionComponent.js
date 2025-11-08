import React, { useMemo } from 'react';
import { competitions } from '../../assets/js/events';
import EventInfo from './eventInfoComponent';
import '../../assets/css/component.css';

const eventMatchesYear = (event, year) => {
    if (!year || year === 'all') {
        return true;
    }
    if (!event || !event.date) {
        return false;
    }
    const matches = `${event.date}`.match(/\b(20\d{2})\b/g);
    if (!matches) {
        return false;
    }
    return matches.some((entry) => entry.trim() === year);
};

function Competitions({ activeYear = 'all' }){
    const visibleEvents = useMemo(() => {
        return competitions.filter((event) => eventMatchesYear(event, activeYear));
    }, [activeYear]);
    const emptyLabel = activeYear === 'all' ? 'All years' : activeYear;

    return(
        <section className="event-category">
            <div className="event-category__header">
                <div className="event-category__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 4H19a2 2 0 012 2 5 5 0 01-3.8 4.872A6.999 6.999 0 0113 15.874V19h3a1 1 0 110 2H8a1 1 0 010-2h3v-3.126A7 7 0 016.8 10.87 5 5 0 013 6a2 2 0 012-2h1.5V2a1 1 0 112 0v2h6V2a1 1 0 112 0v2zM7 6H5a1 1 0 00-1 1 3 3 0 002.25 2.9A7.044 7.044 0 017 6.17V6zm12-1a1 1 0 00-1-1h-2v.17A7.044 7.044 0 0117.75 9.9 3 3 0 0020 7a1 1 0 00-1-1h0z" fill="currentColor" opacity="0.8"/>
                    </svg>
                </div>
                <div>
                    <h3 className="event-category__title">Competitions</h3>
                    <p className="event-category__subtitle">Challenge-driven platforms to put ideas to the test and celebrate engineering excellence.</p>
                </div>
            </div>
            <div className="event-card-grid">
                {visibleEvents.map((event) => (
                    <EventInfo key={event.title} event={event} category="Competition" />
                ))}
                {!visibleEvents.length ? (
                    <p className="event-empty-state">No competitions recorded for {emptyLabel}.</p>
                ) : null}
            </div>
        </section>
    )
}

export default Competitions;