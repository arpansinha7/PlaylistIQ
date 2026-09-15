import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "../services/AutheticateUser";
import { useNavigate } from "react-router-dom";

function Register()
{
    const [ showPassword, setShowPassword ] = useState(false);
    const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ firstName, setFirstName ] = useState('');
    const [ middleName, setMiddleName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ username, setUsername ] = useState('');
    const [ email, setEmail ] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if(password.length < 8)
        {
            alert("Password must be at least 8 characters long.");
            return;
        }

        if(password !== confirmPassword)
        {
            alert("Passwords do not match.");
            return;
        }

        try
        {
            await registerUser(
                username,
                password,
                email,
                firstName,
                middleName,
                lastName
            );

            navigate("/login");
            

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

                <h1>Create your account</h1>

                <p className="auth-subtitle">Register to start using PlaylistIQ</p>

                <form onSubmit={handleRegister}>

                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>

                        <input
                            id="firstName"
                            type="text"
                            placeholder="Enter your first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="middleName">Middle Name <span>(Optional)</span></label>

                        <input
                            id="middleName"
                            type="text"
                            placeholder="Enter your middle name"
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>

                        <input
                            id="lastName"
                            type="text"
                            placeholder="Enter your last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>

                        <input
                            id="username"
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>

                        <div className="password-input">

                            <input
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
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

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>

                        <div className="password-input">

                            <input
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Re-enter your password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>

                        </div>
                    </div>

                    <button type="submit" className="auth-btn">
                        Create Account
                    </button>

                </form>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <a href="/login">Login</a>
                </p>

            </div>

        </div>
    );
}

export default Register;