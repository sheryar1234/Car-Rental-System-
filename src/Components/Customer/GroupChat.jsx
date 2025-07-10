import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './GroupChat.css';
import Navbar from '../Navbar';
const GroupChat = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [socketStatus, setSocketStatus] = useState('disconnected');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const userEmail = localStorage.getItem('userEmail') || 'guest@example.com';

  // Initialize socket connection
  useEffect(() => {
    const socket = io('http://localhost:5000', {
      path: '/socket.io',
      transports: ['websocket'],
      reconnection: true,
      query: { userEmail }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketStatus('connected');
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      setSocketStatus('disconnected');
    });

    socket.on('connect_error', (err) => {
      setSocketStatus('error');
      console.error('Connection error:', err);
    });

    socket.on('receive_message', (message) => {
      console.log('Received message:', message);
      setMessages(prev => [...prev, message]);
    });

    socket.on('messages_read', (data) => {
      setMessages(prev => prev.map(msg => {
        if (data.messageIds.includes(msg._id)) {
          return {
            ...msg,
            readBy: [...(msg.readBy || []), { 
              userEmail: data.readerEmail, 
              timestamp: data.timestamp 
            }]
          };
        }
        return msg;
      }));
    });

    socket.on('group_created', (group) => {
      if (group.members.includes(userEmail)) {
        setGroups(prev => [...prev, group]);
      }
    });

    socket.on('member_added', (updatedGroup) => {
      if (updatedGroup.members.includes(userEmail)) {
        setGroups(prev => prev.map(group => 
          group._id === updatedGroup._id ? updatedGroup : group
        ));
        if (selectedGroup?._id === updatedGroup._id) {
          setSelectedGroup(updatedGroup);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userEmail, selectedGroup]);

  // Fetch user's groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/chat/my-groups/${encodeURIComponent(userEmail)}`);
        const data = await response.json();
        setGroups(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [userEmail]);

  // Fetch messages when group is selected
  useEffect(() => {
    if (selectedGroup && socketRef.current) {
      const fetchMessages = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:5000/api/chat/messages/${selectedGroup._id}`);
          const data = await response.json();
          setMessages(data || []);
          socketRef.current.emit('join_group', selectedGroup._id);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchMessages();
    }
  }, [selectedGroup]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCreateGroup = async () => {
    try {
      setLoading(true);
      const members = groupMembers.split(',')
        .map(email => email.trim().toLowerCase())
        .filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

      if (!groupName.trim() || members.length === 0) {
        throw new Error('Invalid group name or member emails');
      }

      const response = await fetch('http://localhost:5000/api/chat/create-group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: groupName,
          members,
          creatorEmail: userEmail
        }),
      });

      const newGroup = await response.json();
      setGroupName('');
      setGroupMembers('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedGroup) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/chat/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId: selectedGroup._id,
          content: newMessage,
          senderEmail: userEmail
        }),
      });
      setNewMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!selectedGroup) return;
    
    const unreadMessages = messages
      .filter(msg => 
        msg.sender !== userEmail && 
        !(msg.readBy || []).some(r => r.userEmail === userEmail)
      )
      .map(msg => msg._id);

    if (unreadMessages.length === 0) return;

    try {
      await fetch('http://localhost:5000/api/chat/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageIds: unreadMessages,
          groupId: selectedGroup._id,
          readerEmail: userEmail
        }),
      });
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail.trim() || !selectedGroup) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/chat/add-member/${selectedGroup._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberEmail: newMemberEmail.trim().toLowerCase()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add member');
      }

      const updatedGroup = await response.json();
      setGroups(prev => prev.map(group => 
        group._id === updatedGroup._id ? updatedGroup : group
      ));
      setSelectedGroup(updatedGroup);
      setNewMemberEmail('');
      setShowAddMemberModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div><Navbar/>
    <div className="chat-container">
     

      <div className="sidebar">
        <h3>My Groups ({userEmail})</h3>
        
        <div className="group-form">
          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Member emails (comma separated)"
            value={groupMembers}
            onChange={(e) => setGroupMembers(e.target.value)}
            disabled={loading}
          />
          <button 
            onClick={handleCreateGroup}
            disabled={loading || !groupName.trim()}
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="group-list">
          {loading && !groups.length ? (
            <div className="loading">Loading groups...</div>
          ) : groups.length === 0 ? (
            <div className="empty">No groups found</div>
          ) : (
            groups.map(group => (
              <div
                key={group._id}
                className={`group-item ${selectedGroup?._id === group._id ? 'active' : ''}`}
                onClick={() => setSelectedGroup(group)}
              >
                <div className="group-name">{group.name}</div>
                <div className="group-meta">
                  <span>{group.members?.length || 0} members</span>
                  {group.members.includes(userEmail) && <span className="you-indicator">(You)</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-area">
        {selectedGroup ? (
          <>
            <div className="chat-header">
              <div className="chat-header-top flex">
                <h3>{selectedGroup.name}

                </h3>
                <button 
                  className="add-member-btn ml-4 mb-4"
                  onClick={() => setShowAddMemberModal(true)}
                  title="Add member to group"
                >
                  + Add Member
                </button>
        
              </div>
              <div className="group-members flex">
                Members: {selectedGroup.members.join(', ')}
               
              </div>
             
            </div>

            <div 
              className="messages-container"
              onMouseEnter={markMessagesAsRead}
            >
              {loading && !messages.length ? (
                <div className="loading">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="empty">No messages yet</div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`message ${message.sender === userEmail ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <div className="message-sender">
                        {message.sender === userEmail ? 'You' : message.sender}
                      </div>
                      <div className="message-text">{message.content}</div>
                      <div className="message-meta">
                        <span className="message-time">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                        {(message.readBy || []).some(r => r.userEmail !== userEmail) && ' ✓✓'}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
                placeholder="Type a message..."
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !newMessage.trim()}
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </>
        ) : (
          <div className="empty-chat">
            {groups.length > 0 ? 'Select a group' : 'Create a group'}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Member to {selectedGroup?.name}</h3>
            <input
              type="email"
              placeholder="Enter member's email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              disabled={loading}
            />
            {error && <div className="error-message">{error}</div>}
            <div className="modal-buttons">
              <button 
                onClick={handleAddMember}
                disabled={loading || !newMemberEmail.trim()}
              >
                {loading ? 'Adding...' : 'Add Member'}
              </button>
              <button 
                onClick={() => {
                  setShowAddMemberModal(false);
                  setError('');
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default GroupChat;