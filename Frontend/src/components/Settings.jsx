function Settings({ onClose, darkMode, setDarkMode })
{

    return (

        <div className="settings-overlay">
            <div className="settings">

                <button
                    className="settings-close"
                    onClick={onClose}
                >
                    ×
                </button>

                <h2>Settings</h2>
                <div className="settings-section">
                    <h3>Appearance</h3>

                    <div className="theme-row">
                        <span>Theme</span>

                        <button
                        className={`theme-toggle ${darkMode ? 'active' : ''}`}
                        onClick={() => setDarkMode(!darkMode)}
                        >
                            <span className="theme-toggle-knob"></span>
                        </button>
                    </div>
                </div>    
            </div>
        </div>




    );
}

export default Settings;
