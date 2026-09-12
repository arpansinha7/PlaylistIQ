import { useState } from 'react'
import extractPlaylistId from './utils/youtube';
import loadPlaylist from './services/playlistAPI';
import askPlaylist from './services/askPlaylist';
import './App.css'

function App() {
  
  const [ playlistUrl, setPlaylistUrl ] = useState('');
  const [ playlistId, setPlaylistId ] = useState('');
  const [ videos, setVideos ] = useState([]);
  const [ error, setError ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ visibleCount, setVisibleCount ] = useState(50);
  const [ userQuery, setUserQuery ] = useState('');
  const [ answer, setAnswer ] = useState('');
  const [ sources, setSources ] = useState([]);
  const [ darkMode, setDarkMode ] = useState(false);

  const availableVideos = videos.filter(video => video.available);
  const unavailableCount = videos.length - availableVideos.length;
  const visibleVideos = availableVideos.slice(0, visibleCount);

  const handleNewPlaylist = () => {

    setVideos([]);
    setPlaylistUrl('');
    setPlaylistId('');
    setUserQuery('');
    setAnswer('');
    setSources([]);
    setError('');
    setVisibleCount(50);
  };

  const handleLoadPlaylist = async () => {

    setError('');
    setVideos([]);
    setVisibleCount(50);

    const result = extractPlaylistId(playlistUrl);
    
    if(!result.playlistId)
    {
      setError(result.error);
      return;
    }

    const playlistId = result.playlistId;
    setPlaylistId(playlistId);
    try
    {
      setLoading(true);
      const data = await loadPlaylist(playlistId);

      setVideos(data.videos);
    }
    catch(err)
    {
      setError(err.message);
    }
    finally
    {
      setLoading(false);
    }
  };

  const handleAskPlaylist = async () => {

    try
    {
      const data = await askPlaylist(playlistId, userQuery);

      setAnswer(data.answer);
      setSources(data.sources);
    }
    catch(error)
    {
      setError(error.message);
    }
  };
  
  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <nav className='navbar'>
        <div className='brand'>
          <div className='logo'></div>
          <span>PlaylistIQ</span>
        </div>

      <div className='nav-actions'>
        <button 
        className='mode-button'
        onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀' : '☾'}
        </button>
        <button className='menu-button'>
          ☰
        </button>
      </div>  
      </nav>
      { videos.length === 0 ? (
      <main className='entry-page'>
        <section className='hero'>
          <h1>Understand your YouTube playlists</h1>

          <p>
            Ask questions and get answers from the content inside your playlist.
          </p>

          <div className='playlist-input'>
            
            <input
              type='text'
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder='Paste your YouTube playlist URL'
            />

            <button onClick={handleLoadPlaylist}>
              {loading ? 'Loading...' : 'Load Playlist'}
            </button>
          </div>

          {error && (
            <p className='error'>
              {error}
            </p>
          )}
        </section>
      </main>
      ) : (

        <main className='workspace'>
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

          <section className='qa'>
            <h2>Ask your playlist</h2>
            
            <div className='question-box'>
              <input
                type='text'
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder='Ask a question about this playlist...'
              />

              <button onClick={handleAskPlaylist}>Ask</button>
             </div>

             <div className='answer'>
              <h3>Answer</h3>

              <p>
                {answer}
              </p>
             </div>

             <div className='sources'>
              <h3>Sources</h3>

                {sources.map((source, index) => (
                    <div className='source' key={index}>
                      <span>{source.videoId}</span>
                      <span>{source.timestamp}</span>
                    </div>  
                ))}
             </div>
          </section>
        </main>
      )}
    </div>
  );
}

export default App
