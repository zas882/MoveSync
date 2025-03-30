// src/types/index.ts

export interface UserInputs {
    workoutType: string;
    duration: number; // e.g., minutes (30, 45, 60)
    intensity: number; // 1 to 5
    musicGenre: string;
  }
  
  export interface SongData {
    name: string;
    artist: string;
    spotifyTrackId: string; // Crucial for playback/linking
    // Optional: albumArtUrl?: string;
  }
  
  export interface WorkoutItem {
    exercise: string;
    details: string; // e.g., "3 sets of 10 reps", "5 minutes", "Hold for 30 seconds"
    song: SongData;
  }
  
  export type WorkoutPlan = WorkoutItem[];
  
  // Interface for the props of WorkoutCard component
  export interface WorkoutCardProps {
    item: WorkoutItem;
    onPlaySong: (trackId: string) => void; // Function to handle playing the song
  }
  
  // Interface for the props of WorkoutPlanScreen component
  export interface WorkoutPlanScreenProps {
    plan: WorkoutPlan | null;
  }
  
  // Interface for the props of StartScreen component
  export interface StartScreenProps {
    onSubmit: (inputs: UserInputs) => void;
    isLoading: boolean; // To show loading state on the button
  }