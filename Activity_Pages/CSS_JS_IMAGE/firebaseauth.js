// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to send OTP to email
async function sendOtp(email) {
  const otp = Math.floor(10000 + Math.random() * 90000); // 5-digit OTP
  localStorage.setItem("otp", otp); // Store OTP locally for verification
  document.getElementById("debugOtp").value = otp; // For debugging (optional)

  const emailBody = `<h2>Your OTP is:</h2><p>${otp}</p>`;
  try {
    await Email.send({
      SecureToken: "28dbde91-db49-4087-893a-b87af7c2e761",
      To: email,
      From: "gelayjohnfrederick0@gmail.com",
      Subject: "Your OTP Verification Code",
      Body: emailBody,
    });
    console.log(`OTP email sent successfully to: ${email}`);
    return true; // OTP sent successfully
  } catch (emailError) {
    console.error("Failed to send OTP:", emailError);
    return false; // OTP sending failed
  }
}

// ** Registration Functionality **
document.getElementById("submitSignUp").addEventListener("click", async (event) => {
  event.preventDefault();

  const fname = document.getElementById("rFname").value.trim();
  const lname = document.getElementById("rLname").value.trim();
  const email = document.getElementById("rEmail").value.trim();
  const password = document.getElementById("rPassword").value.trim();
  const cpassword = document.getElementById("rCPassword").value.trim();

  // Check if any field is empty
  if (!fname || !lname || !email || !password || !cpassword) {
    showMessage("Please fill out all fields.", "signUpMessage");
    return;
  }

  // Validate email format
  if (!isValidEmail(email)) {
    showMessage("Invalid email format. Please enter a valid email.", "signUpMessage");
    return;
  }

  // Check if password and confirm password match
  if (password !== cpassword) {
    showMessage("Passwords do not match. Please try again.", "signUpMessage");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user details in Firestore
    await setDoc(doc(db, "users", user.uid), {
      firstName: fname,
      lastName: lname,
      email: email,
      createdAt: new Date(),
    });

    // Send OTP to email
    const otpSent = await sendOtp(email);
    if (otpSent) {
      showMessage("Registration successful! OTP sent to your email.", "signUpMessage");
      window.location.href = "otp.html"; // Redirect to OTP page
    } else {
      showMessage("Failed to send OTP. Please try again.", "signUpMessage");
    }
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

  // Validate email format
  if (!isValidEmail(email)) {
    showMessage("Invalid email format. Please enter a valid email.", "signInMessage");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send OTP to email
    let otpSent = await sendOtp(email);
    if (!otpSent) {
      showMessage("Retrying to send OTP...", "signInMessage");
      otpSent = await sendOtp(email); // Retry sending OTP
    }

    if (otpSent) {
      showMessage("OTP sent to your email. Please verify.", "signInMessage");
      window.location.href = "otp.html"; // Redirect on success
    } else {
      showMessage("Failed to send OTP after multiple attempts. Please try again.", "signInMessage");
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

    console.error("Login error:", error);
    showMessage(errorMessage, "signInMessage");
  }
});
