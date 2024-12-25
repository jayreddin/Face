import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Repeat, ArrowLeft } from 'lucide-react';
import { FaceAnalysisResults } from '../types';
import { FaceDetection } from '../components/FaceDetection';

function LiveFacePage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [analysis, setAnalysis] = useState<FaceAnalysisResults | null>(null);

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreamActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopStream = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreamActive(false);
      setAnalysis(null);
    }
  };

  const flipCamera = () => {
    stopStream();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
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
          <button
            onClick={isStreamActive ? stopStream : startStream}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isStreamActive ? 'bg-red-600' : 'bg-green-600'
            } text-white`}
          >
            <Camera size={20} />
            {isStreamActive ? 'Camera Off' : 'Camera On'}
          </button>
        </div>

        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onPlay={() => setIsStreamActive(true)}
            className="w-full h-full object-cover"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
          <FaceDetection
            videoRef={videoRef}
            canvasRef={canvasRef}
            onAnalysis={setAnalysis}
            isActive={isStreamActive}
          />
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={flipCamera}
            disabled={!isStreamActive}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            <Repeat size={20} />
            Flip Camera
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
    </div>
  );
}

export default LiveFacePage;