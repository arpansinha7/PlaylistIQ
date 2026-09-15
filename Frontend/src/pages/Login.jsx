import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';

import { loginUser } from "../services/AutheticateUser";
import { useNavigate } from "react-router-dom";
function Login()
{
    const [ showPassword, setShowPassword ] = useState(false);
    const [ usernameOrEmail, setUsernameOrEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if(!usernameOrEmail.trim() || !password.trim())
        {
            alert("Please fill in all fields.");
            return;
        }

        try
        {
            await loginUser(usernameOrEmail, password);
            console.log("LOGIN SUCCESS");
            navigate("/app");
        }
        catch(error)
        {
            console.log(error);
            alert(error.message);
        }
    };
    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>Welcome Back</h1>

                <p className="auth-subtitle">
                    Login to continue to PlaylistIQ
                </p>

                <form onSubmit={handleLogin}>

                    <div className="form-group">
                        <label htmlFor="usernameOrEmail">
                            Username or Email
                        </label>

                        <input
                        id="usernameOrEmail"
                        type="text"
                        placeholder="Enter your username or email"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>
                    <div className="password-input">
                        <input 
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />

                        <button 
                        type="button" 
                        className="password-toggle"
                        onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                  </div>  
                    <button type="submit" className="auth-btn">
                        Login
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <a href="/register">Get Started</a>
                </p>
            </div>
        </div>
    );
}

export default Login;