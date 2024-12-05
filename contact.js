document
	.getElementById("contact-form")
	.addEventListener("submit", function (event) {
		event.preventDefault(); // Prevent default form submission

		// Collect form data
		const name = document.getElementById("name").value;
		const email = document.getElementById("email").value;
		const message = document.getElementById("message").value;

		// Validate form data (optional)
		if (!name || !email || !message) {
			alert("Please fill out all fields.");
			return;
		}

		// Send email using EmailJS
		emailjs
			.send("service_uyl05bh", "template_avjtt6u", {
				to_name: "Dasha",
				from_name: name,
				from_email: email,
				message: message,
			})
			.then(
				function (response) {
					alert("Thank you! Your message has been sent.");
					document.getElementById("contact-form").reset(); // Reset form
				},
				function (error) {
					alert("Oops! Something went wrong. Please try again.");
					console.error("EmailJS Error:", error);
				}
			);
	});
