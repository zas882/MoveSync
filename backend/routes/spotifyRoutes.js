const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Middleware to ensure the token is always set
router.use((req, res, next) => {
  spotifyApi.setAccessToken(global.access_token); // Use the global token
  next();
});

// Example route to search for tracks
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const data = await spotifyApi.searchTracks(query);
    res.json(data.body.tracks.items);
  } catch (error) {
    console.error('Error searching tracks:', error);
    res.status(500).json({ error: 'Failed to search tracks' });
  }
});

module.exports = router;