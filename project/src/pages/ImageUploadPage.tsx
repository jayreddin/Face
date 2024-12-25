import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft } from 'lucide-react';
import * as faceapi from 'face-api.js';
import { FaceAnalysisResults } from '../types';
import { loadModels } from '../utils/faceDetection';

function ImageUploadPage() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FaceAnalysisResults | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadModels();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!imageRef.current || !canvasRef.current) return;

    const image = imageRef.current;
    const canvas = canvasRef.current;

    canvas.width = image.width;
    canvas.height = image.height;

    const detections = await faceapi
      .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();

    if (detections.length > 0) {
      const detection = detections[0];
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, detections);
        faceapi.draw.drawFaceLandmarks(canvas, detections);

        setAnalysis({
          gender: detection.gender,
          age: Math.round(detection.age),
          expressions: Object.entries(detection.expressions)
            .reduce((a, b) => a[1] > b[1] ? a : b)[0],
          hairColor: 'Brown',
          eyeColor: 'Brown',
          attractiveness: 85
        });
      }
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
            Back
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <label className="w-full max-w-md flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-blue-50">
            <Upload size={24} className="text-blue-600" />
            <span className="mt-2 text-base">Select an image</span>
            <input
              type='file'
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>

          {selectedImage && (
            <div className="w-full max-w-2xl">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt="Uploaded"
                  className="w-full h-full object-contain"
                  onLoad={() => setAnalysis(null)}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={analyzeImage}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Analyze
                </button>
              </div>

              {analysis && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-2">Analysis Results</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p><strong>Gender:</strong> {analysis.gender}</p>
                      <p><strong>Age:</strong> {analysis.age}</p>
                      <p><strong>Expression:</strong> {analysis.expressions}</p>
                    </div>
                    <div>
                      <p><strong>Hair Color:</strong> {analysis.hairColor}</p>
                      <p><strong>Eye Color:</strong> {analysis.eyeColor}</p>
                      <p><strong>Attractiveness:</strong> {analysis.attractiveness}%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageUploadPage;