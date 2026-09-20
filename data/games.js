/* ==================================================================
   Danh sách game có sẵn dữ liệu bản đồ.

   Engine nạp file này trước, dựng bộ chọn game, rồi mới nạp file dữ
   liệu của game người dùng chọn — nạp sẵn hết mọi game là tốn công vô
   ích khi mỗi lúc chỉ xem một game.

   THÊM GAME MỚI: viết data/<id>.js theo mẫu data/ffix.js rồi thêm một
   dòng vào đây. KHÔNG kèm ảnh bản đồ vào repo — ảnh game là art có bản
   quyền, người dùng tự import (xem maps/README.md).

   Danh sách này CHỈ ghi game đã có dữ liệu thật. Thà một game còn hơn
   mười game với toạ độ bịa.
   ================================================================== */
window.MAPGAMELIST = [
  { id:'ffix', name:'Final Fantasy IX', file:'data/ffix.js', note:'44 địa điểm bản đồ thế giới' },
];
