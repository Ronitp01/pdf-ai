import React, { useState } from "react";
import axios from "axios";
import './Upload.css'; // Import CSS for styling

const Upload = ({ onFileUpload }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);  // Track loading state

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);  // Start loading state

            // Call the upload endpoint
            const response = await axios.post("https://pdf-ai-swart.vercel.app/upload-pdf/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Upload response:", response.data); // Debug log

            // Check for the response structure
            const { filename, message } = response.data; // assuming the message confirms success

            if (filename) {
                // Pass the filename to the parent component
                onFileUpload({ filename });
                alert(message);  // Alert user of successful upload
            } else {
                throw new Error("Invalid response from the server.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload the file. Please try again.");
        } finally {
            setUploading(false);  // End loading state
        }
    };

    return (
        <div className="upload-container">
            {/* File Input */}
            <label htmlFor="file-input" className="file-input-label">
                <span className="file-input-text">{file ? file.name : "Choose File"}</span>
                <input
                    id="file-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="file-input"
                    hidden // Hide the input to preserve the label's appearance
                />
            </label>

            {/* Upload Button */}
            <button 
                className={`upload-btn ${uploading ? "loading" : ""}`} 
                onClick={handleUpload}
                disabled={uploading}  // Disable button when uploading
            >
                {uploading ? "Uploading..." : "+ Upload PDF"}
            </button>
        </div>
    );
};

export default Upload;
