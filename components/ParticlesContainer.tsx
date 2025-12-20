'use client';
import React from 'react';
import Snowfall from 'react-snowfall';

const ParticlesContainer = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
      <Snowfall />
    </div>
  );
};

export default ParticlesContainer;
