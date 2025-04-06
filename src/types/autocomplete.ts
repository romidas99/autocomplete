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