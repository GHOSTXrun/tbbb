(() => {
  const original = document.querySelector('main canvas.absolute + div > svg[width="96"]')?.parentElement.previousElementSibling;
  if (!(original instanceof HTMLCanvasElement)) return;

  // The archive can render without React hydration. In that case, run the ring on a separate canvas.
  function nativeIsDrawing() {
    if (!original.width || !original.height) return false;
    try {
      return original.getContext('2d').getImageData(original.width >> 1, original.height >> 1, 1, 1).data[3] > 0;
    } catch {
      return true;
    }
  }

  function start() {
    if (nativeIsDrawing()) return;
    const canvas = original.cloneNode();
    canvas.dataset.kyvexaRing = 'fallback';
    original.before(canvas);
    const context = canvas.getContext('2d');
    const pixels = document.createElement('canvas');
    const pixelContext = pixels.getContext('2d');
    if (!context || !pixelContext) {
      canvas.remove();
      return;
    }

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rings = [
      { radius: 1, count: 90, length: 2, speed: 0.02, alpha: 0.32 },
      { radius: 0.86, count: 60, length: 3, speed: -0.035, alpha: 0.42 },
      { radius: 0.7, count: 36, length: 1, speed: 0.06, alpha: 0.38 },
      { radius: 0.56, count: 24, length: 3, speed: -0.09, alpha: 0.30 },
    ];
    const labels = ['7Hx2', '9qEe', 'Fm4k', '3vTa', 'BkP9', 'Q2sL', 'Dn7c'];
    const assets = ['SOL', 'USDC', 'JUP'];
    const lanes = labels.map((label, index) => ({
      label: label + '…',
      x: (-0.1 + 0.37 * index) % 1.2,
      amount: (10 + Math.random() * 90).toFixed(2) + ' ' + assets[index % assets.length],
    }));
    const turn = Math.PI * 2;
    const started = performance.now();
    let width = 0;
    let height = 0;
    let frame = 0;
    let timer;
    let pointer;

    function onPointer(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointer = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height ? { x, y } : undefined;
    }

    function resize() {
      ({ width, height } = canvas.getBoundingClientRect());
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      pixels.width = Math.ceil(width / 4);
      pixels.height = Math.ceil(height / 4);
      if (reducedMotion) draw(performance.now());
    }

    function draw(now) {
      if (width < 1 || height < 1) {
        if (!reducedMotion) frame = requestAnimationFrame(draw);
        return;
      }
      const elapsed = reducedMotion ? 0 : (now - started) / 1000;
      const x = width / 2;
      const y = height / 2;
      const radius = Math.min(width * 0.36, height * 0.44);
      const focus = pointer ? Math.atan2(pointer.y - y, pointer.x - x) : elapsed * 0.5;
      context.clearRect(0, 0, width, height);
      pixelContext.clearRect(0, 0, pixels.width, pixels.height);

      rings.forEach((ring, ringIndex) => {
        for (let index = 0; index < ring.count; index++) {
          const angle = index / ring.count * turn + elapsed * ring.speed * (pointer ? 2.2 : 1);
          const delta = (angle - focus) % turn;
          const sweep = (delta + turn) % turn;
          const highlight = ringIndex % 2 === 1 && sweep < 0.7;
          const tick = index % (ringIndex === 0 ? 15 : 6) === 0;
          pixelContext.fillStyle = highlight
            ? 'rgba(255,152,0,' + Math.max(0.15, 1 - 1.3 * sweep) + ')'
            : 'rgba(255,242,207,' + (tick ? 1.7 * ring.alpha : ring.alpha) + ')';
          for (let offset = 0; offset < ring.length * (tick ? 2 : 1); offset++) {
            const distance = radius * ring.radius / 4 - offset;
            pixelContext.fillRect(Math.round(x / 4 + Math.cos(angle) * distance), Math.round(y / 4 + Math.sin(angle) * distance), 1, 1);
          }
        }
      });

      context.imageSmoothingEnabled = false;
      context.drawImage(pixels, 0, 0, pixels.width * 4, pixels.height * 4);
      context.font = '500 ' + Math.max(10, Math.min(12.5, width / 80)) + 'px ui-monospace, monospace';
      context.textBaseline = 'middle';
      lanes.forEach((lane, index) => {
        const left = (((lane.x + elapsed * (0.022 + index * 0.001)) % 1.3 + 1.3) % 1.3 - 0.15) * width;
        const top = y + (index - 3) * radius * 1.7 / lanes.length;
        const inside = (left - x) ** 2 + (top - y) ** 2 < radius ** 2;
        const text = inside ? Math.floor(index * 773 + elapsed * 31).toString(16).padStart(6, '0') : left > x ? '▄▄▄▄▄' : lane.amount;
        context.fillStyle = 'rgba(255,242,207,.53)';
        context.fillText(lane.label, left, top);
        context.fillStyle = inside || left > x ? '#ff9800' : '#e5d0a0';
        context.fillText(text, left + context.measureText(lane.label).width + 8, top);
      });

      const fade = context.createLinearGradient(0, 0, width, 0);
      fade.addColorStop(0, '#070707');
      fade.addColorStop(0.12, '#07070700');
      fade.addColorStop(0.88, '#07070700');
      fade.addColorStop(1, '#070707');
      context.fillStyle = fade;
      context.fillRect(0, 0, width, height);
      context.fillStyle = 'rgba(7,7,7,.92)';
      context.beginPath();
      context.arc(x, y, radius * 0.42, 0, turn);
      context.fill();
      if (!reducedMotion) frame = requestAnimationFrame(draw);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    if (!reducedMotion) {
      window.addEventListener('pointermove', onPointer, { passive: true });
      frame = requestAnimationFrame(draw);
    }
    resize();
    timer = setInterval(() => {
      if (original.isConnected && !nativeIsDrawing()) return;
      clearInterval(timer);
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointer);
      canvas.remove();
    }, 1500);
  }

  setTimeout(start, 350);
})();
