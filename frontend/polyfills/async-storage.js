/**
 * Polyfill for @react-native-async-storage/async-storage
 * 
 * This is a browser-compatible implementation that uses localStorage
 * to replace React Native's AsyncStorage when running in a web environment.
 */

const AsyncStorage = {
  getItem: async (key) => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('AsyncStorage.getItem error:', error);
      return null;
    }
  },

  setItem: async (key, value) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('AsyncStorage.setItem error:', error);
    }
  },

  removeItem: async (key) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('AsyncStorage.removeItem error:', error);
    }
  },

  clear: async () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('AsyncStorage.clear error:', error);
    }
  },

  getAllKeys: async () => {
    if (typeof window === 'undefined') return [];
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.warn('AsyncStorage.getAllKeys error:', error);
      return [];
    }
  },

  multiGet: async (keys) => {
    if (typeof window === 'undefined') return [];
    try {
      return keys.map(key => [key, localStorage.getItem(key)]);
    } catch (error) {
      console.warn('AsyncStorage.multiGet error:', error);
      return [];
    }
  },

  multiSet: async (keyValuePairs) => {
    if (typeof window === 'undefined') return;
    try {
      keyValuePairs.forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
    } catch (error) {
      console.warn('AsyncStorage.multiSet error:', error);
    }
  },

  multiRemove: async (keys) => {
    if (typeof window === 'undefined') return;
    try {
      keys.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.warn('AsyncStorage.multiRemove error:', error);
    }
  },
};

export default AsyncStorage;
