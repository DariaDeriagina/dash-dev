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
// === Green Circles sparkle — add to script.js ===
document.addEventListener("DOMContentLoaded", () => {
	// Find note titles and wrap just "Green Circles"
	const titles = document.querySelectorAll(".note-card .note-title a");

	titles.forEach((a) => {
		const text = a.innerHTML;
		const hasTarget =
			/Green\s+Circles/i.test(text) ||
			(a.href && a.href.includes("insight-lighthouse"));

		if (hasTarget && !a.querySelector(".green-circles")) {
			a.innerHTML = text.replace(
				/(Green\s+Circles)/i,
				'<span class="green-circles">$1</span>'
			);

			// (Optional) also tint the tag line on this same card to match Lighthouse green
			const card = a.closest(".note-card");
			const tags = card?.querySelector(".note-tags");
			if (tags) tags.classList.add("lh-tags");
		}
	});
});
(() => {
	const grid = document.querySelector(".wf-grid");
	const dlg = document.querySelector(".wf-lightbox");
	const img = document.getElementById("wf-full");
	const cap = document.getElementById("wf-caption");
	const closeBtn = dlg?.querySelector(".wf-close");

	if (!grid || !dlg) return;

	grid.addEventListener("click", (e) => {
		const btn = e.target.closest(".wf-card");
		if (!btn) return;

		const full = btn.getAttribute("data-full");
		const imageEl = btn.querySelector("img");
		const alt = imageEl?.getAttribute("alt") || "Wireframe";
		img.src = full;
		img.alt = alt;
		cap.textContent = alt;
		dlg.showModal();

		// Trap focus
		closeBtn?.focus();
	});

	closeBtn?.addEventListener("click", () => dlg.close());

	dlg.addEventListener("click", (e) => {
		// click outside image = close
		const rect = img.getBoundingClientRect();
		if (
			!(
				e.clientX >= rect.left &&
				e.clientX <= rect.right &&
				e.clientY >= rect.top &&
				e.clientY <= rect.bottom
			)
		) {
			dlg.close();
		}
	});

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && dlg.open) dlg.close();
	});
})();
