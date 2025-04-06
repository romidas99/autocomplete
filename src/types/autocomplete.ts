export interface Location {
    name: string;
    country: string;
    lat: number;
    lon: number;
  }

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
    abbreviation: string;
    city: string;
    conference: string;
    division: string;
    full_name: string;
    name: string;
  };
}

export interface AutocompleteProps<T extends string | Player> {
  description?: string;
  disabled?: boolean;
  filterOptions?: (options: T[], inputValue: string) => T[];
  label?: string;
  loading?: boolean;
  multiple?: boolean;
  onChange: (value: T | T[] | null) => void;
  onInputChange?: (value: string) => void;
  options: T[];
  placeholder?: string;
  renderOption?: (option: T) => React.ReactNode;
  value: T | T[] | null;
}