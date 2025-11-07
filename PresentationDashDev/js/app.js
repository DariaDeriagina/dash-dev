// --- Reveal on view ---
function fadeIn(el) {
	gsap.fromTo(
		el,
		{ autoAlpha: 0, y: 20 },
		{ autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }
	);
}
const sections = Array.from(document.querySelectorAll("section"));
const io = new IntersectionObserver(
	(ents) => {
		ents.forEach((e) => {
			if (e.isIntersecting) fadeIn(e.target);
		});
	},
	{ threshold: 0.25 }
);
sections.forEach((s) => io.observe(s));

// --- Keyboard nav + click-to-progress ---
let idx = 0;
function go(i) {
	idx = Math.max(0, Math.min(sections.length - 1, i));
	sections[idx].scrollIntoView({ behavior: "smooth", block: "start" });
}
window.addEventListener("keydown", (e) => {
	if (["ArrowRight", "PageDown", " "].includes(e.key)) {
		e.preventDefault();
		go(idx + 1);
	}
	if (["ArrowLeft", "PageUp"].includes(e.key)) {
		e.preventDefault();
		go(idx - 1);
	}
});
window.addEventListener("click", (e) => {
	const tag = (e.target.tagName || "").toLowerCase();
	if (
		[
			"a",
			"button",
			"input",
			"textarea",
			"img",
			"dotlottie-wc",
			"pre",
			"code",
		].includes(tag)
	)
		return;
	go(idx + 1);
});

// --- Glow trail state & controls ---
const isMobile = matchMedia("(max-width: 640px)").matches;
const toggleBtn = document.getElementById("glowToggle");

let glowEnabled = !isMobile && localStorage.getItem("glowEnabled") !== "false";
updateGlowUI();

let throttle = false;
function pointerTrail(e) {
	if (!glowEnabled) return;
	if (throttle) return;
	throttle = true;
	setTimeout(() => (throttle = false), 12);
	const dot = document.createElement("div");
	dot.className = "trail";
	dot.style.left = e.clientX + "px";
	dot.style.top = e.clientY + "px";
	document.body.appendChild(dot);
	setTimeout(() => dot.remove(), 620);
}
window.addEventListener("pointermove", pointerTrail, { passive: true });

function updateGlowUI() {
	if (toggleBtn) {
		toggleBtn.textContent = `Glow: ${glowEnabled ? "On" : "Off"}`;
		toggleBtn.setAttribute("aria-pressed", String(glowEnabled));
	}
}
toggleBtn?.addEventListener("click", () => {
	glowEnabled = !glowEnabled;
	localStorage.setItem("glowEnabled", glowEnabled ? "true" : "false");
	updateGlowUI();
});

// --- S2: chips highlighting + avatar parallax ---
const $ = (s, r = document) => r.querySelector(s);
const palette = $("#paletteCard");
const typeCard = $("#typeCard");
const spacing = $("#spacingCard");

function addHL(el) {
	el && el.classList.add("hl");
}
function rmHL(el) {
	el && el.classList.remove("hl");
}

$("#chip-color")?.addEventListener("click", () => {
	[typeCard, spacing].forEach(rmHL);
	addHL(palette);
});
$("#chip-type")?.addEventListener("click", () => {
	[palette, spacing].forEach(rmHL);
	addHL(typeCard);
});
["#chip-grid", "#chip-spacing"].forEach((sel) => {
	$(sel)?.addEventListener("click", () => {
		[palette, typeCard].forEach(rmHL);
		addHL(spacing);
	});
});

// motion reduce for sparkle
try {
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		const sparkle = $("#sparkle");
		if (sparkle) sparkle.style.animation = "none";
	}
} catch {}

// avatar parallax
const avatar = $("#dashaPersona");
const wrap = avatar?.closest(".portrait-wrap");
if (wrap && avatar) {
	wrap.addEventListener("mousemove", (e) => {
		const r = wrap.getBoundingClientRect();
		const cx = (e.clientX - r.left) / r.width - 0.5;
		const cy = (e.clientY - r.top) / r.height - 0.5;
		avatar.style.transform = `translate(${cx * 8}px, ${cy * 8}px)`;
	});
	wrap.addEventListener("mouseleave", () => {
		avatar.style.transform = "translate(0,0)";
	});
}

// --- S3: toggle plugin vs clean code ---
const pluginCodeEl = document.querySelector("#pluginCode");
const cleanCodeEl = document.querySelector("#cleanCode");
const toggleBtnCode = document.querySelector("#toggleCode");
toggleBtnCode?.addEventListener("click", () => {
	const pluginShown = !pluginCodeEl.classList.contains("hidden");
	pluginCodeEl.classList.toggle("hidden", pluginShown);
	cleanCodeEl.classList.toggle("hidden", !pluginShown);
	toggleBtnCode.textContent = pluginShown
		? "← Back to plugin code"
		: "Switch to clean code →";
});
// --- S4: Myth Break interactions ---
(function MythBreak() {
	const s4 = document.querySelector("#s4");
	if (!s4) return;

	// reveal pieces on enter (lightweight – fade/slide)
	const poster = s4.querySelector(".poster-wrap");
	const bugs = Array.from(s4.querySelectorAll(".bug-card"));

	// GSAP reveal
	if (window.gsap) {
		const tl = gsap.timeline({
			paused: true,
			defaults: { ease: "power2.out" },
		});
		tl.fromTo(
			poster,
			{ autoAlpha: 0, y: 20 },
			{ autoAlpha: 1, y: 0, duration: 0.6 }
		);
		tl.fromTo(
			bugs,
			{ autoAlpha: 0, y: 14 },
			{ autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12 },
			"-=.2"
		);

		// play when section comes into view
		const obs = new IntersectionObserver(
			(ents) => {
				ents.forEach((e) => {
					if (e.isIntersecting) {
						tl.play();
						obs.disconnect();
					}
				});
			},
			{ threshold: 0.35 }
		);
		obs.observe(s4);
	}

	// toggle buttons: swap from "broken" -> "fixed"
	s4.querySelectorAll(".bug-toggle").forEach((btn) => {
		btn.addEventListener("click", () => {
			const card = btn.closest(".bug-card");
			const type = card?.dataset.bug;

			if (type === "button") {
				const c = card.querySelector(".btn-ghost");
				const isBroken = c.classList.contains("misaligned");
				c.classList.toggle("misaligned", !isBroken);
				c.classList.toggle("aligned", isBroken);
			}

			if (type === "text") {
				const p = card.querySelector(".truncate-bad, .truncate-good");
				const isBad = p.classList.contains("truncate-bad");
				p.classList.toggle("truncate-bad", !isBad);
				p.classList.toggle("truncate-good", isBad);
			}

			if (type === "logo") {
				const logo = card.querySelector(".logo-img");
				const isOff = logo.classList.contains("offcenter");
				logo.classList.toggle("offcenter", !isOff);
				logo.classList.toggle("centered", isOff);
			}

			// button label + a11y
			const pressed = btn.getAttribute("aria-pressed") === "true";
			btn.setAttribute("aria-pressed", String(!pressed));
			btn.textContent = pressed ? "Fix it →" : "← Undo fix";
		});
	});
})();
// ---MARK: S5: Prompt copy + refine toggle ---
(function ToolsAI() {
	const s5 = document.querySelector("#s5");
	if (!s5) return;

	// Copy prompt
	const copyBtn = s5.querySelector("#copyPrompt");
	const copyOK = s5.querySelector("#copyOK");
	const textEl = s5.querySelector("#promptText");
	copyBtn?.addEventListener("click", async () => {
		try {
			await navigator.clipboard.writeText(textEl.value);
			if (copyOK) {
				copyOK.hidden = false;
				setTimeout(() => (copyOK.hidden = true), 1400);
			}
		} catch {
			// fallback
			textEl.select();
			document.execCommand("copy");
			if (copyOK) {
				copyOK.hidden = false;
				setTimeout(() => (copyOK.hidden = true), 1400);
			}
		}
	});

	// Refine toggle
	const toggle = s5.querySelector("#refineToggle");
	const ai = s5.querySelector("#aiDraft");
	const ref = s5.querySelector("#refinedCode");
	toggle?.addEventListener("click", () => {
		const showRefined = ref.classList.contains("hidden");
		ref.classList.toggle("hidden", !showRefined);
		ai.classList.toggle("hidden", showRefined);
		toggle.textContent = showRefined ? "← Show AI draft" : "Show refined →";
	});

	// Reveal animation
	if (window.gsap) {
		const cards = s5.querySelectorAll(
			".tool-card, .prompt-card, .refine, .flow-pill, .flow-arrow"
		);
		const tl = gsap.timeline({
			paused: true,
			defaults: { ease: "power2.out" },
		});
		tl.fromTo(
			cards,
			{ autoAlpha: 0, y: 16 },
			{ autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06 }
		);

		const obs = new IntersectionObserver(
			(ents) => {
				ents.forEach((e) => {
					if (e.isIntersecting) {
						tl.play();
						obs.disconnect();
					}
				});
			},
			{ threshold: 0.3 }
		);
		obs.observe(s5);
	}
})();
// s6 fade-in on scroll
const s6 = document.querySelector("#s6");
if (s6) {
	gsap.fromTo(
		s6.querySelector("dotlottie-wc"),
		{ y: 40, autoAlpha: 0 },
		{
			y: 0,
			autoAlpha: 1,
			duration: 1.2,
			ease: "power3.out",
			scrollTrigger: { trigger: s6, start: "top 80%" },
		}
	);
}
(function s7Compare() {
	const topImg = document.querySelector("#s7 #s7TopImg");
	const slider = document.querySelector("#s7 #s7Slider");
	if (!topImg || !slider) return;
	const setClip = (v) => (topImg.style.clipPath = `inset(0 ${100 - v}% 0 0)`);
	setClip(slider.value);
	slider.addEventListener("input", (e) => setClip(e.target.value));
})();
// --- Live Q&A reveal animation ---
if (window.gsap) {
	const qas = document.querySelectorAll("#s8 .qa-card");
	const tlQA = gsap.timeline({
		scrollTrigger: { trigger: "#s8", start: "top 70%" },
	});
	tlQA.from(qas, {
		autoAlpha: 0,
		y: 20,
		duration: 0.6,
		ease: "power2.out",
		stagger: 0.15,
	});
}
// Mobile toggle
const navToggle = document.getElementById("navToggle");
const drawer = document.getElementById("drawer");
const mainNav = document.getElementById("mainNav");
navToggle?.addEventListener("click", () => {
	const open = drawer.classList.toggle("hidden") ? false : true;
	navToggle.setAttribute("aria-expanded", String(open));
});

// Scrollspy: highlight link matching visible section
const links = [...document.querySelectorAll("#mainNav .nav-pill")];
const map = new Map(
	links.map((a) => [a.getAttribute("href")?.replace("#", ""), a])
);
const spy = new IntersectionObserver(
	(entries) => {
		entries.forEach((e) => {
			if (!e.isIntersecting) return;
			const id = e.target.id;
			links.forEach((l) => l.classList.remove("is-active"));
			map.get(id)?.classList.add("is-active");
		});
	},
	{ rootMargin: "-40% 0px -55% 0px", threshold: 0 }
);

document.querySelectorAll("section[id]").forEach((s) => spy.observe(s));

// Close drawer after selecting a link (mobile)
drawer?.addEventListener("click", (e) => {
	if (e.target.matches('a[href^="#"]')) {
		drawer.classList.add("hidden");
		navToggle?.setAttribute("aria-expanded", "false");
	}
});
// Figma clips: gentle stagger reveal on scroll
document.addEventListener("DOMContentLoaded", () => {
	const wrap = document.getElementById("figmaClips");
	if (!wrap || !window.gsap) return;

	const vids = Array.from(wrap.querySelectorAll("video"));
	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					gsap.to(vids, {
						opacity: 1,
						y: 0,
						duration: 0.6,
						stagger: 0.12,
						ease: "power2.out",
					});
					io.disconnect();
				}
			});
		},
		{ threshold: 0.25 }
	);

	vids.forEach((v) => {
		v.style.transform = "translateY(8px)";
		io.observe(v);
	});
});
document.addEventListener("DOMContentLoaded", () => {
	const vid = document.querySelector("#s3a video");
	if (!vid || !("IntersectionObserver" in window)) return;
	const io = new IntersectionObserver(
		([e]) => {
			if (e.isIntersecting) vid.play().catch(() => {});
			else vid.pause();
		},
		{ threshold: 0.25 }
	);
	io.observe(vid);
});
document.addEventListener("DOMContentLoaded", () => {
	const btn = document.getElementById("togglePreview");
	const frame = document.getElementById("livePreview");
	if (!btn || !frame) return;

	btn.addEventListener("click", () => {
		const hidden = frame.classList.toggle("hidden");
		btn.textContent = hidden ? "👀 View Live Preview" : "✖ Hide Preview";
	});
});
// Toggle embedded live preview
document.addEventListener("DOMContentLoaded", () => {
	const btn = document.getElementById("togglePreview");
	const frame = document.getElementById("livePreview");
	if (btn && frame) {
		btn.addEventListener("click", () => {
			const hidden = frame.classList.toggle("hidden");
			btn.textContent = hidden ? "👀 View Live Preview" : "✖ Hide Preview";
		});
	}

	// Copy prompt
	const copyBtn = document.getElementById("copyPrompt");
	const promptEl = document.getElementById("promptText");
	const ok = document.getElementById("copyOK");
	if (copyBtn && promptEl) {
		copyBtn.addEventListener("click", () => {
			navigator.clipboard.writeText(promptEl.textContent.trim()).then(() => {
				if (ok) {
					ok.hidden = false;
					setTimeout(() => (ok.hidden = true), 1500);
				}
			});
		});
	}
});
document.addEventListener("DOMContentLoaded", () => {
	const btn = document.getElementById("togglePreview");
	const wrap = document.getElementById("livePreviewWrap");
	const loader = document.getElementById("previewLoader");
	const iframe = document.getElementById("liveIframe");
	const fallback = document.getElementById("previewFallback");

	if (btn && wrap) {
		btn.addEventListener("click", () => {
			const hidden = wrap.classList.toggle("hidden");
			btn.textContent = hidden ? "👀 View Live Preview" : "✖ Hide Preview";

			if (!hidden && iframe && loader) {
				loader.classList.remove("hidden");
				iframe.classList.add("hidden");
				fallback.classList.add("hidden");

				let resolved = false;
				const showIframe = () => {
					if (resolved) return;
					resolved = true;
					loader.classList.add("hidden");
					iframe.classList.remove("hidden");
				};
				const showFallback = () => {
					if (resolved) return;
					resolved = true;
					loader.classList.add("hidden");
					fallback.classList.remove("hidden");
				};

				iframe.onload = showIframe;
				setTimeout(showFallback, 2000); // if onload never fires (blocked), show fallback
			}
		});
	}

	// Copy prompt
	const copyBtn = document.getElementById("copyPrompt");
	const promptEl = document.getElementById("promptText");
	const ok = document.getElementById("copyOK");
	if (copyBtn && promptEl) {
		copyBtn.addEventListener("click", () => {
			navigator.clipboard.writeText(promptEl.textContent.trim()).then(() => {
				if (ok) {
					ok.hidden = false;
					setTimeout(() => (ok.hidden = true), 1500);
				}
			});
		});
	}
});
// Generic live preview toggles
document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".live-toggle").forEach((btn) => {
		const targetId = btn.getAttribute("data-target");
		const wrap = document.getElementById(targetId);
		if (!wrap) return;

		const loader = wrap.querySelector(".preview-loader");
		const iframe = wrap.querySelector(".preview-iframe");
		const fallback = wrap.querySelector(".preview-fallback");

		btn.addEventListener("click", () => {
			const hidden = wrap.classList.toggle("hidden");
			btn.textContent = hidden ? "👀 View Live Preview" : "✖ Hide Preview";
			if (hidden || !iframe) return;

			loader?.classList.remove("hidden");
			iframe.classList.add("hidden");
			fallback?.classList.add("hidden");

			let resolved = false;
			const showIframe = () => {
				if (resolved) return;
				resolved = true;
				loader?.classList.add("hidden");
				iframe.classList.remove("hidden");
			};
			const showFallback = () => {
				if (resolved) return;
				resolved = true;
				loader?.classList.add("hidden");
				fallback?.classList.remove("hidden");
			};

			iframe.onload = showIframe;
			setTimeout(showFallback, 2000); // if headers block embedding, fall back
		});
	});
});
document.addEventListener("DOMContentLoaded", () => {
	const slides = Array.from(document.querySelectorAll(".inspo-slide"));
	const dots = Array.from(document.querySelectorAll(".inspo-dot"));
	if (!slides.length || !dots.length) return;

	let i = 0;
	let timer;

	const show = (n) => {
		i = (n + slides.length) % slides.length;
		slides.forEach((el, idx) => el.classList.toggle("hidden", idx !== i));
		dots.forEach((d, idx) => d.setAttribute("aria-current", String(idx === i)));
	};

	const start = () => {
		timer = setInterval(() => show(i + 1), 3500);
	};
	const stop = () => {
		if (timer) clearInterval(timer);
	};

	// start rotation
	show(0);
	start();

	// click dots
	dots.forEach((d) =>
		d.addEventListener("click", () => {
			stop();
			show(Number(d.dataset.go || 0));
			start();
		})
	);

	// pause on hover (desktop)
	const panel = document.querySelector("#s6 .backdrop-blur");
	if (panel) {
		panel.addEventListener("mouseenter", stop);
		panel.addEventListener("mouseleave", start);
	}
});
