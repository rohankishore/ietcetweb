import React, { useMemo, useState } from 'react';
import '../assets/css/component.css';
import Workshops from './eventcomponents/workshopComponent';
import Competitions from './eventcomponents/competitionComponent';
import Seminars from './eventcomponents/seminarComponent';
import { workshops, competitions, seminars } from '../assets/js/events';

const extractYearsFromEvents = (collection) => {
    const years = new Set();
    collection.forEach((event) => {
        if (!event || !event.date) {
            return;
        }
        const matches = `${event.date}`.match(/\b(20\d{2})\b/g);
        if (matches) {
            matches.forEach((year) => years.add(year.trim()));
        }
    });
    return years;
};

function Event(){
    const allYears = useMemo(() => {
        const collected = new Set();
        [workshops, competitions, seminars].forEach((group) => {
            extractYearsFromEvents(group).forEach((year) => collected.add(year));
        });
        return Array.from(collected).sort((a, b) => Number(b) - Number(a));
    }, []);

    const [activeYear, setActiveYear] = useState('all');

    const handleSelectYear = (year) => {
        setActiveYear((prev) => (prev === year ? 'all' : year));
    };

    return(
        <section id="event">
            <div className="container">
                <div className="section-intro">
                    <span className="section-badge">Our Programming</span>
                    <h2 className="section-title">Signature events that power future-ready engineers</h2>
                    <p className="section-subtitle">From intensive workshops to inspiring talks and competitive showcases, every experience is crafted to strengthen skills, spark ideas, and connect you with the IET community.</p>
                </div>
                <div className="event-year-filter" aria-label="Filter events by year">
                    <button
                        type="button"
                        className={`event-year-chip ${activeYear === 'all' ? 'event-year-chip--active' : ''}`}
                        onClick={() => setActiveYear('all')}
                        aria-pressed={activeYear === 'all'}
                    >
                        All
                    </button>
                    {allYears.map((year) => (
                        <button
                            key={year}
                            type="button"
                            className={`event-year-chip ${activeYear === year ? 'event-year-chip--active' : ''}`}
                            onClick={() => handleSelectYear(year)}
                            aria-pressed={activeYear === year}
                        >
                            {year}
                        </button>
                    ))}
                </div>
                <div className="event-stack">
                    <Workshops activeYear={activeYear} />
                    <Competitions activeYear={activeYear} />
                    <Seminars activeYear={activeYear} />
                </div>
            </div>
        </section>
    )
}

export default Event;