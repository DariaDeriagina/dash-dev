document
	.getElementById("contact-form")
	.addEventListener("submit", async function (event) {
		event.preventDefault(); // Prevent default form submission

		const form = event.target;
		const formData = new FormData(form);

		// Simple client-side validation
		if (
			!formData.get("name") ||
			!formData.get("email") ||
			!formData.get("message")
		) {
			alert("Please fill out all fields.");
			return;
		}

		// Add loading feedback
		const submitButton = form.querySelector("button");
		submitButton.disabled = true;
		submitButton.textContent = "Sending...";

		try {
			const response = await fetch(form.action, {
				method: form.method,
				body: formData,
				headers: {
					Accept: "application/json",
				},
			});

			if (response.ok) {
				alert("Thank you! Your message has been sent.");
				form.reset(); // Clear the form
			} else {
				alert("Oops! Something went wrong. Please try again later.");
				console.error("Formspree Error:", await response.json());
			}
		} catch (error) {
			alert(
				"There was a problem submitting your form. Please check your internet connection and try again."
			);
			console.error("Network Error:", error);
		} finally {
			// Restore button state
			submitButton.disabled = false;
			submitButton.textContent = "Submit now";
		}
	});
