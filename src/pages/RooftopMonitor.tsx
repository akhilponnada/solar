import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Scan, Loader2 } from 'lucide-react';
import {
  loadGoogleMapsScript,
  geocodeAddress,
  getSatelliteImageUrl,
  reverseGeocode,
  GOOGLE_MAPS_CONFIG,
} from '../lib/googleMaps';
import { analyzeSatelliteImage, isRoboflowConfigured } from '../lib/roboflow';
import type { Location, AnalysisResult } from '../types';
import ResultsDisplay from '../components/ResultsDisplay';

export default function RooftopMonitor() {
  const [address, setAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => {
        setIsMapLoaded(true);
        initializeMap();
      })
      .catch((err) => {
        setError('Failed to load Google Maps');
        console.error(err);
      });
  }, []);

  const initializeMap = () => {
    if (!mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: GOOGLE_MAPS_CONFIG.defaultCenter,
      zoom: GOOGLE_MAPS_CONFIG.defaultZoom,
      mapTypeId: 'satellite',
      tilt: 0,
    });

    mapInstanceRef.current = map;

    // Add click listener to select location
    map.addListener('click', async (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const location: Location = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };

        try {
          const addr = await reverseGeocode(location);
          location.address = addr;
        } catch (err) {
          console.error('Error reverse geocoding:', err);
        }

        setSelectedLocation(location);
        setAddress(location.address || `${location.lat}, ${location.lng}`);
        updateMarker(location);
      }
    });
  };

  const updateMarker = (location: Location) => {
    if (!mapInstanceRef.current) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Add new marker
    const marker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: mapInstanceRef.current,
      title: location.address || 'Selected Location',
    });

    markerRef.current = marker;

    // Center map on location
    mapInstanceRef.current.setCenter({ lat: location.lat, lng: location.lng });
  };

  const handleSearch = async () => {
    if (!address.trim()) {
      setError('Please enter an address');
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    try {
      const location = await geocodeAddress(address);
      setSelectedLocation(location);
      updateMarker(location);
    } catch (err) {
      setError('Could not find address. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedLocation) {
      setError('Please select a location first');
      return;
    }

    if (!isRoboflowConfigured()) {
      setError('Roboflow API is not configured');
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setResult(null);

    try {
      // Get satellite image
      const imageUrl = getSatelliteImageUrl(selectedLocation);

      // Analyze for solar panels
      const analysisResult = await analyzeSatelliteImage(imageUrl, selectedLocation);

      setResult(analysisResult);
    } catch (err) {
      setError('Failed to analyze rooftop. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Rooftop Solar Panel Detection
          </h1>
          <p className="text-gray-600">
            AI-powered analysis to detect solar panels on building rooftops
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Map and Controls */}
          <div className="space-y-4">
            {/* Search Box */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Select Location
              </h2>

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter address or click on map..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isAnalyzing || !address.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>

              {selectedLocation && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Selected:</strong> {selectedLocation.address || 'Custom location'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div
                ref={mapRef}
                className="w-full h-[500px]"
                style={{ minHeight: '500px' }}
              />
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!selectedLocation || isAnalyzing}
              className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-semibold shadow-lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Rooftop...
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5" />
                  Analyze for Solar Panels
                </>
              )}
            </button>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {result ? (
              <ResultsDisplay result={result} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <Scan className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">
                  Select a location and click "Analyze" to detect solar panels
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
