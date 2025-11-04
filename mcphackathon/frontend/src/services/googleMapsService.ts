// frontend/src/services/googleMapsService.ts

export class GoogleMapsService {
  private apiKey: string;
  private scriptLoaded: boolean = false;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async loadGoogleMaps(): Promise<void> {
    if (this.scriptLoaded) return;

    return new Promise((resolve, reject) => {
      if (window.google?.maps) {
        this.scriptLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Maps script'));
      };

      document.head.appendChild(script);
    });
  }

  async geocode(address: string): Promise<{ lat: number; lng: number; address: string } | null> {
    await this.loadGoogleMaps();

    return new Promise((resolve) => {
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            address: results[0].formatted_address
          });
        } else {
          console.error('Geocoding failed:', status);
          resolve(null);
        }
      });
    });
  }

  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    await this.loadGoogleMaps();

    return new Promise((resolve) => {
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          console.error('Reverse geocoding failed:', status);
          resolve(null);
        }
      });
    });
  }

  async searchNearby(lat: number, lng: number, radius: number, types: string[] = []): Promise<any[]> {
    await this.loadGoogleMaps();

    return new Promise((resolve) => {
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      const request = {
        location: new window.google.maps.LatLng(lat, lng),
        radius: radius,
        type: types.length > 0 ? types[0] : undefined
      };

      service.nearbySearch(request, (results, status) => {
        if (status === 'OK' && results) {
          resolve(results);
        } else {
          console.error('Nearby search failed:', status);
          resolve([]);
        }
      });
    });
  }

  async calculateDistance(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }): Promise<number> {
    await this.loadGoogleMaps();

    return window.google.maps.geometry.spherical.computeDistanceBetween(
      new window.google.maps.LatLng(origin.lat, origin.lng),
      new window.google.maps.LatLng(destination.lat, destination.lng)
    );
  }

  async getPlaceDetails(placeId: string): Promise<any> {
    await this.loadGoogleMaps();

    return new Promise((resolve) => {
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      
      service.getDetails({ placeId }, (result, status) => {
        if (status === 'OK' && result) {
          resolve(result);
        } else {
          console.error('Place details failed:', status);
          resolve(null);
        }
      });
    });
  }
}