const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const refreshAccessToken = async () => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('Access token refreshed:', data.body['access_token']);
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

// Refresh the token immediately when the app starts
refreshAccessToken();

// Export the Spotify API instance and the refresh function
module.exports = { spotifyApi, refreshAccessToken };