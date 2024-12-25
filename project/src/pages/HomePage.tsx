import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload } from 'lucide-react';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Face Recognition App</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate('/live-face')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Camera size={24} />
          Live Face
        </button>
        <button
          onClick={() => navigate('/image-upload')}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Upload size={24} />
          Image Upload
        </button>
      </div>
    </div>
  );
}

export default HomePage;