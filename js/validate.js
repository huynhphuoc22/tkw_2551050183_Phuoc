export function getValidationMessage(field) {
  const validity = field.validity;

  if (validity.valueMissing) {
    return "Trường này không được để trống. Vui lòng điền đầy đủ thông tin.";
  }

  if (validity.typeMismatch && field.type === "email") {
    return "Email chưa đúng định dạng. Ví dụ: hotro@vithongminh.vn";
  }

  if (validity.patternMismatch && field.id === "dien-thoai") {
    return "Vui lòng nhập đúng 10 chữ số, bắt đầu bằng số 0. Ví dụ: 0912345678";
  }

  if (validity.rangeUnderflow) {
    if (field.id === "new-weight") {
      return "Số lượng phải lớn hơn hoặc bằng 1.";
    }

    if (field.id === "new-amount") {
      return "Số tiền phải từ 1.000 VND.";
    }
  }

  if (validity.stepMismatch) {
    return "Giá trị chưa đúng bước nhập cho phép.";
  }

  return "Dữ liệu chưa hợp lệ. Vui lòng kiểm tra lại.";
}

export function validateField(field, errorBoxId = `${field.id}-error`) {
  const errorBox = document.getElementById(errorBoxId);
  const isValid = field.validity.valid;

  field.setAttribute("aria-invalid", String(!isValid));

  if (errorBox) {
    errorBox.textContent = isValid ? "" : getValidationMessage(field);
  }

  return isValid;
}

export function validateFields(fields) {
  let firstInvalid = null;
  const errors = [];

  fields.forEach((field) => {
    const valid = validateField(field);

    if (!valid) {
      if (!firstInvalid) firstInvalid = field;
      const label = field.previousElementSibling?.textContent?.replace(" *", "") || "Trường dữ liệu";
      errors.push(`${label}: ${getValidationMessage(field)}`);
    }
  });

  return { valid: errors.length === 0, firstInvalid, errors };
}
