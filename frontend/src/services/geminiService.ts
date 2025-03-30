// src/services/geminiService.ts
import axios from 'axios';
import { UserInputs, WorkoutPlan } from '../types';

// !! IMPORTANT: Replace with your actual backend endpoint URL !!
const GEMINI_BACKEND_URL = 'http://localhost:3001/api/generate';

/**
 * Calls the Gemini backend to generate a workout plan.
 * @param inputs - The user's selections from the form.
 * @returns A promise that resolves with the WorkoutPlan or rejects with an error.
 */
export const generateWorkoutPlan = async (inputs: UserInputs): Promise<WorkoutPlan> => {
  try {
    console.log('Sending to backend:', inputs);
    const response = await axios.post<WorkoutPlan>(GEMINI_BACKEND_URL, inputs);

    // Basic validation (you might want more robust checks)
    if (!Array.isArray(response.data) || response.data.length === 0) {
        throw new Error('Received invalid workout plan data from backend.');
    }
    // Further validation: check if items have necessary fields like exercise, song.name, song.spotifyTrackId etc.

    console.log('Received from backend:', response.data);
    return response.data; // Assuming the backend returns the WorkoutPlan array directly

  } catch (error) {
    console.error('Error calling Gemini backend:', error);
    // Handle different types of errors (network, server response)
    if (axios.isAxiosError(error)) {
        // Access specific axios error properties if needed (error.response, error.request)
        throw new Error(`Backend API error: ${error.response?.statusText || error.message}`);
    } else {
        throw new Error(`An unexpected error occurred: ${(error as Error).message}`);
    }
  }
};