import React, { useState } from 'react';
import { StepLog } from '../api';

interface CopyWorkflowButtonProps {
  stepLogs: StepLog[];
  runId: string;
}

const CopyWorkflowButton: React.FC<CopyWorkflowButtonProps> = ({ stepLogs, runId }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    // Create the workflow data structure
    const workflowData = {
      runId: runId,
      stepLogs: stepLogs.map(step => ({
        step_number: step.step_number,
        step_name: step.step_name,
        input_data: step.input_data,
        output_data: step.output_data,
        metadata: step.metadata,
        duration_ms: step.duration_ms,
        error_message: step.error_message,
        created_at: step.created_at
      }))
    };

    try {
      // Convert to JSON string
      const jsonString = JSON.stringify(workflowData, null, 2);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(jsonString);
      
      // Show success feedback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = JSON.stringify(workflowData, null, 2);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      style={{
        backgroundColor: copied ? '#22c55e' : '#3b82f6',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '6px',
        fontSize: '0.875rem',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'background-color 0.2s ease',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          e.currentTarget.style.backgroundColor = '#2563eb';
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          e.currentTarget.style.backgroundColor = '#3b82f6';
        }
      }}
    >
      {copied ? (
        <>
          <span>✅</span>
          Copied!
        </>
      ) : (
        <>
          <span>📋</span>
          Copy Workflow
        </>
      )}
    </button>
  );
};

export default CopyWorkflowButton;
