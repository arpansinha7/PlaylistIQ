const askPlaylist = async (playlistId, userQuery) => {
    
    const response = await fetch("http://localhost:8080/api/youtube/playlist/ask", {

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