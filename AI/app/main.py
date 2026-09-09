from fastapi import FastAPI

app = FastAPI()


@app.post('/analyze')
def analyze(data: dict):

    videos = data.get('videos', [])
    return {
        'message': "Playlist received by AI service",
        'video_count': len(videos)
    }