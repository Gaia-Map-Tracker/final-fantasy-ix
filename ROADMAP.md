# Hướng phát triển

Ghi lại để phiên sau khỏi đo lại và khỏi đâm vào tường đã có người đâm.
Không phải cam kết lịch trình — chỉ là "nếu làm tiếp thì làm gì, và đã
biết trước được gì".

Cập nhật: 2026-09-21

---

## Đã làm được rồi — đừng dựng lại

| Thứ | Trạng thái |
|---|---|
| Engine tách khỏi dữ liệu game | `index.html` không biết gì về FFIX; `data/games.js` + `data/<game>.js` |
| Nhiều phương tiện, mỗi cái hệ số riêng | đi bộ 1.00 · tàu 0.55 · Chocobo 0.65 · phi thuyền 0.25 · Gargant 0.40 — Dijkstra đã chọn theo hệ số |
| Cờ tính năng theo game | `features.routing` / `features.progress`, tắt là ẩn hẳn khối UI |
| Khoá lưu tách theo game | `ffmap.v2.<gameId>.*`, có chuyển dữ liệu bản cũ một lần |
| Import ảnh bản đồ | IndexedDB, có đường lùi khi trình duyệt chặn |
| Cảnh báo lệch tỉ lệ khung hình | ngưỡng 2% so với `maps[].aspect` |
| Hoàn tác | 30 bước, phủ mọi thao tác biên tập |
| Biết đâu là biển | `data/ffix.js` khai khối đất cho từng điểm; ⚡ Nối gần không vẽ đường đi bộ xuyên biển nữa |

---

## Bốn việc còn lại, theo thứ tự đáng làm

### 1. Tuyến qua gate — RẺ, làm được ngay

North Gate / South Gate / Dragon's Gate đã là marker nhóm `gate`. Thiếu
đúng một thứ: hiện tuyến nối thẳng hai bên gate, đáng ra phải là
`A → Gate → B` để người xem thấy phải đi qua cửa nào.

Đây là **dữ liệu, không phải code**. Hai cách: vẽ tay trong chế độ biên
tập, hoặc thêm `seedEdges` vào `data/ffix.js` để ship sẵn mạng tuyến đúng
(hiện bộ dữ liệu ship 44 điểm nhưng **0 tuyến** — người dùng phải tự bấm
⚡ Nối gần).

### 2. Tuyến phi thuyền / tàu ship sẵn — RẺ

Engine đã đủ sức, chỉ chưa có dữ liệu. Mognet Central giờ không nối đi bộ
được nữa nên nó đang **cô lập** cho tới khi ai đó vẽ tuyến `airship` tới.

### 3. Địa hình chặn đường — VỪA, cần code mới

Tuyến hiện vẽ thẳng, nên có đường xuyên qua đồi núi. Nền tảng đã có:
`tools/analyze-map.mjs` đọc pixel và tách vùng rồi.

Hướng rẻ hơn, nên làm trước: phân loại màu thành *đi được / không đi được*
(núi, rừng rậm), chạy A\* trên lưới để **tự sinh tuyến đúng**, rồi ship
kết quả vào `data/` — app không phải tính gì lúc chạy, y như cách khối đất
đang làm.

Hướng đắt: vẽ tuyến thành **đường cong bám địa hình**. Phải lưu polyline
cho mỗi tuyến, đổi cả cách vẽ SVG lẫn cách bấm chọn tuyến để xoá. Chạm
nhiều chỗ — chỉ làm khi thật sự cần.

### 4. Vẽ tuyến vòng qua vịnh — ĐẮT, và chỉ là chuyện thẩm mỹ

Còn 4 tuyến hai đầu **cùng một khối đất** nhưng đường thẳng cắt ngang vịnh:
Madain Sari ↔ Qu's Marsh — Outer (31% đường trên nước), Mountain Path ↔
Qu's Marsh — Outer (70%), Shimmering Island ↔ Bãi đáp — Lost (28%),
Qu's Marsh — Lost ↔ Bãi đáp — Forgotten (41%).

Mấy tuyến này **đi bộ được thật** (vòng quanh vịnh), chỉ nhìn lạ mắt. Sửa
được bằng hướng đắt ở mục 3.

---

## Đã đo rồi — đừng đo lại

**Ảnh `maps/world.png`**: 1400×1400, tỉ lệ 1.0, md5 `b8e467c7…`, nước chiếm
**71.2%**, tách được **148 mảnh đất**. Bốn mảnh lớn nhất là bốn lục địa:
`mist` 19 điểm · `outer` 10 · `forgotten` 4 · `lost` 2, còn lại 7 đảo lẻ.

**⚡ Nối gần bán kính 12%** sinh 89 cặp: 10 cặp khác khối đất (đã chặn),
4 cặp cắt vịnh ≥25% (giữ, xem mục 4), 75 cặp bình thường.

**Ba trình duyệt qua `file://`** (`node tools/check.mjs --engine <tên>`):
Chromium, WebKit và Firefox đều khớp baseline 9/9. Khác nhau đúng một chỗ —
Safari không lưu được ảnh vào IndexedDB.

---

## Bẫy đã cắn — nhớ trước khi đâm lại

🔴 **Canvas bị taint trên `file://`.** App KHÔNG `getImageData()` được từ
ảnh trong `maps/` — Chromium ném `SecurityError`. Nên mọi phân tích ảnh
phải chạy **ngoài app** (xem `tools/analyze-map.mjs`, nó dùng cờ
`--allow-file-access-from-files`, thứ không dùng được trên máy người dùng)
rồi ship kết quả vào `data/`.

🔴 **Ảnh bản đồ mặc định không có header CORS.** `fetch()` và canvas đều bị
chặn, nên không cache được vào IndexedDB — chọn ảnh đó thì mỗi lần mở app
là một lần tải, và ngoại tuyến là không có bản đồ.

🔴 **Safari hỏng IndexedDB ở tầng GIAO DỊCH, không phải ở `open()`**, và
`tx.error` khi đó là `null`. Đừng bỏ mấy chỗ `|| new Error(...)` trong
`index.html` — thiếu nó là `reject(null)` rồi `err.message` ném tiếp một
TypeError, và người dùng mất luôn cảnh báo lẽ ra phải thấy.

🔴 **`#viewport` gọi `setPointerCapture` ở `pointerdown`.** Nút nào đặt bên
trong viewport sẽ **không nhận được sự kiện `click`** — nút hiện đúng, hàm
đúng, bấm không ăn gì. Màn chọn ảnh đã phải miễn trừ riêng. Thêm UI vào
trong viewport thì nhớ chuyện này.

🔴 **Ảnh bản đồ là art có bản quyền.** `.gitignore` chặn `maps/*`; đừng đảo
nó thành kiểu liệt kê-cái-cần-chặn. Không commit ảnh của bất kỳ game nào.

---

## Công cụ trong repo

```bash
node tools/check.mjs [--engine chromium|webkit|firefox] [--shot out.png]
node tools/analyze-map.mjs [--game data/ffix.js] [--emit]
```

`check.mjs` so 9 chỉ số với baseline — chạy sau mỗi thay đổi.
`analyze-map.mjs` đọc ảnh, tách mảnh đất, và **đối chiếu với trường khối đất
đã khai** trong file dữ liệu; nó báo lệch nếu một mảnh mang hai tên khác nhau.
