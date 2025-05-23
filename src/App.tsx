// frontend/project/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TripProvider } from './TripContext';

// Import pages
import HomePage from './pages/HomePage';
import GroupEntryPage from './pages/GroupEntryPage';
import OriginSelectionPage from './pages/OriginSelectionPage';
import DestinationSelectionPage from './pages/DestinationSelectionPage';
import DateSelectionPage from './pages/DateSelectionPage';
import ThemeSelectionPage from './pages/ThemeSelectionPage';
import Budget from './pages/Budget';
import WaitingRoomPage from './pages/WaitingRoomPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <TripProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/group-entry" element={<GroupEntryPage />} />
          <Route path="/origin-selection" element={<OriginSelectionPage />} />
          <Route path="/destination-selection" element={<DestinationSelectionPage />} />
          <Route path="/date-selection" element={<DateSelectionPage />} />
          <Route path="/theme-selection" element={<ThemeSelectionPage />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/waiting-room" element={<WaitingRoomPage />} />
          <Route path="/results" element={<ResultsPage />} />

        </Routes>
      </Router>
    </TripProvider>
  );
}

export default App;