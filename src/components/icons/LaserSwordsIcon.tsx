import React from 'react';

interface LaserSwordsIconProps {
  className?: string;
}

export const LaserSwordsIcon: React.FC<LaserSwordsIconProps> = ({
  className = 'w-5 h-5 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.85)]',
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-label="Laser Swords"
    >
      {/* Blade 1 (Neon Laser Beam from top-right to bottom-left) */}
      <path
        d="M19.5 4.5L10 14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Guard 1 */}
      <path
        d="M8.5 12.5L11.5 15.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Hilt 1 */}
      <path
        d="M9.2 14.8L5.2 18.8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="4.8" cy="19.2" r="0.9" fill="currentColor" />

      {/* Blade 2 (Neon Laser Beam from top-left to bottom-right) */}
      <path
        d="M4.5 4.5L14 14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Guard 2 */}
      <path
        d="M15.5 12.5L12.5 15.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Hilt 2 */}
      <path
        d="M14.8 14.8L18.8 18.8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="19.2" cy="19.2" r="0.9" fill="currentColor" />

      {/* Energy Clash Flare / Spark in center */}
      <circle cx="12" cy="12" r="1.3" fill="#E0F2FE" />
    </svg>
  );
};
