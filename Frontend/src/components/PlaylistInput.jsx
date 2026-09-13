
function PlaylistInput({
    playlistUrl,
    setPlaylistUrl,
    handleLoadPlaylist,
    loading,
    error
})
{
    return (
    
    <>
        <div className={`playlist-input ${error ? 'input-error' : ''}`}>

            <input
            type='text'
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            placeholder='Paste your YouTube playlist URL'
            />

            <button 
            onClick={handleLoadPlaylist}
            disabled={loading}
            >

                {loading && <span className='loader'></span>}
                {loading ? 'Loading...' : 'Load Playlist'}

            </button>

        </div>

        {error && (
            <p className='error'>
            {error}
            </p>
        )}
    </>   
    );
}

export default PlaylistInput;
