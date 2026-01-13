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

// Initialize SQLite Database
const db = new Database('nova88_users.db');
db.prepare(`CREATE TABLE IF NOT EXISTS users (
    telegram_id TEXT PRIMARY KEY,
    member_id TEXT,
    phone TEXT,
    external_username TEXT,
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

const GAME_URL = "https://m.nova8805.net/en?affCode=21093";
const BANNER_FILE = { source: path.join(__dirname, "images", "welcomebot.jpg") };
const BOT_VERSION = "DB-STABLE-012-FINAL";

const bot = new Telegraf(BOT_TOKEN);
const userState = new Map(); 

/**
 * =======================
 * 2) LATEST LANGUAGE PACK
 * =======================
 */
const texts = {
  en: { label: "🇺🇸 EN", welcomeTitle: "🌟 Welcome to Nova88 – Where Winning Never Sleeps! 🌟", welcomeBody: "🎉 Your Adventure Awaits:\n✅ No Registration Required\n✅ Instant Deposits & Withdrawals\n✅ 24/7 Support", menu: { play: "PLAY NOW & WIN", link: "🔗 Link Account" } },
  zh: { label: "🇨🇳 ZH", welcomeTitle: "🌟 欢迎来到 Nova88 — 全天候赢不停！🌟", welcomeBody: "🎉 精彩旅程即刻开启：\n✅ 无需注册，立即畅玩\n✅ 秒速存款 & 提现\n✅ 24/7 全天客服", menu: { play: "立即游戏", link: "🔗 绑定账号" } },
  th: { label: "🇹🇭 TH", welcomeTitle: "🌟 ยินดีต้อนรับสู่ Nova88 – ชนะได้ตลอด 24 ชม.! 🌟", welcomeBody: "🎉 เริ่มเล่นได้เลย:\n✅ ไม่ต้องสมัครสมาชิก\n✅ ฝาก-ถอนรวดเร็ว\n✅ ซัพพอร์ต 24/7", menu: { play: "เล่นเลยตอนนี้", link: "🔗 ผูกบัญชี" } },
  hi: { label: "🇮🇳 HI", welcomeTitle: "🌟 Nova88 में आपका स्वागत है – जीत कभी नहीं रुकती! 🌟", welcomeBody: "🎉 आपका रोमांच शुरू होता है:\n✅ बिना रजिस्ट्रेशन\n✅ तुरंत डिपॉज़िट और विदड्रॉ\n✅ 24/7 सपोर्ट", menu: { play: "अभी खेलें", link: "🔗 खाता जोड़ें" } },
  bd: { label: "🇧🇩 BN", welcomeTitle: "🌟 Nova88-এ স্বাগতম – জয় কখনো থামে না! 🌟", welcomeBody: "🎉 খেলা শুরু করুন:\n✅ রেজিস্ট্রেশন ছাড়াই খেলা\n✅ দ্রুত লেনদেন\n✅ 24/7 কাস্টমার সার্ভিস", menu: { play: "এখনই খেলুন", link: "🔗 অ্যাকাউন্ট লিঙ্ক" } },
  id: { label: "🇮🇩 ID", welcomeTitle: "🌟 Selamat Datang di Nova88 – Kemenangan Tiada Henti! 🌟", welcomeBody: "🎉 Petualangan Anda Dimulai:\n✅ Tanpa Registrasi\n✅ Deposit & WD Instan\n✅ Dukungan 24/7", menu: { play: "Main Sekarang", link: "🔗 Hubungkan Akun" } },
  vi: { label: "🇻🇳 VI", welcomeTitle: "🌟 Chào mừng đến với Nova88 – Thắng Lớn Mỗi Ngày! 🌟", welcomeBody: "🎉 Hành trình của bạn bắt đầu:\n✅ Không cần đăng ký\n✅ Nạp & Rút tức thì\n✅ Hỗ trợ 24/7", menu: { play: "Chơi Ngay", link: "🔗 Liên kết tài khoản" } }
};

/**
 * =======================
 * 3) DUAL KEYBOARD LOGIC
 * =======================
 */

// 1. INLINE KEYBOARD: Attached to the Image (Only URL/WebApp buttons allowed)
function getInlineKeyboard(ctx, user) {
  const m = L(ctx).menu;
  return Markup.inlineKeyboard([
    [Markup.button.webApp(`🎰 🔥 ${m.play} 🔥 🎰`, GAME_URL)],
    [Markup.button.callback(m.link, "link_account")]
  ]);
}

// 2. REPLY KEYBOARD: Bottom of screen (Required for Contact/Phone buttons)
function getReplyKeyboard(user) {
  const buttons = [];
  if (!user.phone) {
    buttons.push([Markup.button.contactRequest("📱 Verify Phone Number")]);
  }
  // 3-column abbreviated grid for languages
  buttons.push(["🇺🇸 EN", "🇨🇳 ZH", "🇹🇭 TH"]);
  buttons.push(["🇮🇳 HI", "🇧🇩 BN", "🇮🇩 ID", "🇻🇳 VI"]);
  return Markup.keyboard(buttons).resize();
}

/**
 * =======================
 * 4) HELPERS & CORE
 * =======================
 */
function getOrCreateUser(tgId) {
    let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(tgId.toString());
    if (!user) {
        const newMemberId = 'N88-' + Math.floor(10000 + Math.random() * 90000);
        db.prepare('INSERT INTO users (telegram_id, member_id) VALUES (?, ?)').run(tgId.toString(), newMemberId);
        user = { telegram_id: tgId.toString(), member_id: newMemberId, phone: null, external_username: null };
    }
    return user;
}

function L(ctx) {
  const code = ctx.from?.language_code?.split("-")[0] || "en";
  return texts[code] || texts.en;
}

async function sendWelcome(ctx) {
  const user = getOrCreateUser(ctx.from.id);
  const t = L(ctx);
  const caption = `${t.welcomeTitle}\n\n🆔 Member ID: <b>${user.member_id}</b>\n👤 Web Account: <b>${user.external_username || 'Not Linked'}</b>\n\n${t.welcomeBody}\n\n🧩 Version: ${BOT_VERSION}`;

  try {
    // Send Photo with Inline Keyboard
    await ctx.replyWithPhoto(BANNER_FILE, { 
      caption: caption, 
      parse_mode: 'HTML', 
      ...getInlineKeyboard(ctx, user) 
    });
    // Send separate message for the Reply Keyboard (solves 400 Bad Request error)
    await ctx.reply("Select a language or verify your phone below 👇", getReplyKeyboard(user));
  } catch (err) {
    console.error("❌ Send Error:", err.message);
  }
}

bot.start(sendWelcome);

bot.on('contact', async (ctx) => {
    db.prepare('UPDATE users SET phone = ? WHERE telegram_id = ?').run(ctx.message.contact.phone_number, ctx.from.id.toString());
    await ctx.reply("✅ Phone number verified!", Markup.removeKeyboard()); 
    await sendWelcome(ctx);
});

bot.action('link_account', (ctx) => {
    userState.set(ctx.from.id, 'AWAITING_USERNAME');
    return ctx.reply("Please type your Nova88 Website Username:");
});

bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    
    // Handle Username Linking
    if (userState.get(ctx.from.id) === 'AWAITING_USERNAME') {
        db.prepare('UPDATE users SET external_username = ? WHERE telegram_id = ?').run(text, ctx.from.id.toString());
        userState.delete(ctx.from.id);
        await ctx.reply(`✅ Linked to account: ${text}`);
        return sendWelcome(ctx);
    }

    // Handle Language Selection from Reply Keyboard
    const langKey = Object.keys(texts).find(k => texts[k].label === text);
    if (langKey) {
        await ctx.reply(`Language selected: ${text}`);
        return sendWelcome(ctx);
    }
});

bot.command('admin_report', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return ctx.reply("⛔ Access Denied.");
    const total = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const users = db.prepare('SELECT * FROM users ORDER BY join_date DESC LIMIT 5').all();
    let report = `📊 <b>Nova88 Admin Report</b>\n\nTotal Users: ${total}\n\nLatest Users:`;
    users.forEach(u => report += `\n🆔 ${u.member_id} | 📱 ${u.phone || '❌'} | 👤 ${u.external_username || '❌'}`);
    ctx.reply(report, { parse_mode: 'HTML' });
});

bot.launch().then(() => console.log("✅ Nova88 Database Bot Online and Fixed"));

// Graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));