const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-navigation');
const navLinks = navigation ? [...navigation.querySelectorAll('a')] : [];

function closeMenu() {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navigation?.classList.toggle('is-open', !isOpen);
});
navLinks.forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => {
  if (window.innerWidth > 700) closeMenu();
});

const progress = document.querySelector('.reading-progress span');
let scrollTicking = false;
function updateProgress() {
  if (!progress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateProgress);
    scrollTicking = true;
  }
}, { passive: true });
updateProgress();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -32px 0px' });
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 75}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const dialog = document.querySelector('.project-dialog');
const dialogImage = dialog?.querySelector('.dialog-image img');
const dialogTitle = dialog?.querySelector('#dialog-title');
const dialogKind = dialog?.querySelector('.dialog-kind');
const dialogIndex = dialog?.querySelector('.dialog-index');
const dialogDescription = dialog?.querySelector('.dialog-description');
const dialogLink = dialog?.querySelector('.dialog-link');
const previousFocus = { element: null };

document.querySelectorAll('.work-card').forEach((card) => {
  card.addEventListener('click', () => {
    if (!dialog || !dialogImage || !dialogTitle || !dialogKind || !dialogDescription || !dialogLink) return;
    const image = card.querySelector('img');
    previousFocus.element = card;
    dialogImage.src = image?.src ?? '';
    dialogImage.alt = image?.alt ?? '';
    dialogTitle.textContent = card.dataset.title ?? 'Selected work';
    dialogKind.textContent = card.dataset.kind ?? 'PROJECT PREVIEW';
    if (dialogIndex) dialogIndex.textContent = `${card.dataset.project ?? '01'} / 04`;
    dialogDescription.textContent = card.dataset.description ?? '';
    dialogLink.href = card.dataset.url ?? '#contact';
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});

dialog?.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  previousFocus.element?.focus();
});
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog?.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());

document.querySelector('#current-year').textContent = String(new Date().getFullYear());
