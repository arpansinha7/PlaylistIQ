import { useRef } from "react";

function QuestionBox({
    userQuery,
    setUserQuery,
    asking,
    handleAskPlaylist
})
{
    

    const queryRef = useRef(null);

    const handleAsk = () => {
        handleAskPlaylist();

        if(queryRef.current)
        {
            queryRef.current.style.height = '48px';
        }
    };

    return (
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

            <button onClick={handleAsk} disabled={asking}>
                {asking && <span className='loader'></span>}
                {asking ? 'Thinking...' : 'Ask'}
            </button>
        </div>
    );
}

export default QuestionBox;