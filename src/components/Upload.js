import React, { useState } from "react";
import axios from "axios";
import './Upload.css'; // Import CSS for styling

const Upload = ({ onFileUpload }) => {
    const [file, setFile] = useState(null);

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
            // Call the upload endpoint
            const response = await axios.post("http://127.0.0.1:8000/upload-pdf/","https://pdf-ai-swart.vercel.app/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Upload response:", response.data); // Debug log
            const { file_id, filename } = response.data;

            if (file_id && filename) {
                // Pass both `file_id` and `filename` to the parent component
                onFileUpload({ file_id, filename });
                alert("File uploaded successfully!");
            } else {
                throw new Error("Invalid response from the server.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload the file. Please try again.");
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
            <button className="upload-btn" onClick={handleUpload}>
                + Upload PDF
            </button>
        </div>
    );
};

export default Upload;