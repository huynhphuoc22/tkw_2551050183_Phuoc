export function initSlider() {
  const root = document.querySelector("[data-slider]");
  if (!root) return; [5]

  const track = root.querySelector("[data-slider-track]");
  const slides = Array.from(root.querySelectorAll("[data-slide]"));
  const nextBtn = root.querySelector("[data-slider-next]");
  const prevBtn = root.querySelector("[data-slider-prev]");

  if (!track || slides.length === 0) return;

  let index = 0;

  function go(next) {
    // Logic dịch chuyển vòng tròn cả 2 chiều [14, 15]
    index = (next + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;

    // QUAN TRỌNG: Thêm inert cho các slide ẩn để bảo vệ tiêu điểm bàn phím [14]
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.removeAttribute("inert"); [14]
      } else {
        slide.setAttribute("inert", ""); [14]
      }
    });
  }

  if (nextBtn) nextBtn.addEventListener("click", () => go(index + 1));
  if (prevBtn) prevBtn.addEventListener("click", () => go(index - 1));

  // Tự động chạy nhưng tạm dừng khi người dùng tương tác [16]
  let timer = setInterval(() => go(index + 1), 6000);

  const stop = () => clearInterval(timer);
  const start = () => {
    stop();
    timer = setInterval(() => go(index + 1), 6000); [16]
  };

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop); [16]
  root.addEventListener("focusout", start); [16]
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start(); [16]
  });

  // Khởi tạo trạng thái ban đầu cho các slide ẩn
  go(0);
}