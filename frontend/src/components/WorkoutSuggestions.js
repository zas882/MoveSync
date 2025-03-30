import React, { useState } from 'react';

const WorkoutSuggestions = () => {
  const [query, setQuery] = useState('');
  const [song, setSong] = useState(null);

  const handleSearch = async () => {
	const response = await fetch(`/api/spotify/search?query=${query}`);
	const data = await response.json();
	setSong(data);
  };

  return (
	<div>
	  <input
		type="text"
		placeholder="Enter workout suggestion"
		value={query}
		onChange={(e) => setQuery(e.target.value)}
	  />
	  <button onClick={handleSearch}>Search Song</button>
	  {song && <div>{song.name} by {song.artists[0].name}</div>}
	</div>
  );
};

export default WorkoutSuggestions;