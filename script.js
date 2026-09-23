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

const works = [
  {
    index: 0,
    type: "image",
    src: "assets/grid/01-vogue-hong-kong.webp",
    label: "Vogue Hong Kong",
    description:
      "Makeup by Anna Kurihara for Vogue Hong Kong.",
  },
  {
    index: 1,
    type: "image",
    src: "assets/grid/02-oscar-de-la-renta.webp",
    label: "Oscar De La Renta",
    description: "Makeup by Anna Kurihara for Oscar De La Renta.",
  },
  {
    index: 2,
    type: "image",
    src: "assets/grid/03-one-of-ritz-carlton-nomad.webp",
    label: "One Of x Ritz-carlton Nomad",
    description:
      "Makeup by Anna Kurihara for One Of x Ritz-carlton Nomad.",
  },
  {
    index: 3,
    type: "video",
    src: "assets/grid/07-kangol.mp4",
    poster: "assets/grid/07-kangol.webp",
    label: "Kangol",
    description: "Makeup by Anna Kurihara for Kangol.",
  },
  {
    index: 4,
    type: "image",
    src: "assets/grid/04-one-of.webp",
    label: "One Of",
    description: "Makeup by Anna Kurihara for One Of.",
  },
  {
    index: 5,
    type: "video",
    src: "assets/grid/08-gh-bass.mp4",
    poster: "assets/grid/08-gh-bass.webp",
    label: "G.H. Bass",
    description: "Makeup by Anna Kurihara for G.H. Bass.",
  },
  {
    index: 6,
    type: "image",
    src: "assets/grid/05-kaltblut.webp",
    label: "KALTBLUT",
    description: "Makeup by Anna Kurihara for KALTBLUT.",
  },
  {
    index: 7,
    type: "image",
    src: "assets/grid/06-nili-lotan.webp",
    label: "NILI LOTAN",
    description: "Makeup by Anna Kurihara for NILI LOTAN.",
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
      video.playsInline = true;
      video.preload = "metadata";
      video.setAttribute("aria-hidden", "true");
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
const dialogClose = document.querySelector(".work-dialog__close");
const dialogNavButtons = document.querySelectorAll("[data-dialog-dir]");

let currentIndex = 0;

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
  dialogDescription.textContent = work.description;
};

const stepWork = (direction) => {
  const nextIndex = (currentIndex + direction + works.length) % works.length;
  renderDialog(nextIndex);
};

const openWork = (index) => {
  if (!dialog) return;
  renderDialog(index);
  dialog.showModal();
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
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    stepWork(-1);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    stepWork(1);
  }
});

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
});
