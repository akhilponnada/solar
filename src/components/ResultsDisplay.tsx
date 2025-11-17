import { CheckCircle2, XCircle, Image as ImageIcon } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Detection Status */}
      <div
        className={`p-6 ${
          result.hasSolarPanels
            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
            : 'bg-gradient-to-r from-gray-500 to-gray-600'
        } text-white`}
      >
        <div className="flex items-center gap-3 mb-2">
          {result.hasSolarPanels ? (
            <CheckCircle2 className="w-8 h-8" />
          ) : (
            <XCircle className="w-8 h-8" />
          )}
          <h2 className="text-2xl font-bold">
            {result.hasSolarPanels ? 'Solar Panels Detected!' : 'No Solar Panels Detected'}
          </h2>
        </div>
        <p className="text-sm opacity-90">
          Analysis completed at {formatDate(result.timestamp)}
        </p>
      </div>

      {/* Statistics */}
      {result.hasSolarPanels && (
        <div className="p-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{result.panelCount}</div>
            <div className="text-sm text-gray-600 mt-1">Panels Detected</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {result.coveragePercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Coverage Area</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {(result.averageConfidence * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Confidence</div>
          </div>
        </div>
      )}

      {/* Satellite Image */}
      <div className="p-6 border-t">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Analyzed Image
        </h3>
        <div className="relative">
          <img
            src={result.imageUrl}
            alt="Analyzed rooftop"
            className="w-full rounded-lg shadow-md"
          />
          {result.hasSolarPanels && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              ✓ Detected
            </div>
          )}
        </div>
      </div>

      {/* Detection Details */}
      {result.hasSolarPanels && result.detections.length > 0 && (
        <div className="p-6 border-t bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">Detection Details</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {result.detections.map((detection, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
              >
                <div>
                  <span className="font-medium text-gray-700">Panel #{index + 1}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({detection.class})
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    {detection.width.toFixed(0)}x{detection.height.toFixed(0)}px
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full font-medium ${
                      detection.confidence > 0.8
                        ? 'bg-green-100 text-green-800'
                        : detection.confidence > 0.6
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {(detection.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location Info */}
      <div className="p-6 border-t bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Location</h3>
        <p className="text-gray-700">{result.location.address || 'Custom location'}</p>
        <p className="text-sm text-gray-500 mt-1">
          Coordinates: {result.location.lat.toFixed(6)}, {result.location.lng.toFixed(6)}
        </p>
      </div>
    </div>
  );
}
