import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LaserFlow from '../../Reactbits/LaserFlow/LaserFlow';
import './PlugSection.css';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function PlugSection({ onPlugChange }) {
  const BASE_OFFSET = 32;
  const [isPlugged, setIsPlugged] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [maxDrag, setMaxDrag] = useState(0);
  const [surgeActive, setSurgeActive] = useState(false);
  
  const trackRef = useRef(null);
  const plugRef = useRef(null);
  const isDraggingRef = useRef(false);

  const dragProgress = maxDrag > 0 ? dragOffset / maxDrag : 0;

  const updateDrag = useCallback((clientX) => {
    if (!trackRef.current || !plugRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const plugWidth = plugRef.current.offsetWidth;
    const maxDistance = Math.max(rect.width - plugWidth - BASE_OFFSET, 0);
    const rawOffset = clientX - rect.left - plugWidth / 2 - BASE_OFFSET;
    const offset = clamp(rawOffset, 0, maxDistance);
    
    setDragOffset(offset);
    setMaxDrag(maxDistance);
  }, [BASE_OFFSET]);

  const evaluateSnap = useCallback((offset, maxValue) => {
    const progress = offset / maxValue;
    if (progress >= 0.92) {
      setIsPlugged(true);
      setDragOffset(maxValue);
      if (onPlugChange) onPlugChange(true);
    } else {
      setIsPlugged(false);
      setDragOffset(0);
      if (onPlugChange) onPlugChange(false);
    }
  }, [onPlugChange]);

  const handlePointerDown = useCallback((event) => {
    event.preventDefault();
    isDraggingRef.current = true;
    updateDrag(event.clientX);
  }, [updateDrag]);

  const handlePointerUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    evaluateSnap(dragOffset, maxDrag);
  }, [dragOffset, maxDrag, evaluateSnap]);

  const handleReset = useCallback(() => {
    setIsPlugged(false);
    setDragOffset(0);
    setSurgeActive(false);
    if (onPlugChange) onPlugChange(false);
  }, [onPlugChange]);

  useEffect(() => {
    const handleMove = (event) => {
      if (!isDraggingRef.current) return;
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
    const handleResize = () => {
      if (!trackRef.current || !plugRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const plugWidth = plugRef.current.offsetWidth;
      const maxDistance = Math.max(rect.width - plugWidth - BASE_OFFSET, 0);
      const nextOffset = isPlugged ? maxDistance : 0;
      setDragOffset(nextOffset);
      setMaxDrag(maxDistance);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [BASE_OFFSET, isPlugged]);

  useEffect(() => {
    if (!isPlugged) return;
    setSurgeActive(true);
    const timer = setTimeout(() => setSurgeActive(false), 1200);
    return () => clearTimeout(timer);
  }, [isPlugged]);

  return (
    <>
      <section className={`plug-section ${isPlugged ? 'plug-section--active' : ''} ${surgeActive ? 'plug-section--surge' : ''}`}>
        {isPlugged && (
          <div className="plug-section__laserflow">
            <LaserFlow 
              wispDensity={2.5}
              flowSpeed={1.2}
              fogIntensity={0.9}
              color="#6366f1"
              fade={0.5}
              flowStrength={3.5}
            />
          </div>
        )}
        <div className="container">
          <div className="plug-section__header">
            <span className="section-badge">Power Up</span>
            <h2 className="section-title">Plug into the Grid to Explore More</h2>
            <p className="section-subtitle">
              Everything beyond the hero runs on community energy. Slide the power cable home 
              and the rest of the experience will light up—stats, highlights, and what we're building.
            </p>
          </div>
          
          <div className="plug-section__interaction">
            <div className={`plug-scene ${isPlugged ? 'plug-scene--active' : ''}`}>
              <div className="plug-track" ref={trackRef}>
                <div
                  className="plug-cable"
                  style={{ width: `${Math.max(dragOffset + BASE_OFFSET + 32, BASE_OFFSET + 32)}px` }}
                />
                <button
                  type="button"
                  className="plug"
                  ref={plugRef}
                  onPointerDown={handlePointerDown}
                  aria-label={isPlugged ? 'Power connected. Press to unplug.' : 'Drag to connect power.'}
                  aria-pressed={isPlugged}
                  style={{ transform: `translate(${dragOffset}px, -50%)` }}
                >
                  <span className="plug__head" aria-hidden="true"></span>
                  <span className="plug__cap" aria-hidden="true"></span>
                </button>
                <div className="plug-outlet" aria-hidden="true">
                  <span className="plug-outlet__face"></span>
                </div>
              </div>
            </div>
            
            {isPlugged ? (
              <button type="button" className="plug-reset" onClick={handleReset}>
                Unplug &amp; restart
              </button>
            ) : (
              <div className="plug-hint">
                {dragProgress >= 0.45 
                  ? 'Almost there—keep sliding to power up!' 
                  : 'Drag the plug into the outlet to unlock the full experience.'}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className={`powered-content ${isPlugged ? 'powered-content--online' : ''} ${surgeActive ? 'powered-content--surge' : ''}`}>
        {/* Content that appears when plugged */}
      </div>
    </>
  );
}

export default PlugSection;
