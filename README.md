# NBA Player Autocomplete

A React TypeScript implementation of an autocomplete component that searches for NBA players using the BallDontLie API.

## Features

- Search for NBA players with debounced API calls
- Single and multiple selection modes
- Keyboard navigation support
- Accessible using ARIA attributes
- Responsive design with Tailwind CSS
- Floating UI for dropdown positioning
- Beautiful UI with player initials avatars
- Detailed player information display

## Technical Requirements

- React
- TypeScript
- Tailwind CSS
- Floating UI

## Implementation Details

### Props Implementation

The component accepts various props that control its behavior and appearance:

1. **Basic Props**
   - `description` (string): Displayed below the component for additional context
   - `label` (string): Displayed above the component for accessibility
   - `placeholder` (string): Default text shown in the input field
   - `disabled` (boolean): Controls the interactive state of the component

2. **Data and Selection Props**
   - `options` (Array<T>): The data to be displayed in the dropdown
   - `value` (T | T[] | null): The currently selected option(s)
   - `multiple` (boolean): Enables multi-select functionality
   - `loading` (boolean): Shows a loading spinner during data fetching

3. **Callback Props**
   - `onChange`: Fires when selection changes
   - `onInputChange`: Fires when input value changes
   - `filterOptions`: Custom filtering logic
   - `renderOption`: Custom option rendering

### Use Cases Implementation

#### 1. Synchronous Autocomplete

The component supports both single and multiple selection modes:

```tsx
// Single Selection
<Autocomplete<Player>
  value={selectedPlayer}
  onChange={(value) => setSelectedPlayer(value as Player | null)}
  options={players}
/>

// Multiple Selection
<Autocomplete<Player>
  multiple
  value={selectedPlayers}
  onChange={(value) => setSelectedPlayers(value as Player[])}
  options={players}
/>
```

Key implementation details:
- Uses TypeScript generics for type safety
- Handles both string and object options
- Maintains selected state internally
- Updates parent component via onChange callback

#### 2. Debounced Search

The search functionality is implemented using a custom hook (`usePlayerSearch`):

```typescript
const DEBOUNCE_DELAY = 300; // 300ms delay

export function usePlayerSearch() {
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  
  const debouncedSearch = useCallback(
    (query: string) => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      const newTimeoutId = window.setTimeout(() => {
        searchPlayers(query);
      }, DEBOUNCE_DELAY);
      setTimeoutId(newTimeoutId);
    },
    [timeoutId, searchPlayers]
  );

  return { players, loading, error, search: debouncedSearch };
}
```

Key features:
- 300ms debounce delay
- Clears previous timeout on new input
- Handles loading and error states
- Rate-limited to respect API constraints

### Selected Options Display

The component displays selected options in two ways:

1. **Single Selection**:
   - Shows a detailed card with player information
   - Includes team, position, height, and weight
   - Uses player initials in an avatar circle

2. **Multiple Selection**:
   - Displays a grid of selected players
   - Each player card shows essential information
   - Visual feedback for selected state
   - Responsive grid layout

### Keyboard Navigation

The component implements full keyboard support:
- ↑/↓: Navigate through options
- Enter: Select highlighted option
- Escape: Close dropdown
- Tab: Move focus
- Click outside: Close dropdown

### Filtering Implementation

1. **Default String Filtering**:
```typescript
if (typeof option === 'string') {
  return option.toLowerCase().includes(inputValue.toLowerCase());
}
```

2. **Object Filtering (NBA Players)**:
```typescript
const player = option as Player;
return (
  player.first_name.toLowerCase().includes(inputValue.toLowerCase()) ||
  player.last_name.toLowerCase().includes(inputValue.toLowerCase())
);
```

3. **Custom Filtering**:
```typescript
filterOptions?: (options: T[], inputValue: string) => T[];
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## API Integration

The component uses the BallDontLie API:
- Endpoint: `https://www.balldontlie.io/api/v1/players?search={query}`
- Rate Limit: 60 requests/minute
- No API key required
