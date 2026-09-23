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
    src: "assets/grid-01.svg",
    label: "Hallway, noon",
    description:
      "A narrow residential hallway photographed at midday. The window at the far end is the only light source, and the floor falls into a hard shadow. Placeholder text for a longer project note that would describe process, location, and the sequence this still belongs to.",
  },
  {
    index: 1,
    type: "image",
    src: "assets/grid-02.svg",
    label: "Folded cloth",
    description:
      "Draped fabric photographed as a landscape rather than a still life. Folds read as terrain. Placeholder copy stands in for a caption about material, dye, and the afternoon the picture was made.",
  },
  {
    index: 2,
    type: "image",
    src: "assets/grid-03.svg",
    label: "Kitchen sink",
    description:
      "A stainless basin, a faucet, and a single red object left on the rim. Domestic space treated with the same attention as a set. Placeholder description for production notes and print details.",
  },
  {
    index: 3,
    type: "video",
    src: "assets/grid-video-01.mp4",
    poster: "assets/grid-video-01.svg",
    label: "Platform interval",
    description:
      "A short loop from a train platform between arrivals. The red safety line holds the frame. Placeholder text for runtime, camera, and the sound that would play with the finished cut.",
  },
  {
    index: 4,
    type: "image",
    src: "assets/grid-04.svg",
    label: "Bus window",
    description:
      "Looking out from a moving bus. The split pane and the red grab rail keep the interior in the picture. Placeholder caption for the route and the hour it was taken.",
  },
  {
    index: 5,
    type: "image",
    src: "assets/grid-05.svg",
    label: "Backyard fence",
    description:
      "Uneven pale slats against a green yard and a washed-out sky. Placeholder notes about the neighborhood, the season, and why this fence kept appearing in the edit.",
  },
  {
    index: 6,
    type: "video",
    src: "assets/grid-video-02.mp4",
    poster: "assets/grid-video-02.svg",
    label: "Laundry line",
    description:
      "Clothes on a line, shifting in a light wind. The shot holds longer than the gesture. Placeholder description for a moving-image study of ordinary hanging cloth.",
  },
  {
    index: 7,
    type: "image",
    src: "assets/grid-06.svg",
    label: "Bathroom mirror",
    description:
      "A figure reduced to a silhouette in a medicine-cabinet mirror. The red bottle is the only saturated object. Placeholder text for a self-portrait series made in rented rooms.",
  },
  {
    index: 8,
    type: "image",
    src: "assets/grid-07.svg",
    label: "Stairwell",
    description:
      "Concrete treads and a vertical handrail cutting the frame. Placeholder copy for a building study: address, floor count, and the time of day the light hits the landings.",
  },
  {
    index: 9,
    type: "image",
    src: "assets/grid-08.svg",
    label: "Fruit bowl",
    description:
      "A tabletop arrangement after lunch. Fruit, a gray bowl, a paper field. Placeholder description for a still-life sequence shot in the studio over several afternoons.",
  },
];

const mediaGrid = document.querySelector(".media-grid");

if (mediaGrid) {
  const fragment = document.createDocumentFragment();

  works.forEach((work) => {
    const item = document.createElement("article");
    item.className = `media-item media-item--${work.type}`;
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
