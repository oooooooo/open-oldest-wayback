// ==UserScript==
// @name         Open Oldest Wayback
// @namespace    https://github.com/oooooooo/open-oldest-wayback
// @version      0.2.0
// @description  Open the oldest available Wayback Machine snapshot for the current page.
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      web.archive.org
// @updateURL    https://github.com/oooooooo/open-oldest-wayback/raw/main/open-oldest-wayback.user.js
// @downloadURL  https://github.com/oooooooo/open-oldest-wayback/raw/main/open-oldest-wayback.user.js
// @run-at       document-idle
// ==/UserScript==

(() => {
  const SHORTCUT = {
    altKey: true,
    shiftKey: true,
    ctrlKey: false,
    metaKey: false,
    key: "I",
  };

  const CDX_API_URL = "https://web.archive.org/cdx";
  const WAYBACK_URL = "https://web.archive.org/web";
  const STATUS_ID = "open-oldest-wayback-status";

  let statusTimerId = 0;

  function isEditableElement(element) {
    if (!element) {
      return false;
    }

    const tagName = element.tagName;
    return (
      element.isContentEditable ||
      tagName === "INPUT" ||
      tagName === "TEXTAREA" ||
      tagName === "SELECT"
    );
  }

  function matchesShortcut(event) {
    return (
      event.altKey === SHORTCUT.altKey &&
      event.shiftKey === SHORTCUT.shiftKey &&
      event.ctrlKey === SHORTCUT.ctrlKey &&
      event.metaKey === SHORTCUT.metaKey &&
      event.key.toUpperCase() === SHORTCUT.key
    );
  }

  function buildCdxUrl(pageUrl) {
    const params = new URLSearchParams({
      url: pageUrl,
      output: "json",
      fl: "timestamp,original,statuscode",
      filter: "statuscode:200",
      collapse: "digest",
      limit: "1",
      from: "1996",
    });

    return `${CDX_API_URL}?${params.toString()}`;
  }

  function requestJson(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        responseType: "json",
        onload(response) {
          if (response.status < 200 || response.status >= 300) {
            reject(new Error(`CDX API returned HTTP ${response.status}`));
            return;
          }

          resolve(response.response);
        },
        onerror() {
          reject(new Error("Failed to connect to the Internet Archive CDX API"));
        },
        ontimeout() {
          reject(new Error("Timed out while contacting the Internet Archive CDX API"));
        },
      });
    });
  }

  function showStatus(message, options = {}) {
    const { durationMs = 0, isError = false } = options;
    let statusElement = document.getElementById(STATUS_ID);

    if (!statusElement) {
      statusElement = document.createElement("div");
      statusElement.id = STATUS_ID;
      statusElement.style.position = "fixed";
      statusElement.style.left = "50%";
      statusElement.style.top = "38%";
      statusElement.style.transform = "translate(-50%, -50%)";
      statusElement.style.zIndex = "2147483647";
      statusElement.style.padding = "16px 22px";
      statusElement.style.borderRadius = "12px";
      statusElement.style.boxShadow = "0 10px 32px rgba(0, 0, 0, 0.32)";
      statusElement.style.font = "16px/1.5 sans-serif";
      statusElement.style.pointerEvents = "none";
      statusElement.style.transition = "opacity 160ms ease";
      document.documentElement.append(statusElement);
    }

    window.clearTimeout(statusTimerId);
    statusElement.textContent = message;
    statusElement.style.background = isError ? "#7f1d1d" : "#111827";
    statusElement.style.color = "#ffffff";
    statusElement.style.opacity = "0.92";

    if (durationMs > 0) {
      statusTimerId = window.setTimeout(() => {
        statusElement.style.opacity = "0";
      }, durationMs);
    }
  }

  async function openOldestArchive() {
    const pageUrl = window.location.href;
    const MAX_RETRIES = 3;

    showStatus("Fetching the oldest snapshot...");

    let lastError;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const cdxResponse = await requestJson(buildCdxUrl(pageUrl));

        if (!Array.isArray(cdxResponse) || cdxResponse.length < 2) {
          showStatus("No Internet Archive snapshot was found for this page.", {
            durationMs: 3200,
            isError: true,
          });
          return;
        }

        const [timestamp, original] = cdxResponse[1];
        showStatus("Opening the oldest snapshot...", { durationMs: 1600 });
        window.location.assign(`${WAYBACK_URL}/${timestamp}/${original}`);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < MAX_RETRIES) {
          showStatus(`Retrying... (${attempt}/${MAX_RETRIES})`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    throw lastError;
  }

  function handleError(error) {
    console.error("[Open Oldest Wayback]", error);
    showStatus(error.message, { durationMs: 4000, isError: true });
  }

  document.addEventListener("keydown", (event) => {
    if (!matchesShortcut(event) || isEditableElement(event.target)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    openOldestArchive().catch(handleError);
  });

  const navEntry = performance.getEntriesByType("navigation")[0];
  if (navEntry?.responseStatus === 404) {
    openOldestArchive().catch(handleError);
  }
})();
