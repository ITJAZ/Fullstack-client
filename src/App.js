import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import { AuthContext } from "./helpers/AuthContext";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const defaultAuthState = {
    username: "",
    id: 0,
    status: false,
  };

  const [authState, setAuthState] = useState(defaultAuthState);

  useEffect(() => {
    (async () => {
      let response = await axios.get("http://localhost:8080/auth/auth", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      });

      let { data } = response;
      if (data.error)
        setAuthState({
          ...authState,
          status: false,
        });

      setAuthState({
        username: data.username,
        id: data.id,
        status: true,
      });
    })();
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState(defaultAuthState);
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
              <Link to="/">Home</Link>
              {!authState.status ? (
                <React.Fragment>
                  <Link to="/registration">Sign Up</Link>
                  <Link to="/login">Sign In</Link>
                </React.Fragment>
              ) : (
                <div className="loggedInContainer">
                  <h1>Hi! {authState.username}</h1>
                  <Link to="/createPost">Create A Post</Link>
                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          </div>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/createPost" exact element={<CreatePost />} />
            <Route path="/post/:id" exact element={<Post />} />
            <Route path="/registration" exact element={<Registration />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/changepassword" exact element={<ChangePassword />} />
            <Route path="/profile/:id" exact element={<Profile />} />
            {/* 20220525 learnt from https://www.youtube.com/watch?v=UjHT_NKR_gU */}
            <Route path="*" exact element={<ErrorPage />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
