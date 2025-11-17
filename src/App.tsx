import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RooftopMonitor from './pages/RooftopMonitor';
import { Satellite } from 'lucide-react';
import './App.css';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
      <div className="text-center">
        <Satellite className="w-24 h-24 mx-auto text-white mb-6" />
        <h1 className="text-5xl font-bold text-white mb-4">
          Solar Panel Detection System
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          AI-powered rooftop analysis to detect solar panels on buildings using
          satellite imagery and computer vision
        </p>
        <Link
          to="/monitor"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-xl"
        >
          <Satellite className="w-6 h-6" />
          Start Monitoring
        </Link>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">AI Detection</div>
            <p className="text-white/80">
              Advanced computer vision to identify solar panels
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">Satellite View</div>
            <p className="text-white/80">
              High-resolution imagery from Google Maps
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">Real-time</div>
            <p className="text-white/80">
              Instant analysis and detailed statistics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/monitor" element={<RooftopMonitor />} />
      </Routes>
    </Router>
  );
}

export default App;
