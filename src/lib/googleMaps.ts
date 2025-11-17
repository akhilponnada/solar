// Google Maps API integration

import type { Location } from '../types';

export const GOOGLE_MAPS_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  defaultCenter: { lat: 20.5937, lng: 78.9629 }, // India center
  defaultZoom: 18,
};

/**
 * Loads Google Maps JavaScript API
 */
export function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
}

/**
 * Gets satellite image URL for a location
 * @param location Coordinates
 * @param size Image size (default: 640x640)
 * @param zoom Zoom level (default: 19)
 * @returns Static Maps API URL
 */
export function getSatelliteImageUrl(
  location: Location,
  size: { width: number; height: number } = { width: 640, height: 640 },
  zoom: number = 19
): string {
  const { lat, lng } = location;
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size.width}x${size.height}&maptype=satellite&key=${GOOGLE_MAPS_CONFIG.apiKey}`;
}

/**
 * Geocodes an address to coordinates
 * @param address Address string
 * @returns Location with coordinates
 */
export async function geocodeAddress(address: string): Promise<Location> {
  const geocoder = new google.maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
          address: results[0].formatted_address,
        });
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
}

/**
 * Reverse geocodes coordinates to address
 * @param location Coordinates
 * @returns Address string
 */
export async function reverseGeocode(location: Location): Promise<string> {
  const geocoder = new google.maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        resolve(results[0].formatted_address);
      } else {
        reject(new Error(`Reverse geocoding failed: ${status}`));
      }
    });
  });
}

/**
 * Validates if Google Maps API is properly configured
 */
export function isGoogleMapsConfigured(): boolean {
  return !!(GOOGLE_MAPS_CONFIG.apiKey && GOOGLE_MAPS_CONFIG.apiKey !== '');
}
