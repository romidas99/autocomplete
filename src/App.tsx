import { useState } from 'react';
import { Autocomplete } from './components/Autocomplete';
import { usePlayerSearch } from './hooks/usePlayerSearch';
import { Player } from './types/autocomplete';

function App() {
  const { players, loading, error, search } = usePlayerSearch();
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  // Handle player selection/deselection
  const handlePlayerSelection = (value: Player | Player[] | null) => {
    if (!value) {
      setSelectedPlayers([]);
      return;
    }

    if (Array.isArray(value)) {
      setSelectedPlayers(value);
    } else {
      // For single selection, toggle if already selected
      const isSelected = selectedPlayers.some(player => player.id === value.id);
      if (isSelected) {
        setSelectedPlayers(selectedPlayers.filter(player => player.id !== value.id));
      } else {
        setSelectedPlayers([...selectedPlayers, value]);
      }
    }
  };

  // Remove a player from selection
  const removePlayer = (playerId: number) => {
    setSelectedPlayers(selectedPlayers.filter((player) => player.id !== playerId));
  };

  // Default filter function for object type
  const filterOptions = (options: Player[], inputValue: string) => {
    const searchValue = inputValue.toLowerCase();
    return options.filter(
      player => 
        player.first_name.toLowerCase().includes(searchValue) ||
        player.last_name.toLowerCase().includes(searchValue) ||
        (player.team?.full_name?.toLowerCase().includes(searchValue))
    );
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>NBA Player Search</h1>
        <p>Search for NBA players using the Ball Don't Lie API</p>
      </header>

      <div className="card">
        <h2>Search for NBA Players</h2>
        <Autocomplete<Player>
          label="Search for NBA players"
          description="Enter player names to add them to your selection"
          placeholder="Type a player name..."
          loading={loading}
          value={selectedPlayers}
          options={players}
          onChange={handlePlayerSelection}
          onInputChange={search}
          filterOptions={filterOptions}
          renderOption={(player) => (
            <div className="player-option">
              <div className="player-avatar">
                <span>{player.first_name[0]}{player.last_name[0]}</span>
              </div>
              <div className="player-info">
                <div className="player-name">{player.first_name} {player.last_name}</div>
                <div className="player-details">
                  {player.team?.full_name || "Team not available"} • {player.position || "N/A"}
                </div>
              </div>
            </div>
          )}
          multiple={true}
        />
      </div>

      {selectedPlayers.length > 0 ? (
        <div className="card">
          <h2>Selected Players</h2>
          <div className="selected-players-grid">
            {selectedPlayers.map((player) => (
              <div key={player.id} className="selected-player-card">
                <div className="selected-player-info">
                  <div className="selected-player-header">
                    <h3 className="selected-player-name">
                      {player.first_name} {player.last_name}
                    </h3>
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="remove-player-button"
                      aria-label={`Remove ${player.first_name} ${player.last_name}`}
                    >
                      ×
                    </button>
                  </div>
                  <div className="selected-player-details">
                    <div>Team: {player.team?.full_name || "Team not available"}</div>
                    <div>Position: {player.position || "N/A"}</div>
                    {player.height_feet && player.height_inches && (
                      <div>Height: {player.height_feet}'{player.height_inches}"</div>
                    )}
                    {player.weight_pounds && (
                      <div>Weight: {player.weight_pounds} lbs</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default App;