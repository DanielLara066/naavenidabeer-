(() => {
  const $ = (id) => document.getElementById(id);
  const journey = $('inicio');
  const facade = $('facade-image');
  const interior = $('interior-scene');
  const interiorImage = $('interior-image');
  const lookSurface = $('look-surface');
  const copy = $('hero-copy');
  const hint = $('scroll-hint');
  const status = $('scene-status');
  const fill = $('progress-fill');
  const soundStatus = $('sound-status');
  const muteButton = $('mute-button');
  const audio = $('ambient-audio');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const audioSource = audio.dataset.src || '';
  let progress = 0;
  let pan = 0;
  let soundEnabled = false;
  let muted = true;
  let dragging = false;
  let lastX = 0;
  let frame = 0;

  $('year').textContent = new Date().getFullYear();
  if (audioSource) audio.src = audioSource;
  else soundStatus.textContent = 'Trilha ainda não adicionada';

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  function panLimit() {
    const imageWidth = interiorImage.getBoundingClientRect().width;
    const viewWidth = lookSurface.getBoundingClientRect().width;
    return Math.max(0, Math.min((imageWidth - viewWidth) / 2, Math.max(220, viewWidth * .55)));
  }
  function drawPan() {
    pan = clamp(pan, -panLimit(), panLimit());
    interiorImage.style.setProperty('--look-offset', `${pan}px`);
  }
  function updateVolume() {
    // The listener chooses to play. Scroll only changes level; it never starts audio.
    audio.volume = soundEnabled && !muted ? clamp((progress - .12) / .72, 0, 1) * .2 : 0;
  }
  function render() {
    frame = 0;
    const range = Math.max(1, journey.offsetHeight - window.innerHeight);
    progress = clamp((window.scrollY - journey.offsetTop) / range, 0, 1);
    const near = clamp(progress / .73, 0, 1);
    const reveal = reducedMotion.matches ? Number(progress >= .64) : clamp((progress - .59) / .25, 0, 1);
    facade.style.transform = reducedMotion.matches ? 'none' : `scale(${(1 + 1.75 * near).toFixed(3)})`;
    interior.style.opacity = String(reveal);
    copy.style.opacity = String(reducedMotion.matches ? Number(progress < .55) : 1 - clamp(progress / .28, 0, 1));
    hint.style.opacity = String(reducedMotion.matches ? Number(progress < .55) : 1 - clamp(progress / .3, 0, 1));
    copy.style.pointerEvents = progress < .2 ? 'auto' : 'none';
    journey.dataset.scene = progress >= .78 ? 'inside' : 'outside';
    lookSurface.tabIndex = progress >= .78 ? 0 : -1;
    status.textContent = progress >= .78 ? '02 / Interior conceitual' : '01 / Fachada';
    fill.style.width = `${(progress * 100).toFixed(1)}%`;
    updateVolume();
  }
  function requestRender() { if (!frame) frame = requestAnimationFrame(render); }
  addEventListener('scroll', requestRender, {passive:true});
  addEventListener('resize', () => {drawPan(); requestRender()}, {passive:true});
  reducedMotion.addEventListener?.('change', requestRender);

  function goTo(fraction) {
    const range = Math.max(1, journey.offsetHeight - window.innerHeight);
    scrollTo({top: journey.offsetTop + range * fraction, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  }
  $('enter-quiet').addEventListener('click', () => goTo(.9));
  $('back-outside').addEventListener('click', () => goTo(0));
  $('enter-sound').addEventListener('click', async () => {
    goTo(.9);
    if (!audioSource) { soundStatus.textContent = 'Trilha ainda não adicionada; visita sem som'; return; }
    soundEnabled = true;
    muted = false;
    audio.muted = false;
    updateVolume();
    try { await audio.play(); soundStatus.textContent = 'Som suave ativo'; }
    catch { soundEnabled = false; muted = true; soundStatus.textContent = 'Não foi possível iniciar o áudio'; }
    syncMute();
  });
  function syncMute() {
    audio.muted = muted;
    muteButton.textContent = muted ? 'Som desligado' : 'Silenciar';
    muteButton.setAttribute('aria-pressed', String(muted));
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
  $('look-left').addEventListener('click', () => {pan += Math.max(90, lookSurface.clientWidth * .16); drawPan()});
  $('look-right').addEventListener('click', () => {pan -= Math.max(90, lookSurface.clientWidth * .16); drawPan()});
  lookSurface.addEventListener('pointerdown', (event) => {
    if (journey.dataset.scene !== 'inside') return;
    dragging = true; lastX = event.clientX;
    lookSurface.setPointerCapture(event.pointerId);
  });
  lookSurface.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    pan += event.clientX - lastX;
    lastX = event.clientX;
    drawPan();
  });
  const stopDrag = () => {dragging = false};
  lookSurface.addEventListener('pointerup', stopDrag);
  lookSurface.addEventListener('pointercancel', stopDrag);
  lookSurface.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {event.preventDefault();pan += 110;drawPan()}
    if (event.key === 'ArrowRight') {event.preventDefault();pan -= 110;drawPan()}
  });
  drawPan(); render();
})();
