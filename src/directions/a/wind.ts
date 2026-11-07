// Now and then a breath of air crosses the page. Every string reads the same gust,
// so the thread and the lamp's pull string move together, the far one a beat later.

type Gust = { t0: number; dur: number; amp: number; width: number };

const SPEED = 1.1; // px per ms the gust front travels across the page
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const og = document.documentElement.hasAttribute('data-og');
const listeners = new Set<() => void>();
let gust: Gust | null = null;

/** call `fn` when a gust starts, so a sleeping simulation can wake up */
export function onGust(fn: () => void) {
  listeners.add(fn);
}

/** sideways acceleration at page-x `x` at time `now`, in px per step² */
export function wind(x: number, now: number) {
  if (!gust) return 0;
  // the wind only ever blows left to right, so the front reaches x after x / SPEED
  const k = (now - gust.t0 - x / SPEED) / gust.dur;
  if (k <= 0 || k >= 1) return 0;
  const envelope = Math.sin(Math.PI * k) ** 2;
  const flutter = 1 + 0.35 * Math.sin(now / 130) + 0.2 * Math.sin(now / 57 + 1.3);
  return gust.amp * envelope * flutter;
}

/** true while any part of the page is still inside the current gust */
export function blowing(now: number) {
  return !!gust && now < gust.t0 + gust.dur + gust.width / SPEED;
}

// comic-strip wind: a short gust of two bold strokes that starts somewhere on the page,
// blows a little way to the right, then winds itself into a curl and is gone.
// Each path is a wavy line ending in a curl; a short dash travels along it, so the
// stroke is seen moving forward and, at the end, wrapping into the curl as it vanishes.
const NS = 'http://www.w3.org/2000/svg';
const STROKES = [
  ['M0 0c14-5 28-5 42 0s28 5 42 0c10-3 20-1 22 5c1.5 5-5 7-8 4c-3-3 0-7 4-5', 0, 0, 0],
  ['M0 0c10-4 21-4 31 0s21 4 31 0c8-2.5 15-1 16 4c1 4-4 6-6 3c-2-3 1-5 3-4', 18, 12, 140],
] as const;
const DASH = 0.38; // the visible share of each path at once
const LIFE = 1700; // ms from appearing to gone
let layer: HTMLElement | null = null;

function gustLines() {
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'wind-layer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.append(layer);
  }
  const x = innerWidth * (0.06 + Math.random() * 0.5);
  const y = innerHeight * (0.12 + Math.random() * 0.58);
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'puff');
  svg.setAttribute('width', '1');
  svg.setAttribute('height', '1');
  for (const [d, dx, dy, delay] of STROKES) {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    p.setAttribute('pathLength', '1');
    p.setAttribute('transform', `translate(${dx} ${dy})`);
    p.style.strokeDasharray = `${DASH} 1`;
    svg.append(p);
    // offset DASH: the dash sits before the start; -1: it has run off the end, through the curl
    p.animate(
      [
        { strokeDashoffset: DASH, opacity: 0 },
        { opacity: 1, offset: 0.15 },
        { opacity: 1, offset: 0.8 },
        { strokeDashoffset: -1, opacity: 0 },
      ],
      { duration: LIFE - delay, delay, easing: 'cubic-bezier(0.25, 0.4, 0.45, 1)', fill: 'both' },
    );
  }
  // the whole gust drifts on a little as it goes, rising slightly
  svg.animate(
    [{ translate: `${x.toFixed(0)}px ${y.toFixed(0)}px` }, { translate: `${(x + 110).toFixed(0)}px ${(y - 8).toFixed(0)}px` }],
    { duration: LIFE, easing: 'cubic-bezier(0.2, 0.6, 0.4, 1)', fill: 'both' },
  ).finished.then(() => svg.remove());
  layer.append(svg);
}

function blow(first = false) {
  if (!document.hidden && !reduce.matches) {
    gust = {
      t0: performance.now(),
      dur: 1500 + Math.random() * 1300,
      amp: 0.05 + Math.random() * 0.06,
      width: innerWidth,
    };
    for (const fn of listeners) fn();
    // not every gust is drawn, so the lines stay rare; the first always is
    if (first || og || Math.random() < 0.7) gustLines();
  }
  setTimeout(blow, og ? 3200 : 8000 + Math.random() * 9000);
}

// the first gust arrives with the "pull" hint, so the page shows it is alive. On the link-preview
// card (/og) the wind starts at once and keeps a steady beat, so a short recording always has it.
setTimeout(() => blow(true), og ? 500 : 3900);
