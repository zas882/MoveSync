// src/components/WorkoutCard.tsx
import React from 'react';
import { WorkoutCardProps } from '../types';

const WorkoutCard: React.FC<WorkoutCardProps> = ({ item, onPlaySong }) => {
  const { exercise, details, song } = item;

  // Option 1: Button to trigger playback via Spotify API (more complex setup needed)
  const handlePlayClick = () => {
    onPlaySong(song.spotifyTrackId);
    // This function (passed down via props) would interact with the Spotify Web Playback SDK
    // or manage playback state. This is the more integrated approach but requires auth.
  };

  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '15px', borderRadius: '8px' }}>
      <h3>{exercise}</h3>
      <p>{details}</p>
      <hr />
      <p>
        <strong>Song:</strong> {song.name} by {song.artist}
      </p>
      {/* Choose ONE of the following buttons/links */}

      {/* Option 1: In-app play button (Requires Spotify SDK setup) */}
      {/* <button onClick={handlePlayClick}>Play Song</button> */}

    </div>
  );
};

export default WorkoutCard;