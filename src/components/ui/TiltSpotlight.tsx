'use client';

import React from 'react';
import { Tilt } from './Tilt';
import { Spotlight } from './Spotlight';
import type { SpringOptions } from 'framer-motion';

type TiltSpotlightProps = {
  children: React.ReactNode;
  className?: string;
  rotationFactor?: number;
  isReverse?: boolean;
  springOptions?: SpringOptions;
  spotlightSize?: number;
  spotlightClassName?: string;
  style?: React.CSSProperties;
};

export function TiltSpotlight({
  children,
  className = '',
  rotationFactor = 6,
  isReverse = false,
  springOptions = {
    stiffness: 26.7,
    damping: 4.1,
    mass: 0.2,
  },
  spotlightSize = 248,
  spotlightClassName = 'z-10 blur-2xl',
  style,
}: TiltSpotlightProps) {
  return (
    <Tilt
      rotationFactor={rotationFactor}
      isReverse={isReverse}
      style={{
        transformOrigin: 'center center',
        ...style,
      }}
      springOptions={springOptions}
      className={`group relative rounded-lg ${className}`}
    >
      <Spotlight
        className={spotlightClassName}
        size={spotlightSize}
        springOptions={springOptions}
      />
      {children}
    </Tilt>
  );
}
