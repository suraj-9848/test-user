'use client'

import { useEffect, useRef, useState } from 'react';
import { Camera, Circle, Square } from 'lucide-react';

interface CameraMonitorProps {
  stream: MediaStream | null;
  isRecording: boolean;
}

export default function CameraMonitor({ stream, isRecording }: CameraMonitorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [facesDetected, setFacesDetected] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      const video = videoRef.current;
      
      // Reset video element before setting new stream
      video.srcObject = null;
      
      // Set new stream
      video.srcObject = stream;
      
      // Play video with proper error handling
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Camera video started successfully');
          })
          .catch((error) => {
            console.warn('Camera video play interrupted:', error);
            // Try to play again after a short delay
            setTimeout(() => {
              if (video.srcObject === stream) {
                video.play().catch(() => {
                  console.error('Failed to restart camera video');
                });
              }
            }, 100);
          });
      }
      
      // Start face detection
      startFaceDetection();
    }
    
    // Cleanup when stream changes or component unmounts
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]);

  const startFaceDetection = () => {
    // Basic face detection simulation
    // In a real implementation, you would use face-api.js or similar
    const interval = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        // Simulate face detection
        const randomFaces = Math.random() > 0.8 ? 0 : Math.random() > 0.5 ? 1 : 2;
        setFacesDetected(randomFaces);
      }
    }, 2000);

    return () => clearInterval(interval);
  };

  const getFaceDetectionStatus = () => {
    if (facesDetected === 0) return { text: 'No face detected', color: 'text-red-600' };
    if (facesDetected === 1) return { text: 'Face detected', color: 'text-green-600' };
    return { text: 'Multiple faces', color: 'text-yellow-600' };
  };

  const recordingIndicator = (
    <div className="absolute top-2 left-2 flex items-center space-x-1">
      {isRecording ? (
        <>
          <Circle className="h-3 w-3 text-red-500 fill-current animate-pulse" />
          <span className="text-xs text-white bg-black bg-opacity-50 px-1 rounded">REC</span>
        </>
      ) : (
        <>
          <Square className="h-3 w-3 text-gray-500" />
          <span className="text-xs text-white bg-black bg-opacity-50 px-1 rounded">STOPPED</span>
        </>
      )}
    </div>
  );

  if (!stream) {
    return (
      <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg border p-4 z-40">
        <div className="flex items-center space-x-2 text-gray-500">
          <Camera className="h-5 w-5" />
          <span className="text-sm">Camera not available</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 left-4 bg-white rounded-lg shadow-lg border overflow-hidden z-40 transition-all duration-300 ${
      isMinimized ? 'w-12 h-12' : 'w-64 h-48'
    }`}>
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="w-full h-full flex items-center justify-center hover:bg-gray-50"
        >
          <Camera className="h-6 w-6 text-blue-600" />
        </button>
      ) : (
        <>
          {/* Camera Controls */}
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={() => setIsMinimized(true)}
              className="bg-black bg-opacity-50 text-white p-1 rounded hover:bg-opacity-70"
              title="Minimize camera"
            >
              <Square className="h-3 w-3" />
            </button>
          </div>

          {recordingIndicator}

          {/* Video Feed */}
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ display: 'none' }}
            />
          </div>

          {/* Status Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <span>{isRecording ? 'Recording' : 'Stopped'}</span>
              </div>
              
              <div className={getFaceDetectionStatus().color}>
                {getFaceDetectionStatus().text}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 