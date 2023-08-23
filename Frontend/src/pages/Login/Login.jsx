import "./Login.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signin } from "../../state/user/saga";
import { userSelector } from "../../state/user/userSlice";
const PageLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, error } = useSelector(userSelector);
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(signin({ username, password }));
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, error]);
  return (
    <>
      <div className="loginpage-container">
        <div className="login-form-container">
          <form onSubmit={handleSubmit} className="login-form">
            <header className="login-title">
              <h1>Welcome to the Alternative Die Cutting Intranet</h1>
            </header>
            <input
              type="text"
              name="username"
              id="username"
              placeholder={"Username"}
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder={"Password"}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <button className="login-button" type="submit">
              Log In
            </button>
          </form>
          {error && (
            <div className="login-error">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { PageLogin };
