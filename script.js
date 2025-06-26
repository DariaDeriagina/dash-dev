function scrollToContact(e) {
	e.preventDefault();
	const target = document.getElementById("contact");
	const offset = 100;
	const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
	window.scrollTo({ top, behavior: "smooth" });
}
