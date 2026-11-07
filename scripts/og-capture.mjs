// Captures the link-preview card (/og) into public/og.png (og:image) and public/og.mp4 (og:video).
// With the dev server running (npm run dev):
//   npm i --no-save playwright && node scripts/og-capture.mjs
// Needs Google Chrome and ffmpeg (with libx264) installed; Playwright's own video recorder is not used.
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const url = process.env.OG_URL ?? 'http://localhost:4321/og';
const size = { width: 1200, height: 630 };
const browser = await chromium.launch({ channel: 'chrome' });
// the dev server adds its own toolbar to every page; keep it out of the pictures
const hideDevToolbar = (page) => page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });

// the still: once the thread has uncoiled and the first gust is passing
{
  const page = await browser.newPage({ viewport: size, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle' });
  await hideDevToolbar(page);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2200);
  await page.screenshot({ path: 'public/og@2x.png' });
  await page.close();
}

// the loop: about seven seconds of the thread swaying in two gusts, the rays breathing.
// Recorded with Chrome's screencast (a sharp frame per visual change), timed into a steady 30fps.
{
  const dir = mkdtempSync(join(tmpdir(), 'og-video-'));
  const page = await browser.newPage({ viewport: size, deviceScaleFactor: 1 });
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
    frames.push({ data, t: metadata.timestamp });
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await hideDevToolbar(page);
  await page.evaluate(() => document.fonts.ready);
  await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1, maxWidth: size.width, maxHeight: size.height });
  await page.waitForTimeout(7600);
  await cdp.send('Page.stopScreencast');
  await page.close();

  // each frame lasts until the next one; write them out with a concat list for ffmpeg
  const lines = [];
  frames.forEach((f, i) => {
    const file = join(dir, `f${String(i).padStart(5, '0')}.png`);
    writeFileSync(file, Buffer.from(f.data, 'base64'));
    const next = frames[i + 1]?.t ?? f.t + 1 / 30;
    lines.push(`file '${file}'`, `duration ${Math.max(next - f.t, 1 / 60).toFixed(4)}`);
  });
  lines.push(`file '${join(dir, `f${String(frames.length - 1).padStart(5, '0')}.png`)}'`);
  writeFileSync(join(dir, 'list.txt'), lines.join('\n'));
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', join(dir, 'list.txt'),
    '-vf', 'fps=30,format=yuv420p', '-t', '7',
    '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-movflags', '+faststart', 'public/og.mp4',
  ]);
  console.log(`video: ${frames.length} frames`);
  rmSync(dir, { recursive: true, force: true });
}

await browser.close();

// og:image at the standard 1200×630, downsampled from the 2x capture for smoother edges
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', 'public/og@2x.png', '-vf', 'scale=1200:630:flags=lanczos', 'public/og.png']);
rmSync('public/og@2x.png');
console.log('wrote public/og.png and public/og.mp4');
