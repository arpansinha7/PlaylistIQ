const askPlaylist = async (playlistId, userQuery) => {
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/youtube/playlist/ask`, {

        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            playlistId,
            userQuery
        })
    });

    const data = await response.json();

    if(!response.ok)
    {
        throw new Error(data.error || "Something went wrong");
    }

    return data;
};

export default askPlaylist;