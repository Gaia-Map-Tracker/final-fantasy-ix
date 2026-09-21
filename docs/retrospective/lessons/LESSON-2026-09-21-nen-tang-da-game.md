# LESSON 2026-09-21 — Nền tảng bản đồ đa game

Đi cặp với `docs/handoff/HANDOFF-2026-09-21-nen-tang-da-game.md`.

Viết như biên bản đo đạc: sai gì, **vì sao lúc đó nó trông có vẻ đúng**, phát
hiện nhờ đâu, chặn lần sau bằng gì.

---

## 🔴 1. Lao vào code khi chủ dự án đang brainstorm — phải nhắc HAI lần

**Sai:** Lần một, chủ dự án gợi ý dùng điểm uốn cho tuyến cong; tôi lập tức đi
đọc `findRoute()` để chuẩn bị sửa. Chủ dự án phải nói: *"chưa có làm thật đâu.
chưa brainstorm xong mà"*. Lần hai, sau khi chốt phạm vi song ngữ, tôi bắt tay
dịch README và sửa `tools/*.mjs`. Chủ dự án lại phải nói: *"chưa có code gì. khi
nào code a báo"*.

**Vì sao lúc đó trông có vẻ đúng:** mỗi lần chủ dự án đưa một yêu cầu cụ thể,
kèm ví dụ thật, kèm ảnh chụp màn hình. Nghe như một đề bài đã đủ rõ để làm. Và
trước đó cả phiên là nhịp "anh duyệt → tôi code ngay", nên tôi quán tính coi
mọi câu cụ thể là lệnh.

**Cái tôi bỏ sót:** *cụ thể* không có nghĩa là *đã chốt*. Chủ dự án đang xây
dần bức tranh — và đúng là chưa xong thật: sau lần nhắc thứ nhất còn thêm bốn
vòng nữa (tàu đậu mọi bờ biển, tab chế độ, song ngữ, repo tiếng Anh), mỗi vòng
đều đổi thiết kế. Nếu tôi code từ lần đầu thì đã có một mạng tuyến tàu nối
bến-với-bến để rồi đập đi.

**Chặn lần sau:** trong một mạch bàn thiết kế, chỉ bắt đầu code khi có **câu ra
lệnh rõ ràng** ("làm đi", "ok em làm"), chứ không phải khi đề bài nghe đã đủ.
Một câu mô tả nhu cầu — kể cả kèm ảnh và số — vẫn là **dữ kiện để bàn**. Nếu
sốt ruột thì hỏi thẳng *"em code luôn chứ?"* rồi chờ, tốn một lượt còn hơn làm
sai hướng.

---

## 🔴 2. Viết đường dẫn máy mình vào file sẽ public

**Sai:** hardcode `/Users/pgd.quang/.nvm/.../playwright/index.js` vào
`tools/check.mjs` và `tools/analyze-map.mjs`. Hai file đó đã đẩy lên GitHub, và
chủ dự án sau đó publish repo.

**Vì sao lúc đó trông có vẻ đúng:** `require('playwright')` không chạy được vì
playwright cài toàn cục, còn repo không có `node_modules`. Tôi nhét đường dẫn
tuyệt đối vào như một "fallback tạm", có viết cả `process.env.PLAYWRIGHT_PATH ||`
ở trước nên nó **trông như đã có đường thoát**. Và script chạy ngon ngay lập
tức — phản hồi tích cực tức thì, không có gì báo động.

**Phát hiện nhờ:** chủ dự án báo đã publish repo và dặn không được lưu thông
tin bí mật. Quét lại mới thấy.

**Hai cái sai thật ra khác nhau:**
1. Lộ username — không nguy hiểm, nhưng không nên có trong repo public.
2. 🔴 **Script vô dụng với mọi người khác** — nghiêm trọng hơn, vì repo được
   publish để mời người đóng góp, mà công cụ nghiệm thu lại chỉ chạy trên đúng
   một máy.

**Chặn lần sau:** trước khi commit bất kỳ thứ gì vào repo, hỏi *"dòng này có
đúng trên máy người khác không?"*. Đường dẫn tuyệt đối, tên người dùng, cổng
cục bộ — đều là dấu hiệu. Phép kiểm 5 giây:
`grep -rn "/Users/\|/home/\|C:\\\\" --include="*" . | grep -v "^./.git/"`

---

## 🔴 3. Sửa một lỗ hổng bằng cách đục một lỗ khác — và không kiểm lại

**Sai:** bỏ đường dẫn hardcode, thay bằng dò `npm root -g`. Kết quả: `npm` trên
máy là homebrew (`/opt/homebrew/lib/node_modules`) còn playwright nằm ở nvm ⇒
**không tìm ra ⇒ cả hai script chết**.

**Vì sao lúc đó trông có vẻ đúng:** `npm root -g` là cách chuẩn để tìm thư mục
gói toàn cục. Nó đúng về nguyên tắc, chỉ sai với máy có hai bản node.

**Cái tôi bỏ sót:** tôi *có* chạy lại script sau khi sửa, thấy nó in ra thông
báo lỗi thân thiện mà mình vừa viết — và đọc lướt qua như thể đó là output bình
thường. Thông báo lỗi do chính mình viết ra rất dễ bị mắt bỏ qua, vì nó *trông
quen*.

**Chặn lần sau:** sau khi sửa một công cụ, kiểm bằng **kết quả nó phải trả ra**
(ở đây là "✓ khớp baseline"), không phải bằng "nó có chạy không". Và khi thay
một đường dò bằng đường khác, giữ lại đường cũ làm dự phòng thay vì bỏ hẳn.

---

## 🔴 4. Suýt áp một ngưỡng toàn cục lên bản đồ có 4 vùng khác nhau

**Suýt sai:** định phân loại địa hình bằng một bộ ngưỡng màu cho cả ảnh, với
luật *"trắng/sáng = núi, không đi được"*.

**Nếu làm thì hậu quả:** Lost Continent có **53.2%** diện tích là
`rgb(203,211,219)` — băng tuyết. Áp luật đó là **cả lục địa thành vùng cấm**,
trong khi Esto Gaza và Fire Shrine nằm ngay trên tuyết và đi bộ được bình
thường.

**Vì sao lúc đó trông có vẻ đúng:** tôi đã có số liệu thật (nước 71.2%, núi
4.4%, rừng 3.8%), có bảng màu 252 màu, có kết quả quét tuyến. Một đề xuất **có
số liệu** nghe rất chắc — mà số liệu đó đúng, chỉ có **kết luận rút ra từ nó**
là sai vì tôi gộp cả bản đồ làm một.

**Phát hiện nhờ:** chủ dự án nói *"mỗi 1 continent đều có bảng màu khác nhau và
qui tắc cũng khác nhau"*. Đo lại từng lục địa mới thấy chênh xa tới mức đó.

**Chặn lần sau:** trước khi rút một ngưỡng từ thống kê toàn cục, **tách theo
nhóm đã biết rồi đo lại từng nhóm**. Ở đây nhóm có sẵn ngay trong dữ liệu
(trường `land` do chính tôi thêm hôm trước) mà tôi không nghĩ tới việc dùng nó
để chia mẫu. Dấu hiệu: một con số trung bình đẹp che mất bốn phân bố khác hẳn nhau.

---

## ⚠️ 5. Tự tạo nguồn sự thật thứ hai trong cùng một file

**Sai:** thêm mục "## Dữ liệu lưu ở đâu" vào `README.md`, trong khi file **đã
có sẵn** một mục trùng tên ở dưới — nói về khoá `ff9map.v1` cũ.

**Vì sao lúc đó trông có vẻ đúng:** tôi chèn mục mới vào đúng chỗ hợp lý trong
bố cục, và phép `assert count == 1` của script sửa file chạy qua vì lúc đó
chuỗi thật sự chỉ xuất hiện một lần — **tôi tạo ra cái trùng thứ hai bằng chính
lần chèn đó**.

**Phát hiện nhờ:** lần sửa README sau đó, `assert count == 1` mới đỏ.

**Chặn lần sau:** trước khi thêm một mục vào tài liệu dài, `grep -n "^#"` xem
mục lục đã có gì. Và phép `assert` chỉ bảo vệ được *lần thay thế hiện tại*, nó
không nói gì về thứ mình sắp sinh ra.

---

## ⚠️ 6. Hai lệnh rời tưởng là một chuỗi

**Sai:** `python3 - <<EOF ... EOF` rồi xuống dòng `git add ... && git commit`.
Python fail, nhưng git **vẫn chạy** vì chúng là hai lệnh độc lập. Kết quả: một
commit thiếu file `README.md`, phải `--amend` để vá.

**Vì sao lúc đó trông có vẻ đúng:** trong đầu tôi đó là "một khối việc", và
heredoc làm mạch lệnh nhìn liền một dải.

**Chặn lần sau:** lệnh nào phụ thuộc lệnh trước thì nối bằng `&&`, kể cả khi
chúng cách nhau một heredoc. Hoặc tách hẳn thành hai lượt gọi.

---

## ✅ Cái ĐÚNG đáng lặp lại

**1. Đo bốn cái bẫy TRƯỚC khi lập kế hoạch.** Dựng trang probe chạy qua
`file://` thật để kiểm `fetch`, thẻ `<script>` động, IndexedDB, `onerror`. Nếu
bẫy số một sai thì cả kiến trúc sụp — biết trước mất 10 phút, biết sau mất một
slice.

**2. Chụp baseline 9 chỉ số ngay từ đầu, rồi so lại sau MỌI slice.** Bảy slice,
lần nào cũng `✓ khớp baseline`. Nó bắt được lỗi `setEdit()` gọi trước
`applyGame()` ngay lập tức, thay vì để lọt tới lúc bàn giao.

**3. Bấm tay bằng chuột thật thay vì chỉ chạy script.** Ba lỗi chỉ lộ ra theo
cách này, trong đó có một cái **không đọc code ra được**: nút trong `#viewport`
không nhận `click` vì `setPointerCapture`. Nút hiện đúng, hàm đúng, bấm không
ăn gì.

**4. Nghi phép thử trước khi nghi sản phẩm.** Bốn lần "lỗi" hoá ra là phép thử
sai: bấm trúng pin thay vì chỗ trống, quên thoát chế độ biên tập, `el.click()`
không kích hoạt `pointerdown`, và một ca đặt kỳ vọng sai mốc ngưỡng (2.04% vs
2%). Không lần nào phải sửa sản phẩm.

**5. Cài thêm engine để biến giả lập thành phép đo.** Đường lùi IndexedDB ban
đầu chỉ kiểm bằng cách ném lỗi giả. Cài WebKit rồi chạy thật mới lộ ra Safari
hỏng ở **tầng giao dịch với `tx.error = null`**, khác hẳn cách đã giả lập — và
dòng `|| new Error(...)` viết theo phản xạ hoá ra là thứ giữ cho cảnh báo không
biến mất.

**6. Viết spec vào repo trước khi code.** Brainstorm định tuyến kéo tám vòng,
gồm kết quả tra wiki và những thứ **cố ý bỏ đi**. Không ghi thì phiên sau vừa
phải tra lại, vừa không biết cái gì đã bị loại và vì sao.
