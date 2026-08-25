export function showToast(message, type = "success") {
  let toast = document.getElementById("form-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "form-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  const baseClass = "fixed bottom-6 left-6 z-50 rounded-xl px-5 py-3.5 text-sm font-semibold shadow-xl transition-all duration-300 transform translate-y-0 opacity-100";
  const typeClass = type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white";

  toast.className = `${baseClass} ${typeClass}`;
  toast.textContent = message;

  window.setTimeout(() => {
    toast.className = `${baseClass} translate-y-10 opacity-0 pointer-events-none`;
  }, 4000);
}
