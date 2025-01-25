# PDF Q&A Application

## Overview

The **PDF Q&A Application** is a web-based tool that allows users to upload a PDF document and ask questions about its content. This application leverages machine learning models to interpret the uploaded PDF and provide accurate answers to user queries. The project demonstrates the integration of frontend and backend technologies and efficiently handles large document processing.

## Technology Stack

- **Frontend**: React.js
- **Backend**: FastAPI
- **Database**: In-memory storage (or any chosen database)
- **APIs**: Custom RESTful API for handling uploads and queries
- **Deployment**: Vercel (for frontend) and any cloud provider for the backend (e.g., AWS, Heroku)

## Features

- Upload PDF documents.
- Ask questions about the uploaded documents' content.
- Real-time responses based on PDF content.
- Responsive and user-friendly interface.

## Application Architecture

The application consists of two main components:

1. **Frontend**: Built with React, providing an intuitive user interface.
   
   ![Frontend Architecture]

2. **Backend**: Built with FastAPI, handling:
   - PDF uploads and processing.
   - Question parsing and answering via machine learning model.

   ![Backend Architecture]

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (for frontend development)
- Python 3.7 or later with pip (for backend development)
- Git (for version control)

### Frontend Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/pdf-q-a-app.git
    cd pdf-q-a-app/frontend
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Run the development server**:

    ```bash
    npm start
    ```

    The frontend should now be running on [http://localhost:3000](http://localhost:3000).

### Backend Setup

1. **Navigate to the backend directory**:

    ```bash
    cd pdf-q-a-app/backend
    ```

2. **Create a virtual environment** (optional but recommended):

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install required packages**:

    ```bash
    pip install -r requirements.txt
    ```

4. **Run the FastAPI server**:

    ```bash
    uvicorn main:app --reload
    ```

    The backend should now be running on [http://127.0.0.1:8000](http://127.0.0.1:8000).

## API Documentation

### Endpoints

#### 1. **Upload PDF Document**

- **URL**: `POST /upload-pdf/`
- **Description**: Upload a PDF file for processing.
- **Request**: Form-data with a field named `file`.
- **Responses**:
    - `200 OK`: Returns the file ID and filename.
    - `400 BAD REQUEST`: If the file is not a valid PDF.

#### 2. **Ask Question**

- **URL**: `POST /ask-question/`
- **Description**: Ask a question about the uploaded PDF document.
- **Request**: Form-data with `file_id` and `question`.
- **Responses**:
    - `200 OK`: Returns the answer to the specified question.
    - `404 NOT FOUND`: If the file ID is not valid.

