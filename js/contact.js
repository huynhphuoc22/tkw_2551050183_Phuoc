import { validateField, validateFields } from "./validate.js";
import { showToast } from "./toast.js";

export function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  form.setAttribute("novalidate", "");

  const fields = [...form.querySelectorAll("input, select, textarea")];

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.validity.valid) validateField(field);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const result = validateFields(fields);

    if (!result.valid) {
      result.firstInvalid?.focus();
      showToast("Gửi liên hệ thất bại. Vui lòng kiểm tra lại các vùng bị báo đỏ.", "error");
      return;
    }

    showToast("Gửi yêu cầu hỗ trợ thành công! Chúng tôi sẽ phản hồi trong 24 giờ.", "success");
    form.reset();
    fields.forEach((field) => field.setAttribute("aria-invalid", "false"));
  });
}
