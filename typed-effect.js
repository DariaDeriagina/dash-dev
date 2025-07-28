document.addEventListener("DOMContentLoaded", () => {
	const desktopText = "UX/UI & Web Designer | Developer";
	const mobileText = "UX/UI & Web Designer\nDeveloper";

	const isMobile = window.innerWidth <= 768;
	const targetId = isMobile ? "typed-text-mobile" : "typed-text-desktop";
	const text = isMobile ? mobileText : desktopText;

	const el = document.getElementById(targetId);
	const instaIcon = document.getElementById("insta-after-text");

	if (el) {
		typeText(el, text, instaIcon);
	}
});

async function typeText(el, text, instaIcon) {
	for (let i = 0; i < text.length; i++) {
		const char = text[i] === "\n" ? "<br>" : text[i];
		el.innerHTML += char;
		await delay(50);
	}

	// Show Instagram icon after text typing
	if (instaIcon) {
		instaIcon.style.display = "inline-block";
		await delay(50);
		instaIcon.classList.add("show");
	}
}

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
