import React, { useState } from 'react';
import { Autocomplete } from './components/Autocomplete';
import { usePlayerSearch } from './hooks/usePlayerSearch';
import { Player } from './types/autocomplete';

function App() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const { players, loading, error, search } = usePlayerSearch();

  const handleInputChange = (value: string) => {
    search(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">NBA Player Search</h1>
          <p className="text-lg text-gray-600">Search and select your favorite NBA players</p>
        </div>
        
        <div className="space-y-12">
          {/* Single Select Example */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Single Player Select</h2>
            <Autocomplete<Player>
              label="Search for a player"
              description="Type to search for NBA players"
              options={players}
              value={selectedPlayer}
              onChange={(value) => setSelectedPlayer(value as Player | null)}
              onInputChange={handleInputChange}
              loading={loading}
              placeholder="Search for a player..."
              renderOption={(player) => (
                <div className="flex items-center space-x-3 p-1">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">
                      {player.first_name[0]}{player.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{player.first_name} {player.last_name}</div>
                    <div className="text-sm text-gray-500">{player.team.full_name} • {player.position || 'N/A'}</div>
                  </div>
                </div>
              )}
            />
            {selectedPlayer && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <h3 className="font-medium text-indigo-900 mb-2">Selected Player:</h3>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold text-lg">
                      {selectedPlayer.first_name[0]}{selectedPlayer.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{selectedPlayer.first_name} {selectedPlayer.last_name}</div>
                    <div className="text-sm text-gray-500">
                      {selectedPlayer.team.full_name} • {selectedPlayer.position || 'N/A'}
                      {selectedPlayer.height_feet && selectedPlayer.height_inches && 
                        ` • ${selectedPlayer.height_feet}'${selectedPlayer.height_inches}"`}
                      {selectedPlayer.weight_pounds && ` • ${selectedPlayer.weight_pounds} lbs`}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Multiple Select Example */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Multiple Player Select</h2>
            <Autocomplete<Player>
              label="Search for multiple players"
              description="Type to search for NBA players (multiple selection)"
              options={players}
              value={selectedPlayers}
              onChange={(value) => setSelectedPlayers(value as Player[])}
              onInputChange={handleInputChange}
              loading={loading}
              multiple
              placeholder="Search for players..."
              renderOption={(player) => (
                <div className="flex items-center space-x-3 p-1">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">
                      {player.first_name[0]}{player.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{player.first_name} {player.last_name}</div>
                    <div className="text-sm text-gray-500">{player.team.full_name} • {player.position || 'N/A'}</div>
                  </div>
                </div>
              )}
            />
            {selectedPlayers.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-900 mb-3">Selected Players:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedPlayers.map((player) => (
                    <div key={player.id} className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                      <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">
                          {player.first_name[0]}{player.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{player.first_name} {player.last_name}</div>
                        <div className="text-sm text-gray-500">{player.team.full_name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              Error: {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;