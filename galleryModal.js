const modal = document.getElementById("photoModal");
const modalImg = document.getElementById("modalImage");
const closeModal = document.querySelector(".close-modal");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let currentIndex = 0;
let images = Array.from(document.querySelectorAll(".gallery-item"));

// Добавим data-index всем фото
images.forEach((img, index) => {
	img.setAttribute("data-index", index);
	img.addEventListener("click", () => {
		currentIndex = index;
		openModal(img.src);
	});
});

function openModal(src) {
	modal.style.display = "block";
	modalImg.src = src;
}

function closeModalFunc() {
	modal.style.display = "none";
}

function showImage(index) {
	if (index >= 0 && index < images.length) {
		modalImg.src = images[index].src;
	}
}

nextBtn.addEventListener("click", () => {
	currentIndex = (currentIndex + 1) % images.length;
	showImage(currentIndex);
});

prevBtn.addEventListener("click", () => {
	currentIndex = (currentIndex - 1 + images.length) % images.length;
	showImage(currentIndex);
});

closeModal.addEventListener("click", closeModalFunc);

// Закрытие по ESC
window.addEventListener("keydown", (e) => {
	if (e.key === "Escape") closeModalFunc();
});
