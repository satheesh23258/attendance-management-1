// Google Maps Loader Utility
let googleMapsLoaded = false;
let googleMapsPromise = null;

export const loadGoogleMaps = () => {
  // Return existing promise if already loading
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  // Return immediately if already loaded
  if (googleMapsLoaded && window.google) {
    return Promise.resolve(window.google);
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        console.error('Google Maps API key not found in environment variables');
        reject(new Error('VITE_GOOGLE_MAPS_API_KEY is not defined'));
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector(
        `script[src*="maps.googleapis.com"]`
      );

      if (existingScript) {
        if (window.google && window.google.maps) {
          googleMapsLoaded = true;
          resolve(window.google);
          return;
        }

        // Wait for existing script to load if it hasn't finished
        existingScript.addEventListener('load', () => {
          googleMapsLoaded = true;
          resolve(window.google);
        });
        existingScript.addEventListener('error', () => {
          reject(new Error('Failed to load Google Maps API'));
        });
        return;
      }

      // Create and append script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker,drawing`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log('✅ Google Maps API loaded successfully');
        googleMapsLoaded = true;
        resolve(window.google);
      };

      script.onerror = () => {
        console.error('❌ Failed to load Google Maps API');
        console.error('API Key:', apiKey ? '***' + apiKey.slice(-8) : 'NOT SET');
        reject(new Error('Failed to load Google Maps API'));
        googleMapsPromise = null;
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      reject(error);
      googleMapsPromise = null;
    }
  });

  return googleMapsPromise;
};

export const isGoogleMapsLoaded = () => {
  return googleMapsLoaded && !!window.google && !!window.google.maps;
};

export const waitForGoogleMaps = (timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkLoaded = () => {
      if (isGoogleMapsLoaded()) {
        resolve(window.google);
        return;
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error('Google Maps API loading timeout'));
        return;
      }

      setTimeout(checkLoaded, 100);
    };

    checkLoaded();
  });
};
