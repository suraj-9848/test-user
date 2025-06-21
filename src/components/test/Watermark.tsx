'use client'

import { useEffect, useState } from 'react';

interface WatermarkProps {
  text: string;
  opacity?: number;
}

export default function Watermark({ text, opacity = 0.05 }: WatermarkProps) {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleString());

  useEffect(() => {
    // Update timestamp every minute
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleString());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Create a pattern of watermarks across the screen
  const createWatermarkPattern = () => {
    const watermarks = [];
    const rows = 8;
    const cols = 6;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const rotation = -45 + (Math.random() - 0.5) * 10; // Random rotation between -50 and -40 degrees
        const translateX = col * (100 / cols);
        const translateY = row * (100 / rows);

        watermarks.push(
          <div
            key={`${row}-${col}`}
            className="absolute pointer-events-none select-none"
            style={{
              left: `${translateX}%`,
              top: `${translateY}%`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              opacity: opacity,
              zIndex: 1000,
            }}
          >
            <div className="text-gray-500 font-bold text-lg whitespace-nowrap">
              {text}
            </div>
            <div className="text-gray-400 text-xs whitespace-nowrap mt-1">
              {timestamp}
            </div>
          </div>
        );
      }
    }

    return watermarks;
  };

  return (
    <div className="fixed inset-0 pointer-events-none select-none overflow-hidden">
      {createWatermarkPattern()}
      
      {/* Additional dynamic watermarks */}
      <div
        className="absolute top-1/4 left-1/4 pointer-events-none select-none"
        style={{
          transform: 'rotate(-30deg)',
          opacity: opacity * 0.8,
          zIndex: 1000,
        }}
      >
        <div className="text-gray-500 font-bold text-2xl">
          TEST IN PROGRESS
        </div>
      </div>

      <div
        className="absolute bottom-1/4 right-1/4 pointer-events-none select-none"
        style={{
          transform: 'rotate(30deg)',
          opacity: opacity * 0.8,
          zIndex: 1000,
        }}
      >
        <div className="text-gray-500 font-bold text-2xl">
          MONITORED SESSION
        </div>
      </div>

      {/* Corner watermarks */}
      <div
        className="absolute top-4 left-4 pointer-events-none select-none text-gray-400 text-xs"
        style={{ opacity: opacity * 2, zIndex: 1000 }}
      >
        {text} - {timestamp}
      </div>

      <div
        className="absolute top-4 right-4 pointer-events-none select-none text-gray-400 text-xs"
        style={{ opacity: opacity * 2, zIndex: 1000 }}
      >
        {text} - {timestamp}
      </div>

      <div
        className="absolute bottom-4 left-4 pointer-events-none select-none text-gray-400 text-xs"
        style={{ opacity: opacity * 2, zIndex: 1000 }}
      >
        {text} - {timestamp}
      </div>

      <div
        className="absolute bottom-4 right-4 pointer-events-none select-none text-gray-400 text-xs"
        style={{ opacity: opacity * 2, zIndex: 1000 }}
      >
        {text} - {timestamp}
      </div>
    </div>
  );
}