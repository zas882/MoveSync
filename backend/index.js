const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/generate-workout', async (req, res) => {
  const { workoutType, workoutDuration, workoutChallenge, musicGenre } = req.body;

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate a workout plan for ${workoutDuration} minutes of ${workoutType} at a challenge level of ${workoutChallenge}. Also, suggest songs in the ${musicGenre} genre. Return the response as a JSON array.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const workoutJson = JSON.parse(text);
    res.json(workoutJson);
  } catch (error) {
    console.error('Gemini error:', error);
    res.status(500).send('Error generating workout.');
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});