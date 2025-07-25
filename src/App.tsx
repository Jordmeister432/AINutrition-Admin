import React, { useEffect, useState } from 'react';
import { fetchRuns, fetchStepLogs, deleteRun, Run, StepLog } from './api';

const App: React.FC = () => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);
  const [stepLogs, setStepLogs] = useState<StepLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setRuns(await fetchRuns());
      } catch (err: any) {
        setError(err.message);
      }
    })();
  }, []);

  const openRun = async (run: Run) => {
    setSelectedRun(run);
    setLoading(true);
    try {
      const logs = await fetchStepLogs(run.id);
      setStepLogs(logs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (runId: string) => {
    if (!confirm('Delete this run?')) return;
    try {
      await deleteRun(runId);
      setRuns(runs.filter(r => r.id !== runId));
      if (selectedRun?.id === runId) {
        setSelectedRun(null);
        setStepLogs([]);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1rem' }}>
      <h1>Nutrition Search Runs</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Runs list */}
        <div style={{ flex: 1 }}>
          <h2>Recent Runs</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Created</th>
                <th>Status</th>
                <th>User</th>
                <th>Query</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {runs.map(run => (
                <tr key={run.id} style={{ cursor: 'pointer' }} onClick={() => openRun(run)}>
                  <td>{new Date(run.created_at).toLocaleString()}</td>
                  <td>{run.status}</td>
                  <td>{run.user_id?.slice(0, 8) ?? '-'}</td>
                  <td>{run.initial_query?.slice(0, 30)}</td>
                  <td>
                    <button onClick={e => { e.stopPropagation(); handleDelete(run.id); }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Step detail */}
        {selectedRun && (
          <div style={{ flex: 1 }}>
            <h2>Steps for run {selectedRun.id.slice(0, 8)}</h2>
            {loading ? (
              <p>Loading…</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {stepLogs.map(log => (
                  <li key={log.id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '0.5rem' }}>
                    <strong>{log.step_number}. {log.step_name}</strong>
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', background: '#f6f6f6', padding: '0.5rem', overflowX: 'auto' }}>
                      {JSON.stringify({ input: log.input_data, output: log.output_data, metadata: log.metadata, error: log.error_message }, null, 2)}
                    </pre>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
