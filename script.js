const eyeBtn = document.getElementById('eyeBtn');
const eyeIcon = document.getElementById('eyeIcon');
const volumeBtn = document.getElementById('volumeBtn');
const volumeIcon = document.getElementById('volumeIcon');
const desktopContent = document.getElementById('desktopContent');
const mainMenu = document.getElementById('mainMenu');
const menuEnterBtn = document.getElementById('menuEnterBtn');
const menuVolBtn = document.getElementById('menuVolBtn');
const menuVolIcon = document.getElementById('menuVolIcon');
const menuEyeBtn = document.getElementById('menuEyeBtn');
const menuEyeIcon = document.getElementById('menuEyeIcon');

let eyeVisible = true;
let volumeMuted = false;

function getEyeSvg(visible) {
  if (visible) {
    return `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
  }
  return `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><line x1="3" y1="3" x2="21" y2="21"/>`;
}

function getVolumeSvg(muted) {
  if (muted) {
    return `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`;
  }
  return `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>`;
}

function toggleEye() {
  eyeVisible = !eyeVisible;
  eyeBtn.classList.toggle('active', !eyeVisible);
  menuEyeBtn.classList.toggle('active', !eyeVisible);
  eyeIcon.innerHTML = getEyeSvg(eyeVisible);
  menuEyeIcon.innerHTML = getEyeSvg(eyeVisible);
  document.body.classList.toggle('reduce-motion', !eyeVisible);
}

function toggleVolume() {
  volumeMuted = !volumeMuted;
  volumeBtn.classList.toggle('active', volumeMuted);
  menuVolBtn.classList.toggle('active', volumeMuted);
  volumeIcon.innerHTML = getVolumeSvg(volumeMuted);
  menuVolIcon.innerHTML = getVolumeSvg(volumeMuted);
  document.querySelectorAll('audio, video').forEach(el => el.muted = volumeMuted);
}

function enterSite() {
  mainMenu.classList.add('hidden');
}

eyeBtn.addEventListener('click', toggleEye);
volumeBtn.addEventListener('click', toggleVolume);
menuEyeBtn.addEventListener('click', toggleEye);
menuVolBtn.addEventListener('click', toggleVolume);
menuEnterBtn.addEventListener('click', enterSite);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !mainMenu.classList.contains('hidden')) {
    enterSite();
  }
});

const fingerTip = document.querySelector('.finger-seg.tip');
const handFinger = document.querySelector('.hand-finger');
let isDragging = false;
let startX = 0;
let startWidth = 0;
let lastPos = 0;
let hasFarted = false;

function playFart() {
  const audio = new Audio('assets/fart.mp3');
  audio.volume = 0.6;
  audio.play().catch(() => {});
}

fingerTip.addEventListener('mousedown', (e) => {
  if (e.target.closest('.finger-btn')) return;
  isDragging = true;
  startX = e.clientX;
  startWidth = handFinger.offsetWidth;
  lastPos = e.clientX;
  hasFarted = false;
  handFinger.style.transition = 'none';
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - startX;
  if (dx > 20 && !hasFarted) {
    hasFarted = true;
    playFart();
  }
  const rawWidth = Math.max(startWidth, startWidth + dx);
  if (document.body.classList.contains('reduce-motion')) {
    const stepped = Math.round(rawWidth / 100) * 100;
    handFinger.style.width = stepped + 'px';
  } else {
    handFinger.style.width = rawWidth + 'px';
  }
  lastPos = e.clientX;
});

document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  if (document.body.classList.contains('reduce-motion')) {
    handFinger.classList.add('snapping');
    handFinger.style.transition = 'width 0.8s steps(6)';
  } else {
    handFinger.style.transition = 'width 0.25s ease';
  }
  handFinger.style.width = '';
  setTimeout(() => {
    handFinger.classList.remove('snapping');
    handFinger.style.transition = '';
  }, 900);
});
