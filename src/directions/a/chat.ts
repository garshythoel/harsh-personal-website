// "Want to chat?": the arm at the right edge holds up a flag; tapped, it ducks out of sight and
// comes back with a scroll that unrolls to a handwritten note, and the other way round to put
// it away.

const lane = document.querySelector<HTMLElement>('[data-lane]');
if (lane) init(lane);

function init(lane: HTMLElement) {
  const reach = lane.querySelector<HTMLElement>('[data-reach]')!;
  const flagHeld = lane.querySelector<HTMLElement>('[data-flag-held]')!;
  const flag = lane.querySelector<HTMLButtonElement>('[data-chat-toggle]')!;
  const note = lane.querySelector<HTMLElement>('[data-note]')!;
  const paper = note.querySelector<HTMLElement>('[data-paper]')!;
  const rodEnd = note.querySelector<HTMLElement>('[data-rod-end]')!;
  const lede = document.querySelector<HTMLElement>('.lede');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const EASE_IN = 'cubic-bezier(0.55, 0, 0.8, 0.3)';
  let out = false; // what the hand holds now
  let want = false; // what it will hold once it is done swapping
  let busy: Promise<void> = Promise.resolve();

  // the arm comes in just under the lede, so the flag flies in the space between it and the
  // first entry, clear of the thread
  function place() {
    const top = lede ? lede.getBoundingClientRect().bottom + scrollY + 40 : 240;
    lane.style.top = `${Math.round(top)}px`;
  }

  // the handwriting only loads when it is about to be needed
  const loadHand = () => document.fonts?.load('1em "Patrick Hand"').catch(() => {});

  const done = (a: Animation) => a.finished.then(() => {}, () => {});

  // how far right the arm must go to be out of sight with whatever it holds
  const away = () => Math.ceil((out ? note : flagHeld).getBoundingClientRect().width + reach.offsetWidth + 24);

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

  function swap(toNote: boolean) {
    busy = busy.then(async () => {
      if (!reduce.matches) {
        // rolled up first, if it is open
        if (out) await roll(1, 0, 320, EASE_IN);
        await slide(0, away(), 220, EASE_IN);
      }
      out = toNote;
      flag.setAttribute('aria-expanded', String(toNote));
      note.hidden = !toNote;
      flagHeld.classList.toggle('stowed', toNote);
      // the flag has gone, so the keyboard goes on to the note (and back to the flag after)
      if (toNote) note.querySelector('a')?.focus({ preventScroll: true });
      if (reduce.matches) return;
      if (toNote) await roll(0, 0, 1, 'linear'); // comes in rolled up
      await slide(away(), 0, 460, EASE_OUT);
      reach.getAnimations().forEach((a) => a.cancel());
      if (!toNote) return;
      await roll(0, 1, 700, EASE_OUT);
      paper.getAnimations().forEach((a) => a.cancel());
      rodEnd.getAnimations().forEach((a) => a.cancel());
      // and it sways a little as it settles in the hand
      note.animate(
        [{ rotate: '0deg' }, { rotate: '1.4deg', offset: 0.35 }, { rotate: '-0.7deg', offset: 0.7 }, { rotate: '0deg' }],
        { duration: 900, easing: 'ease-in-out' },
      );
    });
  }

  function show() {
    if (want) return;
    want = true;
    loadHand();
    swap(true);
  }

  function hide(refocus = false) {
    if (!want) return;
    want = false;
    const back = refocus || note.contains(document.activeElement);
    swap(false);
    if (back) busy.then(() => flag.focus({ preventScroll: true }));
  }

  flag.addEventListener('click', show);
  flag.addEventListener('pointerenter', loadHand, { once: true });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && want) hide(true);
  });
  // a tap anywhere but the note puts it away
  addEventListener('pointerdown', (e) => {
    if (want && !note.contains(e.target as Node)) hide();
  });

  // "the contacts at the bottom": put the note away and go down to them
  note.querySelector<HTMLAnchorElement>('[data-note-contact]')?.addEventListener('click', (e) => {
    const target = document.getElementById('contact');
    if (!target) return;
    e.preventDefault();
    hide();
    target.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'center' });
    target.querySelector('a')?.focus({ preventScroll: true });
  });

  place();
  addEventListener('resize', place);
  // the fonts can move the lede once they load
  document.fonts?.ready.then(place);
  flag.hidden = false;
  lane.classList.add('placed');
}
