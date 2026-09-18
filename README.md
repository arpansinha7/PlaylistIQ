# PlaylistIQ

## 1. Description

PlaylistIQ is an AI-powered YouTube playlist assistant that allows users to load a YouTube playlist and interact with its content through an AI-powered question-answering system.

The application retrieves the videos from a YouTube playlist, processes their transcripts, converts the transcript content into searchable vector representations, and stores them in a vector database. Users can then ask questions about the playlist, and PlaylistIQ retrieves the most relevant content before generating an answer using an LLM.

The application is built using a React frontend, a Node.js/Express backend, and a Python/FastAPI AI service. The backend handles playlist retrieval, authentication, and communication between the frontend and AI service, while the AI service handles transcript processing, embeddings, vector search, and AI-generated responses.

PlaylistIQ also provides relevant video titles and timestamps when the user's question requires locating where a particular topic was discussed in the playlist.

---

## 2. APIs Used

### YouTube Data API

Used to retrieve YouTube playlist information and video details such as:

- Playlist videos
- Video IDs
- Video titles
- Thumbnails
- Playlist pagination data

### SERPAPI

Used to retrieve YouTube video transcripts for the AI processing pipeline.

### Google Gemini API

Used for AI-related operations including:

- LLM-based response generation
- Text embeddings

### Google OAuth 2.0

Used to provide Google-based authentication for users.

---

## 3. Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- Passport.js
- bcrypt

### AI Service

- Python
- FastAPI
- LangChain

### Databases

- PostgreSQL
- Qdrant

### External Services

- YouTube Data API
- SERPAPI
- Google Gemini API
- Google OAuth 2.0

### Development Tools

- Git
- GitHub
- Docker

---

## 4. AI Information

PlaylistIQ uses a Retrieval-Augmented Generation (RAG) architecture to answer questions about YouTube playlist content.

- **LLM:** Gemini
- **Embedding Model:** `gemini-embedding-001`
- **Vector Database:** Qdrant
- **Framework:** LangChain
- **Transcript Retrieval:** SERPAPI

### RAG Pipeline

1. Retrieve videos from the YouTube playlist.
2. Retrieve video transcripts.
3. Split transcripts into smaller chunks.
4. Generate embeddings for the chunks.
5. Store the embeddings in Qdrant.
6. Retrieve relevant chunks based on the user's question.
7. Provide the relevant content to the LLM.
8. Generate the final answer.

The system also maintains video and timestamp metadata with the stored content so relevant sources can be provided alongside answers.