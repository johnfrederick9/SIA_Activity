function sendOTP() {
    const email = document.getElementById('Email');
    const otpverify = document.getElementsByClassName('otpverify')[0];

let otp_val = Math.floor(Math.random() * 10000);

let emailbody = `<h2>Your OTP is </h2>${otp_val}`;
Email.send({
    SecureToken : " 33e09ff1-676d-4ea2-bbcb-daf0fe85db81",
    To : email.value,
    From : "gelay.johnfrederick9@gmail.com",
    Subject : "Email OTP",
    Body : emailbody,
}).then(
  message => {
    if (message === "OK"){
        alert("OTP sent to your email "+email.value);

        otpverify.style.display = "flex";
        const otp_inp = document.getElementById('otp_inp');
        const itp_btn = document.getElementById('otp-btn');

        otp_btn.addEventListener('click', () => {
            if (otp_inp.value == otp_val) {
                alert("Email address verified...");
            }
            else {
                alert("Invalid OTP");
            }

        })
    }
  }
);
}