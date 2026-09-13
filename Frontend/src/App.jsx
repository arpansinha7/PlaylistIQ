import { useState } from 'react';
import { extractPlaylistId } from './utils/youtube';
import loadPlaylist from './services/playlistAPI';
import askPlaylist from './services/askPlaylist';

import Navbar from './components/navbar';
import PlaylistInput from './components/playlistInput';
import PlaylistSidebar from './components/playlistSideBar';
import Chat from './components/chat';
import QuestionBox from './components/QuestionBox';

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
  const [ messages, setMessages ] = useState([]);
  const [ darkMode, setDarkMode ] = useState(false);


  const availableVideos = videos.filter(video => video.available);
  const unavailableCount = videos.length - availableVideos.length;
  const visibleVideos = availableVideos.slice(0, visibleCount);

  const handleNewPlaylist = () => {

    setVideos([]);
    setPlaylistUrl('');
    setPlaylistId('');
    setUserQuery('');
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

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      { videos.length === 0 ? (

      <main className='entry-page'>

        <section className='hero'>

          <h1>Understand your YouTube playlists</h1>

          <p>
            Ask questions and get answers from the content inside your playlist.
          </p>

          <PlaylistInput
              playlistUrl={playlistUrl}
              setPlaylistUrl={setPlaylistUrl}
              handleLoadPlaylist={handleLoadPlaylist}
              loading={loading}
              error={error}
          />    
          
        </section>

      </main>

      ) : (

        <main className='workspace'>
          
          <PlaylistSidebar
            visibleVideos={visibleVideos}
            availableVideos={availableVideos}
            unavailableCount={unavailableCount}
            visibleCount={visibleCount}
            setVisibleCount={setVisibleCount}
            handleNewPlaylist={handleNewPlaylist}
           />

          <section className='qa'>

            <h2>Ask your playlist</h2>

            <Chat
                messages={messages}
            />    

            <QuestionBox
              userQuery={userQuery}
              setUserQuery={setUserQuery}
              asking={asking}
              handleAskPlaylist={handleAskPlaylist}
            />  

          </section>
        </main>
      )}
    </div>
  );
}

export default App
