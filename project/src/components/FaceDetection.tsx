import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { detectFace } from '../utils/faceDetection';
import { FaceAnalysisResults } from '../types';

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onAnalysis: (results: FaceAnalysisResults | null) => void;
  isActive: boolean;
}

export function FaceDetection({ videoRef, canvasRef, onAnalysis, isActive }: Props) {
  const animationRef = useRef<number>();

  useEffect(() => {
    async function detectAndDraw() {
      if (!isActive || !videoRef.current || !canvasRef.current) return;

      try {
        const detection = await detectFace(videoRef.current);

        if (detection) {
          const canvas = canvasRef.current;
          const displaySize = {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight
          };

          if (canvas.width !== displaySize.width || canvas.height !== displaySize.height) {
            faceapi.matchDimensions(canvas, displaySize);
          }

          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0, 0, canvas.width, canvas.height);

          const resizedDetection = faceapi.resizeResults(detection, displaySize);
          faceapi.draw.drawDetections(canvas, [resizedDetection]);
          faceapi.draw.drawFaceLandmarks(canvas, [resizedDetection]);

          onAnalysis({
            gender: detection.gender,
            age: Math.round(detection.age),
            expressions: Object.entries(detection.expressions)
              .reduce((a, b) => a[1] > b[1] ? a : b)[0],
            hairColor: 'Brown', // These would come from a more sophisticated model
            eyeColor: 'Brown',
            attractiveness: 85
          });
        }

        animationRef.current = requestAnimationFrame(detectAndDraw);
      } catch (error) {
        console.error('Face detection error:', error);
        onAnalysis(null);
      }
    }

    if (isActive) {
      detectAndDraw();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, videoRef, canvasRef, onAnalysis]);

  return null;
}