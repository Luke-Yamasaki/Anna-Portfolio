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
  let animating = false;
  let animStartOffset = 0;
  let targetOffset = 0;
  let animStartTime = 0;
  const speed = 0.45;
  const animDuration = 560;

  const easeOutCubic = (t) => 1 - (1 - t) ** 3;

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
    const delta = direction * stride();
    if (!delta) return;

    if (prefersReducedMotion) {
      offset += delta;
      wrapOffset();
      applyTransform();
      return;
    }

    const width = loopWidth();
    if (direction < 0 && offset < 1) {
      offset += width;
    } else if (direction > 0 && offset >= width - 1) {
      offset -= width;
    }

    animStartOffset = offset;
    targetOffset = (animating ? targetOffset : offset) + delta;
    animStartTime = performance.now();
    animating = true;
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

  const tick = (now) => {
    if (animating) {
      const t = Math.min(1, (now - animStartTime) / animDuration);
      offset = animStartOffset + (targetOffset - animStartOffset) * easeOutCubic(t);
      applyTransform();
      if (t >= 1) {
        offset = targetOffset;
        wrapOffset();
        applyTransform();
        animating = false;
      }
    } else if (!paused) {
      offset += speed;
      wrapOffset();
      applyTransform();
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

const placeholderDescription = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper.",
];

const works = [
  {
    index: 0,
    type: "image",
    src: "assets/grid/01-vogue-hong-kong.webp",
    label: "Vogue Hong Kong",
    description: placeholderDescription,
  },
  {
    index: 1,
    type: "image",
    src: "assets/grid/02-oscar-de-la-renta.webp",
    label: "Oscar De La Renta",
    description: placeholderDescription,
  },
  {
    index: 2,
    type: "image",
    src: "assets/grid/03-one-of-ritz-carlton-nomad.webp",
    label: "One Of x Ritz-carlton Nomad",
    description: placeholderDescription,
  },
  {
    index: 3,
    type: "video",
    src: "assets/grid/07-kangol.mp4",
    poster: "assets/grid/07-kangol.webp",
    label: "Kangol",
    description: placeholderDescription,
  },
  {
    index: 4,
    type: "image",
    src: "assets/grid/04-one-of.webp",
    label: "One Of",
    description: placeholderDescription,
  },
  {
    index: 5,
    type: "video",
    src: "assets/grid/08-gh-bass.mp4",
    poster: "assets/grid/08-gh-bass.webp",
    label: "G.H. Bass",
    description: placeholderDescription,
  },
  {
    index: 6,
    type: "image",
    src: "assets/grid/05-kaltblut.webp",
    label: "KALTBLUT",
    description: placeholderDescription,
  },
  {
    index: 7,
    type: "image",
    src: "assets/grid/06-nili-lotan.webp",
    label: "NILI LOTAN",
    description: placeholderDescription,
  },
];

const packWorksForMobile = (items) => {
  const packed = [];
  const pendingImages = [];

  const flushImages = () => {
    packed.push(...pendingImages);
    pendingImages.length = 0;
  };

  items.forEach((item) => {
    if (item.type === "image") {
      pendingImages.push(item);
      return;
    }

    if (pendingImages.length % 2 === 1) {
      const orphan = pendingImages.pop();
      flushImages();
      packed.push(item);
      pendingImages.push(orphan);
      return;
    }

    flushImages();
    packed.push(item);
  });

  flushImages();
  return packed;
};

const mobileOrderByIndex = new Map(
  packWorksForMobile(works).map((work, order) => [work.index, order])
);

const mediaGrid = document.querySelector(".media-grid");

if (mediaGrid) {
  const fragment = document.createDocumentFragment();
  let videoCount = 0;

  works.forEach((work) => {
    const item = document.createElement("article");
    item.className = `media-item media-item--${work.type}`;
    if (work.type === "video") {
      const side = videoCount % 2 === 0 ? "left" : "right";
      item.classList.add(`media-item--video-${side}`);
      videoCount += 1;
    }
    item.style.setProperty("--mobile-order", String(mobileOrderByIndex.get(work.index)));
    item.dataset.index = String(work.index);

    const frame = document.createElement("div");
    frame.className = "media-item__frame";

    if (work.type === "video") {
      const video = document.createElement("video");
      video.src = work.src;
      video.poster = work.poster;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.loop = true;
      video.autoplay = !prefersReducedMotion;
      video.preload = "auto";
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("aria-hidden", "true");
      if (!prefersReducedMotion) {
        video.play().catch(() => {});
      }
      frame.appendChild(video);
    } else {
      const image = document.createElement("img");
      image.src = work.src;
      image.alt = work.label;
      frame.appendChild(image);
    }

    const label = document.createElement("p");
    label.className = "media-item__label";
    label.textContent = work.label;

    item.append(frame, label);
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `Open ${work.label}`);
    fragment.appendChild(item);
  });

  mediaGrid.appendChild(fragment);
}

const dialog = document.querySelector(".work-dialog");
const dialogMedia = document.querySelector(".work-dialog__media");
const dialogLabel = document.querySelector(".work-dialog__label");
const dialogDescription = document.querySelector(".work-dialog__description");
const dialogDescriptionWrap = document.querySelector(
  ".work-dialog__description-wrap"
);
const dialogClose = document.querySelector(".work-dialog__close");
const dialogNavButtons = document.querySelectorAll("[data-dialog-dir]");
const pageRegions = document.querySelectorAll(
  ".skip-link, .site-header, .site-main, .site-footer"
);

let currentIndex = 0;
let savedScrollY = 0;

const dialogFocusable = () =>
  [...dialog.querySelectorAll(
    'button, [href], video[controls], [tabindex]:not([tabindex="-1"])'
  )].filter((el) => !el.hasAttribute("disabled"));

const lockPage = () => {
  savedScrollY = window.scrollY;
  document.documentElement.classList.add("is-dialog-open");
  document.body.style.top = `-${savedScrollY}px`;
  pageRegions.forEach((el) => {
    el.inert = true;
  });
};

const unlockPage = () => {
  document.documentElement.classList.remove("is-dialog-open");
  document.body.style.top = "";
  pageRegions.forEach((el) => {
    el.inert = false;
  });
  window.scrollTo({ top: savedScrollY, left: 0, behavior: "instant" });
};

const updateDescriptionOverflow = () => {
  if (!dialogDescription || !dialogDescriptionWrap) return;
  const { scrollTop, scrollHeight, clientHeight } = dialogDescription;
  const overflowing = scrollHeight > clientHeight + 1;
  const atEnd = scrollTop + clientHeight >= scrollHeight - 1;
  dialogDescriptionWrap.classList.toggle("is-overflowing", overflowing);
  dialogDescriptionWrap.classList.toggle("is-scrolled-end", atEnd);
};

const renderDialog = (index) => {
  const work = works[index];
  if (!work || !dialogMedia || !dialogLabel || !dialogDescription) return;

  currentIndex = work.index;
  dialogMedia.replaceChildren();

  if (work.type === "video") {
    const video = document.createElement("video");
    video.src = work.src;
    video.poster = work.poster;
    video.controls = true;
    video.playsInline = true;
    video.setAttribute("aria-label", work.label);
    dialogMedia.appendChild(video);
  } else {
    const image = document.createElement("img");
    image.src = work.src;
    image.alt = work.label;
    dialogMedia.appendChild(image);
  }

  dialogLabel.textContent = work.label;
  dialogDescription.replaceChildren(
    ...work.description.map((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      return p;
    })
  );
  requestAnimationFrame(updateDescriptionOverflow);
};

const stepWork = (direction) => {
  const nextIndex = (currentIndex + direction + works.length) % works.length;
  renderDialog(nextIndex);
};

const openWork = (index) => {
  if (!dialog) return;
  lockPage();
  renderDialog(index);
  dialog.showModal();
  requestAnimationFrame(updateDescriptionOverflow);
  dialogClose?.focus({ preventScroll: true });
};

const closeWork = () => {
  if (!dialog?.open) return;
  const playing = dialogMedia?.querySelector("video");
  if (playing) {
    playing.pause();
  }
  dialog.close();
};

if (mediaGrid) {
  mediaGrid.addEventListener("click", (event) => {
    const item = event.target.closest(".media-item");
    if (!item) return;
    openWork(Number(item.dataset.index));
  });

  mediaGrid.addEventListener("keydown", (event) => {
    const item = event.target.closest(".media-item");
    if (!item) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openWork(Number(item.dataset.index));
    }
  });
}

dialogNavButtons.forEach((button) => {
  button.addEventListener("click", () => {
    stepWork(Number(button.dataset.dialogDir));
  });
});

dialog?.addEventListener("keydown", (event) => {
  if (!dialog.open) return;

  if (event.key === "Tab") {
    const focusable = dialogFocusable();
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    stepWork(-1);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    stepWork(1);
  }
});

dialogDescription?.addEventListener("scroll", updateDescriptionOverflow, {
  passive: true,
});
window.addEventListener("resize", updateDescriptionOverflow);

dialogClose?.addEventListener("click", closeWork);

dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) {
    closeWork();
  }
});

dialog?.addEventListener("close", () => {
  const playing = dialogMedia?.querySelector("video");
  if (playing) {
    playing.pause();
  }
  unlockPage();
});
