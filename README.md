# Hướng dẫn cài đặt Confession Ẩn Danh

Bộ này gồm 2 file:
- `index.html` — trang web cho người dùng gửi confession
- `Code.gs` — script backend chạy trên Google Apps Script, ghi dữ liệu vào Google Sheet

Dữ liệu lưu lại: **Thời Gian / Nội Dung / Hình Ảnh (nếu có)**. Không lưu IP hay mã thiết bị của người gửi.

---

## Bước 1: Tạo Google Sheet

1. Vào [sheets.google.com](https://sheets.google.com) → tạo một Sheet mới, đặt tên tuỳ ý (vd: "Confession Data").

## Bước 2: Gắn Apps Script vào Sheet

1. Trong Sheet vừa tạo, vào menu **Tiện ích mở rộng (Extensions) → Apps Script**.
2. Xoá code mặc định trong `Code.gs`, dán toàn bộ nội dung file `Code.gs` mình gửi vào.
3. Nhấn biểu tượng 💾 Lưu.

## Bước 3: Deploy thành Web App

1. Trong Apps Script, bấm **Triển khai (Deploy) → Triển khai mới (New deployment)**.
2. Chọn loại: **Ứng dụng web (Web app)**.
3. Cấu hình:
   - **Execute as:** Me (tài khoản của bạn)
   - **Who has access:** Anyone (bắt buộc, để ai cũng gửi được mà không cần đăng nhập Google)
4. Bấm **Deploy**. Lần đầu Google sẽ yêu cầu bạn **cấp quyền (Authorize access)** — chọn tài khoản của bạn → "Advanced" → "Go to (tên project) (unsafe)" → Allow. (Cảnh báo "unsafe" là bình thường vì đây là script tự viết, không phải app của bên thứ 3 độc hại.)
5. Sau khi deploy xong, copy **Web app URL** (dạng `https://script.google.com/macros/s/xxxxx/exec`).

## Bước 4: Gắn URL vào trang web

1. Mở file `index.html`, tìm dòng:
   ```js
   const SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
2. Thay bằng URL bạn vừa copy ở Bước 3.
3. Lưu file.

## Bước 5: Đưa trang web lên mạng

Có vài cách đơn giản, miễn phí:
- **GitHub Pages**: đẩy `index.html` lên 1 repo GitHub, bật GitHub Pages.
- **Netlify / Vercel**: kéo thả file `index.html` vào để deploy tức thì.
- Hoặc chạy thử tại chỗ: mở trực tiếp file `index.html` bằng trình duyệt (chỉ để test, người khác sẽ không truy cập được).

---

## Ghi chú quan trọng

- Ảnh được lưu vào một thư mục Google Drive tên **"Confession Images"** (tự tạo trong Drive của bạn), link ảnh được lưu vào cột "Hình Ảnh" trong Sheet.
- Nếu bạn muốn giới hạn kích thước ảnh, sửa dòng `5 * 1024 * 1024` trong `index.html` (đơn vị byte, hiện đang là 5MB).
- Nếu sau này bạn sửa lại `Code.gs`, phải **Deploy lại phiên bản mới** (Deploy → Manage deployments → Edit → New version) thì thay đổi mới có hiệu lực.
- Vì "Who has access" đặt là "Anyone", ai cũng có thể gửi request đến script này — nếu lo bị spam, có thể cân nhắc thêm giới hạn số lượng gửi/phút ở tầng frontend, hoặc thêm reCAPTCHA sau này.
