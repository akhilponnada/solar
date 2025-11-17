// Types for the rooftop monitoring application

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface SolarPanelDetection {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
}

export interface AnalysisResult {
  hasSolarPanels: boolean;
  panelCount: number;
  coveragePercentage: number;
  averageConfidence: number;
  detections: SolarPanelDetection[];
  imageUrl: string;
  location: Location;
  timestamp: Date;
}

export interface RoboflowResponse {
  predictions: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    class: string;
    class_id: number;
  }>;
  image: {
    width: number;
    height: number;
  };
}
