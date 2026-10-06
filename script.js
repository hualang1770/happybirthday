const music = document.getElementById('birthday-music');
const musicControl = document.getElementById('music-control');
const musicLabel = document.getElementById('music-label');
const secretTrigger = document.getElementById('secret-trigger');
const secretLetter = document.getElementById('secret-letter');
const welcomeScreen = document.getElementById('welcome-screen');
const enterButton = document.getElementById('enter-button');
const page = document.querySelector('.page');
let hasStarted = false;
let userPaused = false;

music.volume = 0.5;

function updateMusicControl() {
  const playing = !music.paused;
  musicControl.setAttribute('aria-pressed', String(playing));
  musicControl.setAttribute('aria-label', playing ? '暂停背景音乐' : '播放背景音乐');
  musicLabel.textContent = playing ? '暂停音乐' : '播放音乐';
}

function showWelcome() {
  if (!welcomeScreen.hidden) return;
  welcomeScreen.hidden = false;
  document.body.classList.add('welcome-open');
  page.inert = true;
  musicControl.inert = true;
  enterButton.focus();
}

function hideWelcome() {
  if (welcomeScreen.hidden) return;
  welcomeScreen.hidden = true;
  document.body.classList.remove('welcome-open');
  page.inert = false;
  musicControl.inert = false;
  document.getElementById('open-letter').focus({ preventScroll: true });
}

function startMusic() {
  if (music.paused) music.play().catch(() => {
    if (music.error) {
      musicLabel.textContent = '音乐加载失败';
      return;
    }
    showWelcome();
  });
}

enterButton.addEventListener('click', async () => {
  try {
    await music.play();
  } catch {
    musicLabel.textContent = '音乐加载失败';
    hideWelcome();
  }
});

musicControl.addEventListener('click', async () => {
  if (music.paused) {
    userPaused = false;
    try {
      await music.play();
    } catch {
      musicLabel.textContent = '点击重试播放';
      return;
    }
  } else {
    userPaused = true;
    music.pause();
  }
  updateMusicControl();
});

document.getElementById('open-letter').addEventListener('click', startMusic);
secretTrigger.addEventListener('click', () => {
  const opening = secretLetter.hidden;
  secretLetter.hidden = !opening;
  secretTrigger.setAttribute('aria-expanded', String(opening));
  secretTrigger.setAttribute('aria-label', opening ? '收起藏起来的信' : '打开藏起来的信');
  secretTrigger.title = opening ? '收起这封信' : '这里还藏着一封信';
  if (opening) {
    secretLetter.querySelector('h2').focus({ preventScroll: true });
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    secretLetter.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  } else {
    secretTrigger.focus();
  }
});
music.addEventListener('play', () => {
  hasStarted = true;
  hideWelcome();
  updateMusicControl();
});
music.addEventListener('pause', updateMusicControl);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && hasStarted && !userPaused && music.paused) {
    music.play().catch(showWelcome);
  }
});
music.addEventListener('error', () => {
  hideWelcome();
  musicLabel.textContent = '音乐加载失败';
});
startMusic();
