import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'inventoryApp',
  webDir: 'www',
  plugins: {
    GoogleMaps: {
      apiKey: 'AIzaSyBgK7Oil-JysvzLLMIWpNJUi1WmpQ_6PYE', // Reemplaza con tu clave de API de Google Maps
    },
  }
};

export default config;
