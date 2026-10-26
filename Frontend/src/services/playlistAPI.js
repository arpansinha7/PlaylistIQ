const loadPlaylist = async (playlistId) => {
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/youtube/playlist`, {

        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({playlistId})
    });

    const data = await response.json();

    if(!response.ok)
    {
        throw new Error(data.error?.message || "Failed to load playlist");
    }

    return data;
};

export default loadPlaylist;