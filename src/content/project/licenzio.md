---
title: licenzio
github_url: https://github.com/D3ller/licenzio
short_description: A command-line tool written in C that adds a license file to a project in one command.
startedDate: 2026-11-12
---

licenzio is a small CLI written in C. Running `licenzio mit` or `licenzio apache` writes the matching `LICENSE` file into the current directory, and `-o` sends it to another path.

It ships with twelve templates: MIT, Apache, GPL, LGPL, AGPL, BSD 2-Clause and 3-Clause, Mozilla, EUPL, Artistic, zlib and Creative Commons. `licenzio -l` lists them.

It is a C rewrite of a project by [@khalidbelk](https://github.com/khalidbelk), built with a plain Makefile. Note that it overwrites any existing `LICENSE` file.
