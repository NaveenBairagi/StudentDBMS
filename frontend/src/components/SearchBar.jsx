import React, { useState } from 'react';
import { searchStudents } from '../api/studentApi';

const SearchBar = ({ onResults, onClear }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        try {
            const res = await searchStudents(query.trim());
            onResults(res.data.data, query.trim());
        } catch {
            onResults([], query.trim());
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setQuery('');
        onClear();
    };

    return (
        <form className="search-bar" onSubmit={handleSearch}>
            <div className="search-input-wrap">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    id="searchInput"
                    placeholder="Search by name, ID, class, or section..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-input"
                />
                {query && (
                    <button type="button" className="clear-btn" onClick={handleClear} title="Clear search">
                        ✕
                    </button>
                )}
            </div>
            <button type="submit" className="btn btn-primary search-btn" disabled={loading || !query.trim()}>
                {loading ? <span className="spinner" /> : 'Search'}
            </button>
        </form>
    );
};

export default SearchBar;
