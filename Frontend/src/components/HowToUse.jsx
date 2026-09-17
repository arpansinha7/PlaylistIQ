function HowToUse({ onClose })
{
    return (
        <div className="how-to-use-overlay">
            <div className="how-to-use">

                <button
                    className="how-to-use-close"
                    onClick={onClose}
                >
                    ×
                </button>

                <h2>How to Use PlaylistIQ</h2>

                <div className="how-to-use-steps">

                    <div className="how-to-use-step">
                        <h3>1. Paste a YouTube playlist</h3>
                        <p>
                            Enter the URL of the playlist you want to explore.
                        </p>
                    </div>

                    <div className="how-to-use-step">
                        <h3>2. Load the playlist</h3>
                        <p>
                            PlaylistIQ fetches the videos and prepares their
                            content for analysis.
                        </p>
                    </div>

                    <div className="how-to-use-step">
                        <h3>3. Ask questions</h3>
                        <p>
                            Ask questions about the videos and their content
                            using the chat.
                        </p>
                    </div>

                    <div className="how-to-use-step">
                        <h3>4. Explore the playlist</h3>
                        <p>
                            Browse the videos using the playlist panel.
                        </p>
                    </div>

                    <div className="how-to-use-step">
                        <h3>5. Use the timeline</h3>
                        <p>
                            Jump directly to relevant points in a video when
                            timeline information is available.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HowToUse;