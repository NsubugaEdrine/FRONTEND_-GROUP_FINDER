import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Send, Paperclip, FileText, MapPin } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ChatRoom = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const endRef = useRef(null);
  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);

  const MAX_FILE_SIZE_BYTES = 500 * 1024;

  const parseMessageContent = (raw) => {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.type) return parsed;
      return { type: 'text', text: raw };
    } catch (error) {
      return { type: 'text', text: raw };
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get('/chat/messages?room=global&limit=150');
      setMessages(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content) return;

    try {
      await api.post('/chat/messages', { content, room: 'global' });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send message');
    }
  };

  const groupedMessages = useMemo(() => messages, [messages]);

  const sendStructuredMessage = async (payload) => {
    try {
      await api.post('/chat/messages', { content: JSON.stringify(payload), room: 'global' });
      fetchMessages();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send message');
    }
  };

  const handleFileUpload = async (event, kind) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert('File is too large. Please upload a file smaller than 500KB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      await sendStructuredMessage({
        type: kind,
        name: file.name,
        mime: file.type || 'application/octet-stream',
        dataUrl: reader.result
      });
    };
    reader.onerror = () => {
      alert('Failed to read file.');
    };
    reader.readAsDataURL(file);
  };

  const handleShareLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await sendStructuredMessage({
          type: 'location',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      () => {
        alert('Unable to fetch location. Please allow location permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', backgroundColor: '#075E54', color: 'white' }}>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Community Chatroom</h1>
          <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>Communicate to the communinty</p>
        </div>

        <div style={{ height: '60vh', overflowY: 'auto', padding: '1rem', backgroundColor: '#ECE5DD' }}>
          {loading ? <p>Loading messages...</p> : null}
          {!loading && groupedMessages.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No messages yet. Start the conversation.</p>
          ) : null}
          {groupedMessages.map((message) => {
            const mine = Number(message.userId) === Number(user?.id);
            const parsed = parseMessageContent(message.content);
            return (
              <div key={message.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: '0.6rem' }}>
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '0.55rem 0.7rem',
                    borderRadius: '10px',
                    backgroundColor: mine ? '#DCF8C6' : '#FFFFFF',
                    boxShadow: '0 1px 1px rgba(0,0,0,0.08)'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: mine ? '#2E7D32' : '#1565C0', marginBottom: '0.2rem' }}>
                    {mine ? 'You' : message.sender?.name || 'User'}
                  </div>
                  {parsed.type === 'text' ? (
                    <div style={{ fontSize: '0.9rem', color: '#111827' }}>{parsed.text}</div>
                  ) : null}
                  {parsed.type === 'file' || parsed.type === 'document' ? (
                    <div>
                      {String(parsed.mime || '').startsWith('image/') ? (
                        <a href={parsed.dataUrl} download={parsed.name}>
                          <img
                            src={parsed.dataUrl}
                            alt={parsed.name}
                            style={{ width: '220px', maxWidth: '100%', borderRadius: '8px', marginBottom: '0.4rem' }}
                          />
                        </a>
                      ) : null}
                      <a
                        href={parsed.dataUrl}
                        download={parsed.name}
                        style={{ color: '#0F62FE', fontSize: '0.88rem', fontWeight: 600 }}
                      >
                        {parsed.type === 'document' ? 'Document: ' : 'File: '}
                        {parsed.name}
                      </a>
                    </div>
                  ) : null}
                  {parsed.type === 'location' ? (
                    <a
                      href={`https://www.google.com/maps?q=${parsed.latitude},${parsed.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#0F62FE', fontSize: '0.88rem', fontWeight: 600 }}
                    >
                      Shared location: {parsed.latitude?.toFixed?.(5)}, {parsed.longitude?.toFixed?.(5)}
                    </a>
                  ) : null}
                  <div style={{ fontSize: '0.68rem', color: '#6B7280', marginTop: '0.25rem', textAlign: 'right' }}>
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.5rem', padding: '0.8rem', borderTop: '1px solid var(--border-color)', backgroundColor: '#F0F2F5' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,audio/*,.zip,.rar"
            style={{ display: 'none' }}
            onChange={(e) => handleFileUpload(e, 'file')}
          />
          <input
            ref={docInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            style={{ display: 'none' }}
            onChange={(e) => handleFileUpload(e, 'document')}
          />
          <button type="button" className="btn-primary" style={{ padding: '0.75rem 0.9rem' }} onClick={() => fileInputRef.current?.click()}>
            <Paperclip size={18} />
          </button>
          <button type="button" className="btn-primary" style={{ padding: '0.75rem 0.9rem' }} onClick={() => docInputRef.current?.click()}>
            <FileText size={18} />
          </button>
          <button type="button" className="btn-primary" style={{ padding: '0.75rem 0.9rem' }} onClick={handleShareLocation}>
            <MapPin size={18} />
          </button>
          <input
            type="text"
            className="input-field"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0.75rem 0.9rem' }}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
