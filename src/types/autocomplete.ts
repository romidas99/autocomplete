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

export interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  currency: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  volume: number;
  marketCap: number;
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