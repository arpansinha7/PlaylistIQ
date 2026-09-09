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

export default extractPlaylistId;