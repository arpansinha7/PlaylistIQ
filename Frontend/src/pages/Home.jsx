import { Link } from "react-router-dom";

function Home()
{
    return (
        <div className="home-page">

            <header className="home-navbar">
                
               <h1 className="home-logo">PlaylistIQ</h1>

                <nav className="home-nav">
                    <Link to="/login" className="login-btn">Login</Link>
                    <Link to="/register" className="get-started-btn">Get Started</Link>
                </nav>
            </header>

            <main>

                <section className="home-hero">

                    <div className="hero-content">
                        <h1>Understand your YouTube playlists</h1>

                        <p>
                            Ask questions and get answers from the content inside your playlists.
                        </p>

                        <Link to="/register" className="hero-btn">Get Started</Link>
                    </div>
                </section>

                <section className="features">

                    <h2>What can PlaylistIQ do ?</h2>

                    <div className="feature-list">

                        <div className="feature">
                            <h3>Ask Questions</h3>
                            <p>Ask questions about the content in your playlist.</p>
                        </div>

                        <div className="feature">
                            <h3>Learn Faster</h3>
                            <p>Understand concepts without manually searching through every video.</p>
                        </div>

                        <div className="feature">
                            <h3>Find Sources</h3>
                            <p>Jump directly to the relevant parts of the videos.</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Home;