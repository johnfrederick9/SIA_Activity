document.addEventListener("DOMContentLoaded", () => {
    const signInBtn = document.getElementById("sign-in-btn");
    const signUpBtn = document.getElementById("sign-up-btn");
    const container = document.querySelector(".container");
  
    // Toggle forms
    signUpBtn.addEventListener("click", () => {
      container.classList.add("sign-up-mode");
    });
  
    signInBtn.addEventListener("click", () => {
      container.classList.remove("sign-up-mode");
    });
  
    // Utility function to display alert messages
    function showAlert(message, targetForm, isSuccess) {
      const alertBox = targetForm.querySelector(".alert-box");
      alertBox.textContent = message;
      alertBox.style.color = isSuccess ? "#4caf50" : "#ff4d4d"; // Green for success, red for error
      alertBox.style.opacity = "1";
      alertBox.style.transform = "translateY(0)";
      setTimeout(() => {
        alertBox.style.opacity = "0";
        alertBox.style.transform = "translateY(-10px)";
      }, 3000); // Hide alert after 3 seconds
    }
  
    // Login form validation
    const loginForm = document.querySelector(".sign-in-form");
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = loginForm.querySelector("input[name='username']").value.trim();
      const password = loginForm.querySelector("input[name='password']").value.trim();
  
      if (!username || !password) {
        showAlert("Please fill in both username and password.", loginForm, false);
      } else {
        showAlert("Logging in successfully...", loginForm, true);
        // Here you can send the data to the server for validation.
      }
    });
  
    // Register form validation
    const registerForm = document.querySelector(".sign-up-form");
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = registerForm.querySelector("input[name='username']").value.trim();
      const email = registerForm.querySelector("input[name='email']").value.trim();
      const password = registerForm.querySelector("input[name='password']").value.trim();
      const passwordConfirm = registerForm.querySelector("input[name='passwordConfirm']").value.trim();
  
      if (!username || !email || !password || !passwordConfirm) {
        showAlert("Please fill in all fields.", registerForm, false);
      } else if (!validateEmail(email)) {
        showAlert("Please enter a valid email address.", registerForm, false);
      } else if (password !== passwordConfirm) {
        showAlert("Passwords do not match.", registerForm, false);
      } else {
        showAlert("Registration successful!", registerForm, true);
        // Here you can send the data to the server for registration.
      }
    });
  
    // Email validation function
    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    }
  });
  