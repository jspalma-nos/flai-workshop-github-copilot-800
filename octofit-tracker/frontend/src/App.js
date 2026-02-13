import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src="/octofitapp-small.png" alt="OctoFit Logo" />
            <strong>OctoFit Tracker</strong>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/users">
                  Users
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/teams">
                  Teams
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/activities">
                  Activities
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/leaderboard">
                  Leaderboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/workouts">
                  Workouts
                </Link>
              </li>
            </ul>
            <div className="ms-auto">
              <button 
                className="btn btn-outline-light btn-sm" 
                onClick={toggleDarkMode}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div className="container mt-5">
              <div className="hero-section text-center">
                <h1 className="display-3">🏋️ Welcome to OctoFit Tracker</h1>
                <p className="lead">
                  Track your fitness activities, compete with your team, and achieve your goals!
                </p>
                <hr className="my-4" />
                <p className="text-muted">
                  Use the navigation menu above to explore users, teams, activities, leaderboard, and workout suggestions.
                </p>
              </div>
              
              <div className="row mt-5 mb-5">
                <div className="col-md-6 col-lg-3 mb-4">
                  <Link to="/users" className="text-decoration-none">
                    <div className="card feature-card">
                      <div className="card-body text-center">
                        <div className="feature-icon">👥</div>
                        <h5 className="card-title">Users</h5>
                        <p className="card-text text-muted">
                          View and manage user profiles
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
                
                <div className="col-md-6 col-lg-3 mb-4">
                  <Link to="/teams" className="text-decoration-none">
                    <div className="card feature-card">
                      <div className="card-body text-center">
                        <div className="feature-icon">🤝</div>
                        <h5 className="card-title">Teams</h5>
                        <p className="card-text text-muted">
                          Explore team collaborations
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
                
                <div className="col-md-6 col-lg-3 mb-4">
                  <Link to="/activities" className="text-decoration-none">
                    <div className="card feature-card">
                      <div className="card-body text-center">
                        <div className="feature-icon">🏃</div>
                        <h5 className="card-title">Activities</h5>
                        <p className="card-text text-muted">
                          Track fitness activities
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
                
                <div className="col-md-6 col-lg-3 mb-4">
                  <Link to="/leaderboard" className="text-decoration-none">
                    <div className="card feature-card">
                      <div className="card-body text-center">
                        <div className="feature-icon">🏆</div>
                        <h5 className="card-title">Leaderboard</h5>
                        <p className="card-text text-muted">
                          View top performers
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          }
        />
        <Route path="/users" element={<Users />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </div>
  );
}

export default App;
