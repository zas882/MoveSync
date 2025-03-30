// server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- Configuration ---
const PORT = process.env.PORT || 3001; // Use port from .env or default to 3001
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL_NAME = "gemini-1.5-flash"; // Or choose another suitable model

if (!GEMINI_API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY is not defined in .env file.");
  process.exit(1); // Exit if API key is missing
}

// --- Initialize Express App ---
const app = express();

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing for requests from your frontend
app.use(express.json()); // Enable parsing of JSON request bodies

// --- Initialize Google Generative AI Client ---
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });

// --- API Endpoint ---
app.post('/api/generate', async (req, res) => {
  console.log('Received request body:', req.body);

  // 1. Extract and Validate Inputs
  const { workoutType, duration, intensity, musicGenre } = req.body;
  if (!workoutType || !duration || !intensity || !musicGenre) {
    return res.status(400).json({ error: 'Missing required input fields.' });
  }

  try {
    // 2. Construct the Prompt for Gemini
    //    This is crucial for getting the desired JSON output. Be very specific!
    const prompt = `
      You are a helpful workout planner and music curator.
      Generate a workout plan based on the following user preferences:
      - Workout Type: ${workoutType}
      - Desired Duration: ${duration} minutes
      - Intensity Level: ${intensity} (out of 5)
      - Preferred Music Genre: ${musicGenre}

      Return the plan ONLY as a valid JSON array of objects. Do not include any introductory text, explanations, code blocks (like \\\`json), or markdown formatting before or after the JSON array itself.

      Each object in the array must represent one exercise/song pair and have the EXACT following structure:
      {
        "exercise": "Name of the exercise (e.g., 'Push-ups', 'Squats', 'Running', 'Downward Dog')",
        "details": "Specific instructions like sets/reps or duration for this exercise (e.g., '3 sets of 12 reps', 'Run for 5 minutes', 'Hold for 45 seconds'). Aim for the total workout duration to roughly match the user's desired duration.",
        "song": {
          "name": "Relevant Song Title matching the genre",
          "artist": "Artist Name for the song",
          "spotifyTrackId": "A real or plausible Spotify Track ID for the song (e.g., '1xQ6trWNWvdcSvuMHu4a0C'). If unsure or unable to find a real ID, use the placeholder string 'SEARCH_ON_SPOTIFY'."
        }
      }

      Ensure the generated JSON is a valid array and adheres strictly to this structure. The songs should fit the specified genre: ${musicGenre}.
    `;

    console.log("--- Sending Prompt to Gemini ---");
    // console.log(prompt); // Uncomment to debug the exact prompt being sent
    console.log("-------------------------------");


    // 3. Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    console.log("--- Received Raw Response from Gemini ---");
    console.log(rawText);
    console.log("---------------------------------------");

    // 4. Attempt to Parse the Response as JSON
    let workoutPlan;
    try {
        // Sometimes Gemini might still add markdown backticks `json ...  ` - try to remove them
        const cleanedText = rawText.replace(/^json\s*|\s*$/g, '').trim();
        workoutPlan = JSON.parse(cleanedText);

        // Basic validation of the parsed structure
        if (!Array.isArray(workoutPlan)) {
            throw new Error("Parsed response is not a JSON array.");
        }
        if (workoutPlan.length > 0) {
           const firstItem = workoutPlan[0];
           if (!firstItem.exercise || !firstItem.details || !firstItem.song || !firstItem.song.name || !firstItem.song.artist || !firstItem.song.spotifyTrackId) {
               throw new Error("Parsed JSON objects are missing required keys.");
           }
        }
         console.log("Successfully parsed workout plan.");

    } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        console.error('Raw response was:', rawText); // Log the raw response for debugging
        // Send a specific error message indicating parsing failure
        return res.status(500).json({
            error: 'Failed to parse the workout plan from the AI response. The format might be incorrect.',
            rawResponse: rawText // Optionally send raw response back for debugging frontend
        });
    }

    // 5. Send Successful Response to Frontend
    res.json(workoutPlan); // Send the parsed JSON array

  } catch (error) {
    console.error('Error calling Gemini API or processing request:', error);
    res.status(500).json({ error: 'An error occurred while generating the workout plan.' });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Frontend should call: http://localhost:${PORT}/api/generate`);
});