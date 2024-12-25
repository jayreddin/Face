import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LiveFacePage from './pages/LiveFacePage';
import ImageUploadPage from './pages/ImageUploadPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/live-face" element={<LiveFacePage />} />
          <Route path="/image-upload" element={<ImageUploadPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;