import { useState } from "react";

import Settings from "./Settings";
import { useNavigate } from "react-router-dom";
import HowToUse from "./HowToUse";
import About from "./About";
import logo from '../assets/logo.svg';

function Navbar({darkMode, setDarkMode})
{

    const [ menuOpen, setMenuOpen ] = useState(false);
    const [ settingsOpen, setSettingsOpen ] = useState(false);
    const [ howToUseOpen, setHowToUseOpen ] = useState(false);
    const [ aboutOpen, setAboutOpen ] = useState(false);
    
    const navigate = useNavigate();

    return (
    <nav className='navbar'>
        <div className='brand'>
            <img className="logo" src={logo} alt="PlaylistIQ" />
            <span>PlaylistIQ</span>
        </div>

        <div className='nav-actions'>
            <button 
            className='mode-button'
            onClick={() => setDarkMode(!darkMode)}
            >
                
                {darkMode ? '☀' : '☾'}
            
            </button>

            <button className='menu-button'
            onClick={() => setMenuOpen(!menuOpen)}
            >
            ☰
            </button>
        </div>

        {menuOpen && (
            <div className="menu-dropdown">
                <div className="menu-divider"></div>
                
                <button
                onClick={()=> {
                    setSettingsOpen(true)
                    setMenuOpen(false)
                }}
                >
                    Settings
                </button>

                <button onClick={() => {
                    setHowToUseOpen(true);
                    setMenuOpen(false);
                }}>
                    How to use
                </button>

                
                <button onClick={() => {
                    setAboutOpen(true);
                    setMenuOpen(false);
                }}>
                    About PlaylistIQ
                </button>

                <div className="menu-divider"></div>

                <button onClick={() => navigate("/login")}>Logout</button>
            </div>
        )}

        {settingsOpen && (
            <Settings
                onClose={() => setSettingsOpen(false)}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
            />
        )}
        
        {howToUseOpen && (
        <HowToUse
        onClose={() => setHowToUseOpen(false)}
        />
        )}

        {aboutOpen && (
        <About
        onClose={() => setAboutOpen(false)}
        />
        )}
        
</nav>
    );
}

export default Navbar;