import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';

function Registration() {
  let navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  const onSubmit = async data => {
    let response = await axios.post("http://localhost:8080/auth/registration", data);
    console.log(response);
    navigate("/");
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>User Name</label>
          <ErrorMessage name="username" component={"span"} />
          <Field
            id="inputCreatePost"
            name="username"
            placeholder="who are you..."
            autoComplete="off"
          />
          <label>Password</label>
          <ErrorMessage name="password" component={"span"} />
          <Field
            type="password"
            id="inputCreatePost"
            name="password"
            placeholder="*****"
            autoComplete="off"
          />
          <button type="submit">Sign up</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;
