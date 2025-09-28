import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; 
import "./index.css";

const ADMIN_USERNAME = "rutherQuince@kontra.com";
const ADMIN_PASSWORD = "LambKing@57901";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false); 

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            localStorage.setItem("currentUser", JSON.stringify({ username }));
            navigate("/email"); 
        } else {
            setError("Invalid username or password!");
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <h2 className="admin-login-title">Admin Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="admin-login-input"
                    />

                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="admin-login-input"
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>

                    <button type="submit" className="admin-login-btn">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
