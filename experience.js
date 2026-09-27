(() => {
  const $ = (id) => document.getElementById(id);
  const journey = $('inicio');
  const frames = [...document.querySelectorAll('.sequence-frame')];
  const lookSurface = $('look-surface');
  const lookLeft = $('look-left');
  const lookRight = $('look-right');
  const status = $('scene-status');
  const fill = $('progress-fill');
  const soundStatus = $('sound-status');
  const muteButton = $('mute-button');
  const audio = $('ambient-audio');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const audioSource = audio.dataset.src || '';
  let progress = 0;
  let lookFrame = frames.length - 1;
  let soundEnabled = false;
  let muted = true;
  let dragging = false;
  let lastX = 0;
  let frame = 0;

  $('year').textContent = new Date().getFullYear();
  if (audioSource) audio.src = audioSource;
  else soundStatus.textContent = 'Trilha ainda não adicionada';

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const interiorStart = 4; // The last four supplied frames are views from inside.
  function syncLookButtons() {
    lookLeft.disabled = lookFrame >= frames.length - 1;
    lookRight.disabled = lookFrame <= interiorStart;
  }
  function changeLook(delta) {
    lookFrame = clamp(lookFrame + delta, interiorStart, frames.length - 1);
    syncLookButtons();
    requestRender();
  }
  function updateVolume() {
    // The listener chooses to play. Scroll only changes level; it never starts audio.
    audio.volume = soundEnabled && !muted ? clamp((progress - .12) / .72, 0, 1) * .2 : 0;
  }
  function render() {
    frame = 0;
    const range = Math.max(1, journey.offsetHeight - window.innerHeight);
    progress = clamp((window.scrollY - journey.offsetTop) / range, 0, 1);
    // Native scroll controls the photographic order, and reverse scroll retraces it.
    const inside = progress >= .88;
    if (!inside) lookFrame = frames.length - 1;
    const position = inside ? lookFrame : (progress / .88) * (frames.length - 1);
    const shown = reducedMotion.matches ? Math.round(position) : position;
    const index = Math.min(frames.length - 1, Math.floor(shown));
    const phase = shown - index;
    const t = clamp((phase - .28) / .72, 0, 1);
    const fade = t * t * (3 - 2 * t);
    frames.forEach((frame, i) => {
      frame.style.opacity = String(i === index ? 1 : i === index + 1 ? fade : 0);
      frame.setAttribute('aria-hidden', String(i !== (fade > .5 ? index + 1 : index)));
    });
    journey.dataset.scene = inside ? 'inside' : 'outside';
    lookSurface.tabIndex = inside ? 0 : -1;
    const announced = `${String(Math.min(frames.length, Math.round(shown) + 1)).padStart(2, '0')} / ${frames.length} · ${frames[Math.round(shown)].dataset.stage}`;
    if (status.textContent !== announced) status.textContent = announced;
    syncLookButtons();
    fill.style.width = `${(progress * 100).toFixed(1)}%`;
    updateVolume();
  }
  function requestRender() { if (!frame) frame = requestAnimationFrame(render); }
  addEventListener('scroll', requestRender, {passive:true});
  addEventListener('resize', requestRender, {passive:true});
  reducedMotion.addEventListener?.('change', requestRender);

  function goTo(fraction) {
    const range = Math.max(1, journey.offsetHeight - window.innerHeight);
    scrollTo({top: journey.offsetTop + range * fraction, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  }
  $('back-outside').addEventListener('click', () => goTo(0));
  function syncMute() {
    audio.muted = muted;
    muteButton.setAttribute('aria-label', muted ? 'Ativar som' : 'Silenciar');
    muteButton.setAttribute('aria-pressed', String(!muted));
    updateVolume();
  }
  muteButton.addEventListener('click', async () => {
    if (!audioSource) { muted = true; syncMute(); soundStatus.textContent = 'Trilha ainda não adicionada'; return; }
    muted = !muted;
    if (!muted) {
      soundEnabled = true;
      try { await audio.play(); soundStatus.textContent = 'Som suave ativo'; }
      catch { muted = true; soundEnabled = false; soundStatus.textContent = 'Não foi possível iniciar o áudio'; }
    } else soundStatus.textContent = 'Áudio silenciado';
    syncMute();
  });
  lookLeft.addEventListener('click', () => changeLook(1));
  lookRight.addEventListener('click', () => changeLook(-1));
  lookSurface.addEventListener('pointerdown', (event) => {
    if (journey.dataset.scene !== 'inside') return;
    dragging = true; lastX = event.clientX;
    lookSurface.setPointerCapture(event.pointerId);
  });
  lookSurface.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const delta = event.clientX - lastX;
    lastX = event.clientX;
    changeLook(-delta / Math.max(120, lookSurface.clientWidth) * 3.5);
  });
  const stopDrag = () => {dragging = false};
  lookSurface.addEventListener('pointerup', stopDrag);
  lookSurface.addEventListener('pointercancel', stopDrag);
  lookSurface.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {event.preventDefault();changeLook(1)}
    if (event.key === 'ArrowRight') {event.preventDefault();changeLook(-1)}
  });
  syncMute(); render();
})();
