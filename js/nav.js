export function initNav() {
  const toggle = document.querySelector('[aria-controls="nav-mobile"]');
  const menu = document.getElementById("nav-mobile");
  
  if (!toggle || !menu) return; [5]

  function setOpen(open) {
    menu.classList.toggle("hidden", !open);
    toggle.setAttribute("aria-expanded", String(open)); [6]
    toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu"); [6]
    document.body.classList.toggle("overflow-hidden", open); [7]
  }

  toggle.addEventListener("click", () => {
    const isOpen = !menu.classList.contains("hidden");
    setOpen(!isOpen);
  });

  // Đóng menu bằng phím ESC và trả tiêu điểm về nút toggle [7]
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.classList.contains("hidden")) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Tự động đóng menu khi kéo rộng màn hình lên Desktop [7, 8]
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024 && !menu.classList.contains("hidden")) {
      setOpen(false);
    }
  });
}

// 2. Navbar đổi trạng thái khi cuộn (Thêm bóng đổ)
export function initHeaderOnScroll() {
  const header = document.querySelector("header");
  const sentinel = document.getElementById("nav-sentinel"); 
  // Bạn cần thêm một <div id="nav-sentinel" class="absolute top-0 h-1 w-1"></div> ngay đầu thẻ <body>
  
  if (!header || !sentinel) return; [5]

  const observer = new IntersectionObserver(([entry]) => {
    const scrolled = !entry.isIntersecting;
    header.classList.toggle("shadow-sm", scrolled); [8]
  });

  observer.observe(sentinel); [8]
}

// 2b. Nút Lên đầu trang (Hiện khi cuộn > 400px) [6]
export function initToTop() {
  const btn = document.getElementById("to-top");
  if (!btn) return; [5]

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.remove("hidden");
      btn.classList.add("grid"); // Hiện nút (sử dụng grid để căn giữa icon SVG)
    } else {
      btn.classList.add("hidden");
      btn.classList.remove("grid");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}