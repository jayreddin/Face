import * as faceapi from 'face-api.js';
import { initializeModels } from './modelLoader';

let modelsLoaded = false;

export async function loadModels() {
  if (modelsLoaded) return;

  try {
    modelsLoaded = await initializeModels();
    if (!modelsLoaded) {
      throw new Error('Model initialization failed');
    }
  } catch (error) {
    console.error('Error loading face detection models:', error);
    throw new Error(`Failed to load face detection models: ${error.message}`);
  }
}

export async function detectFace(input: HTMLImageElement | HTMLVideoElement) {
  if (!modelsLoaded) {
    await loadModels();
  }

  return faceapi
    .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions()
    .withAgeAndGender();
}