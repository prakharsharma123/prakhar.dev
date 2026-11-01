/*
 * Chatbox widget for the portfolio website.
 *
 * Adds a floating "Talk to Chatbox" button at the bottom-right of the page. Clicking it
 * slides open a panel on the right side (about a quarter of the page) with PrakharBot inside.
 *
 * Use: put this file next to index.html and add, just before </body>:
 *   <script src="chatbox-widget.js" defer></script>
 *
 * Optional settings, as attributes on that script tag:
 *   data-label="Chatbox"                              (button text; default "Talk to Chatbox")
 *   data-src="https://prakhar-chatbox.onrender.com/"  (where the chatbot lives)
 *
 * Everything it needs (styles, button, panel) is created here, so no other files change.
 */
(function () {
  "use strict";
  if (window.__prakharChatboxWidget) return;
  window.__prakharChatboxWidget = true;

  var me = document.currentScript;
  var SRC = (me && me.getAttribute("data-src")) || "https://prakhar-chatbox.onrender.com/";
  var LABEL = (me && me.getAttribute("data-label")) || "Talk to Chatbox";

  var targetOrigin = "*";
  try { targetOrigin = new URL(SRC, location.href).origin; } catch (e) { /* keep "*" */ }

  /* ---------- styles (all names start with pcb- so they never clash with the site) ---------- */
  var css = [
    ".pcb-launch{position:fixed;right:24px;bottom:24px;z-index:2147483000;display:inline-flex;align-items:center;gap:10px;",
    "padding:14px 20px;border:0;border-radius:12px;background:var(--primary-orange,#EE5D36);color:#fff;cursor:pointer;",
    "font:700 15px/1 var(--font-body,'Plus Jakarta Sans',system-ui,sans-serif);letter-spacing:.01em;",
    "box-shadow:0 10px 28px -6px rgba(238,93,54,.55),0 2px 6px rgba(0,0,0,.18);",
    "transition:transform .15s ease,box-shadow .15s ease,opacity .2s ease}",
    ".pcb-launch:hover{transform:translateY(-2px);box-shadow:0 14px 32px -6px rgba(238,93,54,.65),0 2px 8px rgba(0,0,0,.2)}",
    ".pcb-launch:focus-visible,.pcb-btn:focus-visible{outline:3px solid #fff;outline-offset:2px;box-shadow:0 0 0 5px rgba(0,0,0,.45)}",
    ".pcb-launch svg{width:20px;height:20px;flex:none}",
    ".pcb-dot{width:9px;height:9px;border-radius:50%;background:#3ddc97;box-shadow:0 0 0 0 rgba(61,220,151,.7);animation:pcb-pulse 2s infinite}",
    "@keyframes pcb-pulse{70%{box-shadow:0 0 0 8px rgba(61,220,151,0)}100%{box-shadow:0 0 0 0 rgba(61,220,151,0)}}",
    ".pcb-open .pcb-launch{opacity:0;pointer-events:none;transform:translateY(8px)}",

    ".pcb-panel{position:fixed;top:0;right:0;bottom:0;z-index:2147483001;display:flex;flex-direction:column;",
    "width:clamp(360px,25vw,520px);max-width:100vw;background:#0f1117;box-shadow:-18px 0 48px -12px rgba(0,0,0,.45);",
    "transform:translateX(105%);visibility:hidden;transition:transform .3s ease,visibility 0s linear .3s}",
    ".pcb-open .pcb-panel{transform:none;visibility:visible;transition:transform .3s ease,visibility 0s}",
    ".pcb-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 14px;flex:none;",
    "background:var(--primary-orange,#EE5D36);color:#fff;font:700 15px/1.2 var(--font-body,'Plus Jakarta Sans',system-ui,sans-serif)}",
    ".pcb-title{display:flex;align-items:center;gap:8px}",
    ".pcb-title .pcb-dot{background:#fff;animation:none}",
    ".pcb-tools{display:flex;align-items:center;gap:4px}",
    ".pcb-btn{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border:0;border-radius:8px;",
    "background:rgba(255,255,255,.18);color:#fff;cursor:pointer;text-decoration:none}",
    ".pcb-btn:hover{background:rgba(255,255,255,.3)}",
    ".pcb-btn svg{width:18px;height:18px}",
    ".pcb-body{position:relative;flex:1;min-height:0;background:#0f1117}",
    ".pcb-body iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#0f1117}",
    ".pcb-loading{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;",
    "padding:24px;text-align:center;color:#c9ccd6;font:500 14px/1.5 system-ui,sans-serif}",
    ".pcb-loading a{color:#fff}",
    ".pcb-spin{width:28px;height:28px;border:3px solid rgba(255,255,255,.2);border-top-color:var(--primary-orange,#EE5D36);",
    "border-radius:50%;animation:pcb-rot .9s linear infinite}",
    "@keyframes pcb-rot{to{transform:rotate(360deg)}}",

    "@media (max-width:768px){.pcb-panel{width:100vw}.pcb-launch{right:14px;bottom:14px;padding:12px 16px;font-size:14px}}",
    "@media (prefers-reduced-motion:reduce){.pcb-panel,.pcb-launch{transition:none}.pcb-dot{animation:none}.pcb-spin{animation-duration:2s}}"
  ].join("");

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- markup ---------- */
  var ICON_CHAT =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 21 12z"/><path d="M9 11h6M9 14h4"/></svg>';
  var ICON_CLOSE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  var ICON_OUT =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';

  var root = document.createElement("div");
  root.className = "pcb-root";

  var launch = document.createElement("button");
  launch.type = "button";
  launch.className = "pcb-launch";
  launch.setAttribute("aria-haspopup", "dialog");
  launch.setAttribute("aria-expanded", "false");
  launch.innerHTML = ICON_CHAT + "<span></span><i class='pcb-dot' aria-hidden='true'></i>";
  launch.querySelector("span").textContent = LABEL;

  var panel = document.createElement("aside");
  panel.className = "pcb-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Chat with PrakharBot");
  panel.innerHTML =
    '<div class="pcb-head">' +
      '<div class="pcb-title"><i class="pcb-dot" aria-hidden="true"></i><span>PrakharBot</span></div>' +
      '<div class="pcb-tools">' +
        '<a class="pcb-btn" id="pcb-newtab" target="_blank" rel="noopener" title="Open in a new tab" aria-label="Open chat in a new tab"></a>' +
        '<button class="pcb-btn" id="pcb-close" type="button" title="Close" aria-label="Close chat"></button>' +
      "</div>" +
    "</div>" +
    '<div class="pcb-body" id="pcb-body">' +
      '<div class="pcb-loading" id="pcb-loading"><div class="pcb-spin"></div>' +
      "<div>Waking up the chatbot&hellip;<br>The first time can take a few seconds.</div></div>" +
    "</div>";

  root.appendChild(launch);
  root.appendChild(panel);
  document.body.appendChild(root);

  var closeBtn = panel.querySelector("#pcb-close");
  var newTab = panel.querySelector("#pcb-newtab");
  var body = panel.querySelector("#pcb-body");
  var loading = panel.querySelector("#pcb-loading");
  closeBtn.innerHTML = ICON_CLOSE;
  newTab.innerHTML = ICON_OUT;
  newTab.href = SRC;

  /* ---------- behaviour ---------- */
  var frame = null;
  var isOpen = false;

  function siteTheme() {
    var t = document.documentElement.getAttribute("data-theme");
    return t === "dark" ? "dark" : "light";
  }

  function buildUrl() {
    var u = new URL(SRC, location.href);
    u.searchParams.set("theme", siteTheme());
    return u.toString();
  }

  function slowLoadNotice() {
    if (!loading || !loading.parentNode) return;
    loading.innerHTML =
      "<div>This is taking longer than usual.<br>Give it a moment, or " +
      '<a href="' + SRC + '" target="_blank" rel="noopener">open the chat in a new tab</a>.</div>';
  }

  function ensureFrame() {
    if (frame) return;
    frame = document.createElement("iframe");
    frame.title = "PrakharBot chat";
    frame.setAttribute("allow", "microphone; autoplay; clipboard-write");
    frame.src = buildUrl();
    frame.addEventListener("load", function () {
      if (loading && loading.parentNode) loading.parentNode.removeChild(loading);
    });
    body.appendChild(frame);
    setTimeout(slowLoadNotice, 45000);
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    ensureFrame();
    root.classList.add("pcb-open");
    launch.setAttribute("aria-expanded", "true");
    setTimeout(function () { closeBtn.focus(); }, 320);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove("pcb-open");
    launch.setAttribute("aria-expanded", "false");
    launch.focus();
    // Tell the chat to stop talking and listening now that it is hidden.
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage({ type: "pb-hide" }, targetOrigin);
    }
  }

  // Escape pressed while the cursor is inside the chat asks the panel to close.
  window.addEventListener("message", function (e) {
    if (frame && e.source === frame.contentWindow && e.data && e.data.type === "pb-close") close();
  });

  launch.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) close();
  });

  // Keep the chat's light/dark mode in step with the portfolio's theme switch.
  if (window.MutationObserver) {
    new MutationObserver(function () {
      if (frame && frame.contentWindow) {
        frame.contentWindow.postMessage({ type: "pb-theme", theme: siteTheme() }, targetOrigin);
      }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  // The chatbot's server sleeps when nobody uses it. Nudge it awake in the background
  // so it is ready by the time someone clicks the button.
  function wake() {
    try { fetch(SRC, { mode: "no-cors", cache: "no-store" }).catch(function () {}); } catch (e) { /* ignore */ }
  }
  if ("requestIdleCallback" in window) requestIdleCallback(wake, { timeout: 4000 });
  else setTimeout(wake, 2000);
})();
