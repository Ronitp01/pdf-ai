import os
import uuid
import logging
import shutil
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter

# Load environment variables
load_dotenv()

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI()

# Allow CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://pdf-ai-swart.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory for uploaded PDF files
UPLOAD_DIR = "./uploaded_pdfs/"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Endpoint for uploading PDF files
@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File is not a PDF")

    file_location = f"{UPLOAD_DIR}/{file.filename}"

    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        logger.info(f"File {file.filename} uploaded successfully.")
        process_pdf(file_location)  # Call your processing function

        return {"filename": file.filename, "message": "File uploaded successfully!"}
    except Exception as e:
        logger.error(f"Failed to upload file {file.filename}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to upload file.")

# Function for processing the uploaded PDF
def process_pdf(file_path):
    try:
        loader = PyPDFLoader(file_path)
        documents = loader.load()

        splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        texts = splitter.split_documents(documents)

        if not texts:
            raise ValueError("No text could be extracted from the uploaded PDF.")
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        raise ValueError("Error processing PDF.")
