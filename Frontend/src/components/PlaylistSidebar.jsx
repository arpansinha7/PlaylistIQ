function PlaylistSidebar({
    visibleVideos,
    availableVideos,
    unavailableCount,
    visibleCount,
    setVisibleCount,
    handleNewPlaylist
})
{
    return (
        <aside className='playlist'>
            <div className='playlist-header'>
                <h2>Playlist</h2>

                <button onClick={handleNewPlaylist}>
                    + New Playlist
                </button>
            </div> 

            {visibleVideos.map((video) => (
                <a 
                className='video' 
                key={video.videoId}
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target='_blank'
                rel='noopener noreferrer'
                >
                  
                <img src={video.thumbnail} alt={video.title} />
            
                <div>
                <h3>{video.title}</h3>
                </div>
            
                </a>
            ))}

            {visibleCount < availableVideos.length && (

                <button onClick={() => setVisibleCount(prev => prev + 50)}>

                    Show next {Math.min(50, availableVideos.length - visibleCount)}

                </button>
            )}

            {visibleCount >= availableVideos.length && unavailableCount > 0 && (
                <p className='unavailable-message'>
                    {unavailableCount} unavailable video
                    {unavailableCount > 1 ? 's are' : ' is'} hidden
                </p>
            )}
        </aside>

    );
}


export default PlaylistSidebar;