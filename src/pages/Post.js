import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

import DeleteIcon from "@mui/icons-material/Delete";

function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({});
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      let postResponse = await axios.get(`http://localhost:8080/posts/${id}`);
      setPost(postResponse.data);

      let commentResponse = await axios.get(
        `http://localhost:8080/comments/${id}`
      );
      setCommentList(commentResponse.data);
    })();
  }, [id]);

  const addComment = async () => {
    let response = await axios.post(
      "http://localhost:8080/comments",
      {
        PostId: id,
        commentText: newComment,
      },
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }
    );

    let { data } = response;

    if (data.error) return console.error(data.error);

    let commentToAdd = {
      commentText: newComment,
      username: data.username,
      id: data.id,
    };
    setCommentList([...commentList, commentToAdd]);
    setNewComment("");
  };

  const deleteComment = async (id = -1) => {
    await axios.delete(`http://localhost:8080/comments/${id}`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    });
    setCommentList(commentList.filter((comment) => id !== comment.id));
    alert("comment deleted");
  };

  const deletePost = async (id = -1) => {
    await axios.delete(`http://localhost:8080/posts/${id}`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    });
    navigate("/");
  };

  const editPost = async (target) => {
    let url = `http://localhost:8080/posts/${target}`;
    let content = prompt(`Please enter your new ${target} here`);

    if (content === null || content.length === 0) return;

    let response = await axios.put(
      url,
      { id, content },
      { headers: { accessToken: localStorage.getItem("accessToken") } }
    );

    let newPostObj = { ...post };
    newPostObj[target] = content
    setPost(newPostObj);
  };

  let userItSelf = authState.username === post.username;

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              if (userItSelf) editPost("title");
            }}
          >
            {post.title}
          </div>
          <div
            className="body"
            onClick={() => {
              if (userItSelf) editPost("text");
            }}
          >
            {post.text}
          </div>
          <div className="footer">
            {post.username}
            {authState.username === post.username ? (
              <DeleteIcon onClick={() => deletePost(post.id)} />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="listOfComments">
          {commentList.map((comment, key) => {
            return (
              <React.Fragment key={key}>
                <div className="comment">{comment.commentText}</div>
                <label>by {comment.username}</label>
                {authState.username === comment.username ? (
                  <span onClick={() => deleteComment(comment.id)}>&times;</span>
                ) : (
                  <></>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="comment on this post..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
          />
          <button type="button" onClick={addComment.bind(this)}>
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}

export default Post;
