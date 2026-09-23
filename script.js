const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const carousel = document.querySelector(".carousel");
const track = document.querySelector(".carousel__track");

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

  const tick = () => {
    if (!paused) {
      offset += speed;
      const width = loopWidth();
      if (width > 0 && offset >= width) {
        offset -= width;
      }
      applyTransform();
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
