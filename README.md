# NBA Player Search Autocomplete

A React TypeScript implementation of an autocomplete component that allows users to search and select NBA players using the BallDontLie API.

## Features

- Real-time player search with debouncing
- Multiple player selection
- Full keyboard navigation support
- Intuitive mouse interactions
- Clean, minimal design
- Accessibility features
- Responsive layout

## Technical Requirements

- React 19
- TypeScript
- Floating UI for dropdowns
- Vanilla CSS for styling

## Implementation Details

### Core Components

#### 1. Autocomplete Component (`src/components/Autocomplete.tsx`)
The main reusable component that handles:
- Input field with search functionality
- Dropdown list of options
- Selection management
- Keyboard navigation
- Mouse interactions

Key features:
```typescript
export interface AutocompleteProps<T> {
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  multiple?: boolean;
  value: T | T[] | null;
  options: T[];
  onChange: (value: T | T[] | null) => void;
  onInputChange?: (value: string) => void;
  filterOptions?: (options: T[], inputValue: string) => T[];
  renderOption?: (option: T) => React.ReactNode;
}
```

#### 2. Main App Component (`src/App.tsx`)
Implements the NBA player search interface using the Autocomplete component:
```typescript
function App() {
  const { players, loading, error, search } = usePlayerSearch();
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  // ... implementation
}
```

### Key Features Implementation

#### 1. Player Search Hook (`usePlayerSearch`)
```typescript
export function usePlayerSearch() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Debounced API call implementation
  useEffect(() => {
    if (!searchTerm) {
      setPlayers([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchPlayers();
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
}
```

#### 2. Selection Management
The component handles both single and multiple selection modes:
```typescript
const handleSelect = (option: T) => {
  if (multiple) {
    const currentValue = (value as T[]) || [];
    const player = option as Player;
    const isSelected = currentValue.some((v) => (v as Player).id === player.id);
    
    if (isSelected) {
      onChange(currentValue.filter((v) => (v as Player).id !== player.id));
    } else {
      onChange([...currentValue, option]);
    }
  } else {
    onChange(option);
    setIsOpen(false);
  }
};
```

#### 3. Keyboard Navigation
Implemented using arrow keys and enter for selection:
```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const nextIndex = activeIndex === null ? 0 : 
      (activeIndex + 1) % filteredOptions.length;
    setActiveIndex(nextIndex);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    const prevIndex = activeIndex === null ? filteredOptions.length - 1 : 
      (activeIndex - 1 + filteredOptions.length) % filteredOptions.length;
    setActiveIndex(prevIndex);
  } else if (e.key === 'Enter' && activeIndex !== null) {
    e.preventDefault();
    handleSelect(filteredOptions[activeIndex]);
  }
};
```

#### 4. Mouse Interactions
Using Floating UI for dropdown positioning and interactions:
```typescript
const { refs, floatingStyles, context } = useFloating({
  open: isOpen,
  onOpenChange: setIsOpen,
});

const click = useClick(context, {
  enabled: !disabled,
});

const dismiss = useDismiss(context, {
  outsidePress: true,
});
```

### User Interface Components

#### 1. Player Option Display
Each player option shows:
- Player initials in an avatar
- Full name
- Team and position
```typescript
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
```

#### 2. Selected Players Display
Selected players are shown in a grid with:
- Player name
- Team information
- Position
- Height and weight (when available)
- Remove button

### Styling Implementation

The application uses vanilla CSS with CSS variables for theming:
```css
:root {
  --primary-color: #1d4ed8;
  --text-primary: #000000;
  --text-secondary: #333333;
  --background-color: #faf6f1;
  --cream-darker: #f5efe6;
  --cream-lighter: #fffbf6;
}
```

Key styling features:
1. Responsive grid layout for selected players
2. Smooth transitions and hover effects
3. Accessible color contrast
4. Clean, minimal design with cream background

### API Integration

The application uses the BallDontLie API:
- Endpoint: `https://api.balldontlie.io/v1/players`
- Features:
  - Search by player name
  - Debounced API calls (200ms)
  - Error handling
  - Loading states

### Type Definitions

```typescript
export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height_feet: number | null;
  height_inches: number | null;
  weight_pounds: number | null;
  team: {
    id: number;
    full_name: string;
    // ... other team properties
  };
}
```

## Development Setup

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
