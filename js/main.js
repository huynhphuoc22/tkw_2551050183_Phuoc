import { initNav, initHeaderOnScroll, initToTop } from "./nav.js";
import { initTheme } from "./theme.js";
import { initFaq } from "./faq.js";
import { initPricing } from "./pricing.js";
import { initSlider } from "./slider.js";
import { initReveal } from "./reveal.js";
import { initApp } from "./app.js";
import { initContactForm } from "./contact.js";


initNav();           // 1. Menu Mobile
initHeaderOnScroll(); // 2. Đổi trạng thái Navbar khi cuộn
initToTop();         // 2b. Nhiệm vụ khởi động: Nút lên đầu trang
initTheme();         // 4. Công tắc Dark Mode
initFaq();           // 3. Accordion FAQ
initPricing();       // 5. Công tắc giá Tháng/Năm
initSlider();        // 6. Slider cảm nhận khách hàng
initReveal();        // 7. Hiệu ứng lộ dần khi cuộn

// 8. Chỉ khởi tạo module khi trang có đúng thành phần tương ứng.
initApp();
initContactForm();
