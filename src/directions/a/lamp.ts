// A small dome light fixed to the top edge of the page, like a ceiling light. Tap it and
// the page's light goes off or on: the light spreads out from the fixture, or falls back into it.

const lamp = document.querySelector<HTMLElement>('[data-lamp]');
if (lamp) init(lamp);

function init(lamp: HTMLElement) {
  const root = document.documentElement;
  const handle = lamp.querySelector<HTMLButtonElement>('[data-switch]')!;
  const fixture = lamp.querySelector<SVGSVGElement>('[data-fixture]')!;
  const glow = lamp.querySelector<SVGElement>('[data-glow]')!;
  const hint = lamp.querySelector<HTMLElement>('[data-switch-hint]')!;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const PAPER = { light: '#f3f0e8', dark: '#1a1917' };

  const isDark = () => root.dataset.theme === 'dark';

  function label() {
    const dark = isDark();
    handle.setAttribute('aria-label', dark ? 'Turn the light on' : 'Turn the light off');
    hint.textContent = dark ? 'on' : 'off';
  }

  function flip() {
    const dark = !isDark();
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {}
    const apply = () => {
      root.dataset.theme = dark ? 'dark' : 'light';
      if (meta) meta.content = dark ? PAPER.dark : PAPER.light;
      label();
    };
    if (!reduce.matches) {
      // a press on the fixture; switching on, the glow catches and flickers like a warming bulb
      fixture.animate([{ scale: '1' }, { scale: '0.94', offset: 0.35 }, { scale: '1' }], { duration: 260, easing: 'ease-out' });
      if (!dark) {
        glow.animate([{ opacity: 0 }, { opacity: 0.7, offset: 0.2 }, { opacity: 0.25, offset: 0.35 }, { opacity: 1 }], {
          duration: 520,
          easing: 'ease-out',
        });
      }
    }
    if (reduce.matches || !document.startViewTransition) return apply();
    const r = fixture.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.5;
    // in percentages: some browsers draw the snapshot at device scale, which breaks px
    const W = innerWidth;
    const H = innerHeight;
    const far = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy));
    root.style.setProperty('--bx', `${((cx / W) * 100).toFixed(1)}%`);
    root.style.setProperty('--by', `${((cy / H) * 100).toFixed(1)}%`);
    root.style.setProperty('--br', `${Math.ceil((far / (Math.hypot(W, H) / Math.SQRT2)) * 100) + 1}%`);
    root.classList.add(dark ? 'lights-off' : 'lights-on');
    document.startViewTransition(apply).finished.finally(() => root.classList.remove('lights-off', 'lights-on'));
  }

  handle.addEventListener('click', flip);
  label();
  handle.hidden = false;
}
