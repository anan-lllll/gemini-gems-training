const body = document.body;
const modeToggle = document.getElementById("modeToggle");
const printBtn = document.getElementById("printBtn");
const progressText = document.getElementById("progressText");
const slides = Array.from(document.querySelectorAll(".slide"));
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.querySelector(".lightbox-close");

const savedMode = localStorage.getItem("gemDeckMode");
if (savedMode === "dark") {
  body.classList.add("dark");
  modeToggle.textContent = "浅色";
}

modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  modeToggle.textContent = isDark ? "浅色" : "深色";
  localStorage.setItem("gemDeckMode", isDark ? "dark" : "light");
});

printBtn.addEventListener("click", () => window.print());

document.querySelectorAll(".image-zoom").forEach((button) => {
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.src;
    lightboxImage.alt = button.dataset.alt || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

function currentSlideIndex() {
  const viewportMid = window.scrollY + window.innerHeight * 0.45;
  let active = 0;
  slides.forEach((slide, index) => {
    if (slide.offsetTop <= viewportMid) active = index;
  });
  return active;
}

function updateProgress() {
  const active = currentSlideIndex();
  progressText.textContent = `${active + 1} / ${slides.length}`;
}

function goToSlide(index) {
  const target = slides[Math.max(0, Math.min(slides.length - 1, index))];
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
window.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
  const active = currentSlideIndex();
  if (event.key === "ArrowDown" || event.key === "PageDown") {
    event.preventDefault();
    goToSlide(active + 1);
  }
  if (event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault();
    goToSlide(active - 1);
  }
  if (event.key === "Home") {
    event.preventDefault();
    goToSlide(0);
  }
  if (event.key === "End") {
    event.preventDefault();
    goToSlide(slides.length - 1);
  }
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    closeLightbox();
  }
});

updateProgress();
