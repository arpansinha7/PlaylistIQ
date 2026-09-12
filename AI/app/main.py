from fastapi import FastAPI
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_qdrant import QdrantVectorStore
from langchain_core.documents import Document
from openai import OpenAI
import os, json, requests

load_dotenv()

app = FastAPI()

openai_client = OpenAI(
    api_key=os.getenv('GEMINI_API_KEY'),
    base_url=os.getenv('GEMINI_BASE_URL')
)

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
        transcript = response.get('transcript')

        if transcript is None:
            print(f"Transcript is not available for {video['videoId']}")
            continue

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

@app.post('/ask')
def ask(data: dict):

    playlistId = data.get('playlistId', '')
    userQuery = data.get('userQuery', '')

    embedding_model = GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001"
    )

    vector_db = QdrantVectorStore.from_existing_collection(
        url='http://localhost:6333',
        embedding=embedding_model,
        collection_name=f"Playlist-{playlistId}"
    )

    search_results = vector_db.similarity_search(query=userQuery)

    context = "\n\n\n".join(
        
            f"Video Title: {result.metadata['title']}\n"
            f"Timestamp: {result.metadata['timestamp']}\n"
            f"Content: {result.page_content}" 
        for result in search_results
    )

    sources = [
            {
                "videoId": result.metadata['videoId'],
                "timestamp": result.metadata['timestamp']
            }
            for result in search_results
    ]

    SYSTEM_PROMPT = f"""
        You are PlaylistIQ, an expert AI assistant that answers questions about the content of a specific YouTube Playlist.

        Your job is to answer the user's query using the retrieved information from the playlist provided as context.

        Rules:

        1. Answer the user's question based primarily on the provided playlist context.
        
        2. Treat the retrieved context as the source of truth for questions about
           the playlist. Do not invent facts, details, quotes, timestamps, or
           information that are not supported by the context.
        
        3. If the retrieved context contains enough information to answer the
           question, give a clear and direct answer.
        
        4. If the context does not contain enough information to answer the
           question, explicitly say that the available playlist content does not
           provide enough information to answer it. Do not make up an answer.
        
        5. You may combine information from multiple retrieved videos or multiple
           sections of the same video when answering a question.
        
        6. When useful, mention the relevant video title and timestamp so that the
           user can locate the information in the original playlist.
        
        7. If the user asks for a summary, comparison, explanation, list, or
           synthesis, organize the answer in the format that best fits the request.
        
        8. Keep answers concise but sufficiently detailed to properly answer the
           question. Do not unnecessarily repeat the retrieved context.
        
        9. The retrieved context may contain incomplete sentences because it comes
           from transcript chunks. Treat neighboring chunks and related retrieved
           information as parts of the same transcript when appropriate.
        
        10. The transcript may contain speech-recognition errors, filler words,
            or imperfect punctuation. Interpret the meaning as naturally as
            possible without inventing information.
        
        11. If the user's question is unrelated to the playlist context, explain
            that PlaylistIQ is designed to answer questions about the loaded
            playlist.
        
        12. Never claim that you watched a video, accessed YouTube directly, or
            know information that is not present in the provided context.
        
        Retrieved playlist context:
        {context}

    """

    response = openai_client.chat.completions.create(

        model="gemini-3.5-flash",
        messages=[

            { "role": "system", "content": SYSTEM_PROMPT.format(context=context) },
            { "role": "user", "content": userQuery }
        ]
    )

    return {
        "answer": response.choices[0].message.content,
        "sources": sources
    }


