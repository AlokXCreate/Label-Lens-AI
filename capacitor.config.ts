import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'gov.in.doca.labellens',
  appName: 'Label Lens AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      permissionsType: 'prompt'
    },
    Geolocation: {
      permissionsType: 'prompt'
    }
  }
};

export default config;
