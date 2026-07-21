/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

/*
 * The design system lives in src/index.css as CSS custom properties, not here.
 * Two surfaces (light marketing, dark app) swap the same variable names via a
 * data-surface attribute on <html>, which Tailwind's build-time theme cannot
 * express. Tailwind is kept only for a handful of responsive utilities.
 *
 * The previous config defined a purple palette, glow shadows, glassmorphism
 * blurs and nine keyframe animations that no longer have any consumers.
 */
