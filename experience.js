(() => {
  const $ = (id) => document.getElementById(id);
  const journey = $('inicio');
  const facade = $('facade-image');
  const threshold = $('threshold-scene');
  const thresholdImage = $('threshold-image');
  const interior = $('interior-scene');
  const interiorImage = $('interior-image');
  const lookSurface = $('look-surface');
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
    const smooth = (from, to) => {
      const t = clamp((progress - from) / (to - from), 0, 1);
      return t * t * (3 - 2 * t);
    };
    // Each frame overlaps the next; rewinding scroll retraces precisely the same path.
    const near = smooth(0, .65);
    const approach = smooth(.35, .88);
    const bridge = smooth(.34, .59) * (1 - smooth(.72, .92));
    const reveal = smooth(.7, .95);
    facade.style.transform = reducedMotion.matches ? 'none' : `scale(${(1 + 2.05 * near).toFixed(3)})`;
    threshold.style.opacity = String(reducedMotion.matches ? 0 : bridge);
    // The full facade has its doorway around 60% of the frame; the close view centers it.
    const doorwayOffset = window.innerWidth > 650 ? .10 : 0;
    thresholdImage.style.transform = reducedMotion.matches ? 'none' : `translate3d(${((1 - approach) * window.innerWidth * doorwayOffset).toFixed(1)}px,0,0) scale(${(1 + .42 * approach).toFixed(3)})`;
    interior.style.opacity = String(reducedMotion.matches ? Number(progress >= .67) : reveal);
    journey.dataset.scene = progress >= .9 ? 'inside' : 'outside';
    lookSurface.tabIndex = progress >= .9 ? 0 : -1;
    status.textContent = progress >= .9 ? '03 / Interior conceitual' : progress >= .46 ? '02 / Entrada' : '01 / Fachada';
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
  syncMute(); drawPan(); render();
})();
