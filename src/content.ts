import inku from './assets/inku.webp';
import playButton from './assets/riffshop-play-button.webp';
import solarpunk from './assets/solarpunk.webp';

// Single source for the page's copy. Anything still in [brackets] is a placeholder and is not shown.

export const name = 'Harshyt Goel';

export const tagline = 'Engineer · Designer · Operator. Software, hardware, and everything between.';

export const lede = 'I pull threads to see where they go.';

export const contact = [
  { label: 'email', href: 'mailto:harshyt.goel@gmail.com' },
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
  /** a quiet aside after a line that opens, after its swirl */
  hint?: string;
  /** always open, with no swirl to tug: what it holds is shown from the start */
  open?: boolean;
  /** a picture shown under the line (for a line that opens, at the top of what it holds) */
  image?: { src: ImageMetadata; alt: string };
  children?: Item[];
};

export const outline: Item[] = [
  {
    text: 'Founder at Inkboard Inc.',
    subtitle: 'Building hardware and software products that are smart, useful, and joyful.',
    open: true,
    years: 'Present – 2024',
    href: 'https://inkboard.ink',
    linkText: 'Inkboard Inc.',
    children: [
      {
        text: '~$300K in Inku pre\u2011orders on Kickstarter', // a hyphen that never breaks the word
        href: 'https://www.kickstarter.com/projects/desertelf/inku-your-friendly-smart-and-distraction-free-calendar',
        linkText: 'Kickstarter',
        image: {
          src: inku,
          alt: 'a distraction-free e-ink device.',
        },
      },
      { text: 'Delivering every order as the only full-time employee at the company.' },
      { text: 'Running a parallel consumer app doing >\u00a0$100k/yr in revenue (and growing)' },
      {
        text: 'Learning a TON',
        hint: '(tap to see what I’m learning)',
        children: [
          { text: 'Bootstrapping a hardware startup is a great idea to learn a lot of stuff' },
          { text: 'CAD/3D Printing/Pantone colors' },
          { text: 'Firmware development' },
          { text: 'Shipping/Fulfillment and Tariff laws (ask me about procuring my display panels...)' },
          { text: 'Hiring/Firing fast' },
          {
            text: 'Scaling myself way beyond what I could’ve handled pre-AI by building automated agents for',
            open: true,
            children: [
              { text: 'Customer Support' },
              { text: 'Fulfillment handling' },
              { text: 'Special Kickstarter Award deliveries' },
              { text: 'Marketing Creatives (partially)' },
              { text: 'Accounting (rolled back, not a smart move)' },
            ],
          },
          { text: 'Bootstrapping a hardware startup is a bad idea for your sanity' },
        ],
      },
    ],
  },
  {
    text: 'Founding Engineer @ Loom, Inc.',
    open: true,
    years: '2023 – 2017',
    href: 'https://www.loom.com',
    linkText: 'Loom, Inc.',
    children: [
      { text: 'Built core product and technology (billing systems, integration platforms, experimentation etc.) (pre-AI).' },
      { text: 'Started and grew the Loom growth team.' },
      { text: 'Scaled from thousands → 30m+ users worldwide.' },
      { text: 'Acquired by Atlassian for $975M.' },
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
    { text: 'Family' },
    { text: 'The Dream Machine, by M. Mitchell Waldrop' },
    {
      text: 'The future should be solarpunk',
      image: {
        src: solarpunk,
        alt: 'Google’s AI Overview: Solarpunk is an optimistic speculative movement, genre of art and literature, and lifestyle that envisions a sustainable, post-scarcity, and community-driven future.',
      },
    },
    { text: 'Just keep building/making/creating things.' },
    { text: 'Music and singing' },
    { text: 'Twitter / X' },
    { text: 'Space and Nuclear Energy' },
    { text: 'The constant attempts and futility of trying to balance everything on this list' },
    { text: 'Others…' },
  ],
};
