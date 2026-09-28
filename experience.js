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
  const ready = images.map((img) => img.complete && img.naturalWidth > 0);
  let progress = 0;
  let frameRequest = 0;
  let muted = true;
  let enabled = false;

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
    const markReady = () => { ready[index] = true; requestRender(); };
    img.addEventListener('load', markReady, {once:true});
    if (img.decode) img.decode().then(markReady).catch(() => {});
  });

  function updateVolume() {
    // Playback requires an explicit click. Native scrolling only changes the level.
    audio.volume = enabled && !muted ? clamp((progress - .08) / .72, 0, 1) * .2 : 0;
  }
  function render() {
    frameRequest = 0;
    const range = Math.max(1, journey.offsetHeight - innerHeight);
    progress = clamp((scrollY - journey.offsetTop) / range, 0, 1);
    const position = clamp(progress / .92, 0, 1) * (frames.length - 1);
    const shown = reducedMotion.matches ? Math.round(position) : position;
    const target = Math.min(frames.length - 1, Math.floor(shown));
    const phase = shown - target;
    const t = clamp((phase - .64) / .36, 0, 1);
    const fade = t * t * (3 - 2 * t);
    // If a fast scroll outruns image decoding, hold the most recent ready frame.
    let base = target;
    while (base > 0 && !ready[base]) base--;
    const next = base === target && ready[target + 1] ? target + 1 : -1;
    frames.forEach((item, index) => {
      const opacity = index === base ? 1 : index === next ? fade : 0;
      if (item.style.opacity !== String(opacity)) item.style.opacity = String(opacity);
      const hidden = String(index !== (next >= 0 && fade > .5 ? next : base));
      if (item.getAttribute('aria-hidden') !== hidden) item.setAttribute('aria-hidden', hidden);
      item.classList.toggle('is-active', opacity > 0);
    });
    const announced = `${String(Math.min(frames.length, Math.round(shown) + 1)).padStart(2, '0')} / ${frames.length} · ${frames[Math.round(shown)].dataset.stage}`;
    if (status.textContent !== announced) status.textContent = announced;
    fill.style.width = `${(progress * 100).toFixed(1)}%`;
    updateVolume();
  }
  addEventListener('scroll', requestRender, {passive:true});
  addEventListener('resize', requestRender, {passive:true});
  reducedMotion.addEventListener?.('change', requestRender);

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
  render();
})();
