import inku from './assets/inku.webp';
import playButton from './assets/riffshop-play-button.webp';

// Single source for the page's copy. Anything still in [brackets] is a placeholder and is not shown.

export const name = 'Harshyt Goel';

export const lede = 'I pull threads to see where they go.';

export const contact = [
  { label: 'email', href: 'mailto:[email]' },
  { label: 'x', href: 'https://x.com/garshythoel' },
  { label: 'github', href: 'https://github.com/garshythoel' },
];

// The page is an outline. An item with `children` is a swirl you tap to open; an item without
// is a plain bullet.
export type Item = {
  text: string;
  href?: string;
  /** the part of `text` that links to `href`; without it, the whole line is the link */
  linkText?: string;
  /** shown in the left margin beside a top-level line, newest first, e.g. 'Present – 2024'.
   *  Lines that ran side by side share one label: give it to the first of them only. */
  years?: string;
  /** a smaller line under the text */
  subtitle?: string;
  /** always open, with no swirl to tug: what it holds is shown from the start */
  open?: boolean;
  /** a picture shown under the line (for a line that opens, at the top of what it holds) */
  image?: { src: ImageMetadata; alt: string };
  children?: Item[];
};

const todo = (what: string): Item[] => [{ text: `[${what}]` }];

export const outline: Item[] = [
  {
    text: 'Founder at Inkboard Inc.',
    subtitle: 'We build hardware and software products that are smart, useful, and joyful.',
    open: true,
    years: 'Present – 2024',
    href: 'https://inkboard.ink',
    linkText: 'Inkboard Inc.',
    children: [
      {
        text: 'Raised nearly 300K for Inku on Kickstarter',
        href: 'https://www.kickstarter.com/projects/desertelf/inku-your-friendly-smart-and-distraction-free-calendar',
        linkText: 'Kickstarter',
        image: {
          src: inku,
          alt: 'a distraction-free e-ink device.',
        },
      },
      { text: 'Delivered the orders as a 1\u00a0person company.' },
      { text: 'Started a digital platform currently doing over 100k/yr in revenue. (and growing)' },
      {
        text: 'Tap to see the things I’ve learnt:',
        children: [
          { text: 'Bootstrapping a hardware startup is a great idea to learn a lot of stuff' },
          { text: 'CAD/3D Printing/Pantone colors' },
          { text: 'Firmware development' },
          { text: 'Shipping/Fulfillment and Tariff laws (ask me about procuring my display panels...)' },
          { text: 'Hiring/Firing fast' },
          { text: 'Bootstrapping a hardware startup is a bad idea for your sanity' },
        ],
      },
    ],
  },
  {
    text: 'Founding engineer at Loom, Inc. (Acquired by Atlassian)',
    years: '2023 – 2017',
    href: 'https://www.loom.com',
    linkText: 'Loom, Inc.',
    children: [
      { text: 'What we did', children: todo('what you did at Loom') },
      { text: 'Tap to see the things I’ve learnt:', children: todo('what Loom taught you') },
    ],
  },
  { text: 'Worked at Meta for a bit.', years: '2017 – 2015' },
  // ran side by side with Meta: Meta's label covers both
  {
    text: 'Started a successful youtube channel.',
    href: 'https://www.youtube.com/riffshop',
    linkText: 'youtube channel',
    image: {
      src: playButton,
      alt: 'The YouTube silver play button presented to Riffshop for passing 100,000 subscribers.',
    },
    children: [{ text: 'I also sing at my friends’ weddings' }, { text: 'and at my own' }],
  },
];

export const beliefs: Item = {
  text: 'Things I feel strongly about',
  children: [
    { text: 'My family' },
    { text: 'The Dream Machine, by M. Mitchell Waldrop' },
    { text: 'The agentic evolution' },
    { text: 'A desire to build' },
    { text: 'Music and singing' },
    { text: 'Twitter / X' },
    { text: 'SpaceX' },
    { text: 'The incessant push and pull of everything on this list' },
    { text: 'Others…' },
  ],
};
