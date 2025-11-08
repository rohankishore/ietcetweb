import React, { useMemo } from 'react';
import '../../assets/css/component.css';

function EventInfo({ event, category }) {
    const hasQuote = Boolean(event.quote && event.quote.trim());
    const hasDate = Boolean(event.date);
    const hasTime = Boolean(event.time);
    const yearTags = useMemo(() => {
        if (!event.date) {
            return [];
        }
        const matches = `${event.date}`.match(/\b(20\d{2})\b/g);
        if (!matches) {
            return [];
        }
        return Array.from(new Set(matches.map((year) => year.trim())));
    }, [event.date]);
    let imageSrc;
    if (event.img) {
        imageSrc = require(`../../assets/img/${event.img}`);
    }

    let resourceHref;
    if (event.resource) {
        resourceHref = event.resource.startsWith('http')
            ? event.resource
            : require(`../../assets/img/${event.resource}`);
    }

    const ctaLabel = event.resourceLabel || 'View resource';

    return (
        <article className="event-card">
            <div className="event-card__media">
                {imageSrc ? (
                    <img src={imageSrc} alt={event.title} />
                ) : (
                    <div className="event-card__placeholder" aria-hidden="true">
                        <div className="event-card__placeholder-icon">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8.828a2 2 0 00-.586-1.414l-4.828-4.828A2 2 0 0013.172 2H6zm7.172 2H6v16h12V9h-4a1 1 0 01-1-1V4z" fill="currentColor" opacity="0.85" />
                                <path d="M9 13h6a1 1 0 010 2H9a1 1 0 010-2zm0 4h6a1 1 0 010 2H9a1 1 0 010-2z" fill="currentColor" opacity="0.75" />
                            </svg>
                        </div>
                        <span className="event-card__placeholder-label">Resource pack</span>
                    </div>
                )}
                {(category || yearTags.length) ? (
                    <div className="event-card__tags">
                        {category ? <span className="event-card__tag event-card__tag--category">{category}</span> : null}
                        {yearTags.map((year) => (
                            <span key={year} className="event-card__tag event-card__tag--year">{year}</span>
                        ))}
                    </div>
                ) : null}
            </div>
            <div className="event-card__body">
                <h4 className="event-card__title">{event.title}</h4>
                {hasQuote ? (
                    <p className="event-card__quote">“{event.quote}”</p>
                ) : null}
                <p className="event-card__description">{event.content}</p>
                {(hasDate || hasTime) ? (
                    <div className="event-card__meta">
                        {hasDate ? (
                            <div className="event-card__meta-item">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M7 2a1 1 0 112 0v1h6V2a1 1 0 112 0v1h1a3 3 0 013 3v13a3 3 0 01-3 3H5a3 3 0 01-3-3V6a3 3 0 013-3h1V2a1 1 0 112 0v1zM4 9v10a1 1 0 001 1h14a1 1 0 001-1V9H4z" fill="currentColor" opacity="0.9" />
                                    <rect x="15" y="13" width="3" height="3" rx="0.6" fill="currentColor" opacity="0.9" />
                                </svg>
                                <span>{event.date}</span>
                            </div>
                        ) : null}
                        {hasTime ? (
                            <div className="event-card__meta-item">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M12 22a10 10 0 100-20 10 10 0 000 20zm0-18a8 8 0 110 16 8 8 0 010-16zm-.5 4a1 1 0 112 0v3.99l2.864 1.649a1 1 0 01-.992 1.732l-3.36-1.932A1 1 0 0111.5 12V8z" fill="currentColor" opacity="0.9" />
                                </svg>
                                <span>{event.time}</span>
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>
            {resourceHref ? (
                <div className="event-card__footer">
                    <a className="event-card__cta" href={resourceHref} target="_blank" rel="noopener noreferrer">
                        <span>{ctaLabel}</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                            <path d="M20 12H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                        </svg>
                    </a>
                </div>
            ) : null}
        </article>
    );
}

export default EventInfo;