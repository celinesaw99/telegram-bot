require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const path = require("path");
const Database = require('better-sqlite3');

// 1. DATABASE & CONFIG
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = 6674020266; // Set from your logs
const db = new Database('nova88_users.db');
db.prepare(`CREATE TABLE IF NOT EXISTS users (
    telegram_id TEXT PRIMARY KEY, member_id TEXT, phone TEXT, 
    external_username TEXT, join_date DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

const GAME_URL = "https://m.nova8805.net/en?affCode=21093";
const BANNER_FILE = { source: path.join(__dirname, "images", "welcomebot.jpg") };
const bot = new Telegraf(BOT_TOKEN);
const userState = new Map();

// 2. LATEST LANGUAGE PACK
const texts = {
  en: { label: "🇺🇸 EN", welcomeTitle: "🌟 Welcome to Nova88 – Where Winning Never Sleeps! 🌟", welcomeBody: "🎉 Your Adventure Awaits:\n✅ No Registration Required\n✅ Instant Deposits & Withdrawals\n✅ 24/7 Support", menu: { play: "PLAY NOW & WIN", link: "🔗 Link Account" } },
  zh: { label: "🇨🇳 ZH", welcomeTitle: "🌟 欢迎来到 Nova88 — 全天候赢不停！🌟", welcomeBody: "🎉 精彩旅程即刻开启：\n✅ 无需注册，立即畅玩\n✅ 秒速存款 & 提现\n✅ 24/7 全天客服", menu: { play: "立即游戏", link: "🔗 绑定账号" } },
  th: { label: "🇹🇭 TH", welcomeTitle: "🌟 ยินดีต้อนรับสู่ Nova88 – ชนะได้ตลอด 24 ชม.! 🌟", welcomeBody: "🎉 เริ่มเล่นได้เลย:\n✅ ไม่ต้องสมัครสมาชิก\n✅ ฝาก-ถอนรวดเร็ว\n✅ ซัพพอร์ต 24/7", menu: { play: "เล่นเลยตอนนี้", link: "🔗 ผูกบัญชี" } },
  hi: { label: "🇮🇳 HI", welcomeTitle: "🌟 Nova88 में आपका स्वागत है – जीत कभी नहीं रुकती! 🌟", welcomeBody: "🎉 आपका रोमांच शुरू होता है:\n✅ बिना रजिस्ट्रेशन\n✅ तुरंत डिपॉज़िट और विदड्रॉ\n✅ 24/7 सपोर्ट", menu: { play: "अभी खेलें", link: "🔗 खाता जोड़ें" } },
  bd: { label: "🇧🇩 BN", welcomeTitle: "🌟 Nova88-এ স্বাগতম – জয় কখনো থামে না! 🌟", welcomeBody: "🎉 খেলা শুরু করুন:\n✅ রেজিস্ট্রেশন ছাড়াই খেলা\n✅ দ্রুত লেনদেন\n✅ 24/7 কাস্টমার সার্ভিস", menu: { play: "এখনই খেলুন", link: "🔗 অ্যাকাউন্ট লিঙ্ক" } },
  id: { label: "🇮🇩 ID", welcomeTitle: "🌟 Selamat Datang di Nova88 – Kemenangan Tiada Henti! 🌟", welcomeBody: "🎉 Petualangan Anda Dimulai:\n✅ Tanpa Registrasi\n✅ Deposit & WD Instan\n✅ Dukungan 24/7", menu: { play: "Main Sekarang", link: "🔗 Hubungkan Akun" } },
  vi: { label: "🇻🇳 VI", welcomeTitle: "🌟 Chào mừng đến với Nova88 – Thắng Lớn Mỗi Ngày! 🌟", welcomeBody: "🎉 Hành trình của bạn bắt đầu:\n✅ Không cần đăng ký\n✅ Nạp & Rút tức thì\n✅ Hỗ trợ 24/7", menu: { play: "Chơi Ngay", link: "🔗 Liên kết tài khoản" } }
};

// 3. KEYBOARD FUNCTIONS
function getInline(ctx, user) {
  const m = L(ctx).menu;
  return Markup.inlineKeyboard([
    [Markup.button.webApp(`🎰 🔥 ${m.play} 🔥 🎰`, GAME_URL)],
    [Markup.button.callback(m.link, "link_account")]
  ]);
}

function getReply(user) {
  const btns = [];
  if (!user.phone) btns.push([Markup.button.contactRequest("📱 Verify Phone Number")]);
  btns.push(["🇺🇸 EN", "🇨🇳 ZH", "🇹🇭 TH"], ["🇮🇳 HI", "🇧🇩 BN", "🇮🇩 ID", "🇻🇳 VI"]);
  return Markup.keyboard(btns).resize();
}

// 4. CORE LOGIC
function L(ctx) {
  const code = ctx.from?.language_code?.split("-")[0] || "en";
  return texts[code] || texts.en;
}

function getOrCreateUser(tgId) {
  let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(tgId.toString());
  if (!user) {
    const mid = 'N88-' + Math.floor(10000 + Math.random() * 90000);
    db.prepare('INSERT INTO users (telegram_id, member_id) VALUES (?, ?)').run(tgId.toString(), mid);
    user = { telegram_id: tgId.toString(), member_id: mid, phone: null, external_username: null };
  }
  return user;
}

async function sendWelcome(ctx) {
  const user = getOrCreateUser(ctx.from.id);
  const t = L(ctx);
  const caption = `${t.welcomeTitle}\n\n🆔 Member ID: <b>${user.member_id}</b>\n👤 Web Account: <b>${user.external_username || 'Not Linked'}</b>\n\n${t.welcomeBody}\n\n🧩 Version: STABLE-010`;
  try {
    await ctx.replyWithPhoto(BANNER_FILE, { caption, parse_mode: 'HTML', ...getInline(ctx, user) });
    await ctx.reply("Please verify your phone or select language below:", getReply(user));
  } catch (e) { console.error("UI Error:", e.message); }
}

bot.start(sendWelcome);
bot.on('contact', async (ctx) => {
  db.prepare('UPDATE users SET phone = ? WHERE telegram_id = ?').run(ctx.message.contact.phone_number, ctx.from.id.toString());
  await ctx.reply("✅ Phone verified!");
  return sendWelcome(ctx);
});
bot.action('link_account', (ctx) => {
  userState.set(ctx.from.id, 'WAIT');
  return ctx.reply("Type your Nova88 Website Username:");
});
bot.on('text', async (ctx) => {
  if (userState.get(ctx.from.id) === 'WAIT') {
    db.prepare('UPDATE users SET external_username = ? WHERE telegram_id = ?').run(ctx.message.text, ctx.from.id.toString());
    userState.delete(ctx.from.id);
    await ctx.reply("✅ Linked!");
    return sendWelcome(ctx);
  }
  const lang = Object.entries(texts).find(([c, v]) => v.label === ctx.message.text);
  if (lang) return sendWelcome(ctx);
});
bot.command('admin_report', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  const total = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  ctx.reply(`📊 Total Users: ${total}`, { parse_mode: 'HTML' });
});

bot.launch().then(() => console.log("✅ Bot Online - DB Active"));