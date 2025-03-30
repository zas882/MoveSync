declare namespace Spotify {
  interface Player {
    new (options: PlayerOptions): Player;
    connect(): Promise<boolean>;
    disconnect(): void;
    addListener(event: string, callback: (data: any) => void): void;
    removeListener(event: string, callback?: (data: any) => void): void;
  }

  interface PlayerOptions {
    name: string;
    getOAuthToken: (callback: (token: string) => void) => void;
  }

  interface PlayerEventReady {
    device_id: string;
  }

  interface PlayerEventNotReady {
    device_id: string;
  }

  interface PlayerError {
    message: string;
  }
}