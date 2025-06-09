document.addEventListener("DOMContentLoaded", () => {
	const desktopText = "UX/UI & Web Designer | Photographer";
	const mobileText = "UX/UI & Web Designer\nPhotographer";

	// Detect screen size
	if (window.innerWidth <= 768) {
		typeText("typed-text-mobile", mobileText);
	} else {
		typeText("typed-text-desktop", desktopText);
	}
});

function typeText(id, text) {
	const el = document.getElementById(id);
	let i = 0;
	function type() {
		if (i < text.length) {
			const char = text[i] === "\n" ? "<br>" : text[i];
			el.innerHTML += char;
			i++;
			setTimeout(type, 50);
		}
	}
	type();
}
