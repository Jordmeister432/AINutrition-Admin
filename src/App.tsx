import React, { useState } from 'react';
import SearchRunsPage from './SearchRunsPage';
import ChatMonitorPage from './ChatMonitorPage';

const App: React.FC = () => {
  const [view, setView] = useState<'search' | 'chat'>('search');

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Simple navigation bar */}
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <button
          onClick={() => setView('search')}
          style={{ background: view === 'search' ? '#ddd' : undefined }}
        >
          Search Runs
        </button>
        <button
          onClick={() => setView('chat')}
          style={{ background: view === 'chat' ? '#ddd' : undefined }}
        >
          Chat Monitor
        </button>
      </nav>

      {/* Page content */}
      {view === 'search' ? <SearchRunsPage /> : <ChatMonitorPage />}
    </div>
  );
};

export default App;
