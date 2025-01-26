import React, { useState } from 'react';
import axios from 'axios';
import { VscSend } from "react-icons/vsc"; // Import the send icon
import './Question.css'; // Import CSS for styling

const Question = ({ fileId }) => {
    const [question, setQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Function to handle asking a question
    const handleAskQuestion = async () => {
        if (!question.trim()) {
            alert("Please enter a question!");
            return;
        }

        setIsLoading(true);

        try {
            const params = new URLSearchParams();
            params.append("file_id", fileId); // Pass the fileId
            params.append("question", question.trim()); // Pass the trimmed question

            const response = await axios.post(
                "http://127.0.0.1:8000/ask-question/", "https://pdf-ai-swart.vercel.app/",
                params,
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                }
            );

            // Update chat history with the new question and answer
            const { answer } = response.data;
            setChatHistory((prevChat) => [
                ...prevChat,
                { type: 'question', text: question, avatar: '/user.png' }, // Update User Avatar
                { type: 'answer', text: answer, avatar: '/ai.png' } // Update AI Avatar
            ]);

            setQuestion(''); // Clear the input
        } catch (error) {
            console.error("Error fetching answer:", error);
            alert("Failed to get an answer. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="question-container">
            {/* Chat History */}
            <div className="chat-history">
                {chatHistory.map((message, index) => (
                    <div
                        key={index}
                        className={`message-wrapper ${message.type === 'question' ? 'user-message' : 'ai-message'}`}
                    >
                        <img
                            src={message.avatar}
                            alt={`${message.type} avatar`}
                            className="avatar"
                        />
                        <div className="message-bubble">
                            {message.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Ask a question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={isLoading}
                    className="text-input" // Add this class for styling if needed
                />
                <button
                    onClick={handleAskQuestion}
                    disabled={isLoading}
                    className="send-button"
                >
                    <VscSend className="send-icon" /> {/* Use VscSend icon */}
                </button>
            </div>
        </div>
    );
};

export default Question;