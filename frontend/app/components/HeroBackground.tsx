'use client'

import React from 'react';
import { motion } from 'framer-motion';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-white dark:bg-gray-900">
      {/* Gradient Blobs - Colombian Palette */}
      {/* Animated Blobs Removed to match Stats section perfectly - Clean Grid Only */}

      {/* Noise Overlay Removed for clarity to match Stats section */}
      
      {/* Checkerboard Grid Pattern (Consistent with other sections) */}
      <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] pointer-events-none"
          style={{ 
              backgroundImage: `linear-gradient(#0033A0 1px, transparent 1px), linear-gradient(to right, #0033A0 1px, transparent 1px)`, 
              backgroundSize: '30px 30px' 
          }}>
      </div>
    </div>
  );
}
