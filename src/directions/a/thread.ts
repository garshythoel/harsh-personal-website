// One loose thread hanging from the full stop. Verlet rope; rAF runs only while it moves.
// Pull it far enough and every knot on the page comes undone; pull it again and they tie back up.
import { allUntied, tieAll, untieAll } from './knots';
import { blowing, onGust, wind } from './wind';

const sheet = document.querySelector<HTMLElement>('[data-sheet]');
if (sheet) init(sheet);

function init(sheet: HTMLElement) {
  const q = <T extends Element>(s: string) => sheet.querySelector(s) as T;
  const knot = q<HTMLElement>('[data-knot]');
  const tie = q<HTMLElement>('[data-tie]');
  const handle = q<HTMLButtonElement>('[data-pull]');
  const ropePath = q<SVGPathElement>('[data-rope-path]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  const SEG = 4.6;
  const REST = 12; // ~55px of thread hanging from the full stop, clear of the first entry
  const VMAX = 9;
  const G = 0.32;
  const DAMP = 0.986;
  const ITER = 14;
  const STEP = 1000 / 60;

  let xs: number[] = [];
  let ys: number[] = [];
  let ox: number[] = [];
  let oy: number[] = [];
  let ax = 0;
  let ay = 0;
  let sheetX = 0;
  let sheetY = 0;
  let held = false;
  let tx = 0;
  let ty = 0;
  let feed = 0;
  let need = 120;
  let raf = 0;
  let last = 0;
  let acc = 0;
  let still = 0;
  let frame = 0;
  let touchedOnce = false;
  let pullTimer = 0;
  let spent = false; // this pull has already done its work; let go to reset

  function place() {
    const s = sheet.getBoundingClientRect();
    const k = knot.getBoundingClientRect();
    // a zero-height inline-block sits exactly on the baseline; the dot's centre is just above it
    const base = tie.getBoundingClientRect().top;
    sheetX = s.left + scrollX;
    sheetY = s.top + scrollY;
    ax = k.left - s.left + k.width * 0.5;
    ay = base - s.top - k.height * 0.045;
  }

  function build(coiled: boolean) {
    xs = [];
    ys = [];
    // coiled: a small curl of thread at the knot, segment lengths already true, so gravity unwinds it
    let th = 0;
    for (let i = 0; i < REST; i++) {
      if (coiled) {
        const r = 3 + th * 1.5;
        xs.push(ax + r * Math.sin(th));
        ys.push(ay + r * (1 - Math.cos(th)) * 0.85 + i * 0.5);
        th += SEG / r;
      } else {
        xs.push(ax + (i / REST) ** 2 * 7);
        ys.push(ay + i * SEG * 0.98);
      }
    }
    ox = xs.slice();
    oy = ys.slice();
    feed = 0;
  }

  // how much extra thread a pull must draw out; set when a pull starts so it always fits the viewport
  function setNeed() {
    const tailOnScreen = ys[ys.length - 1] + sheetY - scrollY;
    need = Math.max(70, Math.min(150, (innerHeight - tailOnScreen) * 0.5));
  }

  const progress = () => (feed * SEG) / need;

  function feedOne() {
    xs.splice(1, 0, ax);
    ys.splice(1, 0, ay + 0.5);
    ox.splice(1, 0, ax);
    oy.splice(1, 0, ay + 0.5);
    feed++;
  }

  function unfeedOne() {
    xs.splice(1, 1);
    ys.splice(1, 1);
    ox.splice(1, 1);
    oy.splice(1, 1);
    feed--;
  }

  function step(now: number) {
    let n = xs.length;
    let tail = n - 1;
    const wx = held ? 0 : wind(sheetX + ax, now);
    for (let i = 1; i < n; i++) {
      if (held && i === tail) continue;
      let vx = (xs[i] - ox[i]) * DAMP;
      let vy = (ys[i] - oy[i]) * DAMP;
      const v = Math.hypot(vx, vy);
      if (v > VMAX) {
        vx *= VMAX / v;
        vy *= VMAX / v;
      }
      ox[i] = xs[i];
      oy[i] = ys[i];
      xs[i] += vx + wx;
      ys[i] += vy + G;
    }
    if (held) {
      ox[tail] = xs[tail];
      oy[tail] = ys[tail];
      xs[tail] += (tx - xs[tail]) * 0.45;
      ys[tail] += (ty - ys[tail]) * 0.45;
      // thread pays out of the knot as fast as it is pulled, so the rope never stretches and never whips back
      const reach = Math.hypot(xs[tail] - ax, ys[tail] - ay);
      for (let k = 0; k < 10 && reach > (n - 1) * SEG + SEG * 0.6; k++) {
        feedOne();
        n++;
      }
      tail = n - 1;
      if (!spent && progress() >= 1) give();
    }
    xs[0] = ox[0] = ax;
    ys[0] = oy[0] = ay;
    for (let k = 0; k < ITER; k++) {
      for (let i = 0; i < n - 1; i++) {
        const dx = xs[i + 1] - xs[i];
        const dy = ys[i + 1] - ys[i];
        const d = Math.hypot(dx, dy) || 1e-6;
        const w0 = i === 0 ? 0 : 1;
        const w1 = held && i + 1 === tail ? 0 : 1;
        const w = w0 + w1;
        if (!w) continue;
        const f = (d - SEG) / d / w;
        xs[i] += dx * f * w0;
        ys[i] += dy * f * w0;
        xs[i + 1] -= dx * f * w1;
        ys[i + 1] -= dy * f * w1;
      }
    }
    frame++;
    if (held) {
      const ux = xs[1] - ax;
      const uy = ys[1] - ay;
      const ul = Math.hypot(ux, uy) || 1;
      const m = Math.min(2.5, progress() * 4);
      knot.style.transform = `translate(${((ux / ul) * m).toFixed(2)}px,${((uy / ul) * m).toFixed(2)}px)`;
    } else if (feed > 0 && frame % 2 === 0) {
      // the drawn-out thread reels back into the full stop
      unfeedOne();
    }
  }

  const f1 = (v: number) => v.toFixed(1);

  function draw() {
    const n = xs.length;
    const t = n - 1;
    let d = `M${f1(xs[0])} ${f1(ys[0])}`;
    for (let i = 1; i < t; i++) {
      d += `Q${f1(xs[i])} ${f1(ys[i])} ${f1((xs[i] + xs[i + 1]) / 2)} ${f1((ys[i] + ys[i + 1]) / 2)}`;
    }
    d += `L${f1(xs[t])} ${f1(ys[t])}`;
    // a frayed end, three short strands splayed along the last segment
    const ux = xs[t] - xs[t - 1];
    const uy = ys[t] - ys[t - 1];
    const ul = Math.hypot(ux, uy) || 1;
    for (const [a, l] of [
      [0.5, 4],
      [-0.4, 5],
      [0.05, 3],
    ]) {
      const c = Math.cos(a);
      const s = Math.sin(a);
      d += `M${f1(xs[t])} ${f1(ys[t])}l${f1(((ux * c - uy * s) / ul) * l)} ${f1(((ux * s + uy * c) / ul) * l)}`;
    }
    ropePath.setAttribute('d', d);
    handle.style.transform = `translate(${f1(xs[t])}px,${f1(ys[t])}px)`;
  }

  function tick(now: number) {
    acc += Math.min(64, now - (last || now - STEP));
    last = now;
    let steps = 0;
    while (acc >= STEP && steps < 4) {
      step(now);
      acc -= STEP;
      steps++;
    }
    if (steps === 4) acc = 0;
    draw();
    let energy = 0;
    for (let i = 0; i < xs.length; i++) energy += Math.abs(xs[i] - ox[i]) + Math.abs(ys[i] - oy[i]);
    if (!held && feed === 0 && !blowing(now) && energy < 0.03 * xs.length) {
      if (++still > 24) {
        raf = 0;
        last = 0;
        return;
      }
    } else still = 0;
    raf = requestAnimationFrame(tick);
  }

  function wake() {
    if (raf || reduce.matches || !xs.length) return;
    still = 0;
    last = 0;
    acc = 0;
    raf = requestAnimationFrame(tick);
  }

  function label(untied = allUntied()) {
    handle.setAttribute(
      'aria-label',
      untied ? 'Pull the thread to close everything back up' : 'Pull the thread to open everything',
    );
  }

  // the knots come undone one after another, so label by what this pull does, not what has happened yet
  function pullAll() {
    const untying = !allUntied();
    if (untying) untieAll();
    else tieAll();
    label(untying);
  }

  // the pull has gone far enough: every knot gives way (or, if all are undone, ties back up),
  // and the thread slips from the hand and reels back into the full stop
  function give() {
    clearTimeout(pullTimer);
    spent = true;
    pullAll();
    held = false;
    sheet.classList.remove('held', 'hinting');
    knot.style.transform = '';
    wake();
  }

  function autoPull() {
    if (reduce.matches) return pullAll();
    const t = xs.length - 1;
    const sx = xs[t];
    const sy = ys[t];
    const t0 = performance.now();
    held = true;
    spent = false;
    setNeed();
    sheet.classList.add('held');
    // completes even if frames are throttled (background tab, hidden pane)
    pullTimer = setTimeout(() => !spent && give(), 1200);
    const go = (now: number) => {
      if (!held || spent) return;
      const k = Math.min(1, (now - t0) / 900);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      tx = sx + Math.sin(k * Math.PI) * 10;
      ty = sy + e * 240;
      if (k < 1) requestAnimationFrame(go);
      else give();
    };
    requestAnimationFrame(go);
    wake();
  }

  // grabbing the end
  let downX = 0;
  let downY = 0;
  let dragged = false;
  let skipClick = false;

  handle.addEventListener('pointerdown', (e) => {
    touchedOnce = true;
    if (reduce.matches) return;
    handle.setPointerCapture(e.pointerId);
    held = true;
    spent = false;
    dragged = false;
    downX = e.clientX;
    downY = e.clientY;
    tx = e.pageX - sheetX;
    ty = e.pageY - sheetY;
    setNeed();
    sheet.classList.add('held');
    wake();
  });
  handle.addEventListener('pointermove', (e) => {
    if (!held) return;
    tx = e.pageX - sheetX;
    ty = e.pageY - sheetY;
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) dragged = true;
  });
  const release = () => {
    if (dragged || spent) skipClick = true;
    if (!held) return;
    held = false;
    sheet.classList.remove('held');
    knot.style.transform = '';
    // let go past halfway and it still counts; judged on where the hand let go,
    // so a fast flick counts even if few frames ran
    const reach = Math.hypot(tx - ax, ty - ay) - (REST - 1) * SEG;
    if (!spent && dragged && Math.max(progress(), reach / need) >= 0.55) return give();
    const t = xs.length - 1;
    ox[t] = xs[t];
    oy[t] = ys[t];
    wake();
  };
  handle.addEventListener('pointerup', release);
  handle.addEventListener('pointercancel', release);
  handle.addEventListener('click', () => {
    touchedOnce = true;
    if (skipClick) {
      skipClick = false;
      return;
    }
    autoPull();
  });

  // the cursor brushing past moves it, like a real thread on a page
  let px = 0;
  let py = 0;
  let seen = false;
  addEventListener(
    'pointermove',
    (e) => {
      if (held || e.pointerType === 'touch' || !xs.length) return;
      const x = e.pageX - sheetX;
      const y = e.pageY - sheetY;
      const dx = x - px;
      const dy = y - py;
      px = x;
      py = y;
      if (!seen || Math.abs(dx) > 80 || Math.abs(dy) > 80) {
        seen = true;
        return;
      }
      let moved = false;
      for (let i = 1; i < xs.length; i++) {
        const d = Math.hypot(xs[i] - x, ys[i] - y);
        if (d < 36) {
          const f = (1 - d / 36) * 0.24;
          xs[i] += dx * f;
          ys[i] += dy * f * 0.5;
          moved = true;
        }
      }
      if (moved) wake();
    },
    { passive: true },
  );

  function start() {
    handle.hidden = false;
    place();
    build(!reduce.matches);
    draw();
    wake();
    label();
    // knots tugged one by one change what the thread will do too; toggle does not bubble, so capture it
    document.addEventListener('toggle', () => label(), true);
    onGust(() => {
      if (!held) wake();
    });
    // once, if nobody has touched it: the word "pull", as the first gust moves it
    setTimeout(() => {
      if (touchedOnce) return;
      sheet.classList.add('hinting');
      setTimeout(() => sheet.classList.remove('hinting'), 2600);
    }, 4200);
  }

  new ResizeObserver(() => {
    if (!xs.length) return;
    const pax = ax;
    const pay = ay;
    place();
    const dx = ax - pax;
    const dy = ay - pay;
    for (let i = 0; i < xs.length; i++) {
      xs[i] += dx;
      ox[i] += dx;
      ys[i] += dy;
      oy[i] += dy;
    }
    draw();
    wake();
  }).observe(sheet);

  document.fonts.ready.then(start);
}
