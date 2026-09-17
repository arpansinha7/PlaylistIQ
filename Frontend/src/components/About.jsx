function About({ onClose })
{
    return (
        <div className="about-overlay">
            <div className="about">

                <button
                    className="about-close"
                    onClick={onClose}
                >
                    ×
                </button>

                <h2>About PlaylistIQ</h2>

                <p>
                    PlaylistIQ is an AI-powered tool that lets you explore
                    and ask questions about the content of a YouTube playlist.
                </p>

                <div className="about-section">
                    <h3>What it does</h3>
                    <p>
                        Load a YouTube playlist, explore its videos, and use
                        AI to ask questions about the playlist content.
                    </p>
                </div>

                <div className="about-section">
                    <h3>Version</h3>
                    <p>PlaylistIQ v1.0</p>
                </div>

            </div>
        </div>
    );
}

export default About;