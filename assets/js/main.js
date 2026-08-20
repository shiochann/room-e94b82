// 配布ページの演出。外部ライブラリは使っていない。

(() => {
  "use strict";

  /* ---------- ローディング ----------
     実際の読み込み完了に合わせて閉じる。
     一瞬で終わると点滅して見えるので、最低600msは見せる。 */
  const loader = document.getElementById("loader");
  const fill = document.getElementById("loaderFill");
  const start = Date.now();
  let progress = 0;

  const tick = setInterval(() => {
    progress = Math.min(progress + Math.random() * 18, 90);
    fill.style.width = progress + "%";
  }, 120);

  function done() {
    clearInterval(tick);
    fill.style.width = "100%";
    const wait = Math.max(0, 600 - (Date.now() - start));
    setTimeout(() => loader.classList.add("is-done"), wait + 250);
  }

  if (document.readyState === "complete") done();
  else window.addEventListener("load", done);

  // 何かの理由で load が来なくても、画面が固まったままにはしない
  setTimeout(done, 5000);

  /* ---------- スクロールで順に表示 ---------- */
  const targets = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );
    targets.forEach((el) => io.observe(el));
  }

  /* ---------- 画面写真 ----------
     まだ用意していない画像は、枠ごと消して見せない。
     壊れた画像アイコンが出るより、無いほうがきれいなため。 */
  document.querySelectorAll(".shot img").forEach((img) => {
    const hide = () => {
      const fig = img.closest(".shot");
      if (fig) fig.remove();
    };
    if (img.complete && img.naturalWidth === 0) hide();
    img.addEventListener("error", hide);
  });

  /* ---------- 拡大表示 ---------- */
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const big = lightbox.querySelector("img");

    document.addEventListener("click", (e) => {
      const target = e.target.closest(".shot img");
      if (!target) return;
      big.src = target.src;
      big.alt = target.alt;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
    });

    const close = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
    };
    lightbox.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- コピーボタン ----------
     data-copy を付けた .code だけにボタンを足す。
     サンプル出力の枠にまで付くと、押す意味のないボタンが並んで迷わせるため。 */
  document.querySelectorAll(".code[data-copy]").forEach((box) => {
    const text = box.textContent.trim();

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy";
    btn.textContent = "コピー";
    btn.setAttribute("aria-label", text + " をコピー");

    let timer = null;
    const flash = (label, cls) => {
      btn.textContent = label;
      btn.classList.add(cls);
      clearTimeout(timer);
      timer = setTimeout(() => {
        btn.textContent = "コピー";
        btn.classList.remove("is-done", "is-fail");
      }, 1800);
    };

    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(text);
        flash("コピーしました", "is-done");
      } catch {
        // 古い環境やhttp配信のときの保険
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        ta.remove();
        flash(ok ? "コピーしました" : "コピーできません", ok ? "is-done" : "is-fail");
      }
    });

    box.appendChild(btn);
  });

  /* ---------- 年号 ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
