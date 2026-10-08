/* ============================================
   HERO SLIDER — plain vanilla JS, no libraries.
   Handles: automatic rotation, prev/next arrows,
   dot indicators, progress bar, infinite looping,
   and pausing autoplay on hover.
   ============================================ */

(function () {
  const track = document.getElementById('heroTrack');
  const slides = Array.from(track.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('heroDots');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  const progressBar = document.getElementById('heroProgress');
  const hero = document.querySelector('.hero');

  const SLIDE_DURATION = 6000; // ms each slide stays visible
  let current = 0;
  let timer = null;
  let progressStart = null;
  let progressRaf = null;

  // ---------- Build dot indicators ----------
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero__dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('.hero__dot'));

  function render() {
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
  }

  function goToSlide(index) {
    current = (index + slides.length) % slides.length;
    render();
    restartAutoplay();
  }

  function nextSlide() {
    goToSlide(current + 1);
  }

  function prevSlide() {
    goToSlide(current - 1);
  }

  // ---------- Progress bar (visual countdown to next slide) ----------
  function animateProgress(timestamp) {
    if (!progressStart) progressStart = timestamp;
    const elapsed = timestamp - progressStart;
    const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
    progressBar.style.width = `${pct}%`;

    if (elapsed < SLIDE_DURATION) {
      progressRaf = requestAnimationFrame(animateProgress);
    }
  }

  function startProgress() {
    progressStart = null;
    progressBar.style.width = '0%';
    cancelAnimationFrame(progressRaf);
    progressRaf = requestAnimationFrame(animateProgress);
  }

  function stopProgress() {
    cancelAnimationFrame(progressRaf);
  }

  // ---------- Autoplay ----------
  function startAutoplay() {
    stopAutoplay();
    startProgress();
    timer = setInterval(nextSlide, SLIDE_DURATION);
  }

  function stopAutoplay() {
    clearInterval(timer);
    stopProgress();
  }

  function restartAutoplay() {
    startAutoplay();
  }

  // ---------- Controls ----------
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Pause autoplay while the user is hovering/interacting with the hero
  hero.addEventListener('mouseenter', stopAutoplay);
  hero.addEventListener('mouseleave', startAutoplay);

  // ---------- Init ----------
  render();
  startAutoplay();
})();