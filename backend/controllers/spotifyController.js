const spotifyApi = require('../spotifyIntegration');

exports.searchSong = async (req, res) => {
  try {
	const { query } = req.query;
	const data = await spotifyApi.searchTracks(query, { limit: 1 });
	if (data.body.tracks.items.length > 0) {
	  res.json(data.body.tracks.items[0]);
	} else {
	  res.status(404).json({ message: 'No song found' });
	}
  } catch (error) {
	res.status(500).json({ error: error.message });
  }
};

exports.playSong = async (req, res) => {
  try {
	const { uri } = req.body;
	await spotifyApi.play({ uris: [uri] });
	res.status(200).json({ message: 'Playback started' });
  } catch (error) {
	res.status(500).json({ error: error.message });
  }
};

let _stream; // Declare a variable without TypeScript-specific syntax