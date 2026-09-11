from fastapi import FastAPI
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_qdrant import QdrantVectorStore
from langchain_core.documents import Document
import os, json, requests

load_dotenv()

app = FastAPI()


@app.post('/analyze')
def analyze(data: dict):

    videos = data.get('videos', [])
    return {
        'message': "Playlist received by AI service",
        'video_count': len(videos)
    }

@app.post('/ingest')
def ingest(data: dict):

    playlistId = data.get('playlistId', '')
    videos = data.get('videos', [])

    SERPAPI_API_KEY = os.getenv('SERPAPI_API_KEY')

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=400)
    embedding_model = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-001"
        )

    for video in videos:
        params = {
            "api_key": SERPAPI_API_KEY,
            "engine": "youtube_video_transcript",
            "v": video['videoId'],
            "type": "asr"
        }

        search = requests.get('https://serpapi.com/search', params=params)
        response = search.json()

        transcript_document = [
            Document(

                page_content=item['snippet'],
                metadata=
                    {
                        "playlistId": playlistId,
                        "videoId": video['videoId'],
                        "title": video['title'],
                        "timestamp": item['start_time_text']

                    }        
            )
            for item in response['transcript']
        ]

        chunks = text_splitter.split_documents(transcript_document)


        vector_store = QdrantVectorStore.from_documents(
           documents=chunks,
           embedding=embedding_model,
           url="http://localhost:6333",
           collection_name=f"Playlist-{playlistId}"
       ) 
