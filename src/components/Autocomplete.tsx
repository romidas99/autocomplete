import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFloating, useInteractions, useClick, useDismiss, useRole, useListNavigation } from '@floating-ui/react';
import { AutocompleteProps, Player } from '../types/autocomplete';

export function Autocomplete<T extends string | Player>({
  description,
  disabled = false,
  filterOptions,
  label,
  loading = false,
  multiple = false,
  onChange,
  onInputChange,
  options,
  placeholder = 'Search...',
  renderOption,
  value,
}: AutocompleteProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    role,
    listNavigation,
  ]);

  const defaultFilterOptions = useCallback(
    (options: T[], inputValue: string) => {
      return options.filter((option) => {
        if (typeof option === 'string') {
          return option.toLowerCase().includes(inputValue.toLowerCase());
        }
        const player = option as Player;
        return (
          player.first_name.toLowerCase().includes(inputValue.toLowerCase()) ||
          player.last_name.toLowerCase().includes(inputValue.toLowerCase())
        );
      });
    },
    []
  );

  const filteredOptions = filterOptions
    ? filterOptions(options, inputValue)
    : defaultFilterOptions(options, inputValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onInputChange?.(newValue);
    setIsOpen(true);
  };

  const handleSelect = (option: T) => {
    if (multiple) {
      const currentValue = (value as T[]) || [];
      const newValue = currentValue.includes(option)
        ? currentValue.filter((v) => v !== option)
        : [...currentValue, option];
      onChange(newValue);
    } else {
      onChange(option);
      setIsOpen(false);
    }
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && activeIndex !== null) {
      handleSelect(filteredOptions[activeIndex]);
    }
  };

  const defaultRenderOption = (option: T) => {
    if (typeof option === 'string') {
      return option;
    }
    const player = option as Player;
    return `${player.first_name} ${player.last_name} - ${player.team.full_name}`;
  };

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div
        ref={refs.setReference}
        className={`relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...getReferenceProps()}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredOptions.map((option, index) => (
            <div
              key={typeof option === 'string' ? option : (option as Player).id}
              ref={(el) => {
                listRef.current[index] = el;
              }}
              {...getItemProps({
                onClick: () => handleSelect(option),
                role: 'option',
                'aria-selected': activeIndex === index,
              })}
              className={`px-4 py-2 cursor-pointer ${
                activeIndex === index ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
            >
              {renderOption ? renderOption(option) : defaultRenderOption(option)}
            </div>
          ))}
        </div>
      )}
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
} 