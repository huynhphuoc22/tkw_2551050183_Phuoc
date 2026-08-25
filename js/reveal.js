export function initReveal() {
  // Đánh dấu JS đã sẵn sàng để hiệu ứng reveal được kích hoạt.
  document.documentElement.classList.add("js-ready");

  const targets = document.querySelectorAll(".reveal");

  if (targets.length === 0) return;

  // Nếu người dùng tắt animation, hiển thị nội dung ngay lập tức.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  targets.forEach((el) => observer.observe(el));
}
