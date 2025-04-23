import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "/styles/auth.css";
import { AuthenticationDetails, CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// Cognito user pool data, in env
const poolData = {
    endpoint: import.meta.env.VITE_COGNITO_USER_POOL_ENDPOINT,
    UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};

const Authentication = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [statusMessage, setStatusMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedAuth = localStorage.getItem("isAuthenticated") === "true";
        setIsAuthenticated(storedAuth);
        if (storedAuth) {
            navigate("/search-page");
        }
    }, [navigate]);

    const authenticateUser = async (event) => {
        event.preventDefault();

        // Basic validation
        if (!username || !password) {
            setStatusMessage("Please enter both username and password");
            return;
        }

        setIsLoading(true);
        setStatusMessage("");

        const authenticationData = {
            Username: username,
            Password: password,
        };

        const authenticationDetails = new AuthenticationDetails(authenticationData);
        const userPool = new CognitoUserPool(poolData);
        const userData = {
            Username: username,
            Pool: userPool,
        };

        const cognitoUser = new CognitoUser(userData);
        if (import.meta.env.VITE_LOCAL) {
            // the cognito-local library only supports this auth flow
            cognitoUser.setAuthenticationFlowType("USER_PASSWORD_AUTH");
        }

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                console.log("Authentication successful");
                setIsLoading(false);
                setStatusMessage("Login successful!");
                setIsAuthenticated(true);

                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("idToken", result.getIdToken().getJwtToken());

                navigate("/search-page");
            },
            onFailure: (err) => {
                console.error("Authentication failed:", err);
                setIsLoading(false);
                setStatusMessage(err.message || "Authentication failed");
            },
            newPasswordRequired: (userAttributes, requiredAttributes) => {
                console.log("New password required:", userAttributes);
                setIsLoading(false);
                
                // Temporarily store the Cognito user and user attributes
                window.newPasswordCognitoUser = cognitoUser;
                window.userAttributes = userAttributes;
            
                // Redirect to the "Change Password" page
                navigate("/change-password");
            },
        });
    };

    return (
        <div className="login-container">
            {!isAuthenticated && (
                <form onSubmit={authenticateUser} className="login">
                    <h1>Mirrulations Login</h1>

                    {/* Username Field */}
                    <div className="form-group mt-3">
                        <label htmlFor="username" className="visually-hidden">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="form-group mt-3 position-relative">
                        <label htmlFor="password" className="visually-hidden">Password</label>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"} // Toggle input type based on state
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                            style={{
                                position: "absolute",
                                top: "50%",
                                right: "10px",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#6c757d",
                            }}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /> {/* Use Font Awesome icons */}
                        </span>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary w-100 mt-3"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>

                    {/* Status Message */}
                    {statusMessage && (
                        <p
                            id="login_status"
                            className={`mt-3 text-center ${statusMessage.includes("success") ? "text-success" : "text-danger"}`}
                        >
                            {statusMessage}
                        </p>
                    )}
                    
                    {/* Footer Attribution */}
                    <div className="footer mt-5 text-center">
                        <small className="text-muted">
                            <a href="https://www.flickr.com/photos/wallyg/3664385777">Washington DC - Capitol Hill: United States Capitol</a>
                            <span> by </span><a href="https://www.flickr.com/photos/wallyg/">Wally Gobetz</a>
                            <span> is licensed under </span><a href="https://creativecommons.org/licenses/by-nc-nd/2.0/">CC BY-NC-ND 2.0</a>
                        </small>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Authentication;