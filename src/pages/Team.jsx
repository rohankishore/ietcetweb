import { useState } from 'react';
import { motion } from 'framer-motion';
import { members20, witteam20 } from '../data/team_2020';
import { members21, witteam21 } from '../data/team_2021';
import { members22, witteam22 } from '../data/team_2022';
import { members24, witteam24 } from '../data/team_2024';
import { members25, witteam25 } from '../data/team_2025';
import './Team.css';

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

function MemberCard({ profile, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="member-card"
    >
      <div className="member-card__photo">
        <img src={`/team/${profile.img}`} alt={profile.name} />
      </div>
      <div className="member-card__info">
        <h5 className="member-card__name">{profile.name}</h5>
        <p className="member-card__position">{profile.position}</p>
      </div>
    </motion.div>
  );
}

function renderMembers(list) {
  return sortByRole(list).map((member, index) => (
    <MemberCard
      key={`${member.name}-${member.position}`}
      profile={member}
      index={index}
    />
  ));
}

const teamYears = [
  { key: 'execom_25', label: 'Execom 2025-2026', members: members25, wit: witteam25 },
  { key: 'execom_24', label: 'Execom 2024-2025', members: members24, wit: witteam24 },
  { key: 'execom_22', label: 'Execom 2022-2023', members: members22, wit: witteam22 },
  { key: 'execom_21', label: 'Execom 2021-2022', members: members21, wit: witteam21 },
  { key: 'execom_20', label: 'Execom 2020-2021', members: members20, wit: witteam20 },
];

function Team() {
  const [activeTab, setActiveTab] = useState('execom_25');

  const activeTeam = teamYears.find(team => team.key === activeTab);

  return (
    <div className="team-page">
      <section className="team-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="team-hero__content"
          >
            <span className="section-badge">Meet the Crew</span>
            <h1 className="page-title">Leaders Shaping IET On Campus CET</h1>
            <p className="team-hero__subtitle">
              An interdisciplinary mix of strategists, builders, and mentors committed 
              to elevating the engineering culture at CET.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="team-content">
        <div className="container">
          <div className="team-tabs">
            <div className="team-tabs__nav">
              {teamYears.map((team) => (
                <button
                  key={team.key}
                  className={`team-tab ${activeTab === team.key ? 'team-tab--active' : ''}`}
                  onClick={() => setActiveTab(team.key)}
                >
                  {team.label}
                </button>
              ))}
            </div>

            <div className="team-tabs__content">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="team-grid">
                  {renderMembers(activeTeam.members)}
                </div>

                {activeTeam.wit && activeTeam.wit.length > 0 && (
                  <>
                    <h3 className="team-subheading">Women in Technology</h3>
                    <div className="team-grid">
                      {renderMembers(activeTeam.wit)}
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Team;
