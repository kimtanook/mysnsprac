import React, {useState} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {authService} from "../firebase";
import logo from "../images/logo.png";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const {
      target: {name, value}, // event.target.name 과 event.target.value와 같다.
    } = event;
    if (name === "email") {
      // name은 event.target.name과 같다.
      setEmail(value);
      // value은 event.target.value와 같다.
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!newAccount === true) {
        await createUserWithEmailAndPassword(authService, email, password);
        alert("회원가입 완료!");
      } else {
        await signInWithEmailAndPassword(authService, email, password);
      }
    } catch (error) {
      if (
        error.message === "Firebase: Error (auth/wrong-password)." ||
        error.message === "Firebase: Error (auth/user-not-found)."
      ) {
        setError(alert("아이디 또는 비밀번호를 확인해주세요."));
      } else if (
        error.message === "Firebase: Error (auth/email-already-in-use)."
      ) {
        setError(alert("이미  사용중인 아이디 입니다."));
      } else if (
        error.message ===
        "Firebase: Password should be at least 6 characters (auth/weak-password)."
      ) {
        setError(alert("비밀번호가 여섯글자 이상인지 확인해주세요."));
      } else if (error.message === "Firebase: Error (auth/invalid-email).") {
        setError(alert("이메일 형식이 맞는지 확인해주세요."));
      }
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <div className="auth-form-container">
      <div className="auth-title">
        <img src={logo} />
      </div>
      <form className="auth-form" onSubmit={onSubmit}>
        <div>
          <input
            className="input-form"
            name="email"
            type="text"
            placeholder="Email"
            required
            value={email}
            onChange={onChange}
          />
        </div>
        <div>
          <input
            className="input-form"
            name="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={onChange}
          />
        </div>
        <input
          className="submit-button"
          type="submit"
          value={!newAccount ? "Create Account" : "Log In"}
        />

        {error}
      </form>
      <div className="toggle-button" onClick={toggleAccount}>
        {!newAccount ? "Go to Login" : "Go to sign up"}
      </div>
    </div>
  );
};

export default AuthForm;
