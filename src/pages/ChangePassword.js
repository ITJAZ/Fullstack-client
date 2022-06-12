import axios from "axios";
import React, { useState } from "react";

function ChangePassword() {
  const [oriPassword, setOriPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const submitChange = async () => {
    try {
      let response = await axios.put(
        "http://localhost:8080/auth/password",
        { oriPassword, newPassword },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      );
      let updateCount = response.data;
      if(updateCount > 0){
        alert('Password changed successfully, will be active in the next login')
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div>
      <h1>Change your password</h1>
      <input
        type="text"
        placeholder="Original Password.."
        onChange={(e) => {
          setOriPassword(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="New Password.."
        onChange={(e) => {
          setNewPassword(e.target.value);
        }}
      />
      <button onClick={() => submitChange()}>Submit</button>
    </div>
  );
}

export default ChangePassword;
