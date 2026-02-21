# Claude Copy with Sources

Chrome extension that adds a **Copy with sources** button to Claude.ai artifact panels. When you open a deep research report, click the button to copy the full markdown with footnoted citations to your clipboard.

## What it does

Claude's deep research produces documents with inline citation chips, but the built-in "Copy" button strips them. This extension:

1. Reads the artifact content and citation data from React's internal state
2. Maps each citation's character offsets to footnote markers in the text
3. Appends a Sources section with linked references
4. Copies the result as markdown with `[^1]`-style footnotes

## Install

1. Download the latest `.zip` from [Releases](../../releases)
2. Unzip it
3. Go to `chrome://extensions`
4. Enable **Developer mode** (top right)
5. Click **Load unpacked** and select the unzipped folder

## Usage

1. Open any Claude.ai conversation with a deep research artifact
2. Click the artifact to open the side panel
3. Click **Copy with sources** (next to the existing Copy button)
4. Paste the markdown wherever you need it

## How it works

The extension injects a content script (`world: "MAIN"`) that:

- Uses a `MutationObserver` to detect when an artifact panel opens
- Walks React's fiber tree to find the artifact component (`artifact.type === "text/markdown"`)
- Extracts `content` and `citations` from the selected version
- Groups citations by their `end_index`, inserts footnote markers in reverse order (so offsets stay valid), and builds a footnote reference list

## Limitations

- Only works on `text/markdown` artifacts (deep research reports, documents)
- Relies on React fiber internals which may change if Claude.ai updates their frontend
- The button styling is matched to the current Claude UI and may drift over time
