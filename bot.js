require("dotenv").config();
const { Telegraf, Markup, Input } = require("telegraf");
const path = require("path");
const Database = require('better-sqlite3');

/**
 * =======================
 * 1) CONFIG & DATABASE
 * =======================
 */
const BOT_TOKEN = process.env.BOT_TOKEN;

const ADMIN_IDS = [
  6674020266,
  1382562949,
  1264629047,
  6256931897,
  8469468119
];

const CHANNEL_USERNAME = "@Nova88_News";

if (!BOT_TOKEN) throw new Error("❌ BOT_TOKEN missing in .env");

const db = new Database('nova88_users.db');
db.prepare(`CREATE TABLE IF NOT EXISTS users (
  telegram_id TEXT PRIMARY KEY,
  member_id TEXT,
  referred_by TEXT,
  referral_count INTEGER DEFAULT 0,
  join_date DATETIME DEFAULT (datetime('now', '+8 hours'))
)`).run();

// ── URLs ──────────────────────────────────────────────
const PLAY_URL     = "https://www.nova88mas106.com/en/join?affCode=42834";
const PROMO_URL    = "https://www.nova88mas106.com/en/join?affCode=42834";
const SHARE_URL    = "https://www.nova88mas106.com/en/join?affCode=42834";
const SUPPORT_URL  = "https://direct.lc.chat/11638088/";
const DOMAINS_URL  = "https://help.n88backup.com/";
const STREAM_URL   = "https://www.velosportstv.com/index.html#/Home";
const PREDICT_URL  = "https://sabalivescore.com/";
const VN_BOT_URL   = "https://t.me/nova88lixi";

const BANNER_FILE  = { source: path.join(__dirname, "images", "welcomebot.jpg") };

const bot = new Telegraf(BOT_TOKEN);

/**
 * =======================
 * 2) LANGUAGE PACK
 * =======================
 */
const texts = {

  // ── ENGLISH ──────────────────────────────────────────
  en: {
    welcome: "👋 Welcome! To initiate the bot, please join our official channel first:",
    title:
      "🌟 *Welcome to Nova88 — Asia's #1 Online Casino!* 🌟",
    body:
      "🎉 We've just upgraded our bot with exciting new features!\n\n" +
      "🔗 *Backup Domain:* [help.n88backup.com](https://help.n88backup.com/)\n\n" +
      "✅ No Registration Required!\n" +
      "✅ Instant Deposits & Withdrawals!\n\n" +
      "📰 Updates: @Nova88\\_News\n" +
      "🎁 Promotions: @Nova\\_Promotion",
    play:      "🎮 Play Now",
    promo:     "🎁 Promotion",
    share:     "💰 Share & Earn",
    support:   "🎧 Support",
    domains:   "🔗 Domains",
    stream:    "📺 Live Stream",
    predict:   "⚽ Prediction",
    langRow1:  ["🇬🇧 EN", "🇨🇳 中文", "🇹🇭 ไทย"],
    langRow2:  ["🇮🇩 ID",  "🇧🇩 বাং",  "🇻🇳 VI"],
  },

  // ── CHINESE ──────────────────────────────────────────
  cn: {
    welcome: "👋 欢迎！在使用机器人之前，请先加入我们的官方频道：",
    title:
      "🌟 *欢迎来到 Nova88 — 亚洲第一在线赌场！* 🌟",
    body:
      "🎉 我们的机器人已全面升级，新增多项精彩功能！\n\n" +
      "🔗 *备用域名：* [help.n88backup.com](https://help.n88backup.com/)\n\n" +
      "✅ 无需注册 — 立即畅玩！\n" +
      "✅ 秒速存款 & 提现！\n\n" +
      "📰 最新动态: @Nova88\\_News\n" +
      "🎁 促销奖励: @Nova\\_Promotion",
    play:      "🎮 立即游玩",
    promo:     "🎁 优惠活动",
    share:     "💰 分享赚钱",
    support:   "🎧 在线客服",
    domains:   "🔗 备用域名",
    stream:    "📺 直播",
    predict:   "⚽ 赛事预测",
    langRow1:  ["🇬🇧 EN", "🇨🇳 中文", "🇹🇭 ไทย"],
    langRow2:  ["🇮🇩 ID",  "🇧🇩 বাং",  "🇻🇳 VI"],
  },

  // ── THAI ─────────────────────────────────────────────
  th: {
    welcome: "👋 ยินดีต้อนรับ! กรุณาเข้าร่วมช่องทางการของเราก่อนเพื่อเริ่มใช้งาน:",
    title:
      "🌟 *ยินดีต้อนรับสู่ Nova88 — คาสิโนออนไลน์อันดับ 1 ในเอเชีย!* 🌟",
    body:
      "🎉 เราได้อัปเกรดบอทพร้อมฟีเจอร์ใหม่ที่น่าตื่นเต้น!\n\n" +
      "🔗 *โดเมนสำรอง:* [help.n88backup.com](https://help.n88backup.com/)\n\n" +
      "✅ ไม่ต้องสมัครสมาชิก!\n" +
      "✅ ฝาก-ถอนรวดเร็ว!\n\n" +
      "📰 อัปเดตล่าสุด: @Nova88\\_News\n" +
      "🎁 โปรโมชั่น: @Nova\\_Promotion",
    play:      "🎮 เล่นเลย",
    promo:     "🎁 โปรโมชั่น",
    share:     "💰 แชร์และรับเงิน",
    support:   "🎧 ซัพพอร์ต",
    domains:   "🔗 โดเมนสำรอง",
    stream:    "📺 ถ่ายทอดสด",
    predict:   "⚽ ทำนายผล",
    langRow1:  ["🇬🇧 EN", "🇨🇳 中文", "🇹🇭 ไทย"],
    langRow2:  ["🇮🇩 ID",  "🇧🇩 বাং",  "🇻🇳 VI"],
  },

  // ── INDONESIAN ───────────────────────────────────────
  id: {
    welcome: "👋 Selamat datang! Untuk memulai, silakan bergabung dengan saluran resmi kami:",
    title:
      "🌟 *Selamat Datang di Nova88 — Kasino Online #1 di Asia!* 🌟",
    body:
      "🎉 Kami baru saja memperbarui bot dengan fitur-fitur baru yang keren!\n\n" +
      "🔗 *Domain Cadangan:* [help.n88backup.com](https://help.n88backup.com/)\n\n" +
      "✅ Tanpa Registrasi!\n" +
      "✅ Deposit & Penarikan Instan!\n\n" +
      "📰 Update: @Nova88\\_News\n" +
      "🎁 Promo: @Nova\\_Promotion",
    play:      "🎮 Main Sekarang",
    promo:     "🎁 Promosi",
    share:     "💰 Bagikan & Hasilkan",
    support:   "🎧 Dukungan",
    domains:   "🔗 Domain Cadangan",
    stream:    "📺 Siaran Langsung",
    predict:   "⚽ Prediksi",
    langRow1:  ["🇬🇧 EN", "🇨🇳 中文", "🇹🇭 ไทย"],
    langRow2:  ["🇮🇩 ID",  "🇧🇩 বাং",  "🇻🇳 VI"],
  },

  // ── BENGALI (Bangladesh) ─────────────────────────────
  bd: {
    welcome: "👋 স্বাগতম! শুরু করতে, দয়া করে প্রথমে আমাদের অফিসিয়াল চ্যানেলে যোগ দিন:",
    title:
      "🌟 *Nova88-তে স্বাগতম — এশিয়ার #1 অনলাইন ক্যাসিনো!* 🌟",
    body:
      "🎉 আমরা দুর্দান্ত নতুন ফিচার সহ বট আপগ্রেড করেছি!\n\n" +
      "🔗 *ব্যাকআপ ডোমেইন:* [help.n88backup.com](https://help.n88backup.com/)\n\n" +
      "✅ রেজিস্ট্রেশন ছাড়াই খেলুন!\n" +
      "✅ তাৎক্ষণিক জমা ও উত্তোলন!\n\n" +
      "📰 আপডেট: @Nova88\\_News\n" +
      "🎁 অফার: @Nova\\_Promotion",
    play:      "🎮 এখনই খেলুন",
    promo:     "🎁 প্রমোশন",
    share:     "💰 শেয়ার ও আয় করুন",
    support:   "🎧 সাপোর্ট",
    domains:   "🔗 ব্যাকআপ ডোমেইন",
    stream:    "📺 লাইভ স্ট্রিম",
    predict:   "⚽ পূর্বাভাস",
    langRow1:  ["🇬🇧 EN", "🇨🇳 中文", "🇹🇭 ไทย"],
    langRow2:  ["🇮🇩 ID",  "🇧🇩 বাং",  "🇻🇳 VI"],
  },
};

/**
 * =======================
 * 3) CORE LOGIC
 * =======================
 */

async function checkMembership(ctx) {
  try {
    const member = await ctx.telegram.getChatMember(CHANNEL_USERNAME, ctx.from.id);
    return ["member", "administrator", "creator"].includes(member.status);
  } catch (e) { return true; }
}

function getOrCreateUser(tgId, referrerId = null) {
  let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(tgId.toString());
  if (!user) {
    const mid = 'N88-' + Math.floor(10000 + Math.random() * 90000);
    db.prepare('INSERT INTO users (telegram_id, member_id, referred_by) VALUES (?, ?, ?)').run(tgId.toString(), mid, referrerId);
    if (referrerId && referrerId !== tgId.toString()) {
      db.prepare('UPDATE users SET referral_count = referral_count + 1 WHERE telegram_id = ?').run(referrerId);
    }
    user = { telegram_id: tgId.toString(), member_id: mid, referral_count: 0 };
  }
  return user;
}

/**
 * =======================
 * 4) KEYBOARD BUILDER
 * =======================
 */

function getMenuKeyboard(lang) {
  return Markup.inlineKeyboard([
    // Row 1 — Play Now (full width)
    [
      Markup.button.url(lang.play, PLAY_URL),
    ],
    // Row 2 — Promotion + Share & Earn
    [
      Markup.button.url(lang.promo,   PROMO_URL),
      Markup.button.url(lang.share,   SHARE_URL),
    ],
    // Row 3 — Support + Domains
    [
      Markup.button.url(lang.support, SUPPORT_URL),
      Markup.button.url(lang.domains, DOMAINS_URL),
    ],
    // Row 4 — Live Stream + Prediction
    [
      Markup.button.url(lang.stream,  STREAM_URL),
      Markup.button.url(lang.predict, PREDICT_URL),
    ],
    // Row 5 — Language buttons (top row)
    [
      Markup.button.callback("🇬🇧 EN",   "lang_en"),
      Markup.button.callback("🇨🇳 中文",  "lang_cn"),
      Markup.button.callback("🇹🇭 ไทย",  "lang_th"),
    ],
    // Row 6 — Language buttons (bottom row) — VI redirects to external bot
    [
      Markup.button.callback("🇮🇩 ID",   "lang_id"),
      Markup.button.callback("🇧🇩 বাং",  "lang_bd"),
      Markup.button.url("🇻🇳 VI",        VN_BOT_URL),
    ],
  ]);
}

/**
 * =======================
 * 5) SEND UI
 * =======================
 */

async function sendUI(ctx, langCode = 'en') {
  const user = getOrCreateUser(ctx.from.id);
  const lang = texts[langCode] || texts.en;

  const caption =
    `${lang.title}\n\n` +
    `🆔 Member ID: *${user.member_id}*\n` +
    `👥 Friends Invited: *${user.referral_count}*\n\n` +
    `${lang.body}`;

  try {
    await ctx.replyWithPhoto(BANNER_FILE, {
      caption:    caption,
      parse_mode: 'Markdown',
      ...getMenuKeyboard(lang),
    });
  } catch (err) {
    console.error("❌ UI Error:", err.message);
  }
}

/**
 * =======================
 * 6) COMMANDS & ACTIONS
 * =======================
 */

// /start
bot.start(async (ctx) => {
  const isMember = await checkMembership(ctx);
  if (!isMember) {
    return ctx.reply(
      texts.en.welcome,
      Markup.inlineKeyboard([
        [Markup.button.url("📢 Join Nova88 News", "https://t.me/Nova88_News")],
        [Markup.button.callback("✅ I have joined", "check_again")]
      ])
    );
  }
  const payload = ctx.startPayload;
  const refId   = (payload && payload !== ctx.from.id.toString()) ? payload : null;
  getOrCreateUser(ctx.from.id, refId);
  return sendUI(ctx, 'en');
});

// Admin CSV report
bot.command('admin_report', async (ctx) => {
  if (!ADMIN_IDS.includes(ctx.from.id)) return;
  try {
    const rows = db.prepare('SELECT * FROM users').all();
    if (rows.length === 0) return await ctx.reply("📊 Database is empty.");

    const headers   = "Telegram ID,Member ID,Referred By,Referral Count,Join Date (GMT+8)\n";
    const csvString = headers + rows.map(row =>
      `${row.telegram_id},${row.member_id},${row.referred_by || 'None'},${row.referral_count},${row.join_date}`
    ).join("\n");

    await ctx.replyWithDocument(
      Input.fromBuffer(Buffer.from(csvString), 'nova88_report_gmt8.csv'),
      {
        caption:    `📊 **Nova88 Report (GMT+8)**\nTotal Users: ${rows.length}`,
        parse_mode: 'Markdown'
      }
    );
  } catch (err) {
    await ctx.reply("❌ Error generating CSV: " + err.message);
  }
});

// Check membership after joining channel
bot.action("check_again", async (ctx) => {
  const isMember = await checkMembership(ctx);
  if (isMember) {
    try { await ctx.deleteMessage(); } catch(e) {}
    return sendUI(ctx, 'en');
  } else {
    return ctx.answerCbQuery("❌ Join @Nova88_News first!", { show_alert: true });
  }
});

// Language switcher
bot.action(/lang_(.+)/, async (ctx) => {
  const langCode = ctx.match[1];
  await ctx.answerCbQuery();
  try { await ctx.deleteMessage(); } catch(e) {}
  await sendUI(ctx, langCode);
});

// Bot commands menu
bot.telegram.setMyCommands([
  { command: 'start', description: '🚀 Open Nova88 Menu' }
]);

bot.launch().then(() => console.log("✅ Nova88 v39 Active - GMT+8 Timezone Locked"));