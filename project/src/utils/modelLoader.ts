import * as faceapi from 'face-api.js';

export const MODELS_PATH = '/models';

export const REQUIRED_MODELS = [
  {
    net: faceapi.nets.tinyFaceDetector,
    name: 'TinyFaceDetector'
  },
  {
    net: faceapi.nets.faceLandmark68Net,
    name: 'FaceLandmark68'
  },
  {
    net: faceapi.nets.faceExpressionNet,
    name: 'FaceExpression'
  },
  {
    net: faceapi.nets.ageGenderNet,
    name: 'AgeGender'
  }
] as const;

export type FaceDetectionModel = typeof REQUIRED_MODELS[number];

export async function initializeModels() {
  console.log('Initializing face detection models...');
  try {
    await Promise.all(
      REQUIRED_MODELS.map(async ({ net, name }) => {
        if (!net.isLoaded) {
          await net.loadFromUri(MODELS_PATH);
          console.log(`Loaded ${name} model`);
        }
      })
    );
    console.log('All models initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize models:', error);
    return false;
  }
}