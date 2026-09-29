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
    if (!reduceMotion) video.play().catch(() => {});
  }
}, { rootMargin: '200px 0px' });

for (const video of document.querySelectorAll('video')) {
  if (reduceMotion) {
    video.autoplay = false;
    video.pause();
  }
  observer.observe(video);
}
