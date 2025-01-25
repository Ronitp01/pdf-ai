import React, { useState } from 'react';
import './Chat.css';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]); // Chat history
  const [input, setInput] = useState(''); // Text input

  // Send message to backend
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user's question to chat bubble
    const newMessages = [...messages, { type: 'user', text: input }];
    setMessages(newMessages);

    try {
      const response = await axios.post('http://127.0.0.1:8000/ask_question/', {
        question: input,
      });
      // Add backend's response to chat bubble
      setMessages([
        ...newMessages,
        { type: 'bot', text: response.data.answer },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { type: 'bot', text: 'Failed to get a response from the server.' },
      ]);
    }
    setInput(''); // Reset input field
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-bubble ${
              message.type === 'user' ? 'user-bubble' : 'bot-bubble'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <form className="chat-input-container" onSubmit={sendMessage}>
        <input
          className="chat-input"
          type="text"
          placeholder="Send a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="send-btn">➤</button>
      </form>
    </div>
  );
};

export default Chat;
