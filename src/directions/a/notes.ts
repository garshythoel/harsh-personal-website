// A line with a note: hovering (or focusing) its words shows the note in the margin; tapping
// them pins it open, and on a phone that is the only way, with the note under the line.
// One open at a time; a tap elsewhere or Escape closes it.

const lines = [...document.querySelectorAll<HTMLButtonElement>('[data-noted]')];

const set = (b: HTMLButtonElement, open: boolean) => b.setAttribute('aria-expanded', String(open));
const closeAll = (except?: HTMLButtonElement) => lines.forEach((b) => b !== except && set(b, false));

for (const b of lines) {
  b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    closeAll(b);
    set(b, open);
  });
}

addEventListener('pointerdown', (e) => {
  if (!(e.target as Element).closest?.('[data-noted]')) closeAll();
});
addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAll();
});
