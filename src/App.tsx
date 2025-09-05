import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import RunsMonitorPage from './pages/RunsMonitorPage';
import ChatMonitorPage from './pages/ChatMonitorPage';

const App: React.FC = () => {
  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'inline-block',
    padding: '10px 15px',
    marginRight: '10px',
    textDecoration: 'none',
    color: isActive ? 'white' : 'black',
    backgroundColor: isActive ? '#007bff' : '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '5px',
  });

  return (
    <BrowserRouter>
      <div>
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
          <NavLink to="/" style={navLinkStyle}>Runs Monitor</NavLink>
          <NavLink to="/chat" style={navLinkStyle}>Chat Monitor</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<RunsMonitorPage />} />
          <Route path="/chat" element={<ChatMonitorPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
