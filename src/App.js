// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './components/auth/Homepage';
import IvyScoreCalculator from './components/auth/ivyscore';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage Route */}
        <Route path="/" element={<Homepage />} />

        {/* IvyScore Route with built-in authentication */}
        <Route path="/ivyscore" element={<IvyScoreCalculator />} />

        {/* Redirect /auth to /ivyscore since auth is handled within IvyScore */}
        <Route path="/auth" element={<Navigate to="/ivyscore" replace />} />

        {/* Catch all - redirect to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;