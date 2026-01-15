import { useState, type KeyboardEvent } from 'react';
import { IoSearch, IoLocationSharp, IoClose, IoTrendingUp } from 'react-icons/io5';
import { useLocationStore } from '../../store/locations-store';

interface LocationSearchProps {
  placeholder?: string;
  className?: string;
}

/**
 * Premium location search with glass morphism and smooth animations
 */
export function LocationSearch({ placeholder = 'Search destinations...', className = '' }: LocationSearchProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { addLocation, locations, maxLocations } = useLocationStore();

  // Popular destinations for quick access
  const popularLocations = [
    'Tokyo, Japan',
    'Paris, France',
    'New York, USA',
    'London, UK',
    'Bali, Indonesia',
    'Maldives',
    'Barcelona, Spain',
    'Dubai, UAE',
    'Sydney, Australia',
    'Rome, Italy',
    'Bangkok, Thailand',
    'Singapore',
  ];

  const filteredSuggestions = input.length > 0
    ? popularLocations.filter((loc) =>
        loc.toLowerCase().includes(input.toLowerCase())
      )
    : popularLocations;

  const handleAddLocation = (location: string) => {
    if (location.trim() && !locations.includes(location)) {
      addLocation(location);
      setInput('');
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      handleAddLocation(input.trim());
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (location: string) => {
    handleAddLocation(location);
  };

  const isMaxReached = locations.length >= maxLocations;

  return (
    <div className={`relative w-full max-w-2xl ${className}`}>
      <div className="relative group">
        <div className="relative rounded-full transition-all duration-300" style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <IoSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            aria-hidden="true"
          />
          <label htmlFor="location-search" className="sr-only">
            Search for travel destinations
          </label>
          <input
            id="location-search"
            type="text"
            role="combobox"
            aria-label="Search for travel destinations"
            aria-expanded={showSuggestions && !isMaxReached}
            aria-autocomplete="list"
            aria-controls="location-suggestions"
            aria-activedescendant={undefined}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={isMaxReached ? `Maximum ${maxLocations} locations` : placeholder}
            disabled={isMaxReached}
            className="w-full pl-11 pr-11 py-2.5 bg-transparent focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-full text-sm"
            style={{
              color: 'var(--text-primary)',
            }}
          />
          {input && (
            <button
              onClick={() => setInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all focus:outline-none"
              type="button"
              aria-label="Clear search input"
              style={{
                color: 'var(--text-tertiary)',
                background: 'transparent'
              }}
            >
              <IoClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && !isMaxReached && filteredSuggestions.length > 0 && (
        <div
          id="location-suggestions"
          role="listbox"
          aria-label="Location suggestions"
          className="absolute z-20 w-full mt-2 rounded-2xl overflow-hidden animate-slide-up"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-xl)'
          }}
        >
          {input.length === 0 && (
            <div className="px-4 py-2 border-b" style={{
              background: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)'
            }} aria-hidden="true">
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                <IoTrendingUp className="w-3 h-3" style={{ color: 'var(--accent-cyan)' }} />
                Popular Destinations
              </div>
            </div>
          )}
          <div className="max-h-80 overflow-y-auto">
            {filteredSuggestions.map((location, index) => (
              <button
                key={location}
                role="option"
                aria-selected="false"
                onClick={() => handleSuggestionClick(location)}
                className="w-full px-4 py-2.5 text-left flex items-center gap-3 transition-all group border-b last:border-0 focus:outline-none text-sm"
                type="button"
                style={{
                  borderColor: 'var(--border-subtle)',
                  background: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-elevated)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <IoLocationSharp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-cyan)' }} />
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {location}
                </span>
              </button>
            ))}
            {input.length > 0 && filteredSuggestions.length === 0 && (
              <div className="px-4 py-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs" style={{
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-secondary)'
                }}>
                  <IoSearch className="w-3 h-3" />
                  <span>
                    Press <kbd className="px-2 py-0.5 rounded text-xs font-semibold" style={{
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)'
                    }}>Enter</kbd> to search for "{input}"
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
