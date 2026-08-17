export function initTheme() {
    // Kiểm tra nút bấm có tồn tại không để tránh lỗi "null" [1, 3]
    const themeBtn = document.getElementById("theme-toggle"); 
    if (!themeBtn) return;

    themeBtn.addEventListener("click", () => {
        // Toggle class "dark" trên thẻ html
        const isDark = document.documentElement.classList.toggle("dark");
        
        // Ghi nhớ lựa chọn vào localStorage [4, 5]
        localStorage.setItem("theme", isDark ? "dark" : "light");
        
        // Cập nhật ARIA label cho đúng chuẩn tiếp cận [5, 6]
        themeBtn.setAttribute("aria-label", isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối");
    });
}