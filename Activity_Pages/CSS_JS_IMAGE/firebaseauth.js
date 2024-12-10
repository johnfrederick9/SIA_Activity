// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { httpsCallable } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-functions.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3tspF8Bk3NiHh8eD-yYvJwZM2DbgnijE",
  authDomain: "login-form-129dc.firebaseapp.com",
  projectId: "login-form-129dc",
  storageBucket: "login-form-129dc.appspot.com",
  messagingSenderId: "360964365086",
  appId: "1:360964365086:web:0306b4f0b6ecd2473bc70f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const sendOtpEmail = httpsCallable(app.functions(), 'sendOtpEmail');

// Helper function to display messages
function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ** Registration Functionality **
document.getElementById("submitSignUp").addEventListener("click", async (event) => {
  event.preventDefault();

  const fname = document.getElementById("rFname").value.trim();
  const lname = document.getElementById("rLname").value.trim();
  const email = document.getElementById("rEmail").value.trim();
  const password = document.getElementById("rPassword").value.trim();
  const cpassword = document.getElementById("rCPassword").value.trim();

  if (!fname || !lname || !email || !password || !cpassword) {
    showMessage("Please fill out all fields.", "signUpMessage");
    return;
  }

  if (!isValidEmail(email)) {
    showMessage("Invalid email format. Please enter a valid email.", "signUpMessage");
    return;
  }

  if (password !== cpassword) {
    showMessage("Passwords do not match. Please try again.", "signUpMessage");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      firstName: fname,
      lastName: lname,
      email: email,
      createdAt: new Date(),
    });

    showMessage("Registration successful! You can now log in.", "signUpMessage");
    window.location.href = "index.html";
  } catch (error) {
    const errorMessage =
      error.code === "auth/email-already-in-use"
        ? "This email is already registered. Please log in."
        : error.code === "auth/weak-password"
        ? "Password must be at least 6 characters."
        : "Registration failed: " + error.message;

    showMessage(errorMessage, "signUpMessage");
    console.error(error);
  }
});

// ** Login Functionality **
document.getElementById("submitSignIn").addEventListener("click", async (event) => {
  event.preventDefault();

  const email = document.getElementById("signInEmail").value.trim();
  const password = document.getElementById("signInPassword").value.trim();

  if (!email || !password) {
    showMessage("Please fill out all fields.", "signInMessage");
    return;
  }

  if (!isValidEmail(email)) {
    showMessage("Invalid email format. Please enter a valid email.", "signInMessage");
    return;
  }

  try {
    if (email === "Develo4" && password === "develo4@2024") {
      localStorage.setItem("isAdmin", "true");
      showMessage("Login successfully as an Admin.", "signInMessage");
      window.location.href = "admin.html";
      return;
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const otp = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit OTP

    try {
      await sendOtpEmail({ email: email, otp: otp });
      localStorage.setItem("otp", otp); // Store OTP locally
      showMessage("OTP sent to your email. Please verify.", "signInMessage");
      localStorage.setItem("loggedInUserId", user.uid);
      window.location.href = "otp.html";
    } catch (emailError) {
      console.error("Error sending OTP email:", emailError);
      showMessage("Failed to send OTP. Please try again.", "signInMessage");
    }
  } catch (error) {
    let errorMessage = "Login failed: " + error.message;

    switch (error.code) {
      case "auth/wrong-password":
        errorMessage = "Invalid password. Please try again.";
        break;
      case "auth/user-not-found":
        errorMessage = "Email does not exist. Please register first.";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email address format.";
        break;
      case "auth/too-many-requests":
        errorMessage = "Too many failed login attempts. Please try again later.";
        break;
      case "auth/network-request-failed":
        errorMessage = "Network error. Please check your connection.";
        break;
    }

    showMessage(errorMessage, "signInMessage");
    console.error(error);
  }
});
