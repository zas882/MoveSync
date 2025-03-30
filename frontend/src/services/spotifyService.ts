import axios from 'axios';
import queryString from 'query-string';

const CLIENT_ID = '0532417c01ac438dad85bb539b148176'; // Replace with your Client ID
const REDIRECT_URI = 'http://localhost:3000';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

let accessToken: string | null = null;
let player: Spotify.Player | null = null;

export const getAccessToken = async () => {
  if (accessToken) {
    return accessToken;
  }

  const hash = window.location.hash;
  const params = queryString.parse(hash.substring(1));
  accessToken = params.access_token as string;

  if (accessToken) {
    window.location.hash = ''; // Clear the hash

    return accessToken;
  }

  const storedToken = localStorage.getItem('spotify_access_token');
  if (storedToken) {
    accessToken = storedToken;
    return accessToken;
  }

  return null;
};

export const authenticate = () => {
  const scopes = ['streaming', 'user-read-playback-state', 'user-modify-playback-state'];
  const authUrl = `<span class="math-inline">\{AUTH\_ENDPOINT\}?<1\>client\_id\=</span>{CLIENT_ID}&redirect_uri=<span class="math-inline">\{REDIRECT\_URI\}&scope\=</span>{scopes.join(
    '%20'
  )}&response_type=token&show_dialog=true`;
  window.location.href = authUrl;
};

export const initializePlayer = async (callback: (playerInstance: Spotify.Player) => void) => {
  const token = await getAccessToken();

  if (!token) {
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://sdk.scdn.co/spotify-player.js';
  script.async = true;

  document.body.appendChild(script);

  window.onSpotifyWebPlaybackSDKReady = () => {
    player = new window.Spotify.Player({
      name: 'Workout Music Player',
      getOAuthToken: (cb) => {
        cb(token);
      },
      volume: 0.5,
    });

    player.connect().then((success) => {
      if (success) {
        callback(player);
      }
    });
  };
};

export const playTrack = async (trackUri: string, deviceId: string) => {
  const token = await getAccessToken();
  if (!token || !player) return;

  try {
    await axios.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      { uris: [trackUri] },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('Error playing track:', error);
  }
};

export const getDeviceId = () => {
  if (player) {
    return player.getDeviceId();
  }
  return null;
};

export const isPlayerReady = () => {
  return player !== null;
};