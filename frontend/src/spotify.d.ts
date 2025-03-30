// src/spotify.d.ts
interface SpotifyPlayer {
  _options: {
    getOAuthToken: () => string;
  };
  connect: () => Promise<boolean>;
  disconnect: () => void;
  getCurrentState: () => Promise<Spotify.PlaybackState | null>;
  addListener: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  getDeviceId: () => string;
  play: (options: { uris: string[] }) => Promise<void>;
}

interface PlaybackState {
  position: number;
  duration: number;
  track_window: {
    current_track: SpotifyTrack;
  };
  paused: boolean;
  shuffle: boolean;
  repeat_mode: number;
}

interface SpotifyTrack {
  uri: string;
  id: string;
  type: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume: number;
      }) => SpotifyPlayer;
    };
  }
}