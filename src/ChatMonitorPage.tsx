import React, { useEffect, useState } from 'react';
import { ChatUser, ChatMessage, fetchChatUsers, fetchUserChats } from './api';

const ChatMonitorPage: React.FC = () => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load list of users on mount
  useEffect(() => {
    (async () => {
      try {
        setLoadingUsers(true);
        setUsers(await fetchChatUsers());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, []);

  // Fetch messages when user changes
  useEffect(() => {
    if (!selectedUser) return;
    (async () => {
      try {
        setLoadingMessages(true);
        setMessages(await fetchUserChats(selectedUser.id));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingMessages(false);
      }
    })();
  }, [selectedUser]);

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '1rem' }}>
      {/* Users list */}
      <div style={{ width: '200px' }}>
        <h2>Users</h2>
        {loadingUsers ? (
          <p>Loading…</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map(u => (
              <li
                key={u.id}
                onClick={() => setSelectedUser(u)}
                style={{
                  padding: '0.5rem',
                  cursor: 'pointer',
                  background: selectedUser?.id === u.id ? '#eef' : undefined,
                }}
              >
                {u.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat messages */}
      <div style={{ flex: 1 }}>
        <h2>
          {selectedUser ? `Chat with ${selectedUser.name}` : 'Select a user to view chats'}
        </h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loadingMessages && <p>Loading messages…</p>}
        {!loadingMessages && selectedUser && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {messages.map(m => (
              <li
                key={m.id}
                style={{
                  marginBottom: '0.75rem',
                  padding: '0.5rem',
                  background: m.role === 'assistant' ? '#f6f6ff' : '#f6fff6',
                  border: '1px solid #ddd',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  {new Date(m.created_at).toLocaleString()} – {m.role}
                </div>
                <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatMonitorPage;