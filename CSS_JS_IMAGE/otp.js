document.getElementById("submitSignUp").addEventListener("click", (event) => {
    event.preventDefault();
  
    const email = document.getElementById("rEmail").value.trim();
  
    if (!email) {
      alert("Please enter your email.");
      return;
    }
  
    // Generate and send OTP
    const otp_val = Math.floor(1000 + Math.random() * 9000);
    const emailBody = `<h2>Your OTP is </h2>${otp_val}`;
  
    Email.send({
      SecureToken: "623dfa6f-a53e-411d-b72c-c5c518261af7",
      To: email,
      From: "gelay.johnfrederick9@gmail.com",
      Subject: "Email OTP",
      Body: emailBody,
    }).then((message) => {
      if (message === "OK") {
        alert(`OTP sent to ${email}.`);
        document.getElementById("otpSection").style.display = "block";
  
        // Save OTP for verification
        localStorage.setItem("currentOtp", otp_val);
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    });
  });
  
  document.getElementById("verifyOtpBtn").addEventListener("click", () => {
    const enteredOtp = document.getElementById("otpInput").value.trim();
    const currentOtp = localStorage.getItem("currentOtp");
  
    if (enteredOtp === currentOtp) {
      alert("OTP verified successfully!");
      localStorage.removeItem("currentOtp");
  
      // Proceed with registration
      document.getElementById("otpSection").style.display = "none";
      document.getElementById("submitSignUp").dataset.otpVerified = "true";
    } else {
      alert("Invalid OTP. Please try again.");
    }
  });
  