import ReactMarkdown from "react-markdown";
import { timestampToSeconds } from "../utils/youtube";
import { useEffect, useRef } from "react";

function Chat({messages})
{
    const chatRef = useRef(null);

    useEffect(() => {
        if(chatRef.current)
        {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);
    
    return (
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
    );
}

export default Chat;
