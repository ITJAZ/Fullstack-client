import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
  let { id } = useParams();
  let [user, setUser] = useState([]);
  let [listOfPosts, setPostList] = useState([]);
  let navigate = useNavigate();
  let { authState } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      let response = await axios.get(`http://localhost:8080/auth/info/${id}`);
      setUser(response.data);

      response = await axios.get(`http://localhost:8080/posts/by/user/${id}`);
      setPostList(response.data);
    })();
  }, []);

  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        <h1>User Name:{user.username}</h1>
        {authState.username === user.username && (
          <button
            onClick={() => {
              navigate("/changepassword");
            }}
          >
            Change Password
          </button>
        )}
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((obj, key) => (
          <div className="post" key={key}>
            <div
              className="title"
              onClick={() => {
                navigate(`/post/${obj.id}`);
              }}
            >
              {obj.title}
            </div>
            <div className="body">{obj.text}</div>
            <div className="footer">
              <div className="username">{obj.username}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
