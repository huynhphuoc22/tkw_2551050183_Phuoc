
export function initFaq() {
    const root = document.getElementById("cau-hoi");
    if (!root) return;
  
    const triggers = [...root.querySelectorAll("[data-faq-trigger]")];
    if (triggers.length === 0) return;
}