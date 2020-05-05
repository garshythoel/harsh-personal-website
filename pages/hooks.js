import { useMediaPredicate } from "react-media-hook";

let localStorage;

// block third party cookies check
// https://useloom.atlassian.net/browse/LOOM-1639
try {
  localStorage = window && window.localStorage;
} catch (err) {
  // do nothing
}

export const THEME_DARK = 'theme-dark';

export const useTheme = () => {
  const preferredDarkTheme = useMediaPredicate('(prefers-color-scheme: dark)') && THEME_DARK;

  return preferredDarkTheme;
};