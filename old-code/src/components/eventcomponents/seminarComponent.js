import React, { useMemo } from 'react';
import { seminars } from '../../assets/js/events';
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

function Seminars({ activeYear = 'all' }){
    const visibleEvents = useMemo(() => {
        return seminars.filter((event) => eventMatchesYear(event, activeYear));
    }, [activeYear]);
    const emptyLabel = activeYear === 'all' ? 'All years' : activeYear;

    return(
        <section className="event-category">
            <div className="event-category__header">
                <div className="event-category__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 3a2 2 0 00-2 2v13a1 1 0 001.447.894L9 17.118l4.553 1.776a1 1 0 00.894 0L19 17.118l3.553 1.776A1 1 0 0024 18V5a2 2 0 00-2-2H5zm0 2h17v10.382l-2.553-1.276a1 1 0 00-.894 0L14 15.882l-4.553-1.776a1 1 0 00-.894 0L5 15.382V5z" fill="currentColor" opacity="0.8"/>
                    </svg>
                </div>
                <div>
                    <h3 className="event-category__title">Talks &amp; Seminars</h3>
                    <p className="event-category__subtitle">Conversations that spark curiosity, provide direction, and expand perspectives.</p>
                </div>
            </div>
            <div className="event-card-grid">
                {visibleEvents.map((event) => (
                    <EventInfo key={event.title} event={event} category={event.category || 'Seminar'} />
                ))}
                {!visibleEvents.length ? (
                    <p className="event-empty-state">No seminars recorded for {emptyLabel}.</p>
                ) : null}
            </div>
        </section>
    )
}

export default Seminars;