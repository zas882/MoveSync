// src/App.tsx
import React, { useState } from 'react';
import StartScreen from './screens/StartScreen';
import WorkoutPlanScreen from './screens/WorkoutPlanScreen.tsx';
import { generateWorkoutPlan } from './services/geminiService.ts';
import { UserInputs, WorkoutPlan } from './types';
import './App.css'; // Example global styles

function App() {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'start' | 'plan'>('start');

  const handleCreateWorkout = async (inputs: UserInputs) => {
    setIsLoading(true);
    setError(null);
    setWorkoutPlan(null); // Clear previous plan

    try {
      const plan = await generateWorkoutPlan(inputs);
      setWorkoutPlan(plan);
      setCurrentScreen('plan'); // Switch to the plan screen
    } catch (err) {
      setError((err as Error).message || 'Failed to generate workout plan.');
      setCurrentScreen('start'); // Stay on start screen on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
      setWorkoutPlan(null);
      setError(null);
      setCurrentScreen('start');
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Workout & Music Generator</h1>
         {/* Simple back button if on plan screen */}
         {currentScreen === 'plan' && (
            <button onClick={handleGoBack} style={{ margin: '10px 0' }}>Start Over</button>
        )}
      </header>
      <main>
        {/* Conditional Rendering based on currentScreen state */}
        {currentScreen === 'start' && (
          <>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <StartScreen onSubmit={handleCreateWorkout} isLoading={isLoading} />
          </>
        )}
        {currentScreen === 'plan' && <WorkoutPlanScreen plan={workoutPlan} />}
      </main>
    </div>
  );
}

export default App;