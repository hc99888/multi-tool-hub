import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lyricsanalyzer.app',
  appName: '歌词智能分析',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  android: {
    buildOptions: {
      signingType: 'apksigner',
    },
  },
};

export default config;
