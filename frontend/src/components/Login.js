import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Login() {

    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [error, setError] = useState([]);
    const userContext = useContext(UserContext);

    async function Login(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:3001/users/login", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await res.json();
        //console.log(data)

        // if the JWT token isn't undefined, then the user is logged in
        if (data.accessToken !== undefined) {
            userContext.setUserContext(data);
            window.location.href = "/";
        }
        else {
            setUsername("");
            setPassword("");
            setError("Invalid username or password");
        }
    }

    return (
        <form  id="login-form" onSubmit={Login}>
            { UserContext.user ? <Navigate replace to = "/"/> : "" }
            <input type="text" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <input type="submit" name="submit" value="LOGIN"/>
            <label>{error}</label>            
        </form>
    );
}

export default Login;