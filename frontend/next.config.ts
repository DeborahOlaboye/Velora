import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for MetaMask SDK and other packages trying to use React Native dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': path.resolve(__dirname, 'polyfills/async-storage.js'),
    };

    config.resolve.fallback = {
      ...config.resolve.fallback,
      'react-native': false,
      'react-native-randombytes': false,
      'react-native-get-random-values': false,
      'react-native-crypto': false,
      'react-native-webview': false,
    };

    // Ignore warnings for these modules
    config.ignoreWarnings = [
      { module: /@react-native-async-storage\/async-storage/ },
      { module: /react-native/ },
    ];

    return config;
  },
  // Suppress warnings about missing modules
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
