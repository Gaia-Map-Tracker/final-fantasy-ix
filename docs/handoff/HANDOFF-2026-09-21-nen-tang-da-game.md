# HANDOFF 2026-09-21 — Nền tảng bản đồ đa game

Phiên đầu của mạch này, không kế thừa handoff nào trước đó.

🔴 **Phiên này KHÔNG qua PO và KHÔNG qua QC agent.** Dự án chưa có hai vai đó.
Mọi phản biện đến từ chính chủ dự án, và mọi nghiệm thu do lead tự chạy bằng
Playwright trên trình duyệt thật. Đọc bản bàn giao này với mức tin cậy đó.

---

## Đọc 30 giây

- **Chờ anh quyết:** license cho repo (đã public, mời người đóng góp mà chưa có
  license = mặc định "all rights reserved"); có đẩy thư mục `docs/handoff` và
  `docs/retrospective` lên repo public không.
- **Code được ngay khi được lệnh:** ① dịch nốt repo sang tiếng Anh → ② i18n app
  EN/VI → ③ định tuyến theo `docs/SPEC-DINH-TUYEN.md`.
- 🔴 **KHÔNG tự ý code.** Chủ dự án đã phải nhắc **hai lần** trong phiên này.
  Chờ câu "làm đi" rõ ràng.
- 🔴 **Working tree đang bẩn có chủ ý** — 4 file sửa dở, hai trong số đó ĐANG
  HỎNG. Chủ dự án bảo cứ để nguyên. Đừng "dọn dẹp" giúp.

---

## 0. Phiên này làm được gì

Từ repo chưa có commit nào → nền tảng bản đồ đa game, **14 commit, đã đẩy hết**.

| Slice | Commit | Số đo |
|---|---|---|
| Commit đầu tiên | `c331b28` | 5 file, 2 484 dòng, 0 ảnh |
| 1. Tách `data/ffix.js` | `68e5e8a` | 9/9 chỉ số khớp baseline |
| 2. Khoá localStorage theo game + migrate | `aefa7c9` | 5 khoá cũ chuyển sang khớp từng ký tự |
| 3. Bộ chọn game | `534dda7` | đổi game 44↔3 điểm, tiến độ không đè nhau |
| 4. Import ảnh + IndexedDB | `e70afc2` | ảnh 600px sống qua lần mở lại |
| 5. Cảnh báo lệch tỉ lệ | `b90f341` | ngưỡng 2%, đúng cả hai phía |
| 6. Hoàn tác | `03edb1f` | 30 bước, 7 loại thao tác |
| 7. Về dữ liệu gốc | `204fe74` | đếm đúng "2 thêm · 1 sửa · 11 tuyến" |
| Kiểm WebKit | `e9c7f9a` | Safari không lưu được ảnh — đo thật |
| Kiểm Firefox + xoá JSON cũ | `faeb20e` | Firefox lưu được |
| Chặn đi bộ xuyên biển | `e0edeae` | 89 → 79 tuyến |
| ROADMAP + công cụ phân tích ảnh | `b8ab7c1` | |
| Bảng màu theo lục địa | `6f680e2` | |
| Spec định tuyến | `21e3f57` | |

**Quyết định lớn đã chốt** (chi tiết ở `docs/SPEC-DINH-TUYEN.md`):
- Định tuyến do **máy sinh**, ship sẵn trong `data/`; người dùng không tự dựng
- Chỉ đường **kiểu Google Maps**: tab chế độ 🚶 🐤 🚢 ✈️, mỗi chế độ một hành trình
- Tàu **đậu mọi bờ biển** ⇒ không cần mạng tuyến tàu cố định
- Phi thuyền lấy luật **Invincible**, cố ý bỏ Hilda Garde III
- Tuyến chỉ lưu **điểm uốn**, JS tự cong
- Repo **toàn tiếng Anh**, app **song ngữ EN/VI**

**Đã bỏ không làm, và vì sao:**
- Phân biệt hai đời phi thuyền — kéo theo khái niệm "đang ở giai đoạn nào của game"
- Để app tự đọc pixel ảnh lúc chạy — canvas bị taint trên `file://`
- Bắt người dùng khai hạng Chocobo — thay bằng ghi chú "chặng này cần Chocobo đỏ"

---

## 1. Việc chờ quyết định — kèm cái giá

| Việc | Phương án | Giá |
|---|---|---|
| **License** | MIT (phổ biến nhất cho repo mời đóng góp) · Apache-2.0 (có điều khoản sáng chế) · không có license | Không license ⇒ người khác **không được phép** fork/sửa hợp pháp, trái với ý "cho mọi người góp ý và phát triển". Cần ghi rõ license chỉ áp cho **code**, không áp cho art trong `maps/` |
| **Đẩy `docs/handoff` + `docs/retrospective` lên repo public?** | Đẩy · giữ local · chuyển sang `.claude/` | Đẩy thì minh bạch nhưng làm rối repo mà người ngoài đọc, và nó viết bằng tiếng Việt trong khi repo đang chuyển sang tiếng Anh |
| **Tên file spec** | Đổi `SPEC-DINH-TUYEN.md` → `SPEC-ROUTING.md` | Đổi thì đồng bộ với repo tiếng Anh; phải sửa link trong `README.md` và `ROADMAP.md` |

---

## 2. ĐỪNG LÀM LẠI — đã đo rồi

### Ảnh `maps/world.png`
1400×1400 · tỉ lệ 1.0 · md5 `b8e467c75ca4297d82d0f6c786e1c8f0` · **252 màu** ·
nước **71.2%** · **148 mảnh đất**.

Bốn mảnh lớn nhất = bốn lục địa: `mist` 19 điểm · `outer` 10 · `forgotten` 4 ·
`lost` 2, còn lại 7 đảo lẻ.

🔴 **md5 ảnh này TRÙNG KHÍT ảnh ở fantasyanime.com** — cùng 199 354 bytes. Nên
44 toạ độ khớp tuyệt đối với ảnh mặc định, lệch 0%.

### Bảng màu riêng từng lục địa
`lost` **53.2%** là `rgb(203,211,219)` (tuyết) · `mist` lục nhạt 15.4% + lục đậm
12.5% · `outer` nâu vàng 17%+16.2% · `forgotten` nâu vàng 21.1%+17.9%.
**`outer` và `forgotten` gần trùng bảng màu**, chỉ tách được nhờ trường `land`.

### Mạng tuyến
⚡ Nối gần bán kính 12% sinh **89 cặp**: 10 cặp khác khối đất (đã chặn), 4 cặp
cắt vịnh ≥25% (giữ — đi bộ được, chỉ nhìn lạ), 75 cặp bình thường.
⚓ Nối bến tàu ra **11 tuyến** = 10 đường biển + 1 gargant.

Tuyến cắt núi đo được: Dali ↔ Ice Cavern **42% núi**, Burmecia ↔ North Gate **30%**.

### Ba trình duyệt qua `file://`
Chromium · WebKit 26.6 · Firefox 155 — **đều khớp baseline 9/9**, thao tác biên
tập giống hệt nhau. Khác đúng một chỗ: **Safari không lưu được ảnh vào IndexedDB**.

### Thứ đã đo và thấy KHÔNG tồn tại / KHÔNG làm được
- `fetch()` file local qua `file://` — bị CORS chặn (đúng như dự đoán ban đầu)
- **canvas `getImageData()` trên `file://`** — `SecurityError`, ảnh bị taint.
  Đây là thứ giết hướng "app tự nhận ra địa hình lúc chạy".
- **Ảnh mặc định ở fantasyanime.com không có header CORS** — `fetch` và canvas
  đều bị chặn ⇒ **không cache được**, mỗi lần mở là một lần tải.
- Repo **không có** password/token/key nào (đã quét).

---

## 3. BẪY — kèm bằng chứng

🔴 **`#viewport` gọi `setPointerCapture` ở `pointerdown`.** Nút đặt bên trong
viewport **không nhận được sự kiện `click`** — nút hiện đúng, hàm đúng, bấm
không ăn gì. Màn chọn ảnh đã phải miễn trừ riêng (`if (ev.target.closest('#fallback')) return;`).
Đọc code không ra được lỗi này, chỉ bấm thật mới thấy.

🔴 **Safari hỏng IndexedDB ở tầng GIAO DỊCH, không phải ở `open()`**, và
`tx.error` khi đó là **`null`**. Mấy chỗ `|| new Error(...)` trong `index.html`
không phải phòng xa — thiếu nó là `reject(null)` rồi `err.message` ném tiếp một
TypeError, người dùng mất luôn cảnh báo.

🔴 **Hằng `NS` từng bị dùng cho hai thứ** — namespace SVG và tiền tố localStorage.
Đã đổi thành `SVGNS`. Đặt tên trùng kiểu này không lỗi ngay, nó chờ.

⚠️ **Bộ phân loại màu thử nghiệm nhầm ký hiệu địa danh vẽ sẵn trên ảnh thành
núi** — lấy mẫu ngay giữa Alexandria (đồng bằng) cũng ra "núi", vì ảnh có vẽ ký
hiệu trắng tại mỗi địa danh. Phải lọc ký hiệu và viền trước khi tin kết quả.

⚠️ **`python3 ... <<EOF` fail mà `git commit` dòng dưới VẪN chạy** — hai lệnh
rời, không nối `&&`. Đã đẻ ra một commit thiếu file, phải `--amend`.

---

## 4. Cách tái hiện + ca đối chứng

```bash
# nghiệm thu chính — 9 chỉ số so baseline
node tools/check.mjs [--engine chromium|webkit|firefox] [--shot out.png]

# đối chiếu dữ liệu khối đất với ảnh thật
node tools/analyze-map.mjs
```

🔴 **Cả hai script ĐANG HỎNG trên máy chủ dự án** (xem mục 6). Chạy tạm bằng:
```bash
PLAYWRIGHT_PATH="$HOME/.nvm/versions/node/v22.23.2/lib/node_modules/playwright/index.js" node tools/check.mjs
```

**Ca đối chứng cho việc chặn đi bộ xuyên biển:**
- Madain Sari ↔ Mognet Central → khác khối đất → **phải bị chặn**
- Madain Sari ↔ Qu's Marsh — Outer → cùng khối `outer` → **phải được giữ**
  (đi bộ được thật, vòng quanh vịnh; chỉ nhìn lạ vì đường vẽ thẳng)

Thiếu ca thứ hai thì không phân biệt được "đã vá" với "chặn quá tay".

---

## 5. Trạng thái bàn giao

| | |
|---|---|
| Repo | `git@github.com:Gaia-Map-Tracker/final-fantasy-ix.git` |
| Nhánh | `main` |
| Commit | `21e3f57` — **local = remote, đã đẩy hết** |
| Số commit | 14 |
| **Repo đã PUBLIC** | 🔴 Chủ dự án publish để mời người góp ý và phát triển |
| Staging / prod | không có |

### 🔴 Working tree đang bẩn CÓ CHỦ Ý — đừng dọn

Chủ dự án nói nguyên văn: *"cứ để đó đi… bây giờ cứ giữ như hiện tại"*.

| File | Trạng thái |
|---|---|
| `README.md` | Đã dịch xong sang tiếng Anh (231 dòng) — **chưa commit** |
| `docs/SPEC-DINH-TUYEN.md` | Đã thêm 2 chốt cuối + mục giao diện song ngữ — **chưa commit** |
| `tools/check.mjs` | 🔴 **HỎNG** — bỏ đường dẫn hardcode, thay bằng dò `npm root -g`, nhưng npm là homebrew còn playwright ở nvm nên không tìm ra |
| `tools/analyze-map.mjs` | 🔴 **HỎNG** — cùng lý do |

⚠️ **Bản đã đẩy lên GitHub vẫn nguyên vẹn và chạy tốt.** Mọi thứ hỏng chỉ nằm ở
máy chủ dự án.

### 🔴 Repo public đang lộ đường dẫn cá nhân

`tools/check.mjs:26` và `tools/analyze-map.mjs:24` trong **bản đã đẩy** có chuỗi
`/Users/pgd.quang/.nvm/...`. Không phải bí mật nguy hiểm (không có key/token),
nhưng lộ username và **làm script không chạy được trên máy người khác** — đúng
thứ cản người muốn đóng góp. Bản sửa đang nằm trong working tree nhưng chưa xong.

Email `quang4dev@gmail.com` nằm trong tác giả của cả 14 commit đã đẩy. Không gỡ
được nếu không viết lại lịch sử, mà lịch sử đã public thì **không đụng vào**.

---

## 6. Nợ ghi ở đâu

- `ROADMAP.md` — 4 việc còn lại, số đã đo, bẫy đã cắn
- `docs/SPEC-DINH-TUYEN.md` — toàn bộ spec định tuyến, có nguồn wiki
- Không có BACKLOG/REMINDERS riêng

---

## 7. Việc tiếp theo, theo thứ tự

1. **Repo sang tiếng Anh** — README xong (chưa commit), còn `ROADMAP.md`,
   `docs/SPEC-DINH-TUYEN.md`, `maps/README.md`, và comment trong
   `index.html` / `data/*.js` / `tools/*.mjs` (~175 dòng comment)
2. **i18n app EN/VI** — gom chuỗi UI vào bảng, nút đổi, nhớ lựa chọn.
   `data/ffix.js` phải khai song ngữ cho `cats[].name`, `links[].name`,
   `maps[].name`, và ghi chú của 5 điểm. Tên địa danh giữ nguyên tiếng Anh.
   **Làm TRƯỚC định tuyến**, vì định tuyến đẻ thêm cả đống chuỗi mới.
3. **Định tuyến** theo `docs/SPEC-DINH-TUYEN.md`

🔴 **Chờ chủ dự án nói "làm đi" mới bắt đầu.**
