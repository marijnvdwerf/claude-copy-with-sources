import manifest from "./manifest.json";

const REPO = "https://github.com/marijnvdwerf/claude-copy-with-sources";
const OUT = "claude-copy-with-sources.user.js";

const { name, description, version } = manifest;
const contentScript = manifest.content_scripts[0];

const header = `// ==UserScript==
// @name         ${name}
// @namespace    ${REPO}
// @version      ${version}
// @description  ${description}
// @author       marijnvdwerf
${contentScript.matches.map((m) => `// @match        ${m}`).join("\n")}
// @grant        GM_setClipboard
// @downloadURL  ${REPO}/releases/latest/download/${OUT}
// @updateURL    ${REPO}/releases/latest/download/${OUT}
// ==/UserScript==

`;

const scripts = await Promise.all(
  contentScript.js.map((js) => Bun.file(js).text())
);

await Bun.write(OUT, header + scripts.join("\n"));

console.log(`Built ${OUT} (v${version})`);
