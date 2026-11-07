// "Want to chat?": tapped, an arm reaches in from the right edge, just under the label, with a
// scroll that unrolls to a handwritten note; tapped again, it rolls up and the arm takes it away.

const label = document.querySelector<HTMLButtonElement>('[data-chat-toggle]');
const lane = document.querySelector<HTMLElement>('[data-lane]');
if (label && lane) init(label, lane);

function init(label: HTMLButtonElement, lane: HTMLElement) {
  const reach = lane.querySelector<HTMLElement>('[data-reach]')!;
  const note = lane.querySelector<HTMLElement>('[data-note]')!;
  const paper = note.querySelector<HTMLElement>('[data-paper]')!;
  const rodEnd = note.querySelector<HTMLElement>('[data-rod-end]')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const EASE_IN = 'cubic-bezier(0.55, 0, 0.8, 0.3)';
  let want = false; // open, or about to be
  let busy: Promise<void> = Promise.resolve();

  // the arm comes in a little under the label
  function place() {
    lane.style.top = `${Math.round(label.getBoundingClientRect().bottom + scrollY + 12)}px`;
  }

  // the handwriting only loads when it is about to be needed
  const loadHand = () => document.fonts?.load('1em "Patrick Hand"').catch(() => {});

  const done = (a: Animation) => a.finished.then(() => {}, () => {});
  const cancel = (el: Element) => el.getAnimations().forEach((a) => a.cancel());

  // how far right the arm must go, with the scroll, to be out of sight
  const away = () => Math.ceil(note.getBoundingClientRect().width + reach.offsetWidth + 24);

  const slide = (from: number, to: number, duration: number, easing: string) =>
    done(reach.animate([{ translate: `${from}px 0` }, { translate: `${to}px 0` }], { duration, easing, fill: 'both' }));

  // The scroll unrolls downwards: the paper is uncovered from its top as the bottom rod drops,
  // and rolls back up the same way. `k` runs from 0 (rolled) to 1 (open).
  function roll(from: number, to: number, duration: number, easing: string) {
    const h = paper.offsetHeight;
    const clip = (k: number) => ({ clipPath: `inset(0 -2px ${((1 - k) * 100).toFixed(1)}% -2px)` });
    const drop = (k: number) => ({ translate: `0 ${(-(1 - k) * h).toFixed(1)}px` });
    const opts = { duration, easing, fill: 'both' as const };
    return Promise.all([
      done(paper.animate([clip(from), clip(to)], opts)),
      done(rodEnd.animate([drop(from), drop(to)], opts)),
    ]);
  }

  function open() {
    busy = busy.then(async () => {
      label.setAttribute('aria-expanded', 'true');
      place();
      reach.hidden = false;
      note.querySelector('a')?.focus({ preventScroll: true });
      if (reduce.matches) return;
      await roll(0, 0, 1, 'linear'); // it comes in rolled up
      await slide(away(), 0, 460, EASE_OUT);
      await roll(0, 1, 700, EASE_OUT);
      [reach, paper, rodEnd].forEach(cancel);
      // and it sways a little as it settles in the hand
      note.animate(
        [{ rotate: '0deg' }, { rotate: '1.4deg', offset: 0.35 }, { rotate: '-0.7deg', offset: 0.7 }, { rotate: '0deg' }],
        { duration: 900, easing: 'ease-in-out' },
      );
    });
  }

  function close(refocus: boolean) {
    busy = busy.then(async () => {
      label.setAttribute('aria-expanded', 'false');
      if (!reduce.matches) {
        await roll(1, 0, 320, EASE_IN);
        await slide(0, away(), 260, EASE_IN);
      }
      reach.hidden = true;
      [reach, paper, rodEnd, note].forEach(cancel);
      if (refocus) label.focus({ preventScroll: true });
    });
  }

  function show() {
    if (want) return;
    want = true;
    loadHand();
    open();
  }

  function hide(refocus = false) {
    if (!want) return;
    want = false;
    close(refocus || note.contains(document.activeElement));
  }

  label.addEventListener('click', () => (want ? hide() : show()));
  label.addEventListener('pointerenter', loadHand, { once: true });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && want) hide(true);
  });
  // a tap anywhere but the note (or the label, which toggles it) puts it away
  addEventListener('pointerdown', (e) => {
    const t = e.target as Node;
    if (want && !note.contains(t) && !label.contains(t)) hide();
  });

  // "the links at the bottom": put the note away and go down to them
  note.querySelector<HTMLAnchorElement>('[data-note-contact]')?.addEventListener('click', (e) => {
    const target = document.getElementById('contact');
    if (!target) return;
    e.preventDefault();
    hide();
    target.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'center' });
    target.querySelector('a')?.focus({ preventScroll: true });
  });

  addEventListener('resize', () => want && place());
  label.hidden = false;
}
