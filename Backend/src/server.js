import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.post("/api/youtube/playlist", async (req, res) => {

    try
    {
        const { playlistId } = req.body;

        if(!playlistId)
        {
            return res.status(400).json({
                error: 'Playlist ID is required.'
            });
        }
        let allVideos = [];
        let nextPageToken = null;
     do{
        const url = new URL(
            'https://www.googleapis.com/youtube/v3/playlistItems'
        );

        url.searchParams.set('part', 'snippet');
        url.searchParams.set('playlistId', playlistId);
        url.searchParams.set('maxResults', '50');
        url.searchParams.set('key', process.env.YOUTUBE_API_KEY);
        
        if(nextPageToken)
        {
            url.searchParams.set("pageToken", nextPageToken);
        }
        const response = await fetch(url);
        const data = await response.json();

        if(!response.ok)
        {
            return res.status(response.status).json(data);
        }

        const videos = data.items.map(item => ({
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails?.medium?.url,
            position: item.snippet.position
        }));

        allVideos.push(...videos);
        nextPageToken = data.nextPageToken || null;

    }while(nextPageToken);

    const videoIds = allVideos.map(video => video.videoId);

    const availableVideoIds = new Set();

    for(let i = 0; i < videoIds.length; i += 50)
    {
        const batch = videoIds.slice(i, i+50);

        const url = new URL(
            'https://www.googleapis.com/youtube/v3/videos'
        );

        url.searchParams.set('part', 'id');
        url.searchParams.set('id', batch.join(','));
        url.searchParams.set('key', process.env.YOUTUBE_API_KEY);

        const response = await fetch(url);
        const data = await response.json();

        if(!response.ok)
        {
            return res.status(response.status).json(data);
        }

        data.items.forEach(video => {
            availableVideoIds.add(video.id);
        });

    }

    allVideos = allVideos.map(video => ({
        ...video,
        available: availableVideoIds.has(video.videoId)
    }));

    const aiResponse = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playlistId,
            videos: allVideos
        })
    });

    const aiData = await aiResponse.json();

    if(!aiResponse.ok)
    {
        return res.status(aiResponse.status).json(aiData);
    }
    console.log(aiData);
        res.json({
            playlistId,
            videos: allVideos
        });
    }
    catch(error)
    {
        console.log(error);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}...`);
});