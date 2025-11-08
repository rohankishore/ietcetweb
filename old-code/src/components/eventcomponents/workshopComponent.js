import React, { useMemo } from 'react';
import { workshops } from '../../assets/js/events';
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

function Workshops({ activeYear = 'all' })
{
    const visibleEvents = useMemo(() => {
        return workshops.filter((event) => eventMatchesYear(event, activeYear));
    }, [activeYear]);
    const emptyLabel = activeYear === 'all' ? 'All years' : activeYear;

    return(
        <section className="event-category">
            <div className="event-category__header">
                <div className="event-category__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.75 2a1 1 0 00-.97.757l-.54 2.162a1 1 0 00.258.93l1.795 1.795a1 1 0 01.274.9l-.41 2.047a1 1 0 01-1.536.622l-1.45-.966a1 1 0 00-1.07-.03l-1.905 1.095a1 1 0 00-.363 1.36l1.42 2.46a1 1 0 01-.27 1.27l-1.11.84a1 1 0 00-.22 1.38l1.35 1.92a1 1 0 001.38.22l1.59-1.2a1 1 0 011.32.12l1.37 1.52a1 1 0 001.46 0l1.37-1.52a1 1 0 011.33-.12l1.58 1.2a1 1 0 001.38-.22l1.35-1.92a1 1 0 00-.22-1.38l-1.11-.84a1 1 0 01-.27-1.27l1.42-2.46a1 1 0 00-.36-1.36l-1.9-1.095a1 1 0 00-1.07.03l-1.45.966a1 1 0 01-1.54-.622l-.41-2.047a1 1 0 01.27-.9l1.8-1.795a1 1 0 00.26-.93l-.54-2.162A1 1 0 0013.25 2h-2.5z" fill="currentColor" opacity="0.8"/>
                    </svg>
                </div>
                <div>
                    <h3 className="event-category__title">Workshops</h3>
                    <p className="event-category__subtitle">Hands-on skill building sessions led by industry mentors and domain experts.</p>
                </div>
            </div>
            <div className="event-card-grid">
                {visibleEvents.map((event) => (
                    <EventInfo key={event.title} event={event} category="Workshop" />
                ))}
                {!visibleEvents.length ? (
                    <p className="event-empty-state">No workshops recorded for {emptyLabel}.</p>
                ) : null}
            </div>
        </section>
    )
}

export default Workshops;