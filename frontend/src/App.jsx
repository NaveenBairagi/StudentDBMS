import React, { useState } from 'react';
import { BrowserRouter, NavLink, Routes, Route, Navigate } from 'react-router-dom';
import AddStudentPage from './pages/AddStudentPage';
import ViewStudentsPage from './pages/ViewStudentsPage';
import './index.css';

const App = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <span className="logo-icon">🎓</span>
            <div>
              <div className="logo-title">StudentDBMS</div>
              <div className="logo-sub">Cloud Management</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <NavLink to="/add" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">➕</span>
              <span>Add Student</span>
            </NavLink>
            <NavLink to="/view" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">👥</span>
              <span>View Students</span>
            </NavLink>
          </nav>

          <div className="sidebar-footer">
            <div className="tech-stack">
              <span className="tech-badge react">React</span>
              <span className="tech-badge node">Node.js</span>
              <span className="tech-badge mongo">MongoDB</span>
              <span className="tech-badge redis">Redis</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/add" replace />} />
            <Route path="/add" element={<AddStudentPage onStudentAdded={triggerRefresh} />} />
            <Route path="/view" element={<ViewStudentsPage key={refreshKey} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
