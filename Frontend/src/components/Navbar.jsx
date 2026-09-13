function Navbar({darkMode, setDarkMode})
{
    return (
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
    );
}

export default Navbar;