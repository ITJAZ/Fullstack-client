import axios from "axios";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../helpers/AuthContext'

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  const login = async () => {
    let response = await axios.post("http://localhost:8080/auth/login", {
      username,
      password,
    });

    let { data } = response;
    if (data.error) return alert(response.data.error);
    localStorage.setItem("accessToken", data.token);
    setAuthState({
      username: data.username, id: data.id, status: true
    });
    navigate("/");
  };

  return (
    <div className="loginContainer">
      <label>User name</label>
      <input
        type="text"
        onChange={(event) => setUsername(event.target.value)}
      />
      <label>Password</label>
      <input
        type="password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type="button" onClick={login.bind(this)}>
        Sign in
      </button>
    </div>
  );
}

export default Login;
