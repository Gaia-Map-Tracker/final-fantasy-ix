# Spec — Định tuyến kiểu Google Maps

Chốt qua nhiều vòng bàn giữa chủ dự án và Claude, ngày 2026-09-21.
Viết ra vì phần lớn nội dung ở đây **không suy lại được từ code**: luật
trong game, kết quả tra wiki, và những thứ đã cố tình bỏ đi.

Chưa code dòng nào. File này là thứ phải đọc trước khi bắt đầu.

---

## 1. Vấn đề

Tuyến hiện là **đoạn thẳng nối hai điểm**, nên có đường đi bộ xuyên núi,
xuyên vịnh, và chỉ đường đưa ra những hành trình không đi được ngoài đời.
Chủ dự án chỉ ra hai ca: Madain Sari ↔ Mognet Central (xuyên biển — đã
chặn), và một tuyến ở Forgotten Continent phải lượn qua mấy khe núi mà
app vẽ thẳng băng.

## 2. Nguyên tắc đã chốt

| | |
|---|---|
| **Ai định tuyến** | Máy sinh, ship sẵn trong `data/<game>.js`. Người dùng KHÔNG phải tự dựng mạng tuyến |
| **Chế độ biên tập** | Để nguyên, không đụng tới. Bàn lại sau cùng, khi phần định tuyến đã ổn |
| **Tuyến cũ** | Bỏ hết, làm lại từ đầu |
| **Nghiệm thu** | Chủ dự án soi bằng mắt, chỉ ra tuyến sai, rồi sửa trong dữ liệu |
| **Độ phức tạp** | Càng đơn giản càng ngắn càng tốt |

## 3. Mô hình: một thuật toán, bốn bộ luật

Chia ảnh bản đồ thành lưới ô, mỗi ô mang một **loại địa hình**. Mỗi chế độ
di chuyển có một bộ ô được phép đi. Chạy A\* trên lưới đó là ra đường thật.

| Chế độ | Đi trên ô |
|---|---|
| 🚶 Đi bộ | đất (cỏ, cát) |
| 🐤 Chocobo | đất + bãi cạn + núi (+ rừng, nếu Chocobo vàng kim) |
| 🚢 Tàu | **nước** |
| ✈️ Phi thuyền | không cần A\* — bay thẳng, chỉ cần chỗ đáp hợp lệ |

Cùng một thuật toán trả lời luôn câu "có đi được không": A\* không tìm ra
đường tức là chế độ đó không dùng được cho cặp điểm này.

## 4. Luật từng chế độ

### 🚶 Đi bộ
Trong cùng khối đất. Khối đất đã khai sẵn ở ô thứ 7 của mỗi điểm trong
`data/ffix.js` (`mist`, `outer`, `forgotten`, `lost`, và các đảo lẻ).

### 🐤 Chocobo
Khả năng **cộng dồn** theo hạng — Chocobo đỏ vẫn lội được bãi cạn:

| Hạng | Đi thêm được | Nhóm màu đã đo trên ảnh |
|---|---|---|
| Vàng (mặc định) | đất liền | cỏ, cát |
| Xanh nhạt — REEF | bãi cạn ven bờ | `rgb(82,137,165)` — 3.86% ảnh |
| Đỏ — MOUNTAIN | núi, dãy núi | nhóm "núi" — 4.4% |
| Vàng kim — SKY | rừng, bay | nhóm "rừng" — 3.8% |

Vẽ bằng **màu Chocobo** `#fde047` kèm **biểu tượng chocobo chạy dọc
đường**, để nhìn là biết đoạn đó phải cưỡi. Đoạn đi bộ trong cùng hành
trình vẫn vẽ trắng như thường.

Mỗi chặng **ghi rõ cần hạng nào** (kiểu Google Maps ghi "cần vé"), thay vì
đẻ ra bốn chế độ riêng.

### 🚢 Tàu
🔴 **Tàu đậu được ở MỌI bờ biển, không riêng bến.** Chủ dự án nêu, và
khớp với ghi chú vốn có trong code: *Blue Narciss cập hai cảng Alexandria /
Lindblum nhưng đáp được bãi biển bất kỳ*.

⇒ **Không cần mạng tuyến tàu cố định.** Hành trình luôn có ba phần:
đi bộ ra bờ gần nhất → vượt biển (A\* trên ô nước) → đổ bộ ở bờ gần đích →
đi bộ vào.

### ✈️ Phi thuyền
Bay thẳng. Luật đáp **lấy theo Invincible** (đời sau, rộng nhất): đáp được
mọi địa hình **trừ rừng**. Cố ý bỏ qua Hilda Garde III (chỉ đáp được cỏ) —
phân biệt hai đời phi thuyền thì phải thêm khái niệm "đang ở giai đoạn nào
của game", kéo theo cả tá thứ mà đổi lại chẳng được bao nhiêu.

**Đích nằm trong rừng thì đáp chỗ gần nhất rồi đi nốt bằng đi bộ hoặc
tàu** — y như Google Maps bảo "đi tàu tới đây rồi cuốc bộ 300 m".

## 5. Hình dáng tuyến

Tuyến chỉ lưu **các điểm uốn**; JavaScript tự cong mượt qua chúng (spline).
Ba điểm thẳng hàng thì ra đường thẳng, điểm giữa lệch thì thành cung. Một
khúc quanh có thể cần vài điểm sao cho dễ nhìn.

A\* trả về đường bám từng ô, quá chi tiết — phải **rút gọn thành ít điểm
uốn nhất mà vẫn bám đúng khe núi** trước khi ship vào dữ liệu.

## 6. Giao diện chỉ đường

Tab chế độ, bấm cái nào thì bản đồ vẽ đúng tuyến đó:

```
CHỈ ĐƯỜNG   ① Lindblum → ② Esto Gaza

[🚶 Đi bộ]  [🐤 Chocobo]  [🚢 Tàu]  [✈️ Phi thuyền]
     ✗ mờ                    ← đang chọn

🚢 Tàu · 3 chặng · 2 850 km
  Lindblum → Lindblum Harbor         đi bộ     120 km
  Lindblum Harbor → bờ biển Lost     tàu     2 600 km
  bờ biển Lost → Esto Gaza           đi bộ     130 km
```

- **Bày hết** các chế độ dùng được, kể cả khi hai điểm cùng lục địa: đi
  vòng qua núi có thể xa hơn đi tàu, người dùng nhìn số mà tự chọn.
- Chế độ không tới được thì để mờ, và **nói rõ vì sao** ("khác lục địa,
  phải vượt biển").
- Đơn vị: **km** quy ước. Không hiện thời gian — còn phụ thuộc đánh quái.

## 7. Máy không biết gì

🔴 **Ảnh không chứa luật cốt truyện.** Mấy ca sau phải khai tay, máy đoán
là sai:

- **Cleyra** — chỉ vào được qua Gizamaluke's Grotto, không phải vì có núi
  chắn mà vì cốt truyện
- **Chocobo's Paradise** — đảo giữa đại dương góc tây bắc, **phi thuyền
  không tới được**; phải Chocobo vàng kim bay qua rồi dùng Dead Pepper
- **Mognet Central** — vào bằng Dead Pepper trên vết nứt núi
- **Các gate** (North / South / Dragon's) — phải qua cửa, không băng đồng

## 8. Ràng buộc kỹ thuật đã biết

🔴 **Bảng màu và luật khác nhau theo từng lục địa** — xem `ROADMAP.md`.
Luật *"trắng/sáng = núi, không đi được"* giết nguyên Lost Continent, nơi
53.2% diện tích là tuyết mà đi bộ được bình thường.

🔴 **Canvas bị taint trên `file://`** — app không đọc được pixel ảnh lúc
chạy. Mọi phân tích ảnh chạy ngoài app (`tools/analyze-map.mjs`), kết quả
ship vào `data/`.

⚠️ **Bộ phân loại màu thử nghiệm nhầm ký hiệu địa danh vẽ sẵn trên ảnh
thành núi** — lấy mẫu ngay giữa Alexandria cũng ra "núi". Phải lọc ký hiệu
và viền trước khi tin kết quả.

## 9. Còn mở

- **Người dùng có khai hạng Chocobo đang có không?** Không khai thì app
  tính theo hạng cao nhất rồi ghi chú "chặng này cần Chocobo đỏ" — đơn
  giản hơn, và người chơi tự biết mình có gì. Khai thì đúng hơn với người
  đang chơi dở, nhưng thêm một thứ phải chọn. **Mặc định đề xuất: không khai.**
- Mật độ mạng tuyến đi bộ: nối mỗi điểm với mấy hàng xóm là vừa?

## Nguồn tra cứu

- [Invincible (FFIX) — Final Fantasy Wiki](https://finalfantasy.fandom.com/wiki/Invincible_(Final_Fantasy_IX))
- [Hilda Garde — Final Fantasy Wiki](https://finalfantasy.fandom.com/wiki/Hilda_Garde)
- [Choco — Final Fantasy Wiki](https://finalfantasy.fandom.com/wiki/Choco)
- [Chocobo's Paradise — Final Fantasy Wiki](https://finalfantasy.fandom.com/wiki/Chocobo's_Paradise)
- [FFIX Chocobo guide — RPG Site](https://www.rpgsite.net/feature/10877-final-fantasy-ix-chocobo-guide-hot-cold-abilities-colors-and-how-to-reach-lagoon-air-garden-paradise)
