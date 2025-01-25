import React, { useState } from 'react';

import Upload from './components/Upload';
import Question from './components/Question';
import './App.css';

const App = () => {
    const [fileId, setFileId] = useState(''); // Store unique file ID
    const [filename, setFilename] = useState(''); // Store filename

    // Handle file upload success
    const handleFileUpload = ({ file_id, filename }) => {
        setFileId(file_id); // Save the file ID
        setFilename(filename); // Save the filename
    };

    return (
        <div className="app">
            {/* Header Section */}
            <header className="header">
                {/* Logo Section */}
                <div className="logo">
                    <img src="logo.png" alt="Logo" className="logo-icon" />
                </div>
                {/* File Upload Section */}
                <div className="upload-controls">
                    {filename && <span className="file-name">{filename}</span>}
                    <Upload onFileUpload={handleFileUpload} />
                </div>
            </header>

            {/* Main Chat Section */}
            <main className="main-content">
                {fileId ? (
                    <Question fileId={fileId} filename={filename} />
                ) : (
                    <p className="upload-prompt">Please upload a file to begin!</p>
                )}
            </main>
        </div>
    );
};

export default App;
