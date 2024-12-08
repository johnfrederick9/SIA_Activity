// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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
const db = getFirestore(app);

// Fetch and display users
async function fetchUsers() {
  try {
    const usersCollection = collection(db, "users");
    const userDocs = await getDocs(usersCollection);
    const tableBody = document.querySelector(".table tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    userDocs.forEach((doc) => {
      const userData = doc.data();
      const row = `<tr>
                    <td>${doc.id}</td>
                    <td>${userData.firstName} ${userData.lastName}</td>
                    <td>${userData.email}</td>
                    <td>${userData.role || "User"}</td>
                   </tr>`;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("Error fetching users: ", error);
  }
}

// Fetch users on page load
document.addEventListener("DOMContentLoaded", fetchUsers);

// ** Admin Logout Functionality **
document.getElementById("adminLogoutButton")?.addEventListener("click", () => {
  localStorage.removeItem("isAdmin");
  window.location.href = "index.html"; // Redirect to login page
});
