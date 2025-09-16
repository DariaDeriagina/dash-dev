document.addEventListener("DOMContentLoaded", () => {
	const desktopText = "UX/UI & Web Designer | Developer";
	const mobileText = "UX/UI & Web Designer | Developer";

	const isMobile = window.matchMedia("(max-width: 768px)").matches;
	const targetId = isMobile ? "typed-text-mobile" : "typed-text-desktop";
	const text = isMobile ? mobileText : desktopText;

	const el = document.getElementById(targetId);
	const instaIcon = document.getElementById("insta-after-text");

	if (!el) return;

	// start clean in case of re-runs
	el.innerHTML = "";

	typeText(el, text).then(() => {
		// only reveal the Instagram icon on desktop where it's visible
		if (!isMobile && instaIcon) {
			instaIcon.style.display = "inline-block";
			requestAnimationFrame(() => instaIcon.classList.add("show"));
		}
	});
});

async function typeText(el, text) {
	for (let i = 0; i < text.length; i++) {
		el.innerHTML += text[i] === "\n" ? "<br>" : text[i];
		await delay(45);
	}
}

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
