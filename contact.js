document
	.getElementById("contact-form")
	.addEventListener("submit", async function (event) {
		event.preventDefault(); // Prevent default

		const form = event.target;
		const formData = new FormData(form);

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
				alert("Oops! Something went wrong. Please try again.");
			}
		} catch (error) {
			alert("There was a problem submitting your form. Please try again.");
			console.error("Error:", error);
		}
	});
