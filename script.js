document.addEventListener("DOMContentLoaded", () => {
	/* ---------------------------------------------
	   Smooth Scroll to #contact
	--------------------------------------------- */
	function scrollToContact(e) {
		e.preventDefault();
		const target = document.getElementById("contact");
		const offset = 100;
		const top =
			target.getBoundingClientRect().top + window.pageYOffset - offset;
		window.scrollTo({ top, behavior: "smooth" });
	}

	const contactLink = document.querySelector('a[href="#contact"]');
	if (contactLink) contactLink.addEventListener("click", scrollToContact);
	// --- END smooth scroll

	/* ---------------------------------------------
	   Auto-close mobile navbar on scroll
	--------------------------------------------- */
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
	// --- END mobile navbar auto-close

	/* ---------------------------------------------
	   Green Circles Highlight in Insights
	--------------------------------------------- */
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

			const card = a.closest(".note-card");
			const tags = card?.querySelector(".note-tags");
			if (tags) tags.classList.add("lh-tags");
		}
	});
	// --- END Green Circles

	/* ---------------------------------------------
	   WF Lightbox — Wireframes Modal Preview
	--------------------------------------------- */
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
			closeBtn?.focus();
		});

		closeBtn?.addEventListener("click", () => dlg.close());

		dlg.addEventListener("click", (e) => {
			const rect = img.getBoundingClientRect();
			if (
				e.clientX < rect.left ||
				e.clientX > rect.right ||
				e.clientY < rect.top ||
				e.clientY > rect.bottom
			) {
				dlg.close();
			}
		});

		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && dlg.open) dlg.close();
		});
	})();
	/* ---------------------------------------------
	   LIVE NEWS — one card, auto-rotate, pause on hover
	--------------------------------------------- */
	const liveCarousel = document.getElementById("liveCarousel");
	if (liveCarousel) {
		const slides = Array.from(liveCarousel.querySelectorAll(".live-slide"));
		if (slides.length === 0) {
			console.warn("Live carousel: no .live-slide elements found");
			return;
		}

		let current = 0;
		let timer = null;
		const DELAY = 6000; // 6 секунд на одну новость

		// гарантируем, что первый слайд активен
		slides.forEach((slide, index) => {
			slide.classList.toggle("is-active", index === 0);
		});

		function showSlide(nextIndex) {
			slides[current].classList.remove("is-active");
			current = (nextIndex + slides.length) % slides.length;
			slides[current].classList.add("is-active");
		}

		function startRotation() {
			if (timer || slides.length < 2) return; // нечего крутить
			timer = setInterval(() => {
				showSlide(current + 1);
			}, DELAY);
		}

		function stopRotation() {
			if (!timer) return;
			clearInterval(timer);
			timer = null;
		}

		// стартуем через небольшую паузу
		setTimeout(startRotation, 700);

		// стоп по hover
		liveCarousel.addEventListener("mouseenter", stopRotation);
		liveCarousel.addEventListener("mouseleave", startRotation);
	}
	// --- END Live News
});
