import { useState, useEffect, useRef } from 'react';
import { extractPlaylistId, timestampToSeconds } from './utils/youtube';
import loadPlaylist from './services/playlistAPI';
import askPlaylist from './services/askPlaylist';
import ReactMarkdown from 'react-markdown';
import './App.css'

function App() {
  
  const [ playlistUrl, setPlaylistUrl ] = useState('');
  const [ playlistId, setPlaylistId ] = useState('');
  const [ videos, setVideos ] = useState([]);
  const [ error, setError ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ asking, setAsking ] = useState(false);
  const [ visibleCount, setVisibleCount ] = useState(50);
  const [ userQuery, setUserQuery ] = useState('');
  // const [ answer, setAnswer ] = useState('');
  // const [ sources, setSources ] = useState([]);
  const [ messages, setMessages ] = useState([]);
  const [ darkMode, setDarkMode ] = useState(false);

  const chatRef = useRef(null);
  const queryRef = useRef(null);

  useEffect(() => {
    if(chatRef.current)
    {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const availableVideos = videos.filter(video => video.available);
  const unavailableCount = videos.length - availableVideos.length;
  const visibleVideos = availableVideos.slice(0, visibleCount);

  const handleNewPlaylist = () => {

    setVideos([]);
    setPlaylistUrl('');
    setPlaylistId('');
    setUserQuery('');
    // setAnswer('');
    // setSources([]);
    setMessages([]);
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

    setError('');

    const query = userQuery.trim();

    if(!query)
    {
      return;
    }

    setMessages(prev => [
      ...prev,
      {
        role: "user",
        content: query
      }
    ]);

    if(queryRef.current)
    {
      queryRef.current.style.height = '48px';
    }
    setUserQuery('');

    try
    {
      setAsking(true);
      const data = await askPlaylist(playlistId, query);

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources
        }
      ]);
    }
    catch(error)
    {
      setError(error.message);
    }
    finally
    {
      setAsking(false);
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

              <div className='chat' ref={chatRef}>

                {messages.map((message, index) => (
                  <div className={`message ${message.role}`} key={index}>
                    
                    <ReactMarkdown>{message.content}</ReactMarkdown>

                        {message.sources?.length > 0 && (
                       <div className='sources'>
                        <h3>Sources</h3>

                        {message.sources.map((source, sourceIndex) => (
                          <div className='source' key={sourceIndex}>
                            <a
                            href={`https://www.youtube.com/watch?v=${source.videoId}&t=${timestampToSeconds(source.timestamp)}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            >
                              <span>{source.title}</span>
                              <span>{source.timestamp}</span>
                            </a>
                        
                          </div>
                        ))}
                       </div>
                    )} 

                  </div>
                ))}
              </div>

            <div className='question-box'>

              <textarea
                ref={queryRef}
                value={userQuery}
                onChange={(e) => {
                  setUserQuery(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`
                }}
                placeholder='Ask a question about this playlist...'
                disabled={asking}
              />

              <button onClick={handleAskPlaylist} disabled={asking}>
                {asking && <span className='loader'></span>}
                {asking ? 'Thinking...' : 'Ask'}
              </button>
             </div>
             
          </section>
        </main>
      )}
    </div>
  );
}

export default App
