# William Liu Blog

This repository is being migrated from a legacy Jekyll + Minimal Mistakes blog to a static Astro blog.

## Current Phase

- Legacy Jekyll files are kept in the repository for reference.
- The old Travis CI workflow is archived under `archive/travis/`.
- Blog posts are written as Markdown files under `src/content/blog/`.
- The site builds to static HTML with Astro and is prepared for GitHub Pages deployment through GitHub Actions.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Deployment

The intended deployment path is GitHub Actions to GitHub Pages. After this branch is merged to `master`, switch the repository Pages build type from legacy branch deployment to GitHub Actions.

## Mainland China Access

The new Astro shell does not use Google Fonts, Disqus, Twitter embeds, YouTube embeds, or remote CSS/JS. Legacy remote images copied from old posts are not rendered as images in the Astro content; they are kept as plain links until they can be downloaded and localized one by one.
