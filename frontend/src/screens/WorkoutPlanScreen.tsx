// src/screens/WorkoutPlanScreen.tsx
import React from 'react';
import WorkoutCard from '../components/WorkoutCard';
import { WorkoutPlanScreenProps } from '../types';
// import { initializeSpotifyPlayer, playTrack } from '../services/spotifyService'; // If using SDK

const WorkoutPlanScreen: React.FC<WorkoutPlanScreenProps> = ({ plan }) => {

  // Handler for playing song (example for SDK approach)
  const handlePlaySong = (trackId: string) => {
    console.log('Requesting playback for track:', trackId);
    // Example: Call a function from spotifyService to play the track
    // playTrack(trackId); // Assumes player is initialized
  };

  if (!plan || plan.length === 0) {
    return <p>No workout plan generated. Go back and try again!</p>;
    // Optionally add a button to go back
  }

  return (
    <div>
      <h2>Your Workout Plan</h2>
      {plan.map((item, index) => (
        <WorkoutCard
            key={index} // Using index is okay if list isn't dynamically reordered; ideally use a unique ID from backend if available
            item={item}
            onPlaySong={handlePlaySong} // Pass handler down
        />
      ))}
       {/* Maybe add a "Start Over" button here */}
    </div>
  );
};

export default WorkoutPlanScreen;