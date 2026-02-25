# Claude Copy with Sources

Adds a **Copy with sources** button to Claude.ai artifact panels. When you open a deep research report, click the button to copy the full markdown with footnoted citations to your clipboard.

Claude's deep research produces documents with inline citation chips, but the built-in "Copy" button strips them. This script reads the citation data from React's internal state and rebuilds the document as markdown with `[^1]`-style footnotes and a Sources section.

## Install

### Userscript (recommended)

Install a userscript manager like [Violentmonkey](https://violentmonkey.github.io/), then click:

[**Install userscript**](https://github.com/marijnvdwerf/claude-copy-with-sources/releases/latest/download/claude-copy-with-sources.user.js)

### Chrome extension

1. Download the latest `.zip` from [Releases](../../releases)
2. Unzip it
3. Go to `chrome://extensions`, enable **Developer mode**
4. Click **Load unpacked** and select the unzipped folder

## Usage

1. Open any Claude.ai conversation with a deep research artifact
2. Click the artifact to open the side panel
3. Click **Copy with sources** (next to the existing Copy button)
4. Paste the markdown wherever you need it

## Limitations

- Only works on `text/markdown` artifacts (deep research reports, documents)
- Relies on React fiber internals which may change if Claude.ai updates their frontend
