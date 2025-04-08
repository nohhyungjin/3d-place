// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js"; // 🔐 export 된 config 가져오기

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth 설정
const auth = getAuth();

// Email 회원가입
export const signupEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Email 로그인
export const loginEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};
