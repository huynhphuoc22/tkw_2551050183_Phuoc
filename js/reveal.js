export function initReveal() {
  // Kiểm tra nếu người dùng cài đặt giảm chuyển động thì không chạy hiệu ứng [2]
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Sử dụng IntersectionObserver để tối ưu hiệu năng thay vì sự kiện scroll [3, 4]
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Thêm class để kích hoạt hiệu ứng CSS
        entry.target.classList.add("is-visible");
        // Sau khi hiện thì ngừng theo dõi để tiết kiệm tài nguyên [5]
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Tìm các phần tử cần hiệu ứng (ví dụ: các thẻ card hoặc section)
  const items = document.querySelectorAll(".card, .section > div");
  items.forEach((el) => observer.observe(el));
}