# Bản đồ tương tác — Final Fantasy IX

Một file HTML tự chứa. Không thư viện ngoài, không cần build, không cần server —
mở bằng `file://` là chạy.

## Cài

```
ff9-map/
├── index.html         ← engine: pan/zoom, marker, tìm đường… không chứa dữ liệu game
├── data/
│   ├── games.js       ← danh sách game có sẵn dữ liệu
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

## Ảnh bản đồ

Repo **không kèm ảnh bản đồ** — ảnh game là art có bản quyền. Ba cách để có ảnh:

| Cách | App nhớ được? | Chạy ngoại tuyến? |
|---|---|---|
| Đặt file vào `maps/world.png` | — | ✅ |
| **📁 Chọn ảnh từ máy** | ✅ IndexedDB | ✅ |
| **🌐 Dùng bản đồ mặc định** | ❌ | ❌ |

Nút **🖼 Ảnh bản đồ** ở cột trái mở màn chọn bất cứ lúc nào. Ảnh bạn tự chọn
được ưu tiên hơn file trong `maps/`; bấm **📂 Ảnh trong maps/** để quay lại.

Bản đồ mặc định của Final Fantasy IX lấy từ
[fantasyanime.com](https://fantasyanime.com/finalfantasy/ff9/) — ảnh thuộc bản
quyền © Square Enix. App **không tự tải**, chỉ tải khi bạn bấm nút, và tải thẳng
từ máy chủ của họ. Máy chủ đó không trả header CORS nên trình duyệt **không cho
lưu lại**: mỗi lần mở app là một lần tải, và ngoại tuyến thì không có bản đồ.
Muốn chạy ngoại tuyến thì tải ảnh về, đặt vào `maps/world.png`.

Một số trình duyệt (Safari khi mở bằng `file://`) chặn IndexedDB. Gặp trường hợp
đó, app vẫn dùng được ảnh cho phiên đang mở và **nói rõ là lần sau phải chọn lại**.

## Dữ liệu lưu ở đâu

Trong `localStorage` của trình duyệt, khoá theo id game:

```
ffmap.v2.ffix.data     marker
ffmap.v2.ffix.edges    tuyến
ffmap.v2.ffix.found    đã hoàn thành
ffmap.v2.ffix.hidden   nhóm đang ẩn
ffmap.v2.ffix.imgpref  đang dùng ảnh nào cho từng bản đồ
ffmap.v2.game          game mở lần trước
ffmap.v2.theme         nền sáng/tối (dùng chung mọi game)
```

Nhiều game cùng tồn tại mà không đè dữ liệu của nhau. Dữ liệu nằm trên **máy và
trình duyệt đó thôi** — không đồng bộ sang máy khác. Muốn mang đi thì Xuất JSON.

Bản cũ dùng khoá `ff9map.v1.*`; lần đầu mở bản này, dữ liệu đó được chuyển
sang khoá mới **một lần duy nhất** và **khoá cũ vẫn giữ nguyên** — chuyển sai
thì vẫn còn bản gốc mà lấy lại.

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

Viết một file `data/<game>.js` theo mẫu `data/ffix.js`, rồi thêm một dòng
vào `data/games.js`:

```js
window.MAPGAMELIST = [
  { id:'ffix', name:'Final Fantasy IX', file:'data/ffix.js' },
  { id:'game2', name:'Tên game', file:'data/game2.js' },
];
```

Bộ chọn game ở cột trái tự cập nhật. Engine chỉ nạp file của game đang xem,
mỗi game có khoá lưu riêng nên dữ liệu không đè nhau, và app nhớ game mở
lần trước.

Mỗi bộ dữ liệu tự khai nhóm điểm, phương tiện và luật nối tuyến của riêng
nó — engine không hardcode cái nào.

Cờ `features` bật/tắt từng phần của engine:

| Cờ | Tắt thì |
|---|---|
| `routing: false` | Ẩn hẳn khung Chỉ đường, nút Nối điểm / Nối bến tàu / Nối gần — dành cho game open world, đi đâu cũng được nên tìm đường ngắn nhất vô nghĩa |
| `progress: false` | Ẩn thanh tiến độ và ô tick "đã hoàn thành" |

**Không kèm ảnh bản đồ của game vào repo** — đó là art có bản quyền.

## Thêm / sửa nhóm

Sửa `cats` trong `data/ffix.js` — mỗi nhóm cần `id`, `name`, `color`, và `icon`
là phần ruột của một thẻ SVG 24×24. Đã có sẵn mấy nhóm riêng của FF9 còn trống,
chờ đổ dữ liệu: **Chocograph**, **Stellazzio**, **Đồ dễ bỏ lỡ**,
**Người chơi bài**, **Tiệm tổng hợp**.

Engine không hardcode id nhóm nào — kể cả `port` hay `chocobo`. Luật "nối mọi
bến tàu với nhau" nằm ở `rules` trong file dữ liệu, không nằm trong engine.

## 44 điểm đặt sẵn

Các địa danh trên bản đồ thế giới đã được đặt sẵn theo nhóm: thị trấn, hầm ngục,
đền thờ, cổng, Chocobo, đầm lầy Qu, bến tàu, đặc biệt. Vị trí là **ước lượng từ
ảnh** — vào chế độ biên tập kéo chỉnh cho khớp là xong.

Muốn bỏ hết làm lại từ đầu: xoá khoá `ffmap.v2.ffix.data` trong localStorage
(DevTools → Application → Local Storage), tải lại trang.

## Đưa lên web thì nhớ

Repo này chỉ có **engine** — phần mã tự viết. Ảnh bản đồ không nằm trong repo,
và `.gitignore` chặn sẵn `maps/*` để không vô tình commit nhầm.

Nếu định đưa lên web cho người khác xem thì lúc đó bạn đang **phát tán** thứ
mình đặt trong `maps/` — chỉ dùng ảnh bạn có quyền phân phối. Chạy local cho
riêng mình thì không vướng gì.
