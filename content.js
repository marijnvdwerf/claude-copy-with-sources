(() => {
  const BUTTON_ID = "copy-with-sources-btn";

  function getFiberRoot() {
    const el = document.documentElement;
    const fiberKey = Object.keys(el).find(
      (k) =>
        k.startsWith("__reactFiber$") ||
        k.startsWith("__reactInternalInstance$")
    );
    if (!fiberKey) return null;
    let fiber = el[fiberKey];
    while (fiber?.return) fiber = fiber.return;
    return fiber;
  }

  function findArtifact(root) {
    const stack = [root];
    while (stack.length) {
      const f = stack.pop();
      const art = f.memoizedProps?.artifact;
      if (art?.type === "text/markdown" && art.versions?.length) {
        const selectedUuid = f.memoizedProps.selectedArtifactVersionUuid;
        const version =
          art.versions.find((v) => v.uuid === selectedUuid) ||
          art.versions[art.versions.length - 1];
        if (version.content?.length > 500) {
          return { content: version.content, citations: version.citations || [] };
        }
      }
      if (f.sibling) stack.push(f.sibling);
      if (f.child) stack.push(f.child);
    }
    return null;
  }

  function buildMarkdown({ content, citations }) {
    if (!citations.length) return content;

    // Group citations by end_index
    const groups = {};
    for (const c of citations) {
      if (!groups[c.end_index]) groups[c.end_index] = [];
      groups[c.end_index].push(c);
    }

    // Sort descending so insertions don't shift earlier indices
    const sortedEnds = Object.keys(groups)
      .map(Number)
      .sort((a, b) => b - a);

    let result = content;
    const footnotes = [];
    let n = sortedEnds.length;

    for (const endIdx of sortedEnds) {
      const srcs = groups[endIdx]
        .map((c) => `[${c.title}](${c.url})`)
        .join(", ");
      footnotes.unshift(`[^${n}]: ${srcs}`);
      result = result.slice(0, endIdx) + `[^${n}]` + result.slice(endIdx);
      n--;
    }

    return result + "\n\n---\n\n## Sources\n\n" + footnotes.join("\n");
  }

  function injectButton() {
    if (document.getElementById(BUTTON_ID)) return;

    const copyBtn = [...document.querySelectorAll("button")].find(
      (b) => b.textContent.trim() === "Copy"
    );
    if (!copyBtn) return;

    const copyGroup = copyBtn.parentElement;
    const toolbar = copyGroup?.parentElement;
    if (!toolbar) return;

    const btnGroup = document.createElement("div");
    btnGroup.id = BUTTON_ID;
    btnGroup.className = copyGroup.className;

    const btn = document.createElement("button");
    btn.className = copyBtn.className.replace("rounded-l-lg", "rounded-lg");
    btn.style.borderRight = "0.5px solid rgba(222, 220, 209, 0.3)";
    btn.textContent = "Copy with sources";

    btn.addEventListener("click", () => {
      const root = getFiberRoot();
      if (!root) {
        btn.textContent = "No React found!";
        setTimeout(() => (btn.textContent = "Copy with sources"), 2000);
        return;
      }

      const artifact = findArtifact(root);
      if (!artifact) {
        btn.textContent = "No report found!";
        setTimeout(() => (btn.textContent = "Copy with sources"), 2000);
        return;
      }

      const markdown = buildMarkdown(artifact);
      navigator.clipboard.writeText(markdown).then(() => {
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy with sources"), 2000);
      });
    });

    btnGroup.appendChild(btn);
    toolbar.insertBefore(btnGroup, copyGroup);
  }

  const observer = new MutationObserver(() => {
    injectButton();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  injectButton();
})();
