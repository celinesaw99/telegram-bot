require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const path = require("path");
const Database = require('better-sqlite3');

/**
 * =======================
 * 1) CONFIG & DATABASE
 * =======================
 */
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = 6674020266; // Your ID from the logs

if (!BOT_TOKEN) throw new Error("❌ BOT_TOKEN missing in .env");

// Initialize Database
const db = new Database('nova88_users.db');
db.prepare(`CREATE TABLE IF NOT EXISTS users (
    telegram_id TEXT PRIMARY KEY,
    member_id TEXT,
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

const GAME_URL = "https://m.nova8805.net/en?affCode=21093";
const BANNER_FILE = { source: path.join(__dirname, "images", "welcomebot.jpg") };
const BOT_VERSION = "DB-LATEST-014-FINAL";

const bot = new Telegraf(BOT_TOKEN);

/**
 * =======================
 * 2) LATEST LANGUAGE PACK
 * =======================
 */
const texts = {
  en: {
    label: "🇺🇸 EN",
    welcomeTitle: "🌟 Welcome to Nova88 – Where Winning Never Sleeps! 🌟",
    welcomeBody: "🎉 Your Adventure Awaits:\n✅ No Registration Required\n✅ Instant Deposits & Withdrawals\n✅ 24/7 Support",
    menu: { play: "PLAY NOW & WIN" }
  },
  zh: {
    label: "🇨🇳 ZH",
    welcomeTitle: "🌟 欢迎来到 Nova88 — 全天候赢不停！🌟",
    welcomeBody: "🎉 精彩旅程即刻开启：\n✅ 无需注册，立即畅玩\n✅ 秒速存款 & 提现\n✅ 24/7 全天客服",
    menu: { play: "立即游戏" }
  },
  th: {
    label: "🇹🇭 TH",
    welcomeTitle: "🌟 ยินดีต้อนรับสู่ Nova88 – ชนะได้ตลอด 24 ชม.! 🌟",
    welcomeBody: "🎉 เริ่มเล่นได้เลย:\n✅ ไม่ต้องสมัครสมาชิก\n✅ ฝาก-ถอนรวดเร็ว\n✅ ซัพพอร์ต 24/7",
    menu: { play: "เล่นเลยตอนนี้" }
  },
  hi: {
    label: "🇮🇳 HI",
    welcomeTitle: "🌟 Nova88 में आपका स्वागत है – जीत कभी नहीं रुकती! 🌟",
    welcomeBody: "🎉 आपका रोमांच शुरू होता है:\n✅ बिना रजिस्ट्रेशन\n✅ तुरंत डिपॉज़िट और विदड्रॉ\n✅ 24/7 सपोर्ट",
    menu: { play: "अभी खेलें" }
  },
  bd: {
    label: "🇧🇩 BN",
    welcomeTitle: "🌟 Nova88-এ স্বাগতম – জয় কখনো থামে না! 🌟",
    welcomeBody: "🎉 খেলা শুরু করুন:\n✅ রেজিস্ট্রেশন ছাড়াই খেলা\n✅ দ্রুত লেনদেন\n✅ 24/7 কাস্টমার সার্ভিস",
    menu: { play: "এখনই খেলুন" }
  },
  id: {
    label: "🇮🇩 ID",
    welcomeTitle: "🌟 Selamat Datang di Nova88 – Kemenangan Tiada Henti! 🌟",
    welcomeBody: "🎉 Petualangan Anda Dimulai:\n✅ Tanpa Registrasi\n✅ Deposit & WD Instan\n✅ Dukungan 24/7",
    menu: { play: "Main Sekarang" }
  },
  vi: {
    label: "🇻🇳 VI",
    welcomeTitle: "🌟 Chào mừng đến với Nova88 – Thắng Lớน Mỗi Ngày! 🌟",
    welcomeBody: "🎉 Hành trình của bạn bắt đầu:\n✅ Không cần đăng ký\n✅ Nạp & Rút tức thì\n✅ Hỗ trợ 24/7",
    menu: { play: "Chơi Ngay" }
  }
};

/**
 * =======================
 * 3) SAFE UI LOGIC
 * =======================
 */

function L(ctx) {
  const code = ctx.from?.language_code?.split("-")[0] || "en";
  return texts[code] || texts.en;
}

function getGrid(ctx) {
  const m = L(ctx).menu;
  return Markup.inlineKeyboard([
    [Markup.button.webApp(`🎰 🔥 ${m.play} 🔥 🎰`, GAME_URL)],
    [Markup.button.callback("🇺🇸 EN", "lang_en"), Markup.button.callback("🇨🇳 ZH", "lang_zh"), Markup.button.callback("🇹🇭 TH", "lang_th")],
    [Markup.button.callback("🇮🇳 HI", "lang_hi"), Markup.button.callback("🇧🇩 BN", "lang_bd"), Markup.button.callback("🇮🇩 ID", "lang_id")],
    [Markup.button.callback("🇻🇳 VI", "lang_vi")]
  ]);
}

function getOrCreateUser(tgId) {
    let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(tgId.toString());
    if (!user) {
        const mid = 'N88-' + Math.floor(10000 + Math.random() * 90000);
        db.prepare('INSERT INTO users (telegram_id, member_id) VALUES (?, ?)').run(tgId.toString(), mid);
        user = { telegram_id: tgId.toString(), member_id: mid };
    }
    return user;
}

async function sendWelcome(ctx) {
  const user = getOrCreateUser(ctx.from.id);
  const t = L(ctx);
  const caption = `${t.welcomeTitle}\n\n🆔 Member ID: <b>${user.member_id}</b>\n\n${t.welcomeBody}\n\n🧩 Version: ${BOT_VERSION}`;

  try {
    await ctx.replyWithPhoto(BANNER_FILE, { 
      caption: caption, 
      parse_mode: 'HTML', 
      ...getGrid(ctx) 
    });
  } catch (err) {
    console.error("❌ Send Error:", err.message);
  }
}

bot.start(sendWelcome);

// Handle Language Switch buttons
Object.keys(texts).forEach((code) => {
  bot.action(`lang_${code}`, async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await ctx.deleteMessage(); // Clear old message to update language
        await sendWelcome(ctx);
    } catch (e) {
        await sendWelcome(ctx);
    }
  });
});

bot.launch().then(() => console.log("✅ Nova88 Final Bot Active"));