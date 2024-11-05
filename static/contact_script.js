// Show the login modal
function showLoginModal() {
    document.getElementById("loginModal").style.display = "block";
  }
  
  // Close the login modal
  function closeLoginModal() {
    document.getElementById("loginModal").style.display = "none";
  }
  
  // Close modal when clicking outside of it
  window.onclick = function (event) {
    const modal = document.getElementById("loginModal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

//Email Function
emailjs.init({ publicKey: "TNxXByXHi_TSiUtj_" });
document.getElementById("contact-form").addEventListener("submit", (event) => {
  // Prevent the default form submission
  event.preventDefault();

  let parms = {
    contact_name: document.getElementById("contact_name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  emailjs.send("service_0uo416r", "template_rqk459a", parms).then(
    () => {
      alert("Email Sent!"); // Success alert
    },
    function (error) {
      alert("Failed to send email. Please try again later."); // Error alert
      console.error("EmailJS Error:", error); // Log the error for debugging
    }
  );
});
