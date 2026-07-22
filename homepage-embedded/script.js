document.documentElement.classList.add("js-scroll-reveal");

const pageSearchParams = new URLSearchParams(window.location.search);
const embeddedView = pageSearchParams.get("view") || "github";
document.documentElement.dataset.embeddedView = embeddedView;
const footerBannerQr = document.querySelector(".footer-banner-qr");
const toolchainCards = document.querySelectorAll("[data-toolchain-card]");
const usageStep2Display = document.querySelector('[data-usage-step="2-display"]');
const usageStep2Copy = document.querySelector('[data-usage-step="2-copy"]');
const shouldUseInternalQr =
  embeddedView === "internal" ||
  (!pageSearchParams.has("view") &&
    window.location.hostname === "localhost" &&
    window.location.port === "3001");

if (shouldUseInternalQr && footerBannerQr) {
  footerBannerQr.setAttribute("src", "./7/qr-internal.png");
}

if (embeddedView === "internal") {
  const internalToolchainLinks = {
    skill: "https://infra.mioffice.cn/hiui/docs/hiui-cli/#skill",
    cli: "https://infra.mioffice.cn/hiui/docs/hiui-cli/#cli",
    llmstxt: "https://infra.mioffice.cn/hiui/docs/hiui-cli/#llmstxt",
  };
  const internalUsageStep2Copy = [
    "git clone --depth 1 git@git.n.xiaomi.com:guorui20/hiui-page-workflow.git",
    "bash hiui-page-workflow/install.sh",
    "完成后把hiui design接入到当前项目中",
  ].join("\n");

  toolchainCards.forEach((card) => {
    const cardKey = card.getAttribute("data-toolchain-card");
    const href = cardKey ? internalToolchainLinks[cardKey] : "";

    if (href) {
      card.setAttribute("href", href);
    }
  });

  if (usageStep2Display) {
    usageStep2Display.innerHTML = `
      <span class="usage-editor-command">git clone --depth 1 git@git.n.xiaomi.com:guorui20/hiui-page-workflow.git</span>
      <span class="usage-editor-command">bash hiui-page-workflow/install.sh</span>
      <span>完成后把hiui design接入到当前项目中<span class="usage-editor-caret" aria-hidden="true"></span></span>
    `;
  }

  if (usageStep2Copy) {
    usageStep2Copy.value = internalUsageStep2Copy;
    usageStep2Copy.textContent = internalUsageStep2Copy;
  }
}

const glowButtons = document.querySelectorAll("[data-glow-button]");
const heroCodeBlocks = document.querySelectorAll("[data-hero-code]");
const heroRainCanvas = document.querySelector("[data-hero-rain]");
const demoTabs = document.querySelectorAll("[data-demo-tab]");
const demoTrack = document.querySelector("[data-demo-track]");
const demoOverlays = document.querySelectorAll("[data-demo-overlay]");
const upgradeCompare = document.querySelector("[data-upgrade-compare]");
const pageTypesDots = document.querySelectorAll("[data-page-types-dot]");
const pageTypesTrack = document.querySelector("[data-page-types-track]");
const tiltedMediaCards = document.querySelectorAll("[data-tilted-media]");
const usageCopyButtons = document.querySelectorAll("[data-copy-button]");
const usageToast = document.querySelector("[data-copy-toast]");
const scrollRevealTargets = document.querySelectorAll("[data-scroll-reveal]");
const pageTypesAutoPlayDelay = 3000;

let activePageTypesIndex = 0;
let pageTypesAutoPlayTimer = null;

if (usageToast && usageToast.parentElement !== document.body) {
  document.body.append(usageToast);
}

const codeLinePool = [
  "type HeroCTA = { label: string; href: string };",
  "const gradientStops = ['#4b7dff', '#34d7ff', '#ffffff'];",
  "export function createScene(canvas: HTMLCanvasElement) {",
  "  const ctx = canvas.getContext('2d');",
  "  return { width: window.innerWidth, height: window.innerHeight };",
  "}",
  "const navItems = ['首页', '开发', '组件', '生态'];",
  "function renderHeadline(copy: string) {",
  "  return `<h1 class=\"hero-title\">${copy}</h1>`;",
  "}",
  "interface FeatureCard { title: string; desc: string; icon: string; }",
  "const cards: FeatureCard[] = fetchLandingCards();",
  "button.addEventListener('pointermove', syncGlowPosition);",
  "const styles = { opacity: 0.06, backdropFilter: 'blur(20px)' };",
  "requestAnimationFrame(() => updateMotionFrame(performance.now()));",
  "const theme = computed(() => tokens.hero.primary.value);",
  "gsap.to('.hero-orb', { y: 12, repeat: -1, yoyo: true });",
  "background: linear-gradient(180deg, rgba(255,255,255,.24), transparent);",
  "box-shadow: 0 24px 72px rgba(16, 40, 180, 0.16);",
  "const code = snippets.map((line) => line.trimEnd()).join('\\n');",
  "function hydrateApp(root: HTMLElement) {",
  "  root.dataset.ready = 'true';",
  "}",
  "return items.filter((item) => item.visible !== false);",
  "const panelWidth = Math.min(window.innerWidth * 0.72, 1280);",
  "public String toString() { return orderId + solution; }",
  "private LocalDateTime finishTime; // 完成时间",
  "class RepairRecord { constructor(public orderId: string) {} }",
  "const wavePhase = Math.sin((time + index * 120) / 1100);",
  "document.documentElement.style.setProperty('--hero-shift', `${offset}px`);",
  "const orbit = [{ x: 0, y: 0 }, { x: 42, y: -18 }, { x: 96, y: 20 }];",
  "export default function LandingPage() { return <HeroSection />; }",
  "<Button variant=\"primary\" size=\"lg\">开始使用</Button>",
  ".hero-code { color: rgba(255,255,255,.06); mix-blend-mode: screen; }",
  "const localizedCopy = messages[locale] ?? messages['zh-CN'];",
  "async function resolvePreviewData() { return await fetch('/api/design'); }",
  "const surface = createGlassSurface({ blur: 18, alpha: 0.34 });",
  "const designIntent = await parsePrompt('生成官网首屏，保留品牌识别');",
  "const schema = z.object({ title: z.string(), blocks: z.array(z.any()) });",
  "const preview = renderToStaticMarkup(<HeroPreview theme=\"hiui\" />);",
  "figma.variables.setValue('color.hero.primary', '#2d67ff');",
  "const docs = await vectorStore.search('hero motion guidance', { topK: 5 });",
  "const stream = client.responses.stream({ model: 'gpt-5', input: prompt });",
  "const artifact = await writeArtifact('landing-page.tsx', sourceCode);",
  "const audit = runUXWalkthrough({ viewport: '1440x900', locale: 'zh-CN' });",
  "const tokenMap = Object.fromEntries(tokens.map((item) => [item.name, item.value]));",
  "const density = clamp(pointer.speed * 0.18, 0.24, 0.92);",
  "transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);",
  "const frame = createRenderer({ dpr: window.devicePixelRatio || 1 });",
  "await navigator.clipboard.writeText(generatedComponent);",
  "const publishState = syncToPreviewChannel({ branch: 'main', status: 'ready' });",
  "return sections.flatMap((section) => section.snippets).slice(0, 24);",
];

const secureRandomBuffer = new Uint32Array(1);

function getRandomUnit() {
  if (typeof globalThis.crypto?.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(secureRandomBuffer);
    return secureRandomBuffer[0] / 4294967296;
  }

  return 0.5;
}

function createCodeLineSet(lineCount) {
  const lines = [];
  const usedIndexes = new Set();

  while (lines.length < lineCount) {
    const index = Math.floor(getRandomUnit() * codeLinePool.length);

    if (usedIndexes.has(index) && usedIndexes.size < codeLinePool.length) {
      continue;
    }

    usedIndexes.add(index);
    lines.push(codeLinePool[index]);
  }

  return lines;
}

function findCodeCutIndex(line, targetLength) {
  const safeTarget = Math.max(10, Math.min(targetLength, line.length));
  const breakTokens = [
    ");",
    "); }",
    " };",
    " }",
    ");",
    ", ",
    " = ",
    " => ",
    "(",
    ".",
    " {",
    ";",
  ];
  let bestIndex = -1;

  breakTokens.forEach((token) => {
    const index = line.lastIndexOf(token, safeTarget);
    if (index > bestIndex) {
      bestIndex = token.trim() === ";" ? index + 1 : index;
    }
  });

  return bestIndex >= 10 ? bestIndex : safeTarget;
}

function stylizeCodeLines(lines) {
  return lines.map((line, index) => {
    const normalizedLine = line.trimEnd();

    if (normalizedLine.length <= 10 || /^[{}]+$/.test(normalizedLine)) {
      return normalizedLine;
    }

    const distribution = getRandomUnit();
    let ratio = 1;

    if (distribution < 0.48) {
      ratio = 0.3 + getRandomUnit() * 0.22;
    } else if (distribution < 0.82) {
      ratio = 0.48 + getRandomUnit() * 0.2;
    } else {
      ratio = 0.72 + getRandomUnit() * 0.2;
    }

    if (index === lines.length - 1 && getRandomUnit() > 0.45) {
      ratio = 0.42 + getRandomUnit() * 0.18;
    }

    if (ratio >= 0.9) {
      return normalizedLine;
    }

    const cutIndex = findCodeCutIndex(
      normalizedLine,
      Math.floor(normalizedLine.length * ratio)
    );

    return normalizedLine.slice(0, cutIndex).trimEnd();
  });
}

function createCodeTypingStream(block, lineCount) {
  const track = document.createElement("div");
  track.className = "hero-code-track";

  const stream = document.createElement("pre");
  stream.className = "hero-code-stream";
  stream.classList.add("is-typing");

  const lines = stylizeCodeLines(createCodeLineSet(lineCount));
  const content = lines.join("\n");

  block.dataset.lineCount = String(lineCount);
  block.dataset.targetContent = content;
  block.dataset.targetLines = JSON.stringify(lines);
  renderCodeStream(stream, lines, 0, true);

  track.append(stream);
  block.replaceChildren(track);

  return { track, stream };
}

function renderCodeStream(stream, lines, typedLength, isTyping) {
  const fragment = document.createDocumentFragment();
  let remaining = typedLength;
  let activeAssigned = false;

  lines.forEach((line, index) => {
    const lineNode = document.createElement("span");
    lineNode.className = "hero-code-line";
    let visibleText = "";

    if (remaining > 0) {
      if (remaining >= line.length) {
        visibleText = line;
        remaining -= line.length;

        if (index < lines.length - 1 && remaining > 0) {
          remaining -= 1;
        }
      } else {
        visibleText = line.slice(0, remaining);
        remaining = 0;
      }
    }

    if (visibleText || (isTyping && !activeAssigned)) {
      lineNode.textContent = visibleText;

      if (isTyping && !activeAssigned && remaining === 0) {
        lineNode.classList.add("is-active");
        activeAssigned = true;
      }

      fragment.append(lineNode);
    }
  });

  if (!fragment.childNodes.length && isTyping) {
    const emptyLine = document.createElement("span");
    emptyLine.className = "hero-code-line is-active";
    emptyLine.textContent = "";
    fragment.append(emptyLine);
  }

  stream.replaceChildren(fragment);
}

heroCodeBlocks.forEach((block, index) => {
  if (!block.dataset.lineCount) {
    block.dataset.lineCount = String(index < 2 ? 18 : 24);
  }
  createCodeTypingStream(block, Number(block.dataset.lineCount));
});

function startCodeTyping() {
  if (heroCodeBlocks.length === 0) {
    return;
  }

  const typingStates = Array.from(heroCodeBlocks, (block, index) => {
    const stream = block.querySelector(".hero-code-stream");
    const targetContent = block.dataset.targetContent || "";
    const targetLines = JSON.parse(block.dataset.targetLines || "[]");
    return {
      stream,
      targetContent,
      targetLines,
      typedLength: 0,
      lastTypeAt: performance.now() + index * 220,
      typeInterval: index < 2 ? 42 : 38,
      chunkSize: 1,
      isDone: false,
    };
  }).filter((state) => state.stream && state.targetContent && state.targetLines.length);

  function frame(now) {
    let hasPendingState = false;

    typingStates.forEach((state) => {
      if (state.isDone) {
        return;
      }

      if (now < state.lastTypeAt) {
        hasPendingState = true;
        return;
      }

      const steps = Math.max(1, Math.floor((now - state.lastTypeAt) / state.typeInterval) + 1);
      state.typedLength = Math.min(
        state.targetContent.length,
        state.typedLength + steps * state.chunkSize
      );
      renderCodeStream(state.stream, state.targetLines, state.typedLength, true);
      state.lastTypeAt = now;

      if (state.typedLength >= state.targetContent.length) {
        renderCodeStream(state.stream, state.targetLines, state.typedLength, false);
        state.stream.classList.remove("is-typing");
        state.isDone = true;
        return;
      }

      hasPendingState = true;
    });

    if (hasPendingState) {
      window.requestAnimationFrame(frame);
    }
  }

  window.requestAnimationFrame(frame);
}

startCodeTyping();

function createHeroTextRain(canvas) {
  if (!canvas) {
    return;
  }

  const container = canvas.parentElement;
  const ctx = canvas.getContext("2d");

  if (!container || !ctx) {
    return;
  }

  const phrase = "Crafted Exclusively for AI";
  const chars = phrase.split("");
  const rainFont = `24px "PingFang SC", "Microsoft YaHei", sans-serif`;
  let viewport = {
    width: 0,
    height: 0,
    dpr: 1,
  };
  let drops = [];
  let frameId = 0;
  let hasCompleted = false;

  function randomBetween(min, max) {
    return min + getRandomUnit() * (max - min);
  }

  function resolveFloorY(x) {
    const normalizedX = (x / Math.max(viewport.width, 1)) * 2 - 1;
    const edgeRatio = 0.9;
    const liftRatio = 0.09;
    return viewport.height * (edgeRatio - liftRatio * (1 - normalizedX * normalizedX));
  }

  function createDrop(index, initial = false) {
    const count = Math.max(8, Math.floor(viewport.width / 72));
    const usableWidth = Math.max(viewport.width - 120, 1);
    const step = count > 1 ? usableWidth / (count - 1) : 0;
    const originX = 60 + step * index + randomBetween(-6, 6);

    return {
      char: chars[index % chars.length],
      originX,
      x: originX,
      y: initial ? randomBetween(-viewport.height * 0.1, viewport.height * 0.22) : randomBetween(-180, -24),
      speed: randomBetween(2.2, 4.2),
      swayAmplitude: randomBetween(2, 8),
      swaySpeed: randomBetween(0.4, 1),
      swayPhase: randomBetween(0, Math.PI * 2),
      alpha: randomBetween(0.22, 0.54),
      rotation: randomBetween(-0.08, 0.08),
      glowStrength: randomBetween(0.28, 0.58),
      state: "fall",
      bounceVelocity: 0,
      fadeSpeed: randomBetween(0.012, 0.02),
      done: false,
    };
  }

  function resetDrops(initial = false) {
    const count = Math.max(8, Math.floor(viewport.width / 72));
    drops = Array.from({ length: count }, (_, index) => createDrop(index, initial));
    hasCompleted = false;
  }

  function resize() {
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    viewport = {
      width: rect.width,
      height: rect.height,
      dpr,
    };

    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = rainFont;
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";

    if (hasCompleted) {
      drops = [];
      ctx.clearRect(0, 0, viewport.width, viewport.height);
      return;
    }

    resetDrops(true);
  }

  function drawDrop(drop, time) {
    if (drop.done) {
      return false;
    }

    const swayOffset = Math.sin(time * drop.swaySpeed + drop.swayPhase) * drop.swayAmplitude;
    drop.x = drop.originX + swayOffset;

    if (drop.state === "fall") {
      drop.y += drop.speed;
      const floorY = resolveFloorY(drop.x);

      if (drop.y >= floorY) {
        drop.y = floorY;
        drop.state = "bounce";
        drop.bounceVelocity = -randomBetween(3.4, 6.2);
      }
    } else {
      drop.y += drop.bounceVelocity;
      drop.bounceVelocity += 0.24;
      drop.alpha -= drop.fadeSpeed;

      if (drop.alpha <= 0.02 || drop.y > resolveFloorY(drop.x) + 14) {
        drop.done = true;
        return false;
      }
    }

    const blue = Math.floor(218 + drop.glowStrength * 32);
    const green = Math.floor(228 + drop.glowStrength * 20);
    const red = Math.floor(194 + drop.glowStrength * 18);
    const drawAlpha = Math.max(drop.alpha, 0);

    ctx.save();
    ctx.shadowColor = `rgba(176, 208, 255, ${0.22 * drop.glowStrength})`;
    ctx.shadowBlur = 14;
    ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${drawAlpha})`;

    if (Math.abs(drop.rotation) > 0.001) {
      ctx.translate(drop.x, drop.y);
      ctx.rotate(drop.rotation);
      ctx.fillText(drop.char, 0, 0);
    } else {
      ctx.fillText(drop.char, drop.x, drop.y);
    }
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = `rgba(188, 214, 255, ${drawAlpha * 0.24})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(drop.x + 1.5, drop.y - 3);
    ctx.lineTo(drop.x - 1, drop.y + 9);
    ctx.stroke();
    ctx.restore();

    return true;
  }

  function frame(now) {
    const time = now * 0.001;
    ctx.clearRect(0, 0, viewport.width, viewport.height);
    ctx.font = rainFont;

    let activeCount = 0;

    drops.forEach((drop) => {
      if (drawDrop(drop, time)) {
        activeCount += 1;
      }
    });

    if (activeCount > 0) {
      frameId = window.requestAnimationFrame(frame);
      return;
    }

    hasCompleted = true;
    frameId = 0;
  }

  resize();
  window.addEventListener("resize", resize);
  frameId = window.requestAnimationFrame(frame);
}

createHeroTextRain(heroRainCanvas);

function handleGlowPointerMove(event) {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  button.style.setProperty("--glow-x", `${x}%`);
  button.style.setProperty("--glow-y", `${y}%`);
}

function handleGlowPointerEnter(event) {
  event.currentTarget.classList.add("is-glow-active");
  handleGlowPointerMove(event);
}

function handleGlowPointerLeave(event) {
  event.currentTarget.classList.remove("is-glow-active");
}

async function writeClipboardText(text) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    await navigator.clipboard.writeText(text);
    return;
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  helper.style.pointerEvents = "none";
  document.body.append(helper);
  helper.select();

  const copied = document.execCommand("copy");
  helper.remove();

  if (!copied) {
    throw new Error("copy failed");
  }
}

let usageToastTimer = 0;

function showUsageToast(message) {
  if (window.parent !== window) {
    window.parent.postMessage(
      {
        type: "hiui-homepage-embedded-toast",
        message,
      },
      window.location.origin
    );
    return;
  }

  if (!usageToast) {
    return;
  }

  usageToast.textContent = message;
  usageToast.classList.add("is-visible");
  window.clearTimeout(usageToastTimer);
  usageToastTimer = window.setTimeout(() => {
    usageToast.classList.remove("is-visible");
  }, 1600);
}

glowButtons.forEach((button) => {
  button.addEventListener("pointerenter", handleGlowPointerEnter);
  button.addEventListener("pointermove", handleGlowPointerMove);
  button.addEventListener("pointerleave", handleGlowPointerLeave);
});

usageCopyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const targetId = button.dataset.copyTarget;
    const source = targetId ? document.getElementById(targetId) : null;
    const text = source ? source.value : "";

    if (!text) {
      return;
    }

    try {
      await writeClipboardText(text);
      showUsageToast("已复制到剪贴板");
    } catch (error) {
      showUsageToast("复制失败，请手动复制");
    }
  });
});

function syncSlidingTrack(track, index) {
  if (!track) {
    return;
  }

  const panelGap =
    Number.parseFloat(
      window.getComputedStyle(track).getPropertyValue("--page-types-panel-gap")
    ) || 0;

  track.style.transform = `translateX(calc(-${index * 100}% - ${index * panelGap}px))`;
}

function activateDemoTab(nextIndex) {
  demoTabs.forEach((tab, index) => {
    const isActive = index === nextIndex;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  demoOverlays.forEach((overlay, index) => {
    overlay.classList.toggle("is-active", index === nextIndex);
  });

  syncSlidingTrack(demoTrack, nextIndex);
}

function activatePageTypesPage(nextIndex) {
  activePageTypesIndex = nextIndex;

  pageTypesDots.forEach((dot, index) => {
    const isActive = index === nextIndex;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-selected", String(isActive));
  });

  syncSlidingTrack(pageTypesTrack, nextIndex);
}

function stopPageTypesAutoPlay() {
  if (!pageTypesAutoPlayTimer) {
    return;
  }

  window.clearInterval(pageTypesAutoPlayTimer);
  pageTypesAutoPlayTimer = null;
}

function startPageTypesAutoPlay() {
  stopPageTypesAutoPlay();

  if (pageTypesDots.length < 2) {
    return;
  }

  pageTypesAutoPlayTimer = window.setInterval(() => {
    const nextIndex = (activePageTypesIndex + 1) % pageTypesDots.length;
    activatePageTypesPage(nextIndex);
  }, pageTypesAutoPlayDelay);
}

function notifyParentFrameHeight() {
  if (window.parent === window) {
    return;
  }

  const root = document.documentElement;
  const body = document.body;
  const visiblePanels = Array.from(document.querySelectorAll(".panel")).filter((panel) => {
    const panelStyle = window.getComputedStyle(panel);
    return panelStyle.display !== "none" && panelStyle.visibility !== "hidden";
  });
  const visiblePanelBottom = visiblePanels.reduce((maxBottom, panel) => {
    const panelRect = panel.getBoundingClientRect();
    const panelBottom = panelRect.top + window.scrollY + panelRect.height;

    return Math.max(maxBottom, panelBottom);
  }, 0);
  const documentHeight = Math.max(
    root ? root.scrollHeight : 0,
    body ? body.scrollHeight : 0,
    root ? root.offsetHeight : 0,
    body ? body.offsetHeight : 0
  );
  const height = visiblePanelBottom > 0 ? visiblePanelBottom : documentHeight;

  window.parent.postMessage(
    {
      type: "hiui-homepage-embedded-height",
      height,
    },
    window.location.origin
  );
}

let parentFrameHeightRaf = 0;
let parentFrameHeightTimers = [];

function clearScheduledParentFrameHeightSync() {
  window.cancelAnimationFrame(parentFrameHeightRaf);
  parentFrameHeightTimers.forEach((timer) => window.clearTimeout(timer));
  parentFrameHeightTimers = [];
}

function scheduleParentFrameHeightSync() {
  clearScheduledParentFrameHeightSync();

  parentFrameHeightRaf = window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      notifyParentFrameHeight();
    });
  });

  [120, 320, 640].forEach((delay) => {
    const timer = window.setTimeout(() => {
      notifyParentFrameHeight();
    }, delay);

    parentFrameHeightTimers.push(timer);
  });
}

function requestParentScrollTo(targetId) {
  if (!targetId || window.parent === window) {
    return;
  }

  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  const targetTop = target.getBoundingClientRect().top + window.scrollY;

  window.parent.postMessage(
    {
      type: "hiui-homepage-embedded-scroll",
      targetId,
      top: targetTop,
    },
    window.location.origin
  );
}

window.addEventListener("load", () => {
  scheduleParentFrameHeightSync();
});

window.addEventListener("resize", scheduleParentFrameHeightSync);

if (typeof ResizeObserver === "function") {
  const homepageResizeObserver = new ResizeObserver(() => {
    scheduleParentFrameHeightSync();
  });

  if (document.body) {
    homepageResizeObserver.observe(document.body);
  }

  if (document.documentElement) {
    homepageResizeObserver.observe(document.documentElement);
  }
}

document.querySelectorAll("iframe").forEach((frame) => {
  frame.addEventListener("load", scheduleParentFrameHeightSync);
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const href = anchor.getAttribute("href") || "";
    const targetId = href.replace(/^#/, "").trim();

    if (!targetId || targetId === "!") {
      return;
    }

    event.preventDefault();
    requestParentScrollTo(targetId);
  });
});

demoTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    activateDemoTab(index);
  });
});

pageTypesDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    activatePageTypesPage(index);
    startPageTypesAutoPlay();
  });
});

activateDemoTab(0);
activatePageTypesPage(0);
startPageTypesAutoPlay();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopPageTypesAutoPlay();
    return;
  }

  startPageTypesAutoPlay();
});

function initUpgradeCompare() {
  if (!upgradeCompare) {
    return;
  }

  const overlay = upgradeCompare.querySelector("[data-upgrade-overlay]");
  const divider = upgradeCompare.querySelector("[data-upgrade-divider]");
  const handle = upgradeCompare.querySelector("[data-upgrade-handle]");

  if (!overlay || !divider || !handle) {
    return;
  }

  const browserBounds = {
    left: 240 / 2640,
    width: 2160 / 2640,
  };
  let activePointerId = null;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function setUpgradePosition(nextPosition) {
    const safePosition = clamp(nextPosition, 0, 100);
    const overlayInset = `${safePosition}%`;
    const dividerLeft = `${(browserBounds.left + browserBounds.width * (safePosition / 100)) * 100}%`;

    upgradeCompare.dataset.upgradePosition = safePosition.toFixed(2);
    overlay.style.clipPath = `inset(0 0 0 ${overlayInset})`;
    divider.style.left = dividerLeft;
  }

  function syncFromClientX(clientX) {
    const rect = upgradeCompare.getBoundingClientRect();
    const browserLeft = rect.left + rect.width * browserBounds.left;
    const browserWidth = rect.width * browserBounds.width;
    const nextPosition = ((clientX - browserLeft) / browserWidth) * 100;
    setUpgradePosition(nextPosition);
  }

  function handlePointerDown(event) {
    if (event.pointerType !== "touch" && event.button !== 0) {
      return;
    }

    activePointerId = event.pointerId;
    upgradeCompare.classList.add("is-dragging");
    upgradeCompare.setPointerCapture(event.pointerId);
    syncFromClientX(event.clientX);
    event.preventDefault();
  }

  function handlePointerMove(event) {
    if (event.pointerId !== activePointerId) {
      return;
    }

    syncFromClientX(event.clientX);
  }

  function handlePointerEnd(event) {
    if (event.pointerId !== activePointerId) {
      return;
    }

    upgradeCompare.classList.remove("is-dragging");

    if (upgradeCompare.hasPointerCapture(event.pointerId)) {
      upgradeCompare.releasePointerCapture(event.pointerId);
    }

    activePointerId = null;
  }

  function handleKeyDown(event) {
    const current = Number(upgradeCompare.dataset.upgradePosition || "52");
    const step = event.shiftKey ? 10 : 2;

    if (event.key === "ArrowLeft") {
      setUpgradePosition(current - step);
      event.preventDefault();
    }

    if (event.key === "ArrowRight") {
      setUpgradePosition(current + step);
      event.preventDefault();
    }
  }

  upgradeCompare.addEventListener("pointerdown", handlePointerDown);
  upgradeCompare.addEventListener("pointermove", handlePointerMove);
  upgradeCompare.addEventListener("pointerup", handlePointerEnd);
  upgradeCompare.addEventListener("pointercancel", handlePointerEnd);
  handle.addEventListener("keydown", handleKeyDown);

  setUpgradePosition(Number(upgradeCompare.dataset.upgradePosition || "52"));
}

initUpgradeCompare();

function initTiltedMedia() {
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!supportsHover) {
    return;
  }

  tiltedMediaCards.forEach((card) => {
    const inner = card.querySelector("[data-tilted-media-inner]");

    if (!inner) {
      return;
    }

    const rotateAmplitude = Number(card.dataset.rotateAmplitude || 14);
    const scaleOnHover = Number(card.dataset.scaleOnHover || 1.06);
    let targetRotateX = 0;
    let targetRotateY = 0;
    let targetScale = 1;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let currentScale = 1;
    let frameId = 0;

    function render() {
      currentRotateX += (targetRotateX - currentRotateX) * 0.16;
      currentRotateY += (targetRotateY - currentRotateY) * 0.16;
      currentScale += (targetScale - currentScale) * 0.14;

      inner.style.transform = `rotateX(${currentRotateX.toFixed(3)}deg) rotateY(${currentRotateY.toFixed(3)}deg) scale(${currentScale.toFixed(4)})`;

      const shouldContinue =
        Math.abs(targetRotateX - currentRotateX) > 0.01 ||
        Math.abs(targetRotateY - currentRotateY) > 0.01 ||
        Math.abs(targetScale - currentScale) > 0.001;

      if (shouldContinue) {
        frameId = window.requestAnimationFrame(render);
      } else {
        frameId = 0;
      }
    }

    function queueRender() {
      if (!frameId) {
        frameId = window.requestAnimationFrame(render);
      }
    }

    card.addEventListener("pointerenter", () => {
      targetScale = scaleOnHover;
      queueRender();
    });

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const offsetX = event.clientX - rect.left - rect.width / 2;
      const offsetY = event.clientY - rect.top - rect.height / 2;
      targetRotateX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
      targetRotateY = (offsetX / (rect.width / 2)) * rotateAmplitude;
      queueRender();
    });

    card.addEventListener("pointerleave", () => {
      targetRotateX = 0;
      targetRotateY = 0;
      targetScale = 1;
      queueRender();
    });
  });
}

initTiltedMedia();

function initScrollReveal() {
  if (!scrollRevealTargets.length) {
    return;
  }

  const revealTarget = (target) => {
    target.classList.add("is-revealed");
  };
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    scrollRevealTargets.forEach(revealTarget);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        revealTarget(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  scrollRevealTargets.forEach((target) => {
    observer.observe(target);
  });
}

initScrollReveal();
