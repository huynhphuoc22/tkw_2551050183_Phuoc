export function initFaq() {
  const root = document.getElementById("cau-hoi"); // Đảm bảo thẻ bọc danh sách FAQ có id="cau-hoi"
  if (!root) return; [5]

  root.addEventListener("click", (e) => {
    // Tìm phần tử trigger gần nhất phòng trường hợp click trúng SVG bên trong [11]
    const trigger = e.target.closest("[data-faq-trigger]");
    if (!trigger) return;

    const contentId = trigger.getAttribute("aria-controls");
    const content = document.getElementById(contentId);
    if (!content) return;

    const isOpening = trigger.getAttribute("aria-expanded") !== "true";
    
    // Đóng toàn bộ các mục khác để đảm bảo mỗi lúc chỉ mở một mục [3, 11]
    const allTriggers = root.querySelectorAll("[data-faq-trigger]");
    allTriggers.forEach((t) => {
      t.setAttribute("aria-expanded", "false");
      const c = document.getElementById(t.getAttribute("aria-controls"));
      if (c) c.classList.add("hidden");
    });

    // Mở hoặc đóng mục hiện tại
    if (isOpening) {
      trigger.setAttribute("aria-expanded", "true");
      content.classList.remove("hidden");
    }
  });
}
