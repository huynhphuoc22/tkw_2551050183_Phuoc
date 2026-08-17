
    export function initPricing() {
        const toggle = document.getElementById("pricing-toggle");
        const prices = document.querySelectorAll(".price-value");
      
        if (!toggle || prices.length === 0) return;
      
        toggle.addEventListener("change", () => {
          const isYearly = toggle.checked;
      
          prices.forEach((price) => {
            const monthlyPrice = price.getAttribute("data-monthly");
            const yearlyPrice = price.getAttribute("data-yearly");
      
            if (isYearly && yearlyPrice) {
              price.textContent = yearlyPrice;
            } else if (monthlyPrice) {
              price.textContent = monthlyPrice;
            }
          });
        });
      }
  