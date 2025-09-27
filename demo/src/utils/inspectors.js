/**
 * Centralized helpers to render live “inspector” tables next to demos.
 * Import from pages:
 *   import { initImageInspector, initVideoInspector, updateInspector } from "../utils/inspectors.js";
 */

/** Dispatch rows to an InspectorTable by id. */
export function updateInspector(tableId, rows) {
  const tgt = document.getElementById(tableId);
  if (!tgt) return;
  tgt.dispatchEvent(new CustomEvent("inspector:update", { detail: { rows } }));
}

/** Find the <img> element to observe (inner <img> when wrapped in <picture>, else the plain <img>). */
function findTargetImg(root) {
  const pic = root.querySelector("picture");
  if (pic) {
    const inner = pic.querySelector("img");
    if (inner) return inner;
  }
  return root.querySelector("img");
}

/** Initialize SmartImage live inspector for a wrapper+table pair. */
export function initImageInspector(wrapperId, tableId) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;

  const img = findTargetImg(wrapper);
  if (!img) return;

  const scheduleOn = (el, evts) => evts.forEach((e) => el.addEventListener(e, schedule));
  const ro = new ResizeObserver(() => schedule());
  ro.observe(wrapper);

  const mo = new MutationObserver(() => schedule());
  mo.observe(img, { attributes: true, attributeFilter: ["src", "srcset", "sizes"] });

  scheduleOn(img, ["load"]);
  window.addEventListener("resize", () => schedule());

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;

      // Compute the pixel requirement the browser tries to satisfy for crisp rendering:
      // requiredPx ≈ container CSS width * devicePixelRatio
      const dpr = Number(window.devicePixelRatio ?? 1);
      const requiredPx = Math.round(wrapper.clientWidth * dpr);

      // Attempt to parse the chosen candidate width from the currentSrc URL (?w=###).
      // Works with Astro's dev/preview _image transformer URLs.
      let chosenWidth = null;
      try {
        const u = new URL(img.currentSrc);
        const w = u.searchParams.get("w");
        if (w) chosenWidth = Number(w);
      } catch {}

      const rows = [
        { label: "Container (CSS px)", value: `${wrapper.clientWidth}×${wrapper.clientHeight}` },
        { label: "devicePixelRatio", value: String(window.devicePixelRatio ?? 1) },
        { label: "currentSrc", value: img.currentSrc || "(empty)" },
        { label: "naturalWidth (px)", value: String(img.naturalWidth || 0) },
        { label: "naturalHeight (px)", value: String(img.naturalHeight || 0) },
        { label: "sizes", value: img.getAttribute("sizes") || "(none)" },
        {
          label: "srcset candidates",
          value: (img.getAttribute("srcset") || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean).length,
        },
        {
          label: "chosen width (URL w=)",
          value: (() => {
            try {
              const u = new URL(img.currentSrc, window.location.href);
              const w = u.searchParams.get("w") || u.searchParams.get("width");
              if (w) {
                return `${w}px`;
              }
            } catch {}
            // Fallback: reflect the ACTUAL loaded candidate, even when no ?w= is present (prod builds/CDNs).
            return img.naturalWidth ? `${img.naturalWidth}px (naturalWidth)` : "(n/a)";
          })(),
        },
        {
          label: "format",
          value: (() => {
            try {
              const u = new URL(img.currentSrc, window.location.href);
              return u.searchParams.get("f") || "(unknown)";
            } catch {
              return "(unknown)";
            }
          })(),
        },
      ];

      updateInspector(tableId, rows);
    });
  }

  schedule();
}

/** Initialize SmartVideo live inspector for a wrapper+table pair. */
export function initVideoInspector(wrapperId, tableId) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;

  const container = wrapper.querySelector('[data-component="smart-video"]');
  const video = container?.querySelector("video");
  if (!container || !video) return;

  const ro = new ResizeObserver(() => schedule());
  ro.observe(wrapper);

  const mediaEvents = [
    "loadedmetadata",
    "canplay",
    "play",
    "pause",
    "waiting",
    "stalled",
    "timeupdate",
    "progress",
    "ratechange",
    "volumechange",
    "emptied",
    "ended",
  ];
  mediaEvents.forEach((ev) => video.addEventListener(ev, () => schedule()));

  let timer = window.setInterval(() => schedule(), 1000);
  window.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearInterval(timer);
    } else {
      timer = window.setInterval(() => schedule(), 1000);
    }
  });

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;

      const rows = [
        { label: "Container (CSS px)", value: `${wrapper.clientWidth}×${wrapper.clientHeight}` },
        { label: "isIntersecting", value: container.getAttribute("data-is-intersecting") === "true" },
        { label: "autoplay (data)", value: container.dataset.autoplay },
        { label: "playOnHover (data)", value: container.dataset.playOnHover },
        { label: "playback mode", value: container.getAttribute("data-playback-mode") || "(unknown)" },
        { label: "readyState", value: String(video.readyState) },
        { label: "networkState", value: String(video.networkState) },
        { label: "paused", value: String(video.paused) },
        { label: "muted", value: String(video.muted) },
        { label: "video intrinsic (CSS px)", value: `${video.videoWidth}×${video.videoHeight}` },
        { label: "currentTime", value: video.currentTime.toFixed(2) },
      ];

      updateInspector(tableId, rows);
    });
  }

  schedule();
}
