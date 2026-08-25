const STORAGE_KEY = "vithongminh_records";

export async function loadRecords() {
  const localData = localStorage.getItem(STORAGE_KEY);

  if (localData) {
    return JSON.parse(localData);
  }

  const response = await fetch("./data/records.json");

  if (!response.ok) {
    throw new Error(`Máy chủ phản hồi mã lỗi: ${response.status}`);
  }

  const records = await response.json();
  saveRecords(records);
  return records;
}

export function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function addRecord(records, record) {
  const nextRecords = [record, ...records];
  saveRecords(nextRecords);
  return nextRecords;
}

export function removeRecord(records, id) {
  const nextRecords = records.filter((record) => record.id !== id);
  saveRecords(nextRecords);
  return nextRecords;
}

export function clearStoredRecords() {
  localStorage.removeItem(STORAGE_KEY);
}
