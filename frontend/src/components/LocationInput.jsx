import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Check, Search, X } from 'lucide-react';
import api from '../api';

export default function LocationInput({ icon: Icon, value, onChange, onSelectLocation, placeholder }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get('/geocoding/search', { params: { q: query } });
        setSuggestions(res.data || []);
        setIsOpen(true);
      } catch (e) {
        console.error('Location search failed', e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item) => {
    setQuery(item.display_name);
    setIsOpen(false);
    if (onChange) onChange(item.display_name);
    if (onSelectLocation) {
      onSelectLocation({ lat: item.lat, lng: item.lng, name: item.display_name });
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
      <div className="input-field-wrapper" style={{ width: '100%' }}>
        <Icon size={18} style={{ color: 'var(--primary)' }} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (onChange) onChange(e.target.value);
          }}
          placeholder={placeholder}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              if (onChange) onChange('');
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1500,
          maxHeight: '260px',
          overflowY: 'auto'
        }}>
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(item)}
              style={{
                padding: '10px 14px',
                borderBottom: idx < suggestions.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                fontSize: '13px',
                color: 'var(--text-primary)',
                transition: 'background 0.15s'
              }}
              className="suggestion-item"
            >
              <MapPin size={16} style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
              <span style={{ lineHeight: 1.4 }}>{item.display_name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
