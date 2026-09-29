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

  // Door center, threshold and apparent opening width, measured on the original photographs.
  // The sixth photo onward has a different perspective; these anchors only register
  // the opening, without warping or inventing missing geometry.
  const views = [
    [.586, .805, .173], [.582, .807, .180], [.577, .812, .196],
    [.573, .818, .207], [.568, .823, .190], [.496, .824, .350],
    [.495, .846, .358], [.496, .846, .376], [.498, .842, .392], [.500, .842, .415]
  ];
  // Slight overscan ensures there are no empty edges when photo geometry is registered.
  const opening = [.185, .195, .215, .232, .250, .370, .385, .405, .425, .448];
  const ready = images.map((img) => img.complete && img.naturalWidth > 0);
  let target = 0, progress = 0, lastTime = 0, frameRequest = 0;
  let muted = true, enabled = false;

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
  images.forEach((img, index) => {
    img.loading = 'eager';
    img.decoding = 'async';
    if (index < 3) img.fetchPriority = 'high';
    const markReady = () => { ready[index] = true; requestRender(); };
    img.addEventListener('load', markReady, {once:true});
    if (img.decode) img.decode().then(markReady).catch(() => { if (img.naturalWidth) markReady(); });
  });

  function updateVolume() {
    audio.volume = enabled && !muted ? clamp((progress - .08) / .72, 0, 1) * .2 : 0;
  }
  function updateTarget() {
    const range = Math.max(1, journey.offsetHeight - innerHeight);
    target = clamp((scrollY - journey.offsetTop) / range, 0, 1);
    requestRender();
  }
  function align(index, desiredOpening) {
    const img = images[index];
    if (!img.naturalWidth) return;
    const width = innerWidth;
    const height = $('journey-view').clientHeight;
    const cover = Math.max(width / img.naturalWidth, height / img.naturalHeight);
    const imageW = img.naturalWidth * cover;
    const imageH = img.naturalHeight * cover;
    const [x, y, originalOpening] = views[index];
    const scale = Math.max(1.025, desiredOpening / originalOpening);
    const centeredX = .535 - .035 * Math.min(1, index / 5);
    const centeredY = .805 + .037 * Math.min(1, index / 7);
    const tx = clamp((centeredX - .5) * width - (x - .5) * imageW * scale,
      (width - imageW * scale) / 2, (imageW * scale - width) / 2);
    const ty = clamp((centeredY - .5) * height - (y - .5) * imageH * scale,
      (height - imageH * scale) / 2, (imageH * scale - height) / 2);
    img.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
  }
  function render(time = 0) {
    frameRequest = 0;
    const dt = lastTime ? Math.min(time - lastTime, 100) : 16;
    lastTime = time;
    const damping = reducedMotion.matches ? 1 : 1 - Math.exp(-dt / 68);
    progress += (target - progress) * damping;
    if (Math.abs(target - progress) < .00015) progress = target;

    const rawPosition = clamp(progress / .94, 0, 1) * (frames.length - 1);
    const position = reducedMotion.matches ? Math.round(rawPosition) : rawPosition;
    const current = Math.min(frames.length - 1, Math.floor(position));
    const phase = position - current;
    const eased = phase * phase * (3 - 2 * phase);
    const desiredOpening = opening[current] + (opening[Math.min(current + 1, 9)] - opening[current]) * eased;
    const next = Math.min(current + 1, frames.length - 1);
    // A short blend only at the end of each movement segment, after the two openings align.
    const blend = reducedMotion.matches ? 0 : clamp((phase - .88) / .12, 0, 1);
    const fade = blend * blend * (3 - 2 * blend);
    const visible = ready[next] ? next : current;
    align(current, desiredOpening);
    if (visible !== current) align(visible, desiredOpening);
    frames.forEach((item, index) => {
      const opacity = index === current ? 1 : index === visible ? fade : 0;
      const shown = index === current ? visible === current ? 1 : 1 - fade : opacity;
      if (item.style.opacity !== String(shown)) item.style.opacity = String(shown);
      const hidden = String(index !== (visible !== current && fade > .5 ? visible : current));
      if (item.getAttribute('aria-hidden') !== hidden) item.setAttribute('aria-hidden', hidden);
    });
    const scene = Math.min(9, Math.round(position));
    const announced = `${String(scene + 1).padStart(2, '0')} / ${frames.length} · ${frames[scene].dataset.stage}`;
    if (status.textContent !== announced) status.textContent = announced;
    fill.style.width = `${(progress * 100).toFixed(1)}%`;
    updateVolume();
    if (progress !== target) requestRender();
  }
  addEventListener('scroll', updateTarget, {passive:true});
  addEventListener('resize', updateTarget, {passive:true});
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
