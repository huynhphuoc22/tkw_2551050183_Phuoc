import { addRecord, clearStoredRecords, loadRecords, removeRecord, saveRecords } from "./store.js";
import { createRecordId, formatMoney, formatNumber, formatToday } from "./format.js";
import { debounce } from "./debounce.js";
import { validateField, validateFields } from "./validate.js";
import { showToast } from "./toast.js";

const state = {
  records: [],
  query: "",
  category: "all",
  status: "all",
  sort: "date-desc",
  loading: true,
  error: null,
};

const sorters = {
  "date-desc": (a, b) => b.date.localeCompare(a.date),
  "date-asc": (a, b) => a.date.localeCompare(b.date),
  "amount-desc": (a, b) => b.amount - a.amount,
  "amount-asc": (a, b) => a.amount - b.amount,
  "weight-desc": (a, b) => b.weight - a.weight,
};

function getVisibleRecords() {
  const query = state.query.trim().toLowerCase();

  return [...state.records]
    .filter((record) => state.category === "all" || record.category === state.category)
    .filter((record) => state.status === "all" || record.status === state.status)
    .filter((record) => {
      if (!query) return true;
      return record.trader.toLowerCase().includes(query)
        || record.category.toLowerCase().includes(query);
    })
    .sort(sorters[state.sort] || sorters["date-desc"]);
}

function buildRow(record) {
  const template = document.getElementById("row-template");
  const row = template.content.firstElementChild.cloneNode(true);

  row.querySelector("[data-cell='id']").textContent = record.id;
  row.querySelector("[data-cell='trader']").textContent = record.trader;
  row.querySelector("[data-cell='category']").textContent = record.category;
  row.querySelector("[data-cell='weight']").textContent = formatNumber(record.weight);
  row.querySelector("[data-cell='date']").textContent = record.date;

  const amountCell = row.querySelector("[data-cell='amount']");
  const isIncome = record.category === "Thu nhập";
  amountCell.textContent = `${isIncome ? "+" : "-"}${formatMoney(record.amount)}`;
  amountCell.className = isIncome
    ? "px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400"
    : "px-6 py-4 font-semibold text-rose-600 dark:text-rose-400";

  const statusMap = {
    "da-chot": ["✓ Đã thanh toán", "inline-block bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-semibold dark:bg-emerald-950/50 dark:text-emerald-400"],
    "cho-duyet": ["⏳ Dự chi", "inline-block bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-semibold dark:bg-amber-950/50 dark:text-amber-400"],
    huy: ["✕ Hủy", "inline-block bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-xs font-semibold dark:bg-red-950/50 dark:text-red-400"],
  };

  const [statusText, statusClasses] = statusMap[record.status] || statusMap.huy;
  const statusCell = row.querySelector("[data-cell='status']");
  const badge = document.createElement("span");
  badge.className = statusClasses;
  badge.textContent = statusText;
  statusCell.replaceChildren(badge);

  row.querySelector("[data-action='delete']").addEventListener("click", () => deleteRecord(record.id));
  return row;
}

export function renderRecords() {
  const loadingEl = document.getElementById("state-loading");
  const errorEl = document.getElementById("state-error");
  const errorMsg = document.getElementById("error-message");
  const emptyEl = document.getElementById("state-empty");
  const tableEl = document.getElementById("state-data");
  const tbody = document.getElementById("records-tbody");

  if (!tbody) return;

  loadingEl?.classList.toggle("hidden", !state.loading);

  if (state.error) {
    errorEl?.classList.remove("hidden");
    if (errorMsg) errorMsg.textContent = state.error;
    tableEl?.classList.add("hidden");
    emptyEl?.classList.add("hidden");
    return;
  }

  errorEl?.classList.add("hidden");

  const visibleRecords = getVisibleRecords();
  const isEmpty = !state.loading && visibleRecords.length === 0;

  emptyEl?.classList.toggle("hidden", !isEmpty);
  tableEl?.classList.toggle("hidden", isEmpty);

  tbody.replaceChildren(...visibleRecords.map(buildRow));

  const count = document.getElementById("state-count");
  const amount = document.getElementById("state-amount");
  if (count) count.textContent = String(visibleRecords.length);
  if (amount) amount.textContent = formatMoney(visibleRecords.reduce((sum, record) => sum + record.amount, 0));
}

function deleteRecord(id) {
  if (!confirm(`Bạn chắc chắn muốn xóa dòng ghi chép ${id}?`)) return;

  state.records = removeRecord(state.records, id);
  renderRecords();
  showToast("Đã xóa bản ghi thành công.");
}

function initFilters() {
  const searchInput = document.getElementById("search");

  searchInput?.addEventListener("input", debounce((event) => {
    state.query = event.target.value;
    renderRecords();
  }));

  document.getElementById("filter-category")?.addEventListener("change", (event) => {
    state.category = event.target.value;
    renderRecords();
  });

  document.getElementById("filter-status")?.addEventListener("change", (event) => {
    state.status = event.target.value;
    renderRecords();
  });

  document.getElementById("sort")?.addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderRecords();
  });
}

function initAddForm() {
  const form = document.getElementById("add-record-form");
  if (!form) return;

  form.setAttribute("novalidate", "");

  const fields = [
    document.getElementById("new-trader"),
    document.getElementById("new-weight"),
    document.getElementById("new-amount"),
  ].filter(Boolean);
  const summary = document.getElementById("record-form-summary");

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
      summary?.classList.remove("hidden");
      if (summary) {
        summary.textContent = `Vui lòng sửa ${result.errors.length} mục trước khi ghi khoản mới: ${result.errors.join(" ")}`;
      }
      result.firstInvalid?.focus();
      return;
    }

    summary?.classList.add("hidden");

    const record = {
      id: createRecordId(),
      trader: document.getElementById("new-trader").value.trim(),
      category: document.getElementById("new-category").value,
      weight: Number(document.getElementById("new-weight").value),
      amount: Number(document.getElementById("new-amount").value),
      status: "da-chot",
      date: formatToday(),
    };

    state.records = addRecord(state.records, record);
    form.reset();
    fields.forEach((field) => field.setAttribute("aria-invalid", "false"));
    renderRecords();
    showToast("Đã thêm bản ghi thành công.");
  });
}

function initRestore() {
  document.getElementById("btn-restore")?.addEventListener("click", async () => {
    clearStoredRecords();
    state.loading = true;
    state.error = null;
    renderRecords();

    try {
      state.records = await loadRecords();
    } catch (error) {
      state.error = `Khôi phục thất bại: ${error.message}`;
    } finally {
      state.loading = false;
      renderRecords();
    }
  });
}

async function initData() {
  state.loading = true;
  state.error = null;
  renderRecords();

  try {
    state.records = await loadRecords();
  } catch (error) {
    state.error = `Lỗi tải dữ liệu: ${error.message}`;
  } finally {
    state.loading = false;
    renderRecords();
  }
}

export async function initApp() {
  if (!document.getElementById("records-tbody")) return;

  initFilters();
  initAddForm();
  initRestore();
  await initData();
}
