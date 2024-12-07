// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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

// ** SubmitSignUp Functionality **
document.getElementById("submitSignUp").addEventListener("click", async (event) => {
  event.preventDefault();

  const fname = document.getElementById("rFname").value.trim();
  const lname = document.getElementById("rLname").value.trim();
  const email = document.getElementById("rEmail").value.trim();
  const password = document.getElementById("rPassword").value.trim();

  if (!fname || !lname || !email || !password) {
    showMessage("Please fill out all fields.", "signUpMessage");
    return;
  }

  try {
    // Register the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user details in Firestore
    await setDoc(doc(db, "users", user.uid), {
      firstName: fname,
      lastName: lname,
      email: email,
      createdAt: new Date(),
    });

    showMessage("Registration successful! You can now log in.", "signUpMessage");
    document.getElementById("signUp").reset(); // Clear the form
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      showMessage("This email is already registered. Please log in.", "signUpMessage");
    } else if (error.code === "auth/weak-password") {
      showMessage("Password must be at least 6 characters.", "signUpMessage");
    } else {
      console.error(error);
      showMessage("Registration failed: " + error.message, "signUpMessage");
    }
  }
});

// ** SubmitSignIn Functionality **
document.getElementById("submitSignIn").addEventListener("click", async (event) => {
  event.preventDefault();

  const email = document.getElementById("signInEmail").value.trim();
  const password = document.getElementById("signInPassword").value.trim();

  if (!email || !password) {
    showMessage("Please fill out all fields.", "signInMessage");
    return;
  }

  try {
    // Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      // Redirect to the dashboard
      window.location.href = "dashboard.html";
    } else {
      showMessage("User not found in database. Please register first.", "signInMessage");
    }
  } catch (error) {
    if (error.code === "auth/wrong-password") {
      showMessage("Invalid password. Please try again.", "signInMessage");
    } else if (error.code === "auth/user-not-found") {
      showMessage("Email does not exist. Please register first.", "signInMessage");
    } else {
      console.error(error);
      showMessage("Login failed: " + error.message, "signInMessage");
    }
  }
});
