const extractPlaylistId = (url) => {
    try
    {
        const parsedUrl = new URL(url);
        const playlistId = parsedUrl.searchParams.get('list');

        if(!playlistId)
        {
            return {
                playlistId: null,
                error: 'Please enter a valid YouTube playlist URL.'
            };
        }

        if(playlistId.startsWith('RD'))
        {
            return {
                playlistId: null,
                error: 'YouTube Mix URLs are not supported. Please enter a valid YouTube playlist URL.'
            };
        }


        return {
            playlistId,
            error: null
        };
    }
    catch(error)
    {
        return {
            playlistId: null,
            error: 'Please enter a valid YouTube URL.'
        }
    }
};

const timestampToSeconds = (timestamp) => {

    const parts = timestamp.split(':').map(Number);

    if(parts.length === 2)
    {
        return parts[0] * 60 + parts[1];
    }

    if(parts.length === 3)
    {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    return 0;
}
export {extractPlaylistId, timestampToSeconds};