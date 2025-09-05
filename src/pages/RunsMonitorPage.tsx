import React, { useEffect, useState } from 'react';
import { fetchRuns, fetchStepLogs, deleteRun, Run, StepLog } from '../api';
import StepLogCard from '../components/StepLogCard';
import CopyWorkflowButton from '../components/CopyWorkflowButton';

const RunsMonitorPage: React.FC = () => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return '#22c55e';
      case 'IN_PROGRESS': return '#f59e0b';
      case 'FAILED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ color: '#111827', marginBottom: '2rem' }}>Nutrition Search Runs</h1>
      {error && <p style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '6px', border: '1px solid #fecaca' }}>{error}</p>}
      
      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Runs list */}
        <div style={{ flex: 1 }}>
          <h2 style={{ color: '#374151', marginBottom: '1rem' }}>Recent Runs</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {runs.map(run => (
              <div 
                key={run.id} 
                style={{ 
                  backgroundColor: 'white',
                  border: selectedRun?.id === run.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => openRun(run)}
                onMouseEnter={(e) => {
                  if (selectedRun?.id !== run.id) {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedRun?.id !== run.id) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      {new Date(run.created_at).toLocaleString()}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ 
                        backgroundColor: getStatusColor(run.status), 
                        color: 'white', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem', 
                        fontWeight: '500' 
                      }}>
                        {run.status}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={e => { e.stopPropagation(); handleDelete(run.id); }}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
                
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#374151' }}>User:</strong> {run.user_name || 'Unknown User'}
                </div>
                
                <div>
                  <strong style={{ color: '#374151' }}>Query:</strong> 
                  <div style={{ 
                    color: '#6b7280', 
                    marginTop: '0.25rem',
                    fontStyle: 'italic',
                    backgroundColor: '#f3f4f6',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb'
                  }}>
                    "{run.initial_query || 'No query available'}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step detail */}
        {selectedRun && (
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ color: '#374151', margin: 0 }}>
                Steps for run {selectedRun.id.slice(0, 8)}
              </h2>
              <CopyWorkflowButton stepLogs={stepLogs} runId={selectedRun.id} />
            </div>
            
            {loading ? (
              <div style={{ 
                backgroundColor: 'white', 
                padding: '2rem', 
                borderRadius: '8px', 
                textAlign: 'center',
                border: '1px solid #e5e7eb'
              }}>
                <p style={{ color: '#6b7280' }}>Loading step logs...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stepLogs.map(log => (
                  <StepLogCard key={log.id} stepLog={log} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RunsMonitorPage; 