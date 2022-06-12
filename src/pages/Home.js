import React, { useContext } from "react";
import axios from "axios";
//destructoring
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

function Home() {
  const [postList, setPostList] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  //useEffect is like document.ready with jQuery I guess...
  useEffect(() => {
    (async () => {
      if (!authState.status) {
        navigate("/login");
        return;
      }

      let response = await axios.get("http://localhost:8080/posts/", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });
      setPostList(response.data.listOfPost);
      setLikedPosts(response.data.likedPosts.map((like) => like.PostId));
    })();
  }, [navigate, authState]);

  const likeAPost = async (postId) => {
    let response = await axios.post(
      "http://localhost:8080/like/",
      {
        PostId: postId,
      },
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }
    );
    let { likeStatus, like } = response.data;
    setPostList(
      postList.map((post) => {
        if (post.id !== postId) return post;

        //取出現有的post Like list
        let _likes = post.Likes;

        //如果此次行為是dislike
        if (likeStatus === false) {
          //like list就只留不同ID的like
          _likes = _likes.filter((_like) => _like.id !== like.id);
          return { ...post, Likes: _likes };
        }

        //如果此次行為是like
        //用複雜的destructruing來加入新的like entity到like list...
        return { ...post, Likes: [...post.Likes, like] };
      })
    );

    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((_postId) => postId !== _postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  return (
    <React.Fragment>
      {postList.map((obj, key) => (
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
            <div className="username">
              <Link to={`/profile/${obj.UserId}`}>{obj.username}</Link>
            </div>
            <div className="buttons">
              {likedPosts.includes(obj.id) ? (
                <ThumbUpAltIcon onClick={() => likeAPost(obj.id)} />
              ) : (
                <ThumbUpOffAltIcon onClick={() => likeAPost(obj.id)} />
              )}
              <label>{obj.Likes.length}</label>
            </div>
          </div>
        </div>
      ))}
    </React.Fragment>
  );
}

export default Home;
