// Each line with more under it is a small swirl, turning slowly. Open it (tap, Enter, or tug
// it down) and the swirl spins round to rest, and what it held comes in under it. Open it again
// to put them away. ("Tied" and "untied" are the code's words.)
// Each knot is a <details>, so the outline still opens without JS and find-in-page reaches inside.

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const knots = [...document.querySelectorAll<HTMLDetailsElement>('[data-tied]')];
const TUG = 9; // px of downward drag that pulls a knot loose

const kidsOf = (d: HTMLDetailsElement) => d.querySelector<HTMLElement>(':scope > [data-kids]')!;
const markOf = (d: HTMLDetailsElement) => d.querySelector<SVGSVGElement>(':scope > summary .mark')!;
const isUntied = (d: HTMLDetailsElement) => d.classList.contains('untied');

const swirlOf = (d: HTMLDetailsElement) => markOf(d).querySelector<SVGPathElement>('.swirl')!;

// the slow turn stops where it is; spin on round to upright, so it comes to rest the same way each time
function settle(d: HTMLDetailsElement) {
  const swirl = swirlOf(d);
  const turn = swirl.getAnimations().find((a) => (a as CSSAnimation).animationName === 'swirl-turn');
  const t = turn ? Number(turn.currentTime ?? 0) : 0;
  const from = ((t % 9000) / 9000) * 360;
  return () =>
    swirl.animate([{ rotate: `${from.toFixed(1)}deg` }, { rotate: '360deg' }], {
      duration: 380 + (360 - from) * 0.6,
      easing: 'cubic-bezier(0.3, 0.6, 0.3, 1)',
    });
}

function jerk(d: HTMLDetailsElement) {
  markOf(d).animate([{ translate: '0 0' }, { translate: '0 3px', offset: 0.3 }, { translate: '0 0' }], {
    duration: 340,
    easing: 'cubic-bezier(0.3, 0.7, 0.4, 1)',
  });
}

const stop = (kids: HTMLElement) => {
  for (const a of kids.getAnimations()) a.cancel();
};

function resize(kids: HTMLElement, from: number, to: number, duration: number, easing: string) {
  kids.classList.add('moving');
  const a = kids.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration, easing });
  a.finished.then(
    () => kids.classList.remove('moving'),
    () => {},
  );
  return a;
}

export function untie(d: HTMLDetailsElement, instant = false) {
  if (d.open && isUntied(d)) return;
  const kids = kidsOf(d);
  // mid-way through tying, start from where it has got to
  const from = d.open ? kids.offsetHeight : 0;
  stop(kids);
  d.open = true;
  // reading the height also settles the tied styles, so adding the class below animates
  const h = kids.offsetHeight;
  const spin = settle(d);
  d.classList.add('untied');
  if (instant || reduce.matches) return;
  spin();
  jerk(d);
  resize(kids, from, h, Math.min(620, 280 + h * 0.5), 'cubic-bezier(0.2, 0.7, 0.2, 1)');
}

// tying a knot ties everything inside it back up too
function tieInside(d: HTMLDetailsElement) {
  for (const k of d.querySelectorAll<HTMLDetailsElement>('[data-tied]')) {
    k.classList.remove('untied');
    k.open = false;
  }
}

export function tie(d: HTMLDetailsElement, instant = false) {
  if (!d.open) return;
  const kids = kidsOf(d);
  d.classList.remove('untied');
  if (instant || reduce.matches) {
    d.open = false;
    tieInside(d);
    return;
  }
  jerk(d);
  const h = kids.offsetHeight;
  stop(kids);
  resize(kids, h, 0, Math.min(460, 220 + h * 0.3), 'cubic-bezier(0.5, 0, 0.75, 0)').finished.then(
    () => {
      if (isUntied(d)) return;
      d.open = false;
      tieInside(d);
    },
    () => {},
  );
}

const toggle = (d: HTMLDetailsElement) => (isUntied(d) ? tie(d) : untie(d));

export const allUntied = () => knots.every(isUntied);

/** the lede's thread: one pull unties every knot on the page, top to bottom */
export function untieAll() {
  knots.filter((d) => !isUntied(d)).forEach((d, i) => setTimeout(() => untie(d), reduce.matches ? 0 : i * 90));
}

/** and pulled again, ties them all back up, bottom to top */
export function tieAll() {
  const outer = knots.filter((d) => d.open && !d.parentElement!.closest('[data-tied]'));
  outer.reverse().forEach((d, i) => setTimeout(() => tie(d), reduce.matches ? 0 : i * 80));
}

for (const d of knots) {
  const summary = d.querySelector<HTMLElement>(':scope > summary')!;
  const mark = markOf(d);
  let skipClick = false;

  summary.addEventListener('click', (e) => {
    // a link inside the line goes where it says, and leaves the knot as it is
    if ((e.target as Element).closest('a')) return;
    e.preventDefault();
    if (skipClick) {
      skipClick = false;
      return;
    }
    toggle(d);
  });
  // the drawing always follows the real state, even when the browser opens or closes it
  // itself (find-in-page revealing a match inside, for one)
  d.addEventListener('toggle', () => d.classList.toggle('untied', d.open));

  // tugging the knot itself: it gives a little, then pulls loose
  let y0 = 0;
  let pulled = false;
  let dragging = false;
  mark.addEventListener('pointerdown', (e) => {
    if (reduce.matches) return;
    mark.setPointerCapture(e.pointerId);
    dragging = true;
    pulled = false;
    y0 = e.clientY;
  });
  mark.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dy = Math.max(0, e.clientY - y0);
    mark.style.translate = `0 ${(TUG * (1 - Math.exp(-dy / TUG))).toFixed(1)}px`;
    if (dy > 3) skipClick = true;
    if (!pulled && dy > TUG) {
      pulled = true;
      toggle(d);
    }
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    const from = mark.style.translate || '0 0';
    mark.style.translate = '';
    mark.animate([{ translate: from }, { translate: '0 0' }], { duration: 300, easing: 'cubic-bezier(0.3, 1.6, 0.5, 1)' });
  };
  mark.addEventListener('pointerup', release);
  mark.addEventListener('pointercancel', release);
}
