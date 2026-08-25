# VíThôngMinh 
## Buổi 3
- Responsive mobile-first: 360px, 768px, 1024px, 1440px.
- Dark mode dùng token CSS và lưu lựa chọn bằng `localStorage`.
- Tái sử dụng component ở các trang `index.html`, `price.html`, `contact.html`.
- Form liên hệ có nhãn thật, validation HTML và hỗ trợ bàn phím.

## Buổi 4
- Menu mobile: `aria-expanded`, ESC và click ra ngoài.
- Navbar đổi trạng thái bằng `IntersectionObserver`.
- Accordion FAQ dùng event delegation, mỗi lần mở một mục.
- Dark mode ưu tiên lựa chọn người dùng, sau đó đến `prefers-color-scheme`.
- Công tắc giá tháng/năm dùng `data-*` và `Intl.NumberFormat("vi-VN")`.
- Slider cảm nhận tự viết, có dots bằng JS, autoplay và `inert` cho slide ẩn.
- Reveal khi cuộn bằng `IntersectionObserver`, tôn trọng `prefers-reduced-motion`.



## Deploy
Sau khi deploy, ghi URL công khai của dự án vào phần này.


## Buổi 5
## 1. Giới thiệu

VíThôngMinh là dự án website được thực hiện trong môn **Thực hành Thiết kế Web**.  
Dự án áp dụng HTML semantic, CSS external, JavaScript module, dữ liệu JSON, `fetch`, `localStorage`, Constraint Validation API và mô hình **state → render**.

## 2. Các trang

- `index.html` — Trang chủ.
- `record.html` — Trang quản lý dữ liệu động.
- `contact.html` — Trang liên hệ và kiểm tra dữ liệu form.
- `price.html` — Trang bảng giá.

## 3. Tính năng chính

### Trang dữ liệu

- Đọc dữ liệu từ `data/records.json` bằng `fetch`.
- Hiển thị trạng thái loading.
- Hiển thị trạng thái có dữ liệu.
- Hiển thị trạng thái rỗng.
- Hiển thị trạng thái lỗi.
- Tìm kiếm dữ liệu.
- Lọc theo danh mục.
- Lọc theo trạng thái.
- Sắp xếp dữ liệu.
- Debounce ô tìm kiếm.
- Thêm bản ghi.
- Xóa bản ghi.
- Lưu dữ liệu bằng `localStorage`.
- Khôi phục dữ liệu mẫu.

### Form

- Sử dụng Constraint Validation API.
- Hiển thị thông báo lỗi bằng tiếng Việt.
- Đánh dấu trường lỗi bằng `aria-invalid`.
- Đưa focus về trường lỗi đầu tiên.
- Có thông báo tổng hợp khi form chưa hợp lệ.

## 4. Cấu trúc JavaScript

```text
js/
├── main.js
├── app.js
├── store.js
├── format.js
├── debounce.js
├── validate.js
├── toast.js
├── theme.js
├── theme-init.js
├── nav.js
├── faq.js
├── pricing.js
├── slider.js
├── reveal.js
└── contact.js
```

Mỗi module phụ trách một nhóm chức năng riêng để code dễ đọc, dễ bảo trì và dễ kiểm tra.

## 5. Công nghệ sử dụng

- HTML5
- CSS / Tailwind CSS
- JavaScript ES Modules
- JSON
- Fetch API
- LocalStorage
- Constraint Validation API
- Git / GitHub
- Lighthouse

## 6. Cách chạy dự án

### Cài đặt

```bash
npm install
```

### Build production

```bash
npm run build
```

### Chạy thử

Có thể sử dụng Live Server trong VS Code hoặc chạy:

```bash
npx serve .
```


## 7. Kiểm tra chất lượng

Trước khi nộp cần kiểm tra:

- Lighthouse Accessibility đạt từ 95 trở lên.
- Performance đạt mục tiêu của Buổi 5.
- Console không có lỗi hoặc cảnh báo quan trọng.
- Không có request 404.
- Website hiển thị tốt trên màn hình desktop và mobile.
- Có thể thao tác bằng bàn phím.
- Ảnh có `alt` phù hợp.
- Form có `label` và thông báo lỗi rõ ràng.
- Không sử dụng CSS inline hoặc internal CSS.
- CSS được sử dụng từ file external.
- Mỗi trang có đúng một thẻ `<h1>`.

## 8. Demo

**Link demo:** Chưa cập nhật.




## 9. Git

Dự án được quản lý bằng Git và chia thành các tag theo từng buổi:

```text
buoi-1
buoi-2
buoi-3
buoi-4
buoi-5
```

## 10. 

Dự án áp dụng mô hình:

```text
state → render → DOM
       ↑       ↓
       └─ sự kiện người dùng
```

Các thao tác chính cập nhật `state`, sau đó render lại giao diện. Dữ liệu người dùng được đưa vào DOM bằng các phương thức an toàn thay vì nối trực tiếp vào `innerHTML`.

