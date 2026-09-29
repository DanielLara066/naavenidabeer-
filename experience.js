(() => {
  const $ = (id) => document.getElementById(id);
  const journey = $('inicio');
  const frames = [...document.querySelectorAll('.photo-journey .sequence-frame')];
  const images = frames.map((frame) => frame.querySelector('.frame-image'));
  const status = $('scene-status');
  const fill = $('progress-fill');
  const audio = $('ambient-audio');
  const muteButton = $('mute-button');
  const soundStatus = $('sound-status');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const audioSource = audio.dataset.src || '';

  // Similarity registrations measured between shared details of neighboring photos.
  // Each tuple maps the current photograph to the next: scale, horizontal and
  // vertical offset as fractions of the uncropped image. The 05→06 match uses
  // the common bar counter: the entrance itself changes shape in the sources.
  const transitions = [
    [1.081, -.0178, -.0015], [1.049, -.0141, -.0330],
    [.987, -.0161, -.0057], [1.019, .0008, -.0214],
    [1.350, -.0930, 0],
    [1.036, .0035, -.0235], [1.016, .0021, -.0094],
    [1.072, .0144, -.0168], [1.108, -.0121, -.0345]
  ];
  const centers = [.588, .586, .581, .580, .587, .500, .500, .500, .500, .500];
  const ready = images.map(() => false);
  const pending = images.map(() => false);
  const opacity = frames.map(() => -1);
  let target = 0, progress = 0, lastTime = 0, frameRequest = 0;
  let muted = true, enabled = false;
  let viewportW = innerWidth, viewportH = $('journey-view').clientHeight;
  let top = journey.offsetTop, range = Math.max(1, journey.offsetHeight - innerHeight);
  let active = new Set(), visibleScene = -1, lastReady = 0, lastAudible = -1;

  $('year').textContent = new Date().getFullYear();
  if (audioSource) audio.src = audioSource;
  else {
    muteButton.disabled = true;
    muteButton.setAttribute('aria-label', 'Som indisponível');
    soundStatus.textContent = 'Trilha ainda não adicionada';
  }

  function requestRender() {
    if (!frameRequest) frameRequest = requestAnimationFrame(render);
  }
  function prepare(index) {
    if (index < 0 || index >= images.length || ready[index] || pending[index]) return;
    const img = images[index];
    pending[index] = true;
    const selectedSource = img.currentSrc;
    const done = () => {
      pending[index] = false;
      if (img.currentSrc !== selectedSource) { prepare(index); return; }
      ready[index] = img.naturalWidth > 0;
      if (ready[index]) requestRender();
    };
    if (img.decode) img.decode().then(done).catch(done);
    else if (img.complete) done();
    else img.addEventListener('load', done, {once:true});
  }
  images.forEach((img, index) => {
    img.decoding = 'async';
    img.fetchPriority = index < 2 ? 'high' : 'low';
    if (index < 2) prepare(index);
  });
  frames.forEach((frame, index) => frame.setAttribute('aria-hidden', String(index !== 0)));

  function updateVolume() {
    audio.volume = enabled && !muted ? clamp((progress - .08) / .72, 0, 1) * .2 : 0;
  }
  function updateTarget() {
    target = clamp((scrollY - top) / range, 0, 1);
    const predicted = Math.min(9, Math.floor(clamp(target / .94, 0, 1) * 9));
    for (let i = Math.max(0, predicted - 1); i <= Math.min(9, predicted + 2); i++) prepare(i);
    if (target !== progress) requestRender();
  }
  function updateGeometry() {
    viewportW = innerWidth;
    viewportH = $('journey-view').clientHeight;
    top = journey.offsetTop;
    range = Math.max(1, journey.offsetHeight - innerHeight);
    images.forEach((img, index) => {
      if (ready[index] && (!img.complete || !img.naturalWidth)) ready[index] = false;
    });
    updateTarget();
    requestRender();
  }
  function align(index, movement = 0) {
    const img = images[index];
    if (!img.naturalWidth) return;
    const width = viewportW;
    const height = viewportH;
    const cover = Math.max(width / img.naturalWidth, height / img.naturalHeight);
    const imageW = img.naturalWidth * cover;
    const imageH = img.naturalHeight * cover;
    const overscan = 1.025;
    const [relativeScale, shiftX, shiftY] = transitions[index] || [1, 0, 0];
    const next = Math.min(index + 1, images.length - 1);
    const baseX = -(centers[index] - .5) * imageW * overscan;
    const nextBaseX = -(centers[next] - .5) * imageW * overscan;
    const scale = overscan * (1 + (relativeScale - 1) * movement);
    const rawX = baseX + (imageW * shiftX * overscan + nextBaseX - baseX) * movement;
    const rawY = imageH * shiftY * overscan * movement;
    const tx = clamp(rawX, (width - imageW * scale) / 2, (imageW * scale - width) / 2);
    const ty = clamp(rawY, (height - imageH * scale) / 2, (imageH * scale - height) / 2);
    img.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
  }
  function setOpacity(index, value) {
    if (opacity[index] !== value) {
      opacity[index] = value;
      frames[index].style.opacity = String(value);
    }
  }
  function render(time = 0) {
    frameRequest = 0;
    const dt = lastTime ? clamp(time - lastTime, 0, 48) : 16;
    lastTime = time;
    // ~28ms response at 60Hz; stop on convergence instead of keeping an idle RAF loop.
    const damping = reducedMotion.matches ? 1 : 1 - Math.exp(-dt / 28);
    progress += (target - progress) * damping;
    if (Math.abs(target - progress) < .00025) progress = target;

    const rawPosition = clamp(progress / .94, 0, 1) * (frames.length - 1);
    const position = reducedMotion.matches ? Math.round(rawPosition) : rawPosition;
    const current = Math.min(frames.length - 1, Math.floor(position));
    const phase = position - current;
    const eased = phase * phase * (3 - 2 * phase);
    const next = Math.min(current + 1, frames.length - 1);
    // Photo 05 shows a serving opening while 06 shows a full door. A near-instant
    // cut on their matched counter avoids visibly doubling incompatible walls.
    const startFade = current === 4 ? .985 : .90;
    const blend = reducedMotion.matches ? 0 : clamp((phase - startFade) / (1 - startFade), 0, 1);
    const fade = blend * blend * (3 - 2 * blend);
    prepare(current);
    prepare(next);
    const base = ready[current] ? current : lastReady;
    const overlay = base === current && ready[next] && next !== current && fade > 0 ? next : -1;
    if (ready[base]) lastReady = base;
    align(base, base === current ? eased : 0);
    if (overlay >= 0) align(overlay, 0);
    const newActive = new Set(overlay >= 0 ? [base, overlay] : [base]);
    for (const index of active) {
      if (!newActive.has(index)) {
        frames[index].classList.remove('is-active');
        setOpacity(index, 0);
      }
    }
    for (const index of newActive) if (!active.has(index)) frames[index].classList.add('is-active');
    active = newActive;
    setOpacity(base, overlay >= 0 ? 1 - fade : 1);
    if (overlay >= 0) setOpacity(overlay, fade);
    const audibleFrame = overlay >= 0 && fade > .5 ? overlay : base;
    if (visibleScene !== audibleFrame) {
      const announced = `${String(audibleFrame + 1).padStart(2, '0')} / ${frames.length} · ${frames[audibleFrame].dataset.stage}`;
      status.textContent = announced;
      visibleScene = audibleFrame;
    }
    if (lastAudible !== audibleFrame) {
      if (lastAudible >= 0) frames[lastAudible].setAttribute('aria-hidden', 'true');
      frames[audibleFrame].setAttribute('aria-hidden', 'false');
      lastAudible = audibleFrame;
    }
    fill.style.transform = `scaleX(${progress.toFixed(4)})`;
    updateVolume();
    if (progress !== target) requestRender();
  }
  addEventListener('scroll', updateTarget, {passive:true});
  addEventListener('resize', updateGeometry, {passive:true});
  reducedMotion.addEventListener?.('change', updateTarget);

  function syncMute() {
    audio.muted = muted;
    muteButton.setAttribute('aria-label', !audioSource ? 'Som indisponível' : muted ? 'Ativar som' : 'Silenciar');
    muteButton.setAttribute('aria-pressed', String(!muted));
    updateVolume();
  }
  muteButton.addEventListener('click', async () => {
    if (!audioSource) return;
    muted = !muted;
    if (!muted) {
      enabled = true;
      try { await audio.play(); soundStatus.textContent = 'Som suave ativo'; }
      catch { muted = true; enabled = false; soundStatus.textContent = 'Não foi possível iniciar o áudio'; }
    } else soundStatus.textContent = 'Áudio silenciado';
    syncMute();
  });
  syncMute();
  updateTarget();
})();
