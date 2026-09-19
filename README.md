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

---

## 5. Installation & Running Locally

### Prerequisites

Make sure the following are installed on your system:

- Node.js
- npm
- Python 3
- Docker
- PostgreSQL

PlaylistIQ requires the following services:

- PostgreSQL
- Qdrant
- AI service
- Backend
- Frontend

### 1. Clone the Repository

```bash
git clone https://github.com/arpansinha7/PlaylistIQ.git
cd PlaylistIQ
```

### 2. Configure Environment Variables

PlaylistIQ uses separate environment files for the AI service and the backend.

Create the `.env` files inside the `AI` and `Backend` directories using their respective `.env.example` files.

#### AI Environment Variables

Create:

```text
AI/.env
```

Configure the following:

- Gemini API key
- Gemini API base URL
- SERPAPI API key

#### Backend Environment Variables

Create:

```text
Backend/.env
```

Configure the following:

- Server port
- PostgreSQL connection details
- YouTube Data API key
- Google OAuth client ID
- Google OAuth client secret
- Session secret

Do not commit your `.env` files or expose your API keys.

### 3. Install Frontend Dependencies

From the project root:

```bash
cd Frontend
npm install
```

### 4. Install Backend Dependencies

From the project root:

```bash
cd Backend
npm install
```

### 5. Setup the AI Service

From the project root:

```bash
cd AI
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Keep the virtual environment available for running the AI service.

### 6. Setup PostgreSQL

Make sure PostgreSQL is installed and running.

Create a PostgreSQL database and configure its credentials in `Backend/.env`.

Create the required database tables using the SQL schema used by PlaylistIQ.

### 7. Start Qdrant

Make sure Docker is running, then start Qdrant:

```bash
docker run -p 6333:6333 qdrant/qdrant
```

Qdrant will be available at:

```text
http://localhost:6333
```

Keep this terminal running.

### 8. Start the AI Service

Open a new terminal and navigate to the AI directory:

```bash
cd PlaylistIQ/AI
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

The AI service will run on:

```text
http://localhost:8000
```

Keep this terminal running.

### 9. Start the Backend

Open another terminal and navigate to the Backend directory:

```bash
cd PlaylistIQ/Backend
npm run dev
```

The Node.js/Express backend will start on the configured port.

Keep this terminal running.

### 10. Start the Frontend

Open another terminal and navigate to the Frontend directory:

```bash
cd PlaylistIQ/Frontend
npm run dev
```

Vite will display the local URL in the terminal.

Open the displayed URL in your browser.

### Running PlaylistIQ

Keep the following services running simultaneously:

- PostgreSQL
- Qdrant
- AI service
- Backend
- Frontend

Once all services are running, open the frontend URL provided by Vite and start using PlaylistIQ.
