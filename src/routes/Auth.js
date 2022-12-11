import React from "react";
import {authService} from "../firebase.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from "firebase/auth";
import AuthForm from "../components/AuthForm.js";

const Auth = () => {
  const onGoogleLogIn = async () => {
    let provider;
    provider = new GoogleAuthProvider();
    await signInWithPopup(authService, provider);
  };
  const onGithubLogIn = async () => {
    let provider;
    provider = new GithubAuthProvider();
    await signInWithPopup(authService, provider);
  };

  return (
    <div className="auth-container">
      <AuthForm />
      <div className="social-button-container">
        <svg
          className="social-icon"
          onClick={onGoogleLogIn}
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Google"
          role="img"
          viewBox="0 0 512 512"
        >
          <rect width="512" height="512" rx="15%" fill="#fff" />
          <path
            fill="#4285f4"
            d="M386 400c45-42 65-112 53-179H260v74h102c-4 24-18 44-38 57z"
          />
          <path
            fill="#34a853"
            d="M90 341a192 192 0 0 0 296 59l-62-48c-53 35-141 22-171-60z"
          />
          <path
            fill="#fbbc02"
            d="M153 292c-8-25-8-48 0-73l-63-49c-23 46-30 111 0 171z"
          />
          <path
            fill="#ea4335"
            d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55z"
          />
        </svg>
        <svg
          className="social-icon"
          onClick={onGithubLogIn}
          xmlns="http://www.w3.org/2000/svg"
          aria-label="GitHub"
          role="img"
          viewBox="0 0 512 512"
        >
          <rect width="512" height="512" rx="15%" fill="#1B1817" />
          <path
            fill="#fff"
            d="M335 499c14 0 12 17 12 17H165s-2-17 12-17c13 0 16-6 16-12l-1-50c-71 16-86-28-86-28-12-30-28-37-28-37-24-16 1-16 1-16 26 2 40 26 40 26 22 39 59 28 74 22 2-17 9-28 16-35-57-6-116-28-116-126 0-28 10-51 26-69-3-6-11-32 3-67 0 0 21-7 70 26 42-12 86-12 128 0 49-33 70-26 70-26 14 35 6 61 3 67 16 18 26 41 26 69 0 98-60 120-117 126 10 8 18 24 18 48l-1 70c0 6 3 12 16 12z"
          />
        </svg>
      </div>
    </div>
  );
};
export default Auth;
