console.log("File Started");
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