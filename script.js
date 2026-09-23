const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const carousel = document.querySelector(".carousel");
const track = document.querySelector(".carousel__track");
const controlButtons = document.querySelectorAll("[data-carousel-dir]");

if (carousel && track) {
  const originalSlides = Array.from(track.children);
  originalSlides.forEach((slide) => {
    track.appendChild(slide.cloneNode(true));
  });

  let offset = 0;
  let paused = prefersReducedMotion;
  const speed = 0.45;

  const loopWidth = () => track.scrollWidth / 2;

  const applyTransform = () => {
    track.style.transform = `translateX(${-offset}px)`;
  };

  const stride = () => {
    const slide = track.querySelector(".carousel__slide");
    if (!slide) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return slide.getBoundingClientRect().width + gap;
  };

  const wrapOffset = () => {
    const width = loopWidth();
    if (width <= 0) return;
    if (offset >= width) offset -= width;
    if (offset < 0) offset += width;
  };

  const pause = () => {
    paused = true;
  };

  const step = (direction) => {
    pause();
    offset += direction * stride();
    wrapOffset();
    applyTransform();
  };

  controlButtons.forEach((button) => {
    button.addEventListener("click", () => {
      step(Number(button.dataset.carouselDir));
    });
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }
  });

  const tick = () => {
    if (!paused) {
      offset += speed;
      wrapOffset();
      applyTransform();
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
