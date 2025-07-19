document.addEventListener("DOMContentLoaded", () => {
	// Smooth scroll to #contact with offset
	function scrollToContact(e) {
		e.preventDefault();
		const target = document.getElementById("contact");
		const offset = 100;
		const top =
			target.getBoundingClientRect().top + window.pageYOffset - offset;
		window.scrollTo({ top, behavior: "smooth" });
	}

	// Attach to link with href="#contact"
	const contactLink = document.querySelector('a[href="#contact"]');
	if (contactLink) {
		contactLink.addEventListener("click", scrollToContact);
	}

	// Close mobile navbar on scroll
	window.addEventListener("scroll", () => {
		const navCollapse = document.querySelector(".navbar-collapse");
		const navbarToggler = document.querySelector(".navbar-toggler");

		if (
			navCollapse &&
			navCollapse.classList.contains("show") &&
			getComputedStyle(navbarToggler).display !== "none"
		) {
			navbarToggler.click();
		}
	});
});
