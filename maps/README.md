# Thư mục ảnh bản đồ

Đặt ảnh bản đồ vào đây. Mặc định ứng dụng tìm file:

```
maps/world.png
```

Dùng đuôi khác (`.jpg`, `.webp`) thì sửa `CONFIG.maps[].src` trong `index.html`.

## Vì sao thư mục này trống trên repo

Ảnh bản đồ Final Fantasy IX là tác phẩm của Square Enix. Repo này chỉ
chứa **engine** — phần mã nguồn tự viết — nên ảnh được để ngoài qua
`.gitignore`.

Tự chuẩn bị ảnh của mình: ảnh chụp trong game, bản đồ bạn tự vẽ, hoặc
bất kỳ ảnh nào bạn có quyền sử dụng.

## Yêu cầu kỹ thuật

Không có. Engine đọc kích thước thật từ ảnh lúc tải, và toạ độ marker
lưu theo tỉ lệ `0–1` chứ không theo pixel — nên **đổi ảnh sang độ phân
giải khác, marker vẫn nằm đúng chỗ**, miễn giữ nguyên tỉ lệ khung hình.

Ảnh vuông hoặc gần vuông sẽ vừa màn hình đẹp nhất.
