// Import the Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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

// Log In Event Listener
document.getElementById("signIn").addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const username = document.querySelector("input[name='username']").value.trim();
  const password = document.querySelector("input[name='password']").value.trim();

  if (!username || !password) {
    showMessage("Please fill out all fields.", "signInMessage");
    return;
  }

  try {
    // Sign in user
    const userCredential = await signInWithEmailAndPassword(auth, username, password);
    showMessage("Login Successful!", "signInMessage");
    window.location.href = "dashboard.html"; // Redirect to a dashboard or home page
  } catch (error) {
    console.error(error);
    showMessage("Login Failed: " + error.message, "signInMessage");
  }
});

// Register Event Listener
document.getElementById("submitSignUp").addEventListener("click", async (event) => {
  event.preventDefault();

  const firstName = document.getElementById("rFname").value.trim();
  const lastName = document.getElementById("rLname").value.trim();
  const email = document.getElementById("rEmail").value.trim();
  const password = document.getElementById("rPassword").value.trim();
  const confirmPassword = document.querySelector("input[name='passwordConfirm']").value.trim();

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    showMessage("Please fill out all fields.", "signUpMessage");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("Passwords do not match.", "signUpMessage");
    return;
  }

  try {
    // Create a new user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user to Firestore
    const userDoc = doc(db, "users", user.uid);
    await setDoc(userDoc, {
      firstName,
      lastName,
      email,
    });

    showMessage("Account Created Successfully!", "signUpMessage");
    window.location.href = "index.html"; // Redirect on success
  } catch (error) {
    console.error(error);
    showMessage("Registration Failed: " + error.message, "signUpMessage");
  }
});
