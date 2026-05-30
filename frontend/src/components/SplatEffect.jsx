import { useState, useCallback } from 'react';
import './SplatEffect.css';

export const useSplat = () => {
  const [particles, setParticles] = useState([]);

  const trigger = useCallback((color = '#f24c5c', count = 10) => {
    const newParticles = Array.from({ length: count }, (_, i) => {
      const angle = (360 / count) * i + (Math.random() * 30 - 15);
      const rad = (angle * Math.PI) / 180;
      const dist = 40 + Math.random() * 35;
      return {
        id: Date.now() + i,
        dx: Math.cos(rad) * dist,
        dy: Math.sin(rad) * dist,
        color,
        size: 4 + Math.random() * 6,
      };
    });
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 620);
  }, []);

  return { trigger, particles };
};

export const SplatParticles = ({ particles }) => (
  <>
    {particles.map(p => (
      <span
        key={p.id}
        className="splat-particle"
        style={{
          '--dx': `${p.dx}px`,
          '--dy': `${p.dy}px`,
          background: p.color,
          width: `${p.size}px`,
          height: `${p.size}px`,
        }}
      />
    ))}
  </>
);
