import os
import uuid
import logging
import config
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.text_splitter import CharacterTextSplitter
from langchain.document_loaders import PyPDFLoader
from langchain_community.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain

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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory for uploaded PDF files
UPLOAD_DIR = "./uploaded_pdfs/"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Backend storage for vectorstores mapped by file_id
pdf_vectorstores = {}

# Ensure OpenAI API key is loaded
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
if not os.environ["OPENAI_API_KEY"]:
    raise ValueError("OpenAI API Key not found. Ensure it’s set in the environment variables.")

# Helper function to process and create a vectorstore from PDF
def process_pdf(file_path):
    """Process the uploaded PDF and generate a vectorstore."""
    try:
        # Load and process the PDF
        loader = PyPDFLoader(file_path)
        documents = loader.load()

        # Split PDF text into manageable chunks
        splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        texts = splitter.split_documents(documents)

        if not texts:
            raise ValueError("No text could be extracted from the uploaded PDF.")

        # Initialize embeddings and create vectorstore
        embeddings = OpenAIEmbeddings()
        vectorstore = FAISS.from_documents(texts, embeddings)
        return vectorstore

    except Exception as e:
        logger.error(f"Error while processing PDF: {str(e)}")
        raise Exception(f"Failed to process PDF: {str(e)}")

# Root endpoint for testing
@app.get("/")
async def root():
    """Check if the API is running."""
    return {"status": "OK", "message": "Welcome to the PDF Q&A API!"}

# Endpoint to upload and process a PDF
@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    """Handles PDF upload and vectorstore creation."""
    # Generate a unique file ID
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")

    try:
        # Save the uploaded PDF locally
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Process the PDF into a vectorstore
        vectorstore = process_pdf(file_path)
        pdf_vectorstores[file_id] = {
            "filename": file.filename,
            "vectorstore": vectorstore,
        }

        logger.info(f"PDF successfully uploaded and processed: {file.filename}")
        return {"file_id": file_id, "filename": file.filename}

    except Exception as e:
        logger.error(f"Error processing uploaded PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process uploaded PDF: {str(e)}")

# Endpoint to ask a question about a PDF
@app.post("/ask-question/")
async def ask_question(
    file_id: str = Form(...), question: str = Form(...)
):
    """Queries a document's vectorstore."""
    logger.info(f"Received question for file_id: {file_id}")

    # Check if file_id exists
    if file_id not in pdf_vectorstores:
        logger.error(f"File ID '{file_id}' not found.")
        raise HTTPException(status_code=404, detail="File ID not found. Please upload the file first.")

    try:
        # Retrieve the vectorstore
        vectorstore = pdf_vectorstores[file_id]["vectorstore"]

        # Initialize the chat model and chain
        chat_model = ChatOpenAI(temperature=0.7, model_name="gpt-3.5-turbo")
        qa_chain = ConversationalRetrievalChain.from_llm(
            chat_model, vectorstore.as_retriever()
        )

        # Generate the answer
        response = qa_chain.invoke({"question": question, "chat_history": []})
        logger.info(f"Answer to the question: {response['answer']}")

        return {"question": question, "answer": response["answer"]}
    except Exception as e:
        logger.error(f"Error processing question: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

# Endpoint to list all uploaded PDFs and their details
@app.get("/list-pdfs/")
async def list_pdfs():
    """Lists all uploaded PDF files."""
    try:
        return {
            "pdfs": [
                {"file_id": file_id, "filename": data["filename"]}
                for file_id, data in pdf_vectorstores.items()
            ]
        }
    except Exception as e:
        logger.error(f"Error listing PDFs: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve list of uploaded PDFs.")