const state = {
  records: [],       // Toàn bộ các khoản ghi chép
  query: "",         // Tìm kiếm từ khóa
  category: "all",   // Bộ lọc phân loại chi
  status: "all",     // Bộ lọc trạng thái thanh toán
  sort: "date-desc", // Kiểu sắp xếp thời gian/giá tiền
  loading: true,     // Loading skeleton
  error: null,       // Lỗi nạp mạng
};

// Hàm hiển thị tiền tệ VND theo chuẩn Việt Nam [9, 10]
const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const sorters = {
  "date-desc": (a, b) => b.date.localeCompare(a.date),
  "date-asc":  (a, b) => a.date.localeCompare(b.date),
  "amount-desc": (a, b) => b.amount - a.amount,
  "amount-asc":  (a, b) => a.amount - b.amount,
};

// 1. Tải và đồng bộ hóa LocalStorage [2, 11]
async function loadRecords() {
  const localData = localStorage.getItem("vithongminh_records");
  if (localData) {
    return JSON.parse(localData);
  }
  
  const res = await fetch("./data/records.json");
  if (!res.ok) throw new Error(`Mã lỗi máy chủ: ${res.status}`); // Bắt lỗi 404 [11]
  const data = await res.json();
  localStorage.setItem("vithongminh_records", JSON.stringify(data));
  return data;
}

// 2. Lọc thông minh kết hợp đa điều kiện [12]
function getVisibleRecords() {
  const q = state.query.trim().toLowerCase();
  return state.records
    .filter((r) => state.category === "all" || r.category === state.category)
    .filter((r) => state.status === "all" || r.status === state.status)
    .filter((r) => !q || r.description.toLowerCase().includes(q)) // Tìm theo tên khoản chi
    .sort(sorters[state.sort] || sorters["date-desc"]);
}

// 3. Hàm vẽ giao diện (Render) [8]
export function renderRecords() {
  const loadingEl = document.getElementById("state-loading");
  const errorEl = document.getElementById("state-error");
  const errorMsg = document.getElementById("error-message");
  const emptyEl = document.getElementById("state-empty");
  const tableEl = document.getElementById("state-data");
  const tbody = document.getElementById("records-tbody");

  if (!tbody) return;

  // Xử lý các trạng thái tĩnh
  loadingEl.classList.toggle("hidden", !state.loading);
  
  if (state.error) {
    errorEl.classList.remove("hidden");
    errorMsg.textContent = state.error;
    tableEl.classList.add("hidden");
    emptyEl.classList.add("hidden");
    return;
  } else {
    errorEl.classList.add("hidden");
  }

  const list = getVisibleRecords();

  if (!state.loading && list.length === 0) {
    emptyEl.classList.remove("hidden");
    tableEl.classList.add("hidden");
  } else {
    emptyEl.classList.add("hidden");
    tableEl.classList.remove("hidden");
  }

  // Tạo DOM an toàn phòng chống mã độc XSS [13, 14]
  const template = document.getElementById("row-template");
  const rows = list.map((item) => {
    const row = template.content.firstElementChild.cloneNode(true);
    
    row.querySelector("[data-cell='id']").textContent = item.id;
    row.querySelector("[data-cell='trader']").textContent = item.description; // Tên khoản chi
    row.querySelector("[data-cell='category']").textContent = item.category;
    row.querySelector("[data-cell='account']").textContent = item.account; // Ví/Thẻ sử dụng

    // Định dạng số tiền có dấu cộng/trừ để trực quan hóa [4]
    const amountCell = row.querySelector("[data-cell='amount']");
    if (item.category === "Thu nhập") {
      amountCell.textContent = `+${formatter.format(item.amount)}`;
      amountCell.className = "px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400";
    } else {
      amountCell.textContent = `-${formatter.format(item.amount)}`;
      amountCell.className = "px-6 py-4 font-semibold text-rose-600 dark:text-rose-400";
    }

    row.querySelector("[data-cell='date']").textContent = item.date;

    // Gắn tag trạng thái thanh toán
    const statusCell = row.querySelector("[data-cell='status']");
    if (item.status === "da-chi") {
      statusCell.innerHTML = `<span class="inline-block bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-semibold dark:bg-emerald-950/40 dark:text-emerald-400">✓ Đã thanh toán</span>`;
    } else {
      statusCell.innerHTML = `<span class="inline-block bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-semibold dark:bg-amber-950/40 dark:text-amber-400">⏳ Chờ duyệt</span>`;
    }

    row.querySelector("[data-action='delete']").addEventListener("click", () => deleteRecord(item.id));
    return row;
  });

  // Tối ưu hiệu năng nạp một lần duy nhất [14]
  tbody.replaceChildren(...rows);
}

// 4. Xóa bản ghi
function deleteRecord(id) {
  if (confirm(`Xóa dòng ghi chép ${id} khỏi lịch sử?`)) {
    state.records = state.records.filter((r) => r.id !== id);
    localStorage.setItem("vithongminh_records", JSON.stringify(state.records));
    renderRecords();
  }
}

// Hàm Debounce giới hạn tần suất xử lý khi gõ tìm kiếm [14]
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// 5. Khởi động module
export async function initRecords() {
  const tbody = document.getElementById("records-tbody");
  if (!tbody) return;

  // Lọc tìm kiếm gõ phím
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", debounce((e) => {
      state.query = e.target.value;
      renderRecords();
    }, 300));
  }

  // Lọc phân loại
  const filterCat = document.getElementById("filter-category");
  if (filterCat) {
    filterCat.addEventListener("change", (e) => {
      state.category = e.target.value;
      renderRecords();
    });
  }

  // Lọc trạng thái
  const filterStatus = document.getElementById("filter-status");
  if (filterStatus) {
    filterStatus.addEventListener("change", (e) => {
      state.status = e.target.value;
      renderRecords();
    });
  }

  // Lọc sắp xếp
  const sortSelect = document.getElementById("sort");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sort = e.target.value;
      renderRecords();
    });
  }

  // Thêm khoản thu chi thủ công
  const addForm = document.getElementById("add-record-form");
  if (addForm) {
    addForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const descInp = document.getElementById("new-trader");
      const catInp = document.getElementById("new-category");
      const accInp = document.getElementById("new-account");
      const amountInp = document.getElementById("new-amount");

      const newRecord = {
        id: `GD-${new Date().toISOString().slice(2,7).replace("-","")}-${Math.floor(Math.random() * 90 + 10)}`,
        description: descInp.value,
        category: catInp.value,
        account: accInp.value,
        amount: Number(amountInp.value),
        status: catInp.value === "Thu nhập" ? "da-chi" : "da-chi",
        date: new Date().toISOString().split("T"),
      };

      state.records.unshift(newRecord);
      localStorage.setItem("vithongminh_records", JSON.stringify(state.records));
      addForm.reset();
      renderRecords();
    });
  }

  // Khôi phục dữ liệu ban đầu
  const btnRestore = document.getElementById("btn-restore");
  if (btnRestore) {
    btnRestore.addEventListener("click", async () => {
      localStorage.removeItem("vithongminh_records");
      state.loading = true;
      renderRecords();
      try {
        state.records = await loadRecords();
        state.error = null;
      } catch (err) {
        state.error = `Khôi phục thất bại: ${err.message}`;
      } finally {
        state.loading = false;
        renderRecords();
      }
    });
  }

  // Nạp dữ liệu lần đầu
  try {
    state.records = await loadRecords();
    state.error = null;
  } catch (err) {
    state.error = `Lỗi tải sổ thu chi: ${err.message}`;
  } finally {
    state.loading = false;
    renderRecords();
  }
}