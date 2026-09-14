(function () {
  const N = document.querySelectorAll(".slide").length;
  let c = 1;

  const ctr = document.getElementById("ctr");
  const btnN = document.getElementById("btnN");
  const btnP = document.getElementById("btnP");
  const progressFill = document.getElementById("progress-fill");
  const scaleWrap = document.getElementById("scale-wrap");
  const navRow = document.getElementById("nav-row");

  const STAGE_W = 1060;
  const STAGE_H = 596;

  function scaleStage() {
    if (!scaleWrap) return;
    const navH = navRow ? navRow.offsetHeight : 0;
    const availW = window.innerWidth - 24;
    const availH = window.innerHeight - navH - 40;
    const scale = Math.min(1, availW / STAGE_W, availH / STAGE_H);
    scaleWrap.style.transform = "scale(" + scale + ")";
    scaleWrap.style.marginBottom = scale < 1 ? (STAGE_H * scale - STAGE_H) + "px" : "0";
  }

  scaleStage();
  window.addEventListener("resize", scaleStage);

  function updateProgress() {
    if (!progressFill) return;
    progressFill.style.width = (c / N) * 100 + "%";
  }

  function go(n) {
    if (n < 1 || n > N || n === c) return;
    document.getElementById("s" + c).classList.remove("active");
    c = n;
    document.getElementById("s" + c).classList.add("active");
    ctr.textContent = c + " / " + N;
    btnP.disabled = c === 1;
    btnN.disabled = c === N;
    updateProgress();
  }

  updateProgress();
  btnN.onclick = () => go(c + 1);
  btnP.onclick = () => go(c - 1);

  document.addEventListener("keydown", (e) => {
    if (["ArrowLeft", "ArrowDown", " "].includes(e.key)) {
      e.preventDefault();
      go(c + 1);
    }
    if (["ArrowRight", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      go(c - 1);
    }
  });

  /* Copy code buttons */
  function copyCodeText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise((resolve, reject) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "readonly");
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);

      try {
        document.execCommand("copy");
        document.body.removeChild(ta);
        resolve();
      } catch (error) {
        document.body.removeChild(ta);
        reject(error);
      }
    });
  }

  const NBSP = String.fromCharCode(160);

  function extractCodeText(el) {
    const clone = el.cloneNode(true);
    clone.querySelectorAll(".copy-btn, .cb-label").forEach((node) => node.remove());
    return clone.innerText
      .split(NBSP)
      .join(" ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function setCopiedState(btn) {
    clearTimeout(btn._copyTimer);
    btn.classList.add("copied");
    btn.innerHTML = '<i class="fas fa-check"></i><span>تم النسخ</span>';
    btn._copyTimer = setTimeout(() => {
      btn.classList.remove("copied");
      btn.innerHTML = '<i class="fas fa-copy"></i><span>نسخ</span>';
    }, 1600);
  }

  function initCopyButtons() {
    document.querySelectorAll(".cb, .term-body").forEach((el) => {
      if (el.dataset.copyReady === "true") return;
      el.dataset.copyReady = "true";
      el.classList.add("copyable-code");

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.setAttribute("aria-label", "نسخ الكود");
      btn.innerHTML = '<i class="fas fa-copy"></i><span>نسخ</span>';

      btn.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const text = extractCodeText(el);
        if (!text) return;

        try {
          await copyCodeText(text);
          setCopiedState(btn);
        } catch (error) {
          console.error("Copy failed:", error);
        }
      });

      el.appendChild(btn);
    });
  }

  initCopyButtons();
})();
