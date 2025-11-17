// Roboflow API integration for solar panel detection

import type { RoboflowResponse, SolarPanelDetection, AnalysisResult, Location } from '../types';

export const ROBOFLOW_CONFIG = {
  apiKey: import.meta.env.VITE_ROBOFLOW_API_KEY,
  privateKey: import.meta.env.VITE_ROBOFLOW_PRIVATE_KEY,
  modelEndpoint: 'https://detect.roboflow.com',
  // Using a public solar panel detection model
  modelId: 'solar-panels-taxvb',
  modelVersion: '9',
};

/**
 * Detects solar panels in an image using Roboflow API
 * @param imageUrl URL or base64 encoded image
 * @returns Detection results from Roboflow
 */
export async function detectSolarPanels(
  imageUrl: string
): Promise<RoboflowResponse> {
  const url = `${ROBOFLOW_CONFIG.modelEndpoint}/${ROBOFLOW_CONFIG.modelId}/${ROBOFLOW_CONFIG.modelVersion}`;

  try {
    const response = await fetch(`${url}?api_key=${ROBOFLOW_CONFIG.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageUrl,
      }),
    });

    if (!response.ok) {
      throw new Error(`Roboflow API error: ${response.statusText}`);
    }

    const data: RoboflowResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error detecting solar panels:', error);
    throw error;
  }
}

/**
 * Analyzes satellite image for solar panels
 * @param imageUrl Satellite image URL
 * @param location Location coordinates
 * @returns Complete analysis result
 */
export async function analyzeSatelliteImage(
  imageUrl: string,
  location: Location
): Promise<AnalysisResult> {
  try {
    const detectionResponse = await detectSolarPanels(imageUrl);

    const detections: SolarPanelDetection[] = detectionResponse.predictions.map(pred => ({
      x: pred.x,
      y: pred.y,
      width: pred.width,
      height: pred.height,
      confidence: pred.confidence,
      class: pred.class,
    }));

    const stats = calculateSolarStats(detections, detectionResponse.image);

    return {
      hasSolarPanels: detections.length > 0,
      panelCount: detections.length,
      coveragePercentage: stats.coveragePercentage,
      averageConfidence: stats.averageConfidence,
      detections,
      imageUrl,
      location,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error analyzing satellite image:', error);
    throw error;
  }
}

/**
 * Calculates statistics from solar panel detections
 */
export function calculateSolarStats(
  detections: SolarPanelDetection[],
  imageSize: { width: number; height: number }
): {
  coveragePercentage: number;
  averageConfidence: number;
} {
  if (detections.length === 0) {
    return {
      coveragePercentage: 0,
      averageConfidence: 0,
    };
  }

  // Calculate total area covered by solar panels
  const totalPanelArea = detections.reduce(
    (sum, detection) => sum + detection.width * detection.height,
    0
  );

  const totalImageArea = imageSize.width * imageSize.height;
  const coveragePercentage = (totalPanelArea / totalImageArea) * 100;

  // Calculate average confidence
  const totalConfidence = detections.reduce(
    (sum, detection) => sum + detection.confidence,
    0
  );
  const averageConfidence = totalConfidence / detections.length;

  return {
    coveragePercentage: Math.round(coveragePercentage * 100) / 100,
    averageConfidence: Math.round(averageConfidence * 100) / 100,
  };
}

/**
 * Validates if Roboflow API is properly configured
 */
export function isRoboflowConfigured(): boolean {
  return !!(ROBOFLOW_CONFIG.apiKey && ROBOFLOW_CONFIG.apiKey !== '');
}
