import { useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";

const MainPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const onSubmit = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:5000/createUser", data);
  };

  const onLogin = () => {
    const data = { username: username, password: password };
    axios
      .post("http://localhost:5000/login", data)
      .then((res) => {
        const token = res.data.token;
        console.log(token);
        sessionStorage.setItem("token", token);
        navigate("/home");
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  return (
    <>
      <h1>Sign Up</h1>
      <label>
        Username:
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
      </label>
      <label>
        Password
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
      </label>
      <button onClick={() => onSubmit()}>Sign Up</button>
      <button onClick={() => onLogin()}>Login </button>
    </>
  );
};

export default MainPage;
