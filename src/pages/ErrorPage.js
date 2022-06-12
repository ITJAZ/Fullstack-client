import React from "react";
/* 20220525 learnt from https://www.youtube.com/watch?v=UjHT_NKR_gU  */
import { useParams, Link } from "react-router-dom";

function ErrorPage() {
  const { param } = useParams();

  return (
    <div>
      <h1>Error! Page Not Found! {param}</h1>
      <h3>
        <Link to="/">return to Home</Link>
      </h3>
    </div>
  );
}

export default ErrorPage;
