import React, { useState, useEffect } from 'react';
import logo from '../assets/img/logo.png';
import '../assets/css/component.css';
import { Navbar, Nav, NavItem, NavLink, Collapse, NavbarBrand, NavbarToggler } from 'reactstrap';
import anime from 'animejs';
import { Link, useLocation } from 'react-router-dom';


function Navigation(){
    const [collapse, setCollapse] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    const isActivePath = (path) => location.pathname === path;
    
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const toggle = () => {
        if(window.screen.width <= 767)
        {
            setCollapse(prevState => !prevState)
            if(collapse === true)
            {
                anime({
                    targets: '.down',
                    rotate: 0
                });
            }
            else
            {
                anime({
                    targets: '.down',
                    rotate: 90
                });
            }
        }
    }
    return(
        <div id='nav'>
            <Navbar expand='md' fixed='top' className={`${collapse ? 'expand-full' : ''} ${scrolled ? 'scrolled' : ''}`}
            >
                <NavbarBrand>
                    <img src={logo} width='200px' alt='IET On Campus'/>
                </NavbarBrand>
                <NavbarToggler onClick={toggle} id="menuCollapse">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="down" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                    </svg>
                </NavbarToggler>
                <Collapse isOpen={collapse} navbar>
                    <Nav className='ml-auto' navbar>
                        <NavItem onClick={toggle}>
                            <NavLink>
                                <Link
                                    to='/'
                                    className={`navlink ${isActivePath('/') ? 'navlink--active' : ''}`}
                                    aria-current={isActivePath('/') ? 'page' : undefined}
                                >
                                    Home
                                </Link>
                            </NavLink>
                        </NavItem>
                        <NavItem onClick={toggle}>
                            <NavLink>
                                <Link
                                    to='/events'
                                    className={`navlink ${isActivePath('/events') ? 'navlink--active' : ''}`}
                                    aria-current={isActivePath('/events') ? 'page' : undefined}
                                >
                                    Events
                                </Link>
                            </NavLink>
                        </NavItem>
                        {/*
                        <NavItem>
                            <NavLink>
                                <Link to='/projects' className="navlink">Projects</Link>
                            </NavLink>
                        </NavItem>
                        */}
                        <NavItem onClick={toggle}>
                            <NavLink>
                                <Link
                                    to='/team'
                                    className={`navlink ${isActivePath('/team') ? 'navlink--active' : ''}`}
                                    aria-current={isActivePath('/team') ? 'page' : undefined}
                                >
                                    The Team
                                </Link>
                            </NavLink>
                        </NavItem>
                        <NavItem onClick={toggle}>
                            <NavLink>
                                <Link
                                    to='/aboutus'
                                    className={`navlink ${isActivePath('/aboutus') ? 'navlink--active' : ''}`}
                                    aria-current={isActivePath('/aboutus') ? 'page' : undefined}
                                >
                                    About Us
                                </Link>
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    )
}

export default Navigation;