import React from 'react';
import '../assets/css/component.css';
import {members21, witteam21} from '../assets/js/team_2021';
import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "./TabSelector";


function Member({profile})
{
    return(
        <div className="col-md-4 col-lg-3 col-sm-8" id="crew">
            <div className="row justify-content-center">
                <img src={require(`../assets/img/team/${profile.img}`)} alt="eren-yeager"/>
            </div>
            <div className="row">
                <div className="col">
                    <h5>{profile.name}</h5>
                    <h6>{profile.position}</h6>
                </div>
            </div>
        </div>
    )
}

function Team()
{
    const memberList21 = members21.map((member) => (
        <Member profile={member} />
    ));
    const witList21 = witteam21.map((member) => (
        <Member profile={member} />
    ));
    return(
        <div id="team">
            <div className="container">
                <div className="row row-header align-items-center justify-content-start">
                    <div className="col-12">
                        <p>The Team</p>
                    </div>
                </div>
                <div className="row align-items-start justify-content-center">
                    <svg width="75px" height="75px" viewBox="0 0 16 16" class="bi bi-people" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1h7.956a.274.274 0 0 0 .014-.002l.008-.002c-.002-.264-.167-1.03-.76-1.72C13.688 10.629 12.718 10 11 10c-1.717 0-2.687.63-3.24 1.276-.593.69-.759 1.457-.76 1.72a1.05 1.05 0 0 0 .022.004zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10c-1.668.02-2.615.64-3.16 1.276C1.163 11.97 1 12.739 1 13h3c0-1.045.323-2.086.92-3zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                    </svg>
                </div>
                <div className="row align-items-center justify-content-center">
                    {memberList21}                         
                </div>
                <div className="row align-items-center justify-content-center">
                    <h2>Women In Technology</h2>                      
                </div>
                <div className="row align-items-center justify-content-center">
                    {witList21}                         
                </div>
            </div>
        </div>
    )
}

export default Team;
