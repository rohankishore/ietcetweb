import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import plugSound from '../assets/sounds/plug.mp3';

const projectHighlights = [
    {
        badge: 'Flagship Build',
        title: 'CODE reCET',
        description: 'Our campus-wide coding league delivering adaptive missions, live leaderboards, and mentorship for every skill tier across the semester.',
    },
];

const breadcrumbItems = [
    { id: 'banner', label: 'Hero' },
    { id: 'power-hub', label: 'Power Hub' },
    { id: 'club-hype', label: 'Momentum' },
    { id: 'projects-showcase', label: 'Launchpad' },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const getTimestamp = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

function Banner(){
    const BASE_OFFSET = 32; // matches the left inset used in CSS for the cable track
    const [isPlugged, setIsPlugged] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [maxDrag, setMaxDrag] = useState(0);
    const sectionIds = useMemo(() => breadcrumbItems.map((item) => item.id), []);
    const [activeSections, setActiveSections] = useState(() => [breadcrumbItems[0].id]);
    const [surgeActive, setSurgeActive] = useState(false);
    const [ambientProject, setAmbientProject] = useState(null);
    const [plugTrail, setPlugTrail] = useState([]);

    const trackRef = useRef(null);
    const plugRef = useRef(null);
    const heroCtaRef = useRef(null);
    const cubeRef = useRef(null);
    const rafRef = useRef(null);
    const gridMagnetRafRef = useRef(null);
    const gridScrollRafRef = useRef(null);
    const lightingStateRef = useRef({ lastOffset: 0, lastTime: null, velocity: 0 });
    const lightingRafRef = useRef(null);
    const lightingPulseTimeoutRef = useRef(null);
    const metricsRef = useRef({ offset: 0, max: 0 });
    const isDraggingRef = useRef(false);
    const ambientAudioRef = useRef(null);

    const applyLighting = useCallback((value) => {
        const root = document.documentElement;
        if (!root) {
            return;
        }
        const clampedValue = clamp(value, 0, 1.4);
        lightingStateRef.current.velocity = clampedValue;
        root.style.setProperty('--surge-velocity', clampedValue.toFixed(3));
    }, []);

    const animateLightingTo = useCallback((target) => {
        const root = document.documentElement;
        if (!root) {
            return;
        }
        const clampedTarget = clamp(target, 0, 1.4);
        if (lightingRafRef.current !== null) {
            cancelAnimationFrame(lightingRafRef.current);
            lightingRafRef.current = null;
        }
        const step = () => {
            const current = lightingStateRef.current.velocity;
            const next = current + (clampedTarget - current) * 0.12;
            if (Math.abs(next - clampedTarget) <= 0.003) {
                applyLighting(clampedTarget);
                return;
            }
            applyLighting(next);
            lightingRafRef.current = requestAnimationFrame(step);
        };
        lightingRafRef.current = requestAnimationFrame(step);
    }, [applyLighting]);

    const queueLightingBaseline = useCallback((target, delay = 320) => {
        if (lightingPulseTimeoutRef.current) {
            clearTimeout(lightingPulseTimeoutRef.current);
        }
        lightingPulseTimeoutRef.current = setTimeout(() => {
            lightingPulseTimeoutRef.current = null;
            animateLightingTo(target);
        }, delay);
    }, [animateLightingTo]);

    const commitMetrics = useCallback((offset, maxValue) => {
        const safeMax = typeof maxValue === 'number' ? maxValue : metricsRef.current.max;
        const clampedOffset = clamp(offset, 0, safeMax);
        metricsRef.current = { offset: clampedOffset, max: safeMax };
        setDragOffset(clampedOffset);
        setMaxDrag(safeMax);
    }, []);

    const updateDrag = useCallback((clientX) => {
        if (!trackRef.current || !plugRef.current || typeof clientX !== 'number') {
            return;
        }
        const rect = trackRef.current.getBoundingClientRect();
        const plugWidth = plugRef.current.offsetWidth;
        const maxDistance = Math.max(rect.width - plugWidth - BASE_OFFSET, 0);
        const rawOffset = clientX - rect.left - plugWidth / 2 - BASE_OFFSET;
        const offset = clamp(rawOffset, 0, maxDistance);
        commitMetrics(offset, maxDistance);
        const timestamp = getTimestamp();
        const lightingState = lightingStateRef.current;
        const lastTime = lightingState.lastTime ?? timestamp;
        const deltaOffset = Math.abs(offset - lightingState.lastOffset);
        const deltaTime = Math.max(timestamp - lastTime, 16);
        const instantaneous = deltaOffset / deltaTime;
        const normalized = clamp(instantaneous / 1.4, 0, 1.15);
        const smoothed = lightingState.velocity * 0.7 + normalized * 0.3;
        lightingState.lastOffset = offset;
        lightingState.lastTime = timestamp;
        if (lightingRafRef.current !== null) {
            cancelAnimationFrame(lightingRafRef.current);
            lightingRafRef.current = null;
        }
        applyLighting(smoothed + normalized * 0.12);
        queueLightingBaseline(isPlugged ? 0.32 : 0.06, 260);
        setPlugTrail((previous) => {
            const stamp = Date.now();
            const next = [...previous, { id: `${stamp}-${offset.toFixed(2)}`, offset, created: stamp }];
            return next.slice(-14);
        });
    }, [BASE_OFFSET, applyLighting, commitMetrics, isPlugged, queueLightingBaseline]);

    const evaluateSnap = useCallback((offset, maxValue) => {
        const safeMax = maxValue || metricsRef.current.max;
        if (safeMax <= 0) {
            setIsPlugged(false);
            commitMetrics(0, safeMax);
            animateLightingTo(0);
            queueLightingBaseline(0, 200);
            return;
        }
        const progress = offset / safeMax;
        if (progress >= 0.92) {
            setIsPlugged(true);
            commitMetrics(safeMax, safeMax);
            setPlugTrail([]);
            const timestamp = getTimestamp();
            lightingStateRef.current.lastOffset = safeMax;
            lightingStateRef.current.lastTime = timestamp;
            animateLightingTo(1.08);
            queueLightingBaseline(0.32, 540);
        } else {
            setIsPlugged(false);
            commitMetrics(0, safeMax);
            animateLightingTo(0.08);
            queueLightingBaseline(0.05, 240);
        }
    }, [animateLightingTo, commitMetrics, queueLightingBaseline]);

    const handlePointerDown = useCallback((event) => {
        event.preventDefault();
        if (lightingPulseTimeoutRef.current) {
            clearTimeout(lightingPulseTimeoutRef.current);
            lightingPulseTimeoutRef.current = null;
        }
        const timestamp = getTimestamp();
        lightingStateRef.current.lastTime = timestamp;
        lightingStateRef.current.lastOffset = metricsRef.current.offset;
        isDraggingRef.current = true;
        updateDrag(event.clientX);
    }, [updateDrag]);

    const handlePointerUp = useCallback(() => {
        if (!isDraggingRef.current) {
            return;
        }
        isDraggingRef.current = false;
        const { offset, max } = metricsRef.current;
        const timestamp = getTimestamp();
        lightingStateRef.current.lastTime = timestamp;
        lightingStateRef.current.lastOffset = offset;
        evaluateSnap(offset, max);
    }, [evaluateSnap]);

    useEffect(() => {
        const handleMove = (event) => {
            if (!isDraggingRef.current) {
                return;
            }
            updateDrag(event.clientX);
        };

        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);

        return () => {
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
        };
    }, [handlePointerUp, updateDrag]);

    useEffect(() => {
        lightingStateRef.current.lastOffset = 0;
        lightingStateRef.current.lastTime = null;
        applyLighting(0);

        return () => {
            applyLighting(0);
            if (lightingRafRef.current !== null) {
                cancelAnimationFrame(lightingRafRef.current);
                lightingRafRef.current = null;
            }
            if (lightingPulseTimeoutRef.current) {
                clearTimeout(lightingPulseTimeoutRef.current);
                lightingPulseTimeoutRef.current = null;
            }
        };
    }, [applyLighting]);

    useEffect(() => {
        const handleResize = () => {
            if (!trackRef.current || !plugRef.current) {
                return;
            }
            const rect = trackRef.current.getBoundingClientRect();
            const plugWidth = plugRef.current.offsetWidth;
            const maxDistance = Math.max(rect.width - plugWidth - BASE_OFFSET, 0);
            const currentProgress = metricsRef.current.max > 0 ? metricsRef.current.offset / metricsRef.current.max : 0;
            const nextOffset = isPlugged ? maxDistance : maxDistance * currentProgress;
            commitMetrics(nextOffset, maxDistance);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [BASE_OFFSET, commitMetrics, isPlugged]);

    useEffect(() => {
        if (!plugTrail.length) {
            return undefined;
        }
        const cleanup = setTimeout(() => {
            const now = Date.now();
            setPlugTrail((segments) => segments.filter((segment) => now - segment.created < 320));
        }, 160);
        return () => clearTimeout(cleanup);
    }, [plugTrail]);

    useEffect(() => {
        const button = heroCtaRef.current || document.querySelector('#explore .hero-cta');
        if (!button) {
            return undefined;
        }

        const resetAngles = () => {
            button.style.setProperty('--cta-tilt-x', '0px');
            button.style.setProperty('--cta-tilt-y', '0px');
            button.style.setProperty('--cta-glow-x', '50%');
            button.style.setProperty('--cta-glow-y', '50%');
        };

        resetAngles();

        const handleMove = (event) => {
            const rect = button.getBoundingClientRect();
            const ratioX = (event.clientX - rect.left) / rect.width;
            const ratioY = (event.clientY - rect.top) / rect.height;
            const tiltX = (ratioX - 0.5) * 18;
            const tiltY = (ratioY - 0.5) * 14;
            button.style.setProperty('--cta-tilt-x', `${tiltX}px`);
            button.style.setProperty('--cta-tilt-y', `${tiltY}px`);
            button.style.setProperty('--cta-glow-x', `${ratioX * 100}%`);
            button.style.setProperty('--cta-glow-y', `${ratioY * 100}%`);
        };

        const handleLeave = () => {
            resetAngles();
        };

        button.addEventListener('pointermove', handleMove);
        button.addEventListener('pointerleave', handleLeave);
        button.addEventListener('pointerdown', handleLeave);

        return () => {
            button.removeEventListener('pointermove', handleMove);
            button.removeEventListener('pointerleave', handleLeave);
            button.removeEventListener('pointerdown', handleLeave);
        };
    }, []);

    useEffect(() => {
        const nodes = Array.from(document.querySelectorAll('.magnetic-title'));
        if (!nodes.length) {
            return undefined;
        }

        const applyReset = (node) => {
            node.style.setProperty('--title-tilt-x', '0px');
            node.style.setProperty('--title-tilt-y', '0px');
            node.style.setProperty('--title-glow-x', '50%');
            node.style.setProperty('--title-glow-y', '50%');
            node.style.setProperty('--title-glow-opacity', '0');
        };

        const cleaners = nodes.map((node) => {
            applyReset(node);

            const handlePointerMove = (event) => {
                const rect = node.getBoundingClientRect();
                const ratioX = (event.clientX - rect.left) / rect.width;
                const ratioY = (event.clientY - rect.top) / rect.height;
                const tiltX = (ratioX - 0.5) * 16;
                const tiltY = (ratioY - 0.5) * 12;
                node.style.setProperty('--title-tilt-x', `${tiltX}px`);
                node.style.setProperty('--title-tilt-y', `${tiltY}px`);
                node.style.setProperty('--title-glow-x', `${ratioX * 100}%`);
                node.style.setProperty('--title-glow-y', `${ratioY * 100}%`);
                node.style.setProperty('--title-glow-opacity', '0.65');
            };

            const handlePointerLeave = () => {
                applyReset(node);
            };

            node.addEventListener('pointermove', handlePointerMove);
            node.addEventListener('pointerleave', handlePointerLeave);
            node.addEventListener('pointerdown', handlePointerLeave);

            return () => {
                node.removeEventListener('pointermove', handlePointerMove);
                node.removeEventListener('pointerleave', handlePointerLeave);
                node.removeEventListener('pointerdown', handlePointerLeave);
            };
        });

        return () => cleaners.forEach((cleanup) => cleanup());
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (!root) {
            return undefined;
        }

        const resetGrid = () => {
            root.style.setProperty('--grid-magnet-x', '0');
            root.style.setProperty('--grid-magnet-y', '0');
        };

        const updateGrid = ({ clientX, clientY }) => {
            gridMagnetRafRef.current = null;
            const width = window.innerWidth || 1;
            const height = window.innerHeight || 1;
            const ratioX = width ? clientX / width - 0.5 : 0;
            const ratioY = height ? clientY / height - 0.5 : 0;
            root.style.setProperty('--grid-magnet-x', ratioX.toFixed(4));
            root.style.setProperty('--grid-magnet-y', ratioY.toFixed(4));
        };

        const handlePointerMove = (event) => {
            const coords = { clientX: event.clientX, clientY: event.clientY };
            if (gridMagnetRafRef.current !== null) {
                return;
            }
            gridMagnetRafRef.current = requestAnimationFrame(() => updateGrid(coords));
        };

        const handlePointerLeave = () => {
            if (gridMagnetRafRef.current !== null) {
                cancelAnimationFrame(gridMagnetRafRef.current);
                gridMagnetRafRef.current = null;
            }
            resetGrid();
        };

        resetGrid();
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
        window.addEventListener('blur', handlePointerLeave);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerleave', handlePointerLeave);
            window.removeEventListener('blur', handlePointerLeave);
            if (gridMagnetRafRef.current !== null) {
                cancelAnimationFrame(gridMagnetRafRef.current);
                gridMagnetRafRef.current = null;
            }
            resetGrid();
        };
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (!root) {
            return undefined;
        }

        const updateScrollOffset = () => {
            gridScrollRafRef.current = null;
            const scrollY = window.scrollY || window.pageYOffset || 0;
            const maxScrollable = Math.max(
                (document.documentElement && document.documentElement.scrollHeight) || 0,
                (document.body && document.body.scrollHeight) || 0
            ) - (window.innerHeight || 0);
            const ratio = maxScrollable > 0 ? clamp(scrollY / maxScrollable, 0, 1) : 0;
            const offset = ratio * 72;
            root.style.setProperty('--grid-scroll-y', `${offset.toFixed(2)}px`);
        };

        const handleScroll = () => {
            if (gridScrollRafRef.current !== null) {
                return;
            }
            gridScrollRafRef.current = requestAnimationFrame(updateScrollOffset);
        };

        const handleResize = () => {
            if (gridScrollRafRef.current !== null) {
                cancelAnimationFrame(gridScrollRafRef.current);
                gridScrollRafRef.current = null;
            }
            updateScrollOffset();
        };

        updateScrollOffset();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            if (gridScrollRafRef.current !== null) {
                cancelAnimationFrame(gridScrollRafRef.current);
                gridScrollRafRef.current = null;
            }
            root.style.setProperty('--grid-scroll-y', '0px');
        };
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            setActiveSections((prevActive) => {
                const nextSet = new Set(prevActive);
                entries.forEach((entry) => {
                    const id = entry.target.id;
                    if (!id) {
                        return;
                    }
                    entry.target.classList.toggle('section--active', entry.isIntersecting);
                    if (entry.isIntersecting) {
                        nextSet.add(id);
                    } else {
                        nextSet.delete(id);
                    }
                });
                const nextArray = sectionIds.filter((id) => nextSet.has(id));
                if (nextArray.length === prevActive.length && nextArray.every((value, index) => value === prevActive[index])) {
                    return prevActive;
                }
                return nextArray;
            });
        }, { rootMargin: '-45% 0px -45% 0px', threshold: [0.25, 0.6] });

        const targets = sectionIds
            .map((id) => document.getElementById(id))
            .filter(Boolean);

        targets.forEach((node) => observer.observe(node));

        return () => observer.disconnect();
    }, [sectionIds]);

    useEffect(() => {
        if (!isPlugged) {
            return;
        }
        setSurgeActive(true);
        const timer = setTimeout(() => setSurgeActive(false), 1200);
        return () => clearTimeout(timer);
    }, [isPlugged]);

    useEffect(() => {
        const audio = new Audio(plugSound);
        audio.preload = 'auto';
        audio.volume = 0.32;
        ambientAudioRef.current = audio;

        return () => {
            audio.pause();
            audio.currentTime = 0;
            ambientAudioRef.current = null;
        };
    }, []);

    const triggerAmbientSound = useCallback(() => {
        const audio = ambientAudioRef.current;
        if (!audio) {
            return;
        }
        if (!audio.paused) {
            return;
        }
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }, []);

    const haltAmbientSound = useCallback(() => {
        const audio = ambientAudioRef.current;
        if (!audio) {
            return;
        }
        audio.pause();
        audio.currentTime = 0;
    }, []);

    const handleReset = useCallback(() => {
        setIsPlugged(false);
        commitMetrics(0, metricsRef.current.max);
        setSurgeActive(false);
        setAmbientProject(null);
        haltAmbientSound();
        setPlugTrail([]);
        if (lightingPulseTimeoutRef.current) {
            clearTimeout(lightingPulseTimeoutRef.current);
            lightingPulseTimeoutRef.current = null;
        }
        lightingStateRef.current.lastOffset = 0;
        lightingStateRef.current.lastTime = getTimestamp();
        animateLightingTo(0.04);
        queueLightingBaseline(0.02, 260);
    }, [animateLightingTo, commitMetrics, haltAmbientSound, queueLightingBaseline]);

    const handleProjectEnter = useCallback((title) => {
        setAmbientProject(title);
        triggerAmbientSound();
    }, [triggerAmbientSound]);

    const handleProjectLeave = useCallback(() => {
        setAmbientProject(null);
        haltAmbientSound();
    }, [haltAmbientSound]);

    const handleKeyDown = useCallback((event) => {
        const { max, offset } = metricsRef.current;
        if (event.key === 'ArrowRight' && max > 0) {
            event.preventDefault();
            const step = max * 0.12;
            const next = clamp(offset + step, 0, max);
            if (next / max >= 0.92) {
                evaluateSnap(next, max);
            } else {
                setIsPlugged(false);
                commitMetrics(next, max);
                if (lightingRafRef.current !== null) {
                    cancelAnimationFrame(lightingRafRef.current);
                    lightingRafRef.current = null;
                }
                const movement = Math.abs(next - offset);
                const normalizedMove = max > 0 ? clamp(movement / max, 0, 1.1) : 0;
                const blended = lightingStateRef.current.velocity * 0.6 + normalizedMove * 0.9;
                applyLighting(blended);
                lightingStateRef.current.lastOffset = next;
                lightingStateRef.current.lastTime = getTimestamp();
                queueLightingBaseline(isPlugged ? 0.32 : 0.06, 280);
            }
        } else if (event.key === 'ArrowLeft' && max > 0) {
            event.preventDefault();
            const step = max * 0.12;
            const next = clamp(offset - step, 0, max);
            if (next === 0) {
                setIsPlugged(false);
            }
            commitMetrics(next, max);
            if (lightingRafRef.current !== null) {
                cancelAnimationFrame(lightingRafRef.current);
                lightingRafRef.current = null;
            }
            const movement = Math.abs(next - offset);
            const normalizedMove = max > 0 ? clamp(movement / max, 0, 1) : 0;
            const blended = lightingStateRef.current.velocity * 0.6 + normalizedMove * 0.85;
            applyLighting(blended);
            lightingStateRef.current.lastOffset = next;
            lightingStateRef.current.lastTime = getTimestamp();
            queueLightingBaseline(isPlugged ? 0.28 : 0.05, 260);
        } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (isPlugged) {
                handleReset();
            } else {
                const targetMax = max > 0 ? max : metricsRef.current.max;
                evaluateSnap(targetMax, targetMax);
            }
        }
    }, [applyLighting, commitMetrics, evaluateSnap, handleReset, isPlugged, queueLightingBaseline]);

    const dragProgress = useMemo(() => (maxDrag > 0 ? dragOffset / maxDrag : 0), [dragOffset, maxDrag]);

    return(
    <>
    <div id="banner">
        <div className="container">
            <div className='row hero-row align-items-center justify-content-between'>
                <div className="col-lg-6 col-md-7" id="banner-heading">
                    <h1 className="hero-title">
                        <span className="hero-title-line">Welcome to</span>
                        <span className="hero-title-accent">IET On Campus CET</span>
                    </h1>
                    <p className="hero-subtext">
                        Building a vibrant community of innovators, mentors, and makers who elevate engineering on campus through events, mentorship, and opportunities that feel future-ready.
                    </p>
                    <div id="explore">
                        <Link to="/events" className="hero-cta" ref={heroCtaRef}>
                            <span className="hero-cta__label">Explore Events</span>
                        </Link>
                    </div>
                </div>
                <div className="col-lg-6 d-none d-lg-flex justify-content-center" id="banner-visual" aria-hidden="true">
                    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
                        <Prism
                            animationType="rotate"
                            timeScale={0.5}
                            height={3.5}
                            baseWidth={5.5}
                            scale={3.6}
                            hueShift={0}
                            colorFrequency={1}
                            noise={0.5}
                            glow={1}
                        />
                    </div>
                </div>
            </div>
        </div>
        <div className="discover-more">
            <a className="discover-link" href="#power-hub">
                <span>Discover more</span>
                <div className="scroll-indicator">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="9" y="4" width="6" height="13" rx="3" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="8" r="1.5" fill="currentColor"/>
                    </svg>
                </div>
            </a>
        </div>
    </div>
    <section className={`projects-teaser grid-section ${isPlugged ? 'projects-teaser--active' : ''} ${surgeActive ? 'projects-teaser--surge' : ''}`} id="power-hub">
        <span className="section-gridlines" aria-hidden="true"></span>
        <div className="container">
            <div className="projects-teaser__header">
                <span className="section-badge">Campus Mainframe</span>
                <h2 className="projects-teaser__title magnetic-title">Plug into the grid to bring our story to life</h2>
                <p className="projects-teaser__subtitle">
                    Everything beyond the hero section runs on community energy. Slide the power cable home and the rest of the experience will light up—metrics, showcases, and the ideas we are shipping this season.
                </p>
            </div>
            <div className="projects-teaser__interaction">
                <div
                    className={`projects-teaser__scene ${isPlugged ? 'projects-teaser__scene--active' : ''}`}
                    style={{ '--progress': dragProgress }}
                >
                    <div className="projects-teaser__track" ref={trackRef}>
                        {plugTrail.map((segment) => (
                            <span
                                key={segment.id}
                                className="plug-trail__segment"
                                style={{ left: `${BASE_OFFSET + segment.offset}px` }}
                                aria-hidden="true"
                            ></span>
                        ))}
                        <div
                            className="projects-teaser__cable"
                            style={{ width: `${Math.max(dragOffset + BASE_OFFSET + 32, BASE_OFFSET + 32)}px` }}
                        />
                        <button
                            type="button"
                            className="projects-teaser__plug"
                            ref={plugRef}
                            onPointerDown={handlePointerDown}
                            onKeyDown={handleKeyDown}
                            aria-label={isPlugged ? 'Power connected. Press to unplug or drag back to reset.' : 'Drag or press to connect the cable and reveal our latest projects.'}
                            aria-pressed={isPlugged}
                            style={{ transform: `translate(${dragOffset}px, -50%)` }}
                        >
                            <span className="projects-teaser__plug-head" aria-hidden="true"></span>
                            <span className="projects-teaser__plug-cap" aria-hidden="true"></span>
                        </button>
                        <div className="projects-teaser__outlet" aria-hidden="true">
                            <span className="projects-teaser__outlet-face"></span>
                        </div>
                    </div>
                </div>
                {isPlugged ? (
                    <button type="button" className="projects-teaser__reset" onClick={handleReset}>
                        Unplug &amp; restart
                    </button>
                ) : (
                    <div className="projects-teaser__hint" role="status">
                        {dragProgress >= 0.45 ? 'Almost there—keep sliding to energise the rest of the page.' : 'Drag the plug into the outlet to power up the full experience.'}
                    </div>
                )}
            </div>
        </div>
    </section>
    <div className={`power-grid ${isPlugged ? 'power-grid--online' : ''} ${surgeActive ? 'power-grid--surge' : ''}`} aria-hidden={!isPlugged}>
        <section className="hype-section grid-section" id="club-hype">
            <span className="section-gridlines" aria-hidden="true"></span>
            <div className="container">
                <div className="hype-header">
                    <h2 className="hype-title magnetic-title">The CET Innovation Pulse</h2>
                    <p className="hype-subtitle">
                        IET On Campus CET is where bright ideas grow into shipped prototypes, new career paths, and a campus-wide movement. We mix adrenaline-fuelled build nights with deep mentorship so every member can aim higher than the syllabus.
                    </p>
                </div>
                <div className="hype-grid">
                    <article className="hype-card" aria-label="Build sprints">
                        <h3 className="hype-metric">48<span>+</span></h3>
                        <p className="hype-label">High-energy build hours every semester</p>
                        <p className="hype-copy">Intensive project sprints, labs, and bootcamps that move ideas from notion to prototype with mentors on standby.</p>
                    </article>
                    <article className="hype-card" aria-label="Industry collaborations">
                        <h3 className="hype-metric">11<span>+</span></h3>
                        <p className="hype-label">Partner companies &amp; alumni collaborators</p>
                        <p className="hype-copy">From deep-tech startups to global engineering giants, we co-create challenges and pipelines tailored for CET talent.</p>
                    </article>
                    <article className="hype-card" aria-label="Mentorship programme">
                        <h3 className="hype-metric">120<span>+</span></h3>
                        <p className="hype-label">Active mentors, fellows, and peer leads</p>
                        <p className="hype-copy">A layered mentorship stack that keeps first-years curious, seniors leading, and alumni plugged into every cohort.</p>
                    </article>
                </div>
                <div className="hype-footer">
                    <Link className="hype-cta" to="/team">Meet the builders</Link>
                    <Link className="hype-cta hype-cta--secondary" to="/aboutus">See our playbook</Link>
                </div>
            </div>
        </section>
        <section className="projects-showcase grid-section" id="projects-showcase">
            <span className="section-gridlines" aria-hidden="true"></span>
            <div className="container">
                <div className="projects-teaser__header projects-showcase__header">
                    <h2 className="projects-teaser__title projects-showcase__title magnetic-title">Recent builds lighting up CET</h2>
                    <p className="projects-teaser__subtitle projects-showcase__subtitle">
                        A snapshot of the flagship experiments our squads are polishing for demo days, competitions, and community deployment.
                    </p>
                </div>
                <div className={`projects-teaser__grid projects-showcase__grid ${isPlugged ? 'projects-teaser__grid--visible' : ''}`}>
                    {projectHighlights.map((project) => (
                        <article
                            key={project.title}
                            className={`projects-teaser__card ${project.title === ambientProject ? 'projects-teaser__card--ambient' : ''}`}
                            onMouseEnter={() => handleProjectEnter(project.title)}
                            onMouseLeave={handleProjectLeave}
                            onFocus={() => handleProjectEnter(project.title)}
                            onBlur={handleProjectLeave}
                            onTouchStart={() => handleProjectEnter(project.title)}
                            onTouchEnd={handleProjectLeave}
                            onTouchCancel={handleProjectLeave}
                            tabIndex={0}
                        >
                            <span className="projects-teaser__badge">{project.badge}</span>
                            <h3 className="projects-teaser__card-title">{project.title}</h3>
                            <p className="projects-teaser__card-copy">{project.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    </div>
    <aside className={`neon-breadcrumb ${isPlugged ? 'neon-breadcrumb--online' : ''}`} role="navigation" aria-label="Page section progress">
        {breadcrumbItems.map((item) => {
            const isActive = activeSections.includes(item.id);
            return (
                <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`neon-breadcrumb__link ${isActive ? 'neon-breadcrumb__link--active' : ''}`}
                    aria-label={`${item.label} section`}
                    aria-current={isActive ? 'location' : undefined}
                >
                    <span className={`neon-breadcrumb__dot ${isActive ? 'neon-breadcrumb__dot--active' : ''}`} aria-hidden="true"></span>
                    <span className="neon-breadcrumb__label">{item.label}</span>
                </a>
            );
        })}
    </aside>
    </>
    );
}

export default Banner;
