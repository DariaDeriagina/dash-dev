// Initialize EmailJS
(function () {
	emailjs.init("fhWNTia2q7mX6J6cl"); // Replace with your EmailJS Public Key
})();

// Handle Form Submission
document
	.getElementById("contact-form")
	.addEventListener("submit", function (event) {
		event.preventDefault(); // Prevent default form submission

		// Get form data
		const name = document.getElementById("name").value;
		const email = document.getElementById("email").value;
		const message = document.getElementById("message").value;

		// Simple validation
		if (!name || !email || !message) {
			alert("Please fill out all fields.");
			return;
		}

		// EmailJS send function
		emailjs
			.send("service_8zmvq2i", "template_tjlj9ef", {
				to_name: "Dasha",
				from_name: name,
				from_email: email,
				message: message,
			})
			.then(
				function (response) {
					alert("Thank you! Your message has been sent.");
					document.getElementById("contact-form").reset(); // Clear form
				},
				function (error) {
					alert("Oops! Something went wrong. Please try again.");
					console.error("EmailJS Error:", error);
				}
			);
	});
