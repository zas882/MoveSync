// src/screens/StartScreen.tsx
import React, { useState } from 'react';
import { UserInputs, StartScreenProps } from '../types';

// Define options for dropdowns/selections
const DURATION_OPTIONS = [15, 30, 45, 60, 75, 90]; // in minutes
const INTENSITY_OPTIONS = [1, 2, 3, 4, 5];
const GENRE_OPTIONS = ['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Classical', 'Jazz', 'R&B', 'Country', 'Workout Beats'];

const StartScreen: React.FC<StartScreenProps> = ({ onSubmit, isLoading }) => {
  const [workoutType, setWorkoutType] = useState<string>('');
  const [duration, setDuration] = useState<number>(DURATION_OPTIONS[1]); // Default to 30 min
  const [intensity, setIntensity] = useState<number>(INTENSITY_OPTIONS[2]); // Default to 3
  const [musicGenre, setMusicGenre] = useState<string>(GENRE_OPTIONS[0]); // Default to Pop

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    if (!workoutType.trim()) {
        alert("Please specify the type of workout.");
        return;
    }
    const inputs: UserInputs = {
      workoutType: workoutType.trim(),
      duration,
      intensity,
      musicGenre,
    };
    onSubmit(inputs); // Pass data up to the parent component (App.tsx)
  };

  return (
    <div>
      <h1>Create Your Workout</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="workoutType">1. What type of workout?</label>
          <input
            type="text"
            id="workoutType"
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            placeholder="e.g., Legs, Chest & Triceps, Cardio, Yoga"
            required
          />
        </div>

        <div>
          <label htmlFor="duration">2. How long? (minutes)</label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            {DURATION_OPTIONS.map((time) => (
              <option key={time} value={time}>
                {time} min
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="intensity">3. How challenging? (1-5)</label>
          <select
            id="intensity"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
          >
            {INTENSITY_OPTIONS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="musicGenre">4. Music Genre?</label>
          <select
            id="musicGenre"
            value={musicGenre}
            onChange={(e) => setMusicGenre(e.target.value)}
          >
            {GENRE_OPTIONS.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Create Workout'}
        </button>
      </form>
    </div>
  );
};

export default StartScreen;