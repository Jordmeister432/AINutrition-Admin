import React, { useState } from 'react';
import { StepLog } from '../api';

interface StepLogCardProps {
  stepLog: StepLog;
}

const StepLogCard: React.FC<StepLogCardProps> = ({ stepLog }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getStatusColor = () => {
    if (stepLog.error_message) return '#ff4444'; // Red for errors
    return '#22c55e'; // Green for success
  };

  const getStatusIcon = () => {
    if (stepLog.error_message) return '❌';
    return '✅';
  };

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      marginBottom: '1rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <div 
        style={{
          padding: '1rem',
          cursor: 'pointer',
          backgroundColor: '#f9fafb',
          borderBottom: isExpanded ? '1px solid #e5e7eb' : 'none',
          borderRadius: isExpanded ? '8px 8px 0 0' : '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        onClick={toggleExpanded}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>{getStatusIcon()}</span>
          <strong style={{ color: getStatusColor() }}>
            {stepLog.step_number}. {stepLog.step_name}
          </strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {stepLog.duration_ms && (
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {stepLog.duration_ms}ms
            </span>
          )}
          <span style={{ fontSize: '1.2rem' }}>
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div style={{ padding: '1rem' }}>
          {/* Trigger Message (if available) */}
          {stepLog.trigger_message && stepLog.step_number === 1 && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>Trigger Message:</h4>
              <div style={{
                backgroundColor: '#f3f4f6',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontStyle: 'italic'
              }}>
                "{stepLog.trigger_message}"
              </div>
            </div>
          )}

          {/* Error Message */}
          {stepLog.error_message && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#dc2626' }}>Error:</h4>
              <div style={{
                backgroundColor: '#fef2f2',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #fecaca',
                color: '#dc2626'
              }}>
                {stepLog.error_message}
              </div>
            </div>
          )}

          {/* Input Data */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', color: '#374151', fontSize: '1rem', fontWeight: '600' }}>📥 Input:</h4>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '1rem',
              borderRadius: '8px',
              border: '2px solid #e2e8f0',
              overflowX: 'auto',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <pre style={{
                margin: 0,
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                lineHeight: '1.5'
              }}>
                {JSON.stringify(stepLog.input_data, null, 2)}
              </pre>
            </div>
          </div>

          {/* Output Data */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', color: '#374151', fontSize: '1rem', fontWeight: '600' }}>📤 Output:</h4>
            <div style={{
              backgroundColor: '#f0f9ff',
              padding: '1rem',
              borderRadius: '8px',
              border: '2px solid #bae6fd',
              overflowX: 'auto',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <pre style={{
                margin: 0,
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                lineHeight: '1.5'
              }}>
                {JSON.stringify(stepLog.output_data, null, 2)}
              </pre>
            </div>
          </div>

          {/* Metadata */}
          {stepLog.metadata && (
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>Metadata:</h4>
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                overflowX: 'auto'
              }}>
                <pre style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace'
                }}>
                  {JSON.stringify(stepLog.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepLogCard;
