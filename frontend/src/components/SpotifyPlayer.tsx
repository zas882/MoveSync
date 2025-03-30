import React, { useEffect, useState } from 'react';

interface SpotifyPlayerProps {
  token: string; // Spotify access token
  trackUri: string; // Spotify track URI (e.g., "spotify:track:6rqhFgbbKwnb9MLmUQDhG6")
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ token, trackUri }) => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Spotify) {
        const spotifyPlayer = new window.Spotify.Player({
          name: 'Workout Player',
          getOAuthToken: (cb) => cb(token),
        });

        setPlayer(spotifyPlayer);

        spotifyPlayer.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
        });

        spotifyPlayer.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });

        spotifyPlayer.addListener('initialization_error', ({ message }) => {
          console.error('Initialization Error:', message);
        });

        spotifyPlayer.addListener('authentication_error', ({ message }) => {
          console.error('Authentication Error:', message);
        });

        spotifyPlayer.addListener('account_error', ({ message }) => {
          console.error('Account Error:', message);
        });

        spotifyPlayer.addListener('playback_error', ({ message }) => {
          console.error('Playback Error:', message);
        });

        spotifyPlayer.connect();
      }
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [token]);

  const handlePlay = async () => {
    if (!deviceId) {
      console.error('Device ID is not available yet.');
      return;
    }

    const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [trackUri] }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to start playback:', response.statusText);
    }
  };

  return (
    <div>
      <button onClick={handlePlay}>Play Song</button>
    </div>
  );
};

export default SpotifyPlayer;