// Videos below the fold load only when they approach the viewport, and every
// video pauses while off screen. Nothing autoplays when reduced motion is requested.
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function loadSources(video) {
  for (const source of video.querySelectorAll('source[data-src]')) {
    source.src = source.dataset.src;
    source.removeAttribute('data-src');
  }
  video.load();
}

const observer = new IntersectionObserver((entries) => {
  for (const { target: video, isIntersecting } of entries) {
    if (!isIntersecting) {
      video.pause();
      continue;
    }
    if (video.querySelector('source[data-src]')) loadSources(video);
    if (!reduceMotion && video.autoplay) video.play().catch(() => {});
  }
}, { rootMargin: '200px 0px' });

for (const video of document.querySelectorAll('video')) {
  if (reduceMotion) {
    video.autoplay = false;
    video.pause();
  }
  observer.observe(video);
}

// Mark the section index link for the section at the middle of the viewport.
const indexLinks = [...document.querySelectorAll('.section-index a')];
const indexed = indexLinks.map((a) => document.querySelector(a.getAttribute('href')));

function markCurrentSection() {
  const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
  let current = atBottom ? indexed.length - 1 : -1;
  if (!atBottom) {
    indexed.forEach((section, i) => {
      if (section.getBoundingClientRect().top <= innerHeight / 2) current = i;
    });
  }
  indexLinks.forEach((a, i) => {
    if (i === current) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  });
}

let pending = false;
addEventListener('scroll', () => {
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => { pending = false; markCurrentSection(); });
}, { passive: true });
markCurrentSection();
