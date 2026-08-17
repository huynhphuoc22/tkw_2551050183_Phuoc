export function initSlider() {
    // Kiểm tra sự tồn tại của slider trên trang
    const root = document.querySelector('[data-slider]'); 
    if (!root) return; // Thoát nếu trang hiện tại không có slider [1]

    const track = root.querySelector('[data-slider-track]');
    const slides = Array.from(root.querySelectorAll('[data-slide]'));
    const nextBtn = root.querySelector('[data-slider-next]');
    const prevBtn = root.querySelector('[data-slider-prev]');
    
    if (!track || slides.length === 0) return;

    let index = 0;

    function go(next) {
        // Logic vòng tròn: (next + length) % length [3], [4]
        index = (next + slides.length) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        
        // QUAN TRỌNG: Thêm inert cho các slide ẩn để đảm bảo tiếp cận (Accessibility) [4], [5]
        slides.forEach((s, i) => {
            if (i === index) {
                s.removeAttribute("inert");
            } else {
                s.setAttribute("inert", "");
            }
        });
    }

    // Gán sự kiện cho các nút bấm
    if (nextBtn) nextBtn.addEventListener("click", () => go(index + 1));
    if (prevBtn) prevBtn.addEventListener("click", () => go(index - 1));

    // Slider tự chạy nhưng dừng khi di chuột vào hoặc focus bàn phím [6]
    let timer = setInterval(() => go(index + 1), 5000);
    const stop = () => clearInterval(timer);
    const start = () => {
        stop();
        timer = setInterval(() => go(index + 1), 5000);
    };

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);
}