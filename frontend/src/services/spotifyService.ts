// src/services/spotifyService.ts (Frontend)

import axios from 'axios';
import queryString from 'query-string';

const CLIENT_ID = '0532417c01ac438dad85bb539b148176';
const REDIRECT_URI = 'http://localhost:3000';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';

let accessToken: string | null = null;
let deviceId: string | null = null;

// ... (generateCodeVerifier and generateCodeChallenge functions)

export const authenticate = async () => {
  // ... (authenticate function)
  
};

export const initializePlayer = async () => {
  const hash = window.location.search;
  const params = queryString.parse(hash);
  const code = params.code as string;

  if (code) {
    const codeVerifier = localStorage.getItem('code_verifier');
    localStorage.removeItem('code_verifier');

    try {
      const response = await axios.post('/api/token', { code, codeVerifier, redirectUri: REDIRECT_URI });
      accessToken = response.data.accessToken;
    } catch (error) {
      console.error('Error getting token:', error);
    }
  }
};

export const playTrack = async (trackUri: string, deviceId: string) => {
  try {
    await axios.post('/api/play', { trackUri, deviceId });
  } catch (error) {
    console.error('Error playing track:', error);
  }
};

export const getAvailableDevices = async () => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/devices', {headers: {Authorization: `Bearer ${accessToken}`}});
    return response.data.devices;
  } catch (error) {
    console.error('Error getting devices:', error);
    return [];
  }
}