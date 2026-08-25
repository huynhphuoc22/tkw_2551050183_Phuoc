export function initTheme() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return; [5]

  btn.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light"); [9]
    btn.setAttribute("aria-label", isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối");
  });
}