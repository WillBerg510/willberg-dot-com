import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminAPI from "../api/AdminAPI.js";

const Login = () => {
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const changePassword = (e) => {
    setPassword(e.target.value);
  }

  const inputKeyDown = (e) => {
    if (e.key === "Enter") {
      login();
    }
  }

  const login = () => {
    adminAPI.login(password).then(res => {
      localStorage.setItem("auth_token", res.data.token);
      navigate('/');
    });
  }

  return (
    <>
      <h2>Login</h2>
      <input type="password" onChange={changePassword} value={password} onKeyDown={inputKeyDown}/>
      <button onClick={login}>Log In</button>
    </>
  )
}

export default Login