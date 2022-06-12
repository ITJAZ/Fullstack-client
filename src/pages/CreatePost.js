import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      if (!authState.status) {
        navigate("/login");
        return;
      }
    })();
  }, [authState, navigate]);

  const initialValues = {
    title: "",
    text: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    text: Yup.string().required(),
  });

  const onSubmit = async (data) => {
    let response = await axios.post("http://localhost:8080/posts", data, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    });
    let post = response.data;
    navigate(`/post/${post.id}`);
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Title</label>
          <ErrorMessage name="title" component={"span"} />
          <Field
            id="inputCreatePost"
            name="title"
            placeholder="input your title..."
            autoComplete="off"
          />
          <label>Content</label>
          <ErrorMessage name="text" component={"span"} />
          <Field
            id="inputCreatePost"
            name="text"
            placeholder="input your content..."
            autoComplete="off"
          />
          <button type="submit">Create!</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
