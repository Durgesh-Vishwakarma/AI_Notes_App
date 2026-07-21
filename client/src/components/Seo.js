import React from 'react';
import { Helmet } from 'react-helmet-async';

// Canonical origin for this deployment. Override at build time with
// REACT_APP_SITE_URL if the app moves to a custom domain.
export const SITE_URL = (
  process.env.REACT_APP_SITE_URL || 'https://ai-notes-app-pi.vercel.app'
).replace(/\/$/, '');

const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * Per-route document head.
 *
 * `noindex` is set on authenticated and auth-form routes: they carry no
 * unique public content, and letting them into the index dilutes the
 * landing page and produces useless search results.
 */
export default function Seo({
  title,
  description,
  path = '/',
  noindex = false,
  image = DEFAULT_IMAGE,
  type = 'website',
  children,
}) {
  const canonical = `${SITE_URL}${path === '/' ? '' : path}`;
  const fullTitle = path === '/' ? title : `${title} · AI Notes`;

  // Deliberately not using `prioritizeSeoTags`: it only splits tags into a
  // separate bucket for server rendering, and this app renders on the client.
  // Enabling it hides the SEO tags from any future prerender step that does
  // not also emit helmet.priority.
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="AI Notes" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {children}
    </Helmet>
  );
}
