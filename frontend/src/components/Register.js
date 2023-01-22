import { useState } from "react";

function Register() {

    const [username, setUsername] = useState([]);
    const [email, setEmail] = useState([]);
    const [password, setPassword] = useState([]);
    const [error, setError] = useState([]);

    async function Register(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:3001/users", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });
        const data = await res.json();
        if (data._id !== undefined) {
            window.location.href = "/";
        }
        else {
            setUsername("");
            setEmail("");
            setPassword("");
            setError("Registration failed");
        }
    }

    return (
        <form id="register-form" onSubmit={Register}>
            <input type="text" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input type="text" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <input type="submit" name="submit" value="REGISTER"/>
            <label>{error}</label>
        </form>
    );
}

export default Register;