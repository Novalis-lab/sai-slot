/*
 * ============================================================
 *  メニューデータ（ここだけ直せばメニューを更新できます）
 * ============================================================
 *
 *  出典：サイ○リヤ公式メニューブック「グランドメニュー 2026.10 A」
 *  ※ 店舗・時期によって品目や価格が違う場合があります。
 *
 *  ■ 1品の書き方
 *    { code: "2101", name: "ミラノ風ドリア", price: 320, category: "ドリア・グラタン" },
 *
 *    code     … メニュー番号（注文用紙に書く番号）。わからなければ "" でOK
 *    name     … メニュー名
 *    price    … 税込価格（数字だけ。「円」や「,」は書かない）
 *    category … カテゴリ名（下の CATEGORIES にある名前と同じにする）
 *    hide     … true にするとスロットに出なくなる（一時的に外したいとき便利）
 *    note     … 補足メモ（画面には出ません）
 *
 *  ■ 注意
 *    ・各行の最後の「,」を忘れないでください
 *    ・文字は "（半角のダブルクォーテーション）で囲みます
 */

// 更新した日付やメニュー版を書いておくと、画面に表示されます
const MENU_VERSION = "2026年10月 グランドメニュー";

// カテゴリの一覧（並び順はこの順番になります）
//   main: true … 「主食を必ず1品入れる」のときに主食あつかいになる
//   defaultOn: false … 最初はチェックが外れた状態になる
const CATEGORIES = [
  { name: "前菜",             emoji: "🍗" },
  { name: "サラダ",           emoji: "🥗" },
  { name: "スープ",           emoji: "🥣" },
  { name: "パン・ライス",     emoji: "🍞" },
  { name: "パスタ",           emoji: "🍝", main: true },
  { name: "ピザ",             emoji: "🍕", main: true },
  { name: "ドリア・グラタン", emoji: "🧀", main: true },
  { name: "肉料理",           emoji: "🍖", main: true },
  { name: "デザート",         emoji: "🍮" },
  { name: "お酒",             emoji: "🍷", defaultOn: false },
  { name: "トッピング",       emoji: "🥚", defaultOn: false },
];

// ドリンクバー（「ドリンクバーを含める」をONにしたときに追加されます）
const DRINK_BAR = { code: "5101", name: "セットドリンクバー", price: 210 };

const MENU_ITEMS = [
  // ---------- 前菜 ----------
  { code: "1401", name: "辛味チキン",                         price: 320, category: "前菜" },
  { code: "1405", name: "エスカルゴのオーブン焼き",           price: 420, category: "前菜" },
  { code: "1410", name: "ムール貝のガーリック焼き",           price: 420, category: "前菜" },
  { code: "1407", name: "チョリソー",                         price: 420, category: "前菜" },
  { code: "1404", name: "ポップコーンシュリンプ",             price: 320, category: "前菜" },
  { code: "1416", name: "ポテトのグリル",                     price: 320, category: "前菜" },
  { code: "1403", name: "ほうれん草のソテー",                 price: 210, category: "前菜" },
  { code: "1402", name: "アロスティチーニ",                   price: 420, category: "前菜" },
  { code: "1452", name: "アロスティチーニ（Wサイズ）",        price: 840, category: "前菜" },
  { code: "1425", name: "柔らか青豆の温サラダ",               price: 210, category: "前菜" },
  { code: "1413", name: "キャロットラペ",                     price: 210, category: "前菜" },
  { code: "1422", name: "生ハム",                             price: 320, category: "前菜" },
  { code: "1417", name: "バッファローモッツァレラのカプレーゼ", price: 460, category: "前菜" },
  { code: "1408", name: "蒸し鶏の香味ソース",                 price: 320, category: "前菜" },
  { code: "1406", name: "小エビのカクテル",                   price: 320, category: "前菜" },
  { code: "1423", name: "生ハムとバッファローモッツァレラの盛合せ", price: 530, category: "前菜" },

  // ---------- サラダ ----------
  { code: "1202", name: "小エビのサラダ",   price: 370, category: "サラダ" },
  { code: "1209", name: "チキンのサラダ",   price: 370, category: "サラダ" },
  { code: "1205", name: "わかめのサラダ",   price: 370, category: "サラダ" },

  // ---------- スープ ----------
  { code: "1307", name: "たまねぎのズッパ",     price: 320, category: "スープ" },
  { code: "1301", name: "コーンクリームスープ", price: 160, category: "スープ" },
  { code: "1305", name: "田舎風ミネストローネ", price: 320, category: "スープ" },

  // ---------- パン・ライス ----------
  { code: "3110", name: "フォッカチオ",           price: 160, category: "パン・ライス" },
  { code: "3111", name: "ガーリックフォッカチオ", price: 210, category: "パン・ライス" },
  { code: "3113", name: "タラコフォッカチオ",     price: 260, category: "パン・ライス" },
  { code: "3114", name: "チーズフォッカチオ",     price: 260, category: "パン・ライス" },
  { code: "3112", name: "シナモンフォッカチオ",   price: 210, category: "パン・ライス" },
  { code: "3101", name: "ライス",                 price: 160, category: "パン・ライス" },
  { code: "3102", name: "ラージライス",           price: 210, category: "パン・ライス" },
  { code: "3103", name: "スモールライス",         price: 110, category: "パン・ライス" },

  // ---------- パスタ ----------
  { code: "2301", name: "タラコソースシシリー風",               price: 420, category: "パスタ" },
  { code: "2304", name: "パルマ風スパゲッティ",                 price: 420, category: "パスタ" },
  { code: "2305", name: "カルボナーラ",                         price: 530, category: "パスタ" },
  { code: "2318", name: "半熟卵のカルボナーラ",                 price: 590, category: "パスタ" },
  { code: "2320", name: "小エビのタラコソース",                 price: 570, category: "パスタ" },
  { code: "2321", name: "きのことほうれん草のクリームスパゲッティ", price: 640, category: "パスタ" },
  { code: "2328", name: "イカの墨入りセピアソース",             price: 530, category: "パスタ" },
  { code: "2306", name: "ミートソースボロニア風",               price: 420, category: "パスタ" },
  { code: "2316", name: "半熟卵のミートソースボロニア風",       price: 480, category: "パスタ" },
  { code: "2310", name: "スープ入り塩味ボンゴレ",               price: 530, category: "パスタ" },
  { code: "2303", name: "ペペロンチーノ",                       price: 320, category: "パスタ" },
  { code: "2317", name: "半熟卵のペペロンチーノ",               price: 380, category: "パスタ" },
  { code: "2325", name: "ペンネアラビアータ",                   price: 420, category: "パスタ" },

  // ---------- ピザ ----------
  { code: "2203", name: "バッファローモッツァレラのマルゲリータピザ", price: 420, category: "ピザ" },
  { code: "2204", name: "野菜ときのこのピザ",   price: 420, category: "ピザ" },
  { code: "2208", name: "ソーセージピザ",       price: 420, category: "ピザ" },
  { code: "2206", name: "たっぷりコーンのピザ", price: 420, category: "ピザ" },

  // ---------- ドリア・グラタン ----------
  { code: "2101", name: "ミラノ風ドリア",                       price: 320, category: "ドリア・グラタン" },
  { code: "2103", name: "半熟卵のミラノ風ドリア",               price: 380, category: "ドリア・グラタン" },
  { code: "2108", name: "焼チーズ ミラノ風ドリア",              price: 380, category: "ドリア・グラタン" },
  { code: "2110", name: "タラコとポップコーンシュリンプのドリア", price: 420, category: "ドリア・グラタン" },
  { code: "2115", name: "ポップコーンシュリンプとタラコのクリームグラタン", price: 420, category: "ドリア・グラタン" },

  // ---------- 肉料理 ----------
  { code: "2407", name: "ディアボラ風ハンバーグ",     price: 530,  category: "肉料理" },
  { code: "2403", name: "イタリアンハンバーグ",       price: 530,  category: "肉料理" },
  { code: "2406", name: "ハンバーグステーキ",         price: 430,  category: "肉料理" },
  { code: "2418", name: "ミックスグリル",             price: 690,  category: "肉料理" },
  { code: "2402", name: "若鶏のディアボラ風",         price: 530,  category: "肉料理" },
  { code: "2404", name: "柔らかチキンのチーズ焼き",   price: 530,  category: "肉料理" },
  { code: "2417", name: "ラム（仔羊）のランプステーキ", price: 1090, category: "肉料理" },
  // ビーフステーキは一部店舗のみ（ラムステーキの代わりに販売）。出したい場合は hide を false に
  { code: "2419", name: "ビーフステーキ",             price: 1090, category: "肉料理", hide: true, note: "販売店舗限定" },

  // ---------- デザート ----------
  { code: "3206", name: "イタリアンプリン",                 price: 270, category: "デザート" },
  { code: "3201", name: "ティラミス クラシコ",              price: 320, category: "デザート" },
  { code: "3212", name: "プリンとティラミス クラシコの盛合せ", price: 570, category: "デザート" },
  { code: "3205", name: "ミルクジェラート",                 price: 270, category: "デザート" },
  { code: "3207", name: "チョコレートケーキ",               price: 320, category: "デザート" },
  { code: "3216", name: "チョコレートケーキ&ミルクジェラート", price: 570, category: "デザート" },
  { code: "3213", name: "トリフアイスクリーム",             price: 370, category: "デザート" },
  { code: "3215", name: "コーヒーゼリー&ミルクジェラート",  price: 370, category: "デザート" },
  { code: "3214", name: "ジェラート&シナモンフォッカチオ",  price: 470, category: "デザート" },

  // ---------- お酒 ----------
  { code: "3402", name: "グラスワイン 白（120ml）",   price: 100,  category: "お酒" },
  { code: "3401", name: "グラスワイン 赤（120ml）",   price: 100,  category: "お酒" },
  { code: "3404", name: "デカンタ小 白（250ml）",     price: 200,  category: "お酒" },
  { code: "3403", name: "デカンタ小 赤（250ml）",     price: 200,  category: "お酒" },
  { code: "3406", name: "デカンタ大 白（500ml）",     price: 400,  category: "お酒" },
  { code: "3405", name: "デカンタ大 赤（500ml）",     price: 400,  category: "お酒" },
  { code: "3408", name: "マグナム 白（1500ml）",      price: 1100, category: "お酒" },
  { code: "3407", name: "マグナム 赤（1500ml）",      price: 1100, category: "お酒" },
  { code: "3413", name: "ドンラファエロ（ボトル）",   price: 1200, category: "お酒" },
  { code: "3412", name: "ランブルスコロゼ（ボトル）", price: 1200, category: "お酒" },
  { code: "3414", name: "ランブルスコセッコ（ボトル）", price: 1200, category: "お酒" },
  { code: "3415", name: "ベルデッキオ（ボトル）",     price: 1200, category: "お酒" },
  { code: "3416", name: "キャンティ（ボトル）",       price: 1200, category: "お酒" },
  { code: "3419", name: "キャンティ ルフィナ（ボトル）", price: 2400, category: "お酒" },
  { code: "3301", name: "生ビール キリン一番搾り（ジョッキ）", price: 390, category: "お酒" },
  { code: "3302", name: "生ビール キリン一番搾り（グラス）",   price: 280, category: "お酒" },
  { code: "3304", name: "キリン 氷結 シチリア産レモン", price: 370, category: "お酒" },
  { code: "3303", name: "アサヒ ドライゼロ（ノンアルコール）", price: 270, category: "お酒" },
  { code: "3306", name: "グラッパ（30ml）",           price: 320, category: "お酒" },

  // ---------- トッピング ----------
  { code: "4307", name: "トッピング粉チーズ",   price: 110, category: "トッピング" },
  { code: "4301", name: "トッピング半熟卵",     price: 60,  category: "トッピング" },
  { code: "4304", name: "トッピング野菜ソース", price: 110, category: "トッピング" },
];
