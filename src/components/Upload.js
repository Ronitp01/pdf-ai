import React, { useState } from "react";
import axios from "axios";
import './Upload.css'; // Import CSS for styling

const Upload = ({ onFileUpload }) => {
    const [file, setFile] = useState(null); // To store the selected file

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Store the selected file
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
            const response = await axios.post("http://127.0.0.1:8000/upload-pdf/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Upload response:", response.data); // Debug log

            // Extract `file_id` and `filename` from the response
            const { file_id, filename } = response.data;

            if (file_id && filename) {
                // Pass both `file_id` and `filename` to the parent component
                onFileUpload({ file_id, filename });
                alert("File uploaded successfully!");
                
                // Optionally reset the selected file after successful upload
                setFile(null); // Uncomment if you want to clear the selected file after uploading
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
            {/* Display the uploaded file name to the left of the buttons */}
            {file && <span className="uploaded-file-name">{file.name}</span>}
            
            {/* File Input */}
            <label htmlFor="file-input" className="file-input-label">
                Choose File
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
