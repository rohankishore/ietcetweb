import React from 'react';
import Navigation from './navComponent';
import Footer from './footerComponent';
import MV from './missionvisionComponent';
import Team from './teamComponent';
import Event from './eventComponent';
import Banner from './bannerComponent';
import '../assets/css/component.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

function Main() {
    return(
        <Router>
            <div id="page-container">
                <div id="page-content">
                    <Navigation/>
                    <Switch>
                        <Route exact path='/' component={Banner} />
                        <Route path='/events' exact component={Event} />
                        {/*<Route path='/projects' exact component={Projects} />*/}
                        <Route path='/team' exact component={Team}/>
                        <Route path='/aboutus' exact component={MV} /> 
                        <Route path='*' exact component={Banner} />
                    </Switch>
                </div>
                <Footer/>
            </div>
        </Router>
    )
}

export default Main;