export function initReveal() {
  // Thoát ngay lập tức nếu người dùng bật chế độ giảm chuyển động trong hệ thống [13]
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".card, section > div").forEach((el) => {
      el.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); [15]
      }
    });
  }, { threshold: 0.1 });

  // Theo dõi các khối phần tử cần hiển thị mượt mà
  document.querySelectorAll(".card, section > div").forEach((el) => {
    observer.observe(el);
  });
}