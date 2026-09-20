/* ==================================================================
   Final Fantasy IX — bộ dữ liệu bản đồ
   ------------------------------------------------------------------
   File này TỰ ĐĂNG KÝ vào window.MAPGAMES. Engine (index.html) nạp nó
   bằng thẻ <script> chèn động — KHÔNG dùng fetch() và KHÔNG dùng
   import, vì cả hai đều bị chặn khi mở trang bằng file://.

   Engine không biết gì về FFIX. Mọi thứ riêng của game — nhóm điểm,
   phương tiện, luật nối bến tàu — đều khai ở đây.

   ẢNH BẢN ĐỒ KHÔNG NẰM TRONG REPO. Ảnh game là tác phẩm có bản quyền
   của Square Enix; người dùng tự đặt ảnh của mình vào maps/ (xem
   maps/README.md).
   ================================================================== */
window.MAPGAMES = window.MAPGAMES || [];
window.MAPGAMES.push({
  id:   'ffix',
  name: 'Final Fantasy IX',

  /* Tiền tố khoá localStorage. Giữ nguyên 'ff9map.v1' để bản cũ mở lên
     không mất dữ liệu — slice sau sẽ đổi sang khoá theo game kèm migrate. */
  store: 'ff9map.v1',

  /* Tính năng engine bật cho game này. Game open world sau này đặt
     routing:false — đi đâu cũng được, tìm đường ngắn nhất vô nghĩa —
     và engine sẽ ẩn hẳn khung Chỉ đường, không chỉ làm mờ nó đi. */
  features: { routing: true, progress: true },

  /* aspect = tỉ lệ khung hình (rộng / cao) của ẢNH mà toạ độ bên dưới
     được đặt theo. Toạ độ lưu theo tỉ lệ 0–1 nên đổi độ phân giải vẫn
     đúng chỗ, nhưng đổi TỈ LỆ thì lệch hết. Đo từ ảnh gốc: 1400×1400. */
  maps: [
    { id:'world', name:'Bản đồ thế giới', src:'maps/world.png', aspect:1.0 },
    // Thêm bản đồ khác ở đây, ví dụ:
    // { id:'alexandria', name:'Alexandria', src:'maps/alexandria.png' },
  ],

  /* Nhóm điểm. Engine KHÔNG hardcode bất kỳ id nào trong đây. */
  cats: [
    { id:'town',       name:'Thị trấn & thành phố', color:'#fbbf24',
      icon:'<path d="M4 11l8-6 8 6"/><path d="M6 10.5V20h12v-9.5"/><path d="M10 20v-5h4v5"/>' },
    { id:'dungeon',    name:'Hầm ngục',             color:'#a78bfa',
      icon:'<path d="M4 20v-7a8 8 0 0 1 16 0v7"/><path d="M9 20v-5a3 3 0 0 1 6 0v5"/>' },
    { id:'shrine',     name:'Đền thờ',              color:'#22d3ee',
      icon:'<path d="M3 6h18"/><path d="M5 9.5h14"/><path d="M7 6v14"/><path d="M17 6v14"/>' },
    { id:'gate',       name:'Cổng',                 color:'#94a3b8',
      icon:'<path d="M5 20V9l7-4 7 4v11"/><path d="M9.5 20v-6a2.5 2.5 0 0 1 5 0v6"/>' },
    { id:'chocobo',    name:'Chocobo',              color:'#fde047',
      icon:'<path d="M18 5c1 6-3 11-8 12"/><path d="M18 5c-6 0-10 3-11 8"/><path d="M7 13l-2 6"/>' },
    { id:'qu',         name:"Đầm lầy Qu",           color:'#4ade80',
      icon:'<path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3z"/>' },
    { id:'port',       name:'Bến tàu / bãi đáp',    color:'#fb7185',
      icon:'<circle cx="12" cy="4.5" r="2"/><path d="M12 6.5V20"/><path d="M8 10h8"/><path d="M4.5 13.5a7.5 7.5 0 0 0 15 0"/>' },
    { id:'special',    name:'Đặc biệt',             color:'#f472b6',
      icon:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z"/>' },
    { id:'chocograph', name:'Chocograph',           color:'#fb923c',
      icon:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14"/><path d="M15 6v14"/>' },
    { id:'stellazzio', name:'Stellazzio',           color:'#e879f9',
      icon:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5l1.4 2.9 3.1.4-2.3 2.2.6 3.1-2.8-1.5-2.8 1.5.6-3.1-2.3-2.2 3.1-.4z"/>' },
    { id:'missable',   name:'Đồ dễ bỏ lỡ',          color:'#ef4444',
      icon:'<path d="M12 4L2.5 20h19z"/><path d="M12 10v4.5"/><path d="M12 17.3v.1"/>' },
    { id:'card',       name:'Người chơi bài',       color:'#38bdf8',
      icon:'<rect x="4.5" y="3.5" width="15" height="17" rx="2"/><path d="M12 8l2.2 3.5L12 15l-2.2-3.5z"/>' },
    { id:'synth',      name:'Tiệm tổng hợp',        color:'#2dd4bf',
      icon:'<path d="M10 3v6l-5.2 9a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 9V3"/><path d="M9 3h6"/><path d="M7.5 14h9"/>' },
  ],

  /* Phương tiện di chuyển. cost = hệ số nhân quãng đường khi tìm
     đường ngắn nhất — số càng nhỏ thì tuyến đó càng được ưu tiên. */
  links: [
    { id:'walk',    name:'Đi bộ',      color:'#e2e8f0', cost:1.00 },
    { id:'boat',    name:'Đi tàu',     color:'#38bdf8', cost:0.55 },
    { id:'chocobo', name:'Chocobo',    color:'#fde047', cost:0.65 },
    { id:'airship', name:'Phi thuyền', color:'#c084fc', cost:0.25 },
    { id:'gargant', name:'Gargant',   color:'#f472b6', cost:0.40 },
  ],

  /* Điểm đặt sẵn: [map, nhóm, tên, x, y, ghi chú]. Toạ độ theo tỉ lệ
     0–1 của ảnh. Vào chế độ biên tập là kéo chỉnh được hết. */
  seed: [
  ['world','town','Alexandria',0.862,0.585,''],
  ['world','port','Alexandria Harbor',0.814,0.593,'Cảng của tàu Blue Narciss'],
  ['world','town','Lindblum',0.571,0.843,''],
  ['world','port','Lindblum Harbor',0.534,0.854,'Cảng của tàu Blue Narciss'],
  ['world','town','Treno',0.807,0.764,''],
  ['world','town','Dali',0.672,0.651,''],
  ['world','town','Burmecia',0.608,0.600,''],
  ['world','town','Cleyra',0.564,0.645,''],
  ['world','town','Conde Petie',0.561,0.366,''],
  ['world','town','Madain Sari',0.576,0.267,''],
  ['world','town','Black Mage Village',0.611,0.388,''],
  ['world','town','Esto Gaza',0.246,0.299,''],
  ['world','town','Daguerreo',0.229,0.805,''],
  ['world','town',"Quan's Dwelling",0.895,0.742,''],

  ['world','dungeon','Evil Forest',0.768,0.608,''],
  ['world','dungeon','Ice Cavern',0.729,0.671,''],
  ['world','dungeon',"Gizamaluke's Grotto",0.619,0.708,''],
  ['world','dungeon','Fossil Roo',0.576,0.398,''],
  ['world','dungeon',"Ipsen's Castle",0.119,0.455,''],
  ['world','dungeon','Oeilvert',0.246,0.663,''],
  ['world','dungeon','Desert Palace',0.777,0.301,''],
  ['world','dungeon','Pinnacle Rocks',0.613,0.829,''],
  ['world','dungeon','Mountain Path',0.558,0.301,''],
  ['world','dungeon','Observatory Mountain',0.696,0.652,''],
  ['world','dungeon','Lifa Tree',0.480,0.352,''],

  ['world','shrine','Fire Shrine',0.317,0.211,''],
  ['world','shrine','Water Shrine',0.129,0.531,''],
  ['world','shrine','Wind Shrine',0.314,0.718,''],
  ['world','shrine','Earth Shrine',0.736,0.376,''],
  ['world','shrine','Shimmering Island',0.279,0.351,''],

  ['world','gate','North Gate',0.649,0.629,''],
  ['world','gate','South Gate',0.737,0.739,''],
  ['world','gate',"Dragon's Gate",0.569,0.798,''],

  ['world','chocobo',"Chocobo's Forest",0.663,0.759,''],
  ['world','chocobo',"Chocobo's Lagoon",0.369,0.868,''],
  ['world','chocobo',"Chocobo's Paradise",0.071,0.148,''],

  ['world','qu',"Qu's Marsh — Mist",0.589,0.749,''],
  ['world','qu',"Qu's Marsh — Outer",0.649,0.345,''],
  ['world','qu',"Qu's Marsh — Forgotten",0.210,0.463,''],
  ['world','qu',"Qu's Marsh — Lost",0.184,0.746,''],

  ['world','special','Mognet Central',0.671,0.214,''],

  // Tàu Blue Narciss đáp được cả bãi biển, nên ba điểm dưới là chỗ cập
  // bến ƯỚC LƯỢNG cho ba lục địa còn lại — kéo về đúng bãi thật.
  ['world','port','Bãi đáp — Outer',0.503,0.404,'Vị trí ước lượng, kéo chỉnh'],
  ['world','port','Bãi đáp — Forgotten',0.196,0.700,'Vị trí ước lượng, kéo chỉnh'],
  ['world','port','Bãi đáp — Lost',0.272,0.333,'Vị trí ước lượng, kéo chỉnh'],
  ],

  /* Luật nối tuyến riêng của FFIX. Trước đây engine hardcode chuỗi
     'port', 'boat', 'gargant' và cả tên "Fossil Roo" — game khác nạp
     vào là sai ngay. Giờ engine chỉ đọc mấy khoá dưới đây.

     Đường biển trong FF9 không phải mạng tuyến cố định: tàu Blue
     Narciss cập hai cảng Alexandria / Lindblum và đáp được bãi biển
     bất kỳ. Nên mô hình là: mọi điểm thuộc nhóm "Bến tàu" đều đi tới
     nhau được. Riêng Fossil Roo là hầm gargant nối Mist với Outer
     Continent, không phải đường biển. */
  rules: {
    hubCat:   'port',   // nhóm được nối đầy đủ với nhau
    hubLink:  'boat',   // phương tiện dùng cho các tuyến đó
    walkLink: 'walk',   // phương tiện mặc định của "⚡ Nối gần"

    /* Bãi đáp tạo sẵn khi bản đồ chưa đủ điểm cập bến. */
    hubSeed: [
      { name:'Bãi đáp — Outer',     x:0.503, y:0.404 },
      { name:'Bãi đáp — Forgotten', x:0.196, y:0.700 },
      { name:'Bãi đáp — Lost',      x:0.272, y:0.333 },
    ],
    /* Điểm có sẵn cần đổi sang nhóm hubCat khi dựng mạng đường biển. */
    hubPromote: ['Alexandria Harbor', 'Lindblum Harbor'],

    /* Tuyến đặc biệt, nối theo TÊN điểm. */
    extraEdges: [
      { from:"Qu's Marsh — Mist", to:'Fossil Roo', type:'gargant' },
    ],
  },
});
