export function initNav() {
  const toggle = document.querySelector('[aria-controls="nav-mobile"]');
  const menu = document.getElementById("nav-mobile");
  
  // Kiểm tra sự tồn tại để tránh lỗi null [2, 5]
  if (!toggle || !menu) return;

  function setOpen(open) {
    // Hiển thị/ẩn menu
    menu.classList.toggle("hidden", !open);
    // Cập nhật trạng thái ARIA cho trình đọc màn hình [4, 5]
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
    // Chặn cuộn nền trên điện thoại [4]
    document.body.classList.toggle("overflow-hidden", open);
  }

  // Lắng nghe sự kiện click (thay thế hoàn toàn onclick trong HTML) [6]
  toggle.addEventListener("click", () => {
    const isOpen = !menu.classList.contains("hidden");
    setOpen(!isOpen);
  });

  // Đóng menu khi bấm phím ESC và trả tiêu điểm về nút bấm [4]
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.classList.contains("hidden")) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Tự động đóng menu khi phóng to màn hình lên Desktop [7]
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024 && !menu.classList.contains("hidden")) {
      setOpen(false);
    }
  });
}

// 2. Navbar phản ứng khi cuộn (Thêm bóng đổ) [7]
export function initHeaderOnScroll() {
  const header = document.querySelector("header");
  const sentinel = document.getElementById("nav-sentinel");
  
  if (!header || !sentinel) return;

  // Sử dụng IntersectionObserver để tối ưu hiệu năng thay vì sự kiện scroll [7, 8]
  const observer = new IntersectionObserver(([entry]) => {
    const scrolled = !entry.isIntersecting;
    header.classList.toggle("shadow-sm", scrolled);
  });

  observer.observe(sentinel);
}

// 3. Nhiệm vụ khởi động: Nút Lên đầu trang [2, 3]
export function initToTop() {
  const btn = document.getElementById("to-top");
  if (!btn) return;

  // Hiện nút khi cuộn quá 400px [2]
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.remove("hidden");
      btn.classList.add("grid"); // Dùng grid để căn giữa icon
    } else {
      btn.classList.add("hidden");
      btn.classList.remove("grid");
    }
  });

  // Cuộn mượt lên đầu trang khi click
  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}