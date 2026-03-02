import React, { useState, useEffect, useCallback } from 'react';
import { getStudents } from '../api/studentApi';
import SearchBar from '../components/SearchBar';
import StudentTable from '../components/StudentTable';
import StudentForm from '../components/StudentForm';

const ViewStudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editStudent, setEditStudent] = useState(null);
    const [searchActive, setSearchActive] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [cacheSource, setCacheSource] = useState('');

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getStudents();
            setStudents(res.data.data);
            setCacheSource(res.data.source);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch students. Is the backend running?');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const handleSearchResults = (results, query) => {
        setSearchResults(results);
        setSearchQuery(query);
        setSearchActive(true);
    };

    const handleSearchClear = () => {
        setSearchActive(false);
        setSearchResults([]);
        setSearchQuery('');
    };

    const handleEditSuccess = () => {
        setEditStudent(null);
        setSearchActive(false);
        fetchStudents();
    };

    const handleDeleted = () => {
        fetchStudents();
        if (searchActive) {
            setSearchActive(false);
        }
    };

    const displayedStudents = searchActive ? searchResults : students;

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">All Students</h1>
                <p className="page-subtitle">
                    {loading ? 'Loading...' : `${students.length} student${students.length !== 1 ? 's' : ''} registered`}
                    {cacheSource && !loading && (
                        <span className={`cache-badge ${cacheSource === 'cache' ? 'cache-hit' : 'cache-miss'}`}>
                            {cacheSource === 'cache' ? '⚡ Redis Cache' : '🗄️ MongoDB'}
                        </span>
                    )}
                </p>
            </div>

            <SearchBar onResults={handleSearchResults} onClear={handleSearchClear} />

            {searchActive && (
                <div className="search-status">
                    {searchResults.length > 0
                        ? `Found ${searchResults.length} result(s) for "${searchQuery}"`
                        : `No results found for "${searchQuery}"`}
                </div>
            )}

            {error && <div className="alert alert-error">{error}</div>}

            {editStudent && (
                <div className="edit-overlay-section">
                    <StudentForm
                        editStudent={editStudent}
                        onSuccess={handleEditSuccess}
                        onCancelEdit={() => setEditStudent(null)}
                    />
                </div>
            )}

            {loading ? (
                <div className="loading-state">
                    <div className="loader" />
                    <p>Fetching students...</p>
                </div>
            ) : (
                <StudentTable
                    students={displayedStudents}
                    onEdit={setEditStudent}
                    onDeleted={handleDeleted}
                />
            )}
        </div>
    );
};

export default ViewStudentsPage;
