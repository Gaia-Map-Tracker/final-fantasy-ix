# Bản đồ tương tác — Final Fantasy IX

Một file HTML tự chứa. Không thư viện ngoài, không cần build, không cần server —
mở bằng `file://` là chạy.

## Cài

```
ff9-map/
├── index.html         ← engine: pan/zoom, marker, tìm đường… không chứa dữ liệu game
├── data/
│   └── ffix.js        ← dữ liệu Final Fantasy IX: nhóm, phương tiện, 44 điểm
├── tools/
│   └── check.mjs      ← nghiệm thu bằng trình duyệt thật (tuỳ chọn, cần playwright)
└── maps/
    └── world.png      ← đặt ảnh bản đồ của anh vào đây
```

Engine và dữ liệu game tách rời: `index.html` không biết gì về Final Fantasy IX.
File trong `data/` tự đăng ký vào `window.MAPGAMES`, nạp bằng thẻ `<script>` chèn
động — không `fetch()`, không `import`, vì cả hai đều bị chặn khi mở bằng `file://`.

Mở `index.html` bằng trình duyệt. Chưa có ảnh vẫn chạy được — nó hiện nền tạm
và anh vẫn đặt / sửa marker bình thường.

## Dùng

| Thao tác | |
|---|---|
| Kéo chuột | Di chuyển bản đồ |
| Lăn chuột / chụm hai ngón | Phóng to thu nhỏ |
| Bấm vào điểm | Xem chi tiết, tick "đã hoàn thành" |
| `/` | Nhảy vào ô tìm kiếm |
| `+` `−` | Phóng / thu |
| `0` | Vừa màn hình |
| `Esc` | Đóng bảng chi tiết |

Bấm tên nhóm ở cột trái để ẩn/hiện nhóm đó. Con số bên phải là
**đã hoàn thành / tổng số**.

## Chế độ biên tập

Bấm **✎ Biên tập**:

- Bấm lên bản đồ → thêm điểm mới
- Kéo điểm → đổi vị trí
- Bấm điểm → sửa tên, nhóm, ghi chú, hoặc xoá

Xong thì **Xuất JSON** để sao lưu. **Nhập JSON** để nạp lại hoặc chia cho người khác.

## Toạ độ lưu theo tỉ lệ 0–1

Không lưu theo pixel. Nghĩa là **đổi ảnh bản đồ sang độ phân giải khác,
marker vẫn nằm đúng chỗ** — miễn là khung hình giữ nguyên tỉ lệ.

## Thêm bản đồ

Sửa `maps` trong `data/ffix.js`:

```js
maps: [
  { id:'world',      name:'Bản đồ thế giới', src:'maps/world.png',      aspect:1.0 },
  { id:'alexandria', name:'Alexandria',      src:'maps/alexandria.png', aspect:1.0 },
],
```

`aspect` là tỉ lệ khung hình (rộng / cao) của ảnh mà toạ độ được đặt theo.

Bộ chọn bản đồ ở cột trái tự cập nhật. Mỗi marker nhớ nó thuộc bản đồ nào.

## Thêm game

Viết một file `data/<game>.js` theo mẫu `data/ffix.js`, rồi thêm nó vào
`CONFIG.dataFiles` trong `index.html`. Mỗi bộ dữ liệu tự khai nhóm điểm,
phương tiện và luật nối tuyến của riêng nó — engine không hardcode cái nào.

Cờ `features` bật/tắt từng phần của engine:

| Cờ | Tắt thì |
|---|---|
| `routing: false` | Ẩn hẳn khung Chỉ đường, nút Nối điểm / Nối bến tàu / Nối gần — dành cho game open world, đi đâu cũng được nên tìm đường ngắn nhất vô nghĩa |
| `progress: false` | Ẩn thanh tiến độ và ô tick "đã hoàn thành" |

**Không kèm ảnh bản đồ của game vào repo** — đó là art có bản quyền.

## Thêm / sửa nhóm

Sửa `CONFIG.cats` — mỗi nhóm cần `id`, `name`, `color`. Đã có sẵn mấy nhóm
riêng của FF9 còn trống, chờ anh đổ dữ liệu: **Chocograph**, **Stellazzio**,
**Đồ dễ bỏ lỡ**, **Người chơi bài**, **Tiệm tổng hợp**.

## Dữ liệu lưu ở đâu

`localStorage` của trình duyệt, khoá bắt đầu bằng `ff9map.v1`:

| Khoá | Nội dung |
|---|---|
| `.data` | Toàn bộ marker |
| `.found` | Những điểm đã tick hoàn thành |
| `.hidden` | Nhóm đang ẩn |
| `.theme` | Nền sáng / tối |

Dữ liệu nằm trên **máy và trình duyệt đó thôi** — không đồng bộ sang máy khác.
Muốn mang đi thì Xuất JSON.

Đổi `CONFIG.store` sang tên khác nếu anh muốn chạy nhiều dự án bản đồ song song
mà không đụng dữ liệu của nhau.

## 41 điểm đặt sẵn

Các địa danh trên bản đồ thế giới đã được đặt sẵn theo nhóm: thị trấn, hầm ngục,
đền thờ, cổng, Chocobo, đầm lầy Qu. Vị trí là **ước lượng từ ảnh** — vào chế độ
biên tập kéo chỉnh cho khớp là xong.

Muốn bỏ hết làm lại từ đầu: xoá khoá `ff9map.v1.data` trong localStorage
(DevTools → Application → Local Storage), tải lại trang.

## Về ảnh bản đồ

Engine này không kèm ảnh nào. Ảnh anh tự đặt vào `maps/`.

Nếu định **đưa lên web cho người khác xem**, nhớ là lúc đó anh đang phát tán
ảnh đó — nên chỉ dùng ảnh anh có quyền phân phối. Chạy local cho riêng mình
thì không vướng gì.
