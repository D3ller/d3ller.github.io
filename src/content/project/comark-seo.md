---
title: comark-seo
github_url: https://github.com/D3ller/comark-seo
short_description: A Comark plugin that analyzes Markdown for SEO, covering headings, links, images, word count and reading time.
startedDate: 2026-09-14
---

comark-seo is a TypeScript plugin for the Comark Markdown parser. It analyzes a document while it is parsed and attaches an SEO report to `tree.meta.seo`.

The report covers word count and reading time (code blocks are excluded from the count), repeated words with optional French or English stop words, heading hierarchy, internal and external links, and images missing alt text. It also lists the issues it finds.

The whole report is JSON-serializable, so it can be sent in an SSR payload or cached as-is.
