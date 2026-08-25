export function initPricing() {
    const toggle = document.getElementById("price-switch");
    const prices = document.querySelectorAll("[data-price]");
    const periods = document.querySelectorAll("[data-billing-period]");

    // Chỉ chạy khi trang hiện tại có công tắc và bảng giá.
    if (!toggle || prices.length === 0) return;

    const formatPrice = (value) =>
        `${Number(value).toLocaleString("vi-VN")} ₫`;

    const renderPricing = (isYearly) => {
        // 1. Cập nhật giá theo chu kỳ đã chọn.
        prices.forEach((price) => {
            const value = isYearly
                ? price.dataset.yearly
                : price.dataset.monthly;

            if (value) {
                price.textContent = formatPrice(value);
            }
        });

        // 2. Cập nhật đơn vị /tháng hoặc /năm.
        periods.forEach((period) => {
            period.textContent = isYearly ? "/năm" : "/tháng";
        });

        // 3. Cập nhật trạng thái công tắc để người dùng dễ nhận biết.
        toggle.setAttribute("aria-checked", String(isYearly));
        toggle.classList.toggle("bg-slate-200", !isYearly);
        toggle.classList.toggle("bg-brand-600", isYearly);

        const thumb = toggle.querySelector("span");
        if (thumb) {
            thumb.classList.toggle("translate-x-0", !isYearly);
            thumb.classList.toggle("translate-x-5", isYearly);
        }
    };

    toggle.addEventListener("click", () => {
        const isYearly = toggle.getAttribute("aria-checked") === "true";
        renderPricing(!isYearly);
    });

    // Khởi tạo ở chế độ thanh toán hàng tháng.
    renderPricing(false);
}
