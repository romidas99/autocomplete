import React, { useCallback, useRef, useState } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const click = useClick(context, {
    // Enable click to open
    enabled: !disabled,
    keyboardHandlers: false
  });

  const dismiss = useDismiss(context, {
    // Enable click outside to close
    outsidePress: true,
  });

  const role = useRole(context);
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    role,
    listNavigation,
  ]);

  // Handle click on the input container
  const handleContainerClick = () => {
    if (!disabled) {
      setIsOpen(true);
      inputRef.current?.focus();
    }
  };

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

  const isOptionSelected = (option: T) => {
    if (!value) return false;
    if (Array.isArray(value)) {
      if (typeof option === 'string') {
        return value.includes(option);
      }
      const player = option as Player;
      return value.some((v) => (v as Player).id === player.id);
    }
    return false;
  };

  const handleSelect = (option: T) => {
    if (multiple) {
      const currentValue = (value as T[]) || [];
      // Check if the player is already selected
      if (typeof option === 'string') {
        // Handle string options
        const isSelected = currentValue.includes(option);
        const newValue = isSelected
          ? currentValue.filter((v) => v !== option)
          : [...currentValue, option];
        onChange(newValue);
      } else {
        // Handle player options
        const player = option as Player;
        const isSelected = currentValue.some((v) => (v as Player).id === player.id);
        if (isSelected) {
          // Deselect the player
          onChange(currentValue.filter((v) => (v as Player).id !== player.id));
        } else if (!isSelected) {
          // Only add if not already selected
          onChange([...currentValue, option]);
        }
      }
      // Keep focus on input after selection in multiple mode
      inputRef.current?.focus();
    } else {
      onChange(option);
      setIsOpen(false);
    }
    setInputValue('');
  };

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
      // Keep dropdown open for multiple selection mode
      if (multiple) {
        setIsOpen(true);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const defaultRenderOption = (option: T) => {
    if (typeof option === 'string') {
      return option;
    }
    const player = option as Player;
    return `${player.first_name} ${player.last_name} - ${player.team.full_name}`;
  };

  const inputProps = {
    ...getReferenceProps({
      onChange: handleInputChange,
      onKeyDown: handleKeyDown,
      value: inputValue,
      placeholder,
      disabled,
      type: "text",
      ref: inputRef,
    })
  };

  return (
    <div className="autocomplete-container">
      {label && (
        <label className="autocomplete-label">
          {label}
        </label>
      )}
      <div
        ref={refs.setReference}
        className={`autocomplete-input-container ${disabled ? 'disabled' : ''}`}
        onClick={handleContainerClick}
      >
        <input
          className="autocomplete-input"
          {...inputProps}
        />
        {loading && (
          <div className="autocomplete-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="autocomplete-dropdown"
        >
          {filteredOptions.map((option, index) => {
            const isSelected = isOptionSelected(option);
            return (
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
                className={`autocomplete-option ${activeIndex === index ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
              >
                {renderOption ? renderOption(option) : defaultRenderOption(option)}
              </div>
            );
          })}
        </div>
      )}
      {description && (
        <p className="autocomplete-description">{description}</p>
      )}
    </div>
  );
} 