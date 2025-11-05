/* ---- Helpers ---- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const prefersReduce = () =>
	matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- Section reveals (GSAP optional) ---- */
function fadeIn(el) {
	if (!window.gsap) return;
	gsap.fromTo(
		el,
		{ autoAlpha: 0, y: 16 },
		{ autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }
	);
}
const sections = $$(".section");
const io = new IntersectionObserver(
	(ents) => ents.forEach((e) => e.isIntersecting && fadeIn(e.target)),
	{ threshold: 0.25 }
);
sections.forEach((s) => io.observe(s));

/* ---- Keyboard & click-to-progress (presentation mode) ---- */
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
			"svg",
		].includes(tag)
	)
		return;
	go(idx + 1);
});

/* ---- Glow trail (OFF by default) ---- */
const toggleBtn = $("#glowToggle");
let glowEnabled = localStorage.getItem("glowEnabled") === "true" ? true : false;
updateGlowUI();
let throttle = false;
function pointerTrail(e) {
	if (!glowEnabled || prefersReduce()) return;
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
toggleBtn?.addEventListener("click", () => {
	glowEnabled = !glowEnabled;
	localStorage.setItem("glowEnabled", glowEnabled ? "true" : "false");
	updateGlowUI();
});
function updateGlowUI() {
	if (!toggleBtn) return;
	toggleBtn.textContent = `Glow: ${glowEnabled ? "On" : "Off"}`;
	toggleBtn.setAttribute("aria-pressed", String(glowEnabled));
}

/* ---- S2 chips + avatar parallax ---- */
const paletteCard = $("#paletteCard");
const typeCard = $("#typeCard");
const spacingCard = $("#spacingCard");
function setHL(target) {
	[paletteCard, typeCard, spacingCard].forEach((el) =>
		el?.classList.remove("hl")
	);
	target?.classList.add("hl");
}
$("#chip-color")?.addEventListener("click", () => setHL(paletteCard));
$("#chip-type")?.addEventListener("click", () => setHL(typeCard));
$("#chip-grid")?.addEventListener("click", () => setHL(spacingCard));
$("#chip-spacing")?.addEventListener("click", () => setHL(spacingCard));

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
	if (prefersReduce()) avatar.style.transition = "none";
}

/* ---- S3 code toggle ---- */
const pluginCodeEl = $("#pluginCode");
const cleanCodeEl = $("#cleanCode");
$("#toggleCode")?.addEventListener("click", () => {
	const pluginShown = !pluginCodeEl.classList.contains("hidden");
	pluginCodeEl.classList.toggle("hidden", pluginShown);
	cleanCodeEl.classList.toggle("hidden", !pluginShown);
	$("#toggleCode").textContent = pluginShown
		? "← Back to plugin code"
		: "Switch to clean code →";
});

/* ---- S4 Myth Break toggles ---- */
$("#s4")
	?.querySelectorAll(".bug-toggle")
	.forEach((btn) => {
		btn.addEventListener("click", () => {
			const card = btn.closest(".bug-card");
			const type = card?.dataset.bug;

			if (type === "button") {
				const c = card.querySelector(".btn-ghost");
				const broken = c.classList.contains("misaligned");
				c.classList.toggle("misaligned", !broken);
				c.classList.toggle("aligned", broken);
			}
			if (type === "text") {
				const p = card.querySelector(".truncate-bad, .truncate-good");
				const bad = p.classList.contains("truncate-bad");
				p.classList.toggle("truncate-bad", !bad);
				p.classList.toggle("truncate-good", bad);
			}
			if (type === "logo") {
				const logo = card.querySelector(".logo-img");
				const off = logo.classList.contains("offcenter");
				logo.classList.toggle("offcenter", !off);
				logo.classList.toggle("centered", off);
			}

			const pressed = btn.getAttribute("aria-pressed") === "true";
			btn.setAttribute("aria-pressed", String(!pressed));
			btn.textContent = pressed ? "Fix it →" : "← Undo fix";
		});
	});

/* ---- S5 copy + refine toggle ---- */
(function toolsAI() {
	const s5 = $("#s5");
	if (!s5) return;
	const copyBtn = $("#copyPrompt");
	const copyOK = $("#copyOK");
	const textEl = $("#promptText");
	copyBtn?.addEventListener("click", async () => {
		try {
			await navigator.clipboard.writeText(textEl.value);
		} catch {
			textEl.select();
			document.execCommand("copy");
		}
		if (copyOK) {
			copyOK.hidden = false;
			setTimeout(() => (copyOK.hidden = true), 1200);
		}
	});

	const toggle = $("#refineToggle");
	const ai = $("#aiDraft");
	const ref = $("#refinedCode");
	toggle?.addEventListener("click", () => {
		const showRef = ref.classList.contains("hidden");
		ref.classList.toggle("hidden", !showRef);
		ai.classList.toggle("hidden", showRef);
		toggle.textContent = showRef ? "← Show AI draft" : "Show refined →";
	});
})();

/* ---- S6 simple reveal (if GSAP present) ---- */
(function s6Reveal() {
	const s6 = $("#s6");
	if (!s6 || !window.gsap) return;
	gsap.fromTo(
		s6.querySelector("dotlottie-wc"),
		{ y: 32, autoAlpha: 0 },
		{ y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }
	);
})();

/* ---- S7 compare slider ---- */
(function s7Compare() {
	const topImg = $("#s7TopImg");
	const slider = $("#s7Slider");
	if (!topImg || !slider) return;
	const setClip = (v) => (topImg.style.clipPath = `inset(0 ${100 - v}% 0 0)`);
	setClip(slider.value);
	slider.addEventListener("input", (e) => setClip(e.target.value));
})();

/* ---- S8 stagger in (if GSAP present) ---- */
(function s8Reveal() {
	if (!window.gsap) return;
	const qas = $$("#s8 .qa-card");
	gsap.from(qas, {
		autoAlpha: 0,
		y: 18,
		duration: 0.6,
		ease: "power2.out",
		stagger: 0.12,
	});
})();
