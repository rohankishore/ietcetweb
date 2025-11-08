import React from 'react';
import '../assets/css/component.css';

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

function MV() {
    return (
        <section id="organisation">
            <div className="container">
                <div className="section-intro section-intro--narrow">
                    <span className="section-badge">About IET CET</span>
                    <h2 className="section-title">Engineering a better future from our campus</h2>
                    <div className="section-copy">
                        {introParagraphs.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
                <div className="about-grid">
                    {aboutCards.map((card) => (
                        <article key={card.id} className="about-card">
                            <h3>{card.title}</h3>
                            <p>{card.description}</p>
                            {card.highlights ? (
                                <ul className="about-card__list">
                                    {card.highlights.map((highlight, itemIndex) => (
                                        <li key={itemIndex}>{highlight}</li>
                                    ))}
                                </ul>
                            ) : null}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default MV;