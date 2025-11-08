import '../assets/css/component.css';
import { members20, witteam20 } from '../assets/js/team_2020';
import { members21, witteam21 } from '../assets/js/team_2021';
import { members22, witteam22 } from '../assets/js/team_2022';
import { members24, witteam24 } from '../assets/js/team_2024';
import { members25, witteam25 } from '../assets/js/team_2025';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import React from 'react';

const POSITION_ORDER = [
    'chairperson',
    'vice chairperson',
    'secretary',
    'treasurer',
    'joint secretary',
    'joint treasurer',
    'technical head',
    'technical coordinator',
    'project coordinator',
    'event coordinator',
    'community coordinator',
    'outreach lead',
    'inventory head',
    'documentation head',
    'web lead',
    'webmaster',
    'membership coordinator',
    'publicity coordinator',
    'design lead',
    'media lead',
    'media head',
    'social media head',
    'media team',
];

const POSITION_PRIORITY = POSITION_ORDER.reduce((acc, role, index) => {
    acc[role] = index;
    return acc;
}, {});

function sortByRole(list) {
    const defaultPriority = POSITION_ORDER.length;

    return [...list]
        .map((member, originalIndex) => ({ member, originalIndex }))
        .sort((a, b) => {
            const aKey = (a.member.position || '').toLowerCase();
            const bKey = (b.member.position || '').toLowerCase();
            const aPriority = POSITION_PRIORITY[aKey] ?? defaultPriority;
            const bPriority = POSITION_PRIORITY[bKey] ?? defaultPriority;

            if (aPriority !== bPriority) {
                return aPriority - bPriority;
            }

            return a.originalIndex - b.originalIndex;
        })
        .map(({ member }) => member);
}

function MemberCard({ profile }) {
    return (
        <div className="team-member">
            <div className="team-card">
                <div className="team-card__photo">
                    <img src={require(`../assets/img/team/${profile.img}`)} alt={profile.name} />
                </div>
                <div className="team-card__info">
                    <h5>{profile.name}</h5>
                    <p>{profile.position}</p>
                </div>
            </div>
        </div>
    );
}

function renderMembers(list) {
    return sortByRole(list).map((member) => (
        <MemberCard key={`${member.name}-${member.position}`} profile={member} />
    ));
}


function Team() {
    return (
        <section id="team">
            <div className="container">
                <div className="section-intro">
                    <span className="section-badge">Meet the Crew</span>
                    <h2 className="section-title">Leaders shaping IET On Campus CET</h2>
                    <p className="section-subtitle">An interdisciplinary mix of strategists, builders, and mentors committed to elevating the engineering culture at CET.</p>
                </div>
                <div className="team-tabs">
                    <Tabs defaultActiveKey="execom_25" id="team-tabs" className="modern-tabs">
                        <Tab eventKey="execom_25" title="Execom 2025-2026">
                            <div className="team-grid">
                                {renderMembers(members25)}
                            </div>
                            <div className="team-subheading">Women in Technology</div>
                            <div className="team-grid">
                                {renderMembers(witteam25)}
                            </div>
                        </Tab>
                        <Tab eventKey="execom_24" title="Execom 2024-2025">
                            <div className="team-grid">
                                {renderMembers(members24)}
                            </div>
                            <div className="team-subheading">Women in Technology</div>
                            <div className="team-grid">
                                {renderMembers(witteam24)}
                            </div>
                        </Tab>
                        <Tab eventKey="execom_22" title="Execom 2022-2023">
                            <div className="team-grid">
                                {renderMembers(members22)}
                            </div>
                            <div className="team-subheading">Women in Technology</div>
                            <div className="team-grid">
                                {renderMembers(witteam22)}
                            </div>
                        </Tab>
                        <Tab eventKey="execom_21" title="Execom 2021-2022">
                            <div className="team-grid">
                                {renderMembers(members21)}
                            </div>
                            <div className="team-subheading">Women in Technology</div>
                            <div className="team-grid">
                                {renderMembers(witteam21)}
                            </div>
                        </Tab>
                        <Tab eventKey="execom_20" title="Execom 2020-2021">
                            <div className="team-grid">
                                {renderMembers(members20)}
                            </div>
                            <div className="team-subheading">Women in Technology</div>
                            <div className="team-grid">
                                {renderMembers(witteam20)}
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </section>
    );
}

export default Team;





