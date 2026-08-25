const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("vi-VN");

export function formatMoney(value) {
  return currencyFormatter.format(value);
}

export function formatNumber(value) {
  return numberFormatter.format(value);
}

export function formatToday() {
  return new Date().toISOString().split("T")[0];
}

export function createRecordId() {
  return `GD-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 90 + 10)}`;
}
