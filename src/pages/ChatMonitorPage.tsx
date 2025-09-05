import React, { useEffect, useState } from 'react';
import { getUsers, getChatMessages, UserProfile, ChatMessage } from '../api';

const ChatMonitorPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedMessages = await getChatMessages(selectedUserId);
        setMessages(fetchedMessages);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedUserId]);

  const userBubbleStyle: React.CSSProperties = {
    background: '#dcf8c6',
    padding: '8px 12px',
    borderRadius: '12px',
    maxWidth: '70%',
    alignSelf: 'flex-end',
    marginBottom: '8px',
  };

  const assistantBubbleStyle: React.CSSProperties = {
    background: '#f1f0f0',
    padding: '8px 12px',
    borderRadius: '12px',
    maxWidth: '70%',
    alignSelf: 'flex-start',
    marginBottom: '8px',
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1rem' }}>
      <h1>Chat Monitor</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div>
        <label htmlFor="user-select" style={{ marginRight: '0.5rem' }}>Select a User:</label>
        <select 
          id="user-select"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          disabled={loading}
        >
          <option value="" disabled>--Please choose a user--</option>
          {users.map(user => (
            <option key={user.user_id} value={user.user_id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem', height: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <h2>Chat History</h2>
        {loading && <p>Loading...</p>}
        {!loading && messages.length === 0 && selectedUserId && <p>No messages found for this user.</p>}
        {!selectedUserId && <p>Please select a user to see their chat history.</p>}
        
        {messages.map(msg => (
          <div key={msg.message_id} style={msg.sender === 'user' ? userBubbleStyle : assistantBubbleStyle}>
            <strong>{msg.sender}</strong> - <small>{new Date(msg.created_at).toLocaleString()}</small>
            <p style={{ margin: '4px 0 0' }}>{msg.content_text}</p>
            {msg.content_json && (
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', background: '#e0e0e0', padding: '0.5rem', overflowX: 'auto', marginTop: '4px' }}>
                {JSON.stringify(msg.content_json, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMonitorPage; 