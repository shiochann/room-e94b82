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

  /* ---------- 年号 ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
