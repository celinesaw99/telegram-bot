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
if (!BOT_TOKEN) throw new Error("❌ BOT_TOKEN missing in .env");

// Initialize Database
const db = new Database('nova88_users.db');
db.prepare(`CREATE TABLE IF NOT EXISTS users (
    telegram_id TEXT PRIMARY KEY,
    member_id TEXT,
    phone TEXT,
    external_username TEXT,
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

// URLs & Constants
const GAME_URL = "https://m.nova8805.net/en?affCode=21093";
const REFERRAL_URL = "https://m.nova88805.net/cs/join?AffId=6bl3wx9q";
const SUPPORT_URL = "https://direct.lc.chat/11638088/";
const CHANNEL_URL = "https://t.me/Nova_Promotion";
const BOT_USERNAME = "Nova88OfficialBot"; 
const BANNER_FILE = { source: path.join(__dirname, "images", "welcomebot.jpg") };
const BOT_VERSION = "DB-GRID-008-FINAL";
const DEFAULT_LANG = "en";

const bot = new Telegraf(BOT_TOKEN);
const userState = new Map(); // To track link-account flow
const userLang = new Map();

/**
 * =======================
 * 2) LANGUAGE PACK
 * =======================
 */
const texts = {
  en: {
    label: "🇺🇸 EN",
    welcomeTitle: "🌟 Welcome to Nova88! 🌟",
    welcomeBody: "🎉 Your Adventure Awaits:\n✅ No Registration Required\n✅ Instant Withdrawals\n✅ 24/7 Support",
    menu: { play: "PLAY NOW & WIN", referrals: "Referral", support: "Support", rewards: "Rewards", share: "Share", link: "🔗 Link Account" }
  },
  zh: {
    label: "🇨🇳 ZH",
    welcomeTitle: "🌟 欢迎来到 Nova88! 🌟",
    welcomeBody: "🎉 精彩旅程即刻开启：\n✅ 无需注册，立即畅玩\n✅ 秒速提现\n✅ 24/7 全天客服",
    menu: { play: "立即游戏", referrals: "邀请返佣", support: "在线客服", rewards: "领取奖励", share: "分享好友", link: "🔗 绑定账号" }
  },
  th: {
    label: "🇹🇭 TH",
    welcomeTitle: "🌟 ยินดีต้อนรับสู่ Nova88! 🌟",
    welcomeBody: "🎉 เริ่มเล่นได้เลย:\n✅ ไม่ต้องสมัครสมาชิก\n✅ ฝาก-ถอนรวดเร็ว\n✅ ซัพพอร์ต 24/7",
    menu: { play: "เล่นเลยตอนนี้", referrals: "แนะนำเพื่อน", support: "ซัพพอร์ต", rewards: "รับรางวัล", share: "แชร์ให้เพื่อน", link: "🔗 ผูกบัญชี" }
  },
  hi: {
    label: "🇮🇳 HI",
    welcomeTitle: "🌟 Nova88 में स्वागत है! 🌟",
    welcomeBody: "🎉 आपका रोमांच शुरू होता है:\n✅ बिना रजिस्ट्रेशन\n✅ तुरंत निकासी\n✅ 24/7 सपोर्ट",
    menu: { play: "अभी खेलें", referrals: "रेफ़रल", support: "सपोर्ट", rewards: "रिवॉर्ड", share: "शेयर करें", link: "🔗 खाता जोड़ें" }
  },
  bd: {
    label: "🇧🇩 BN",
    welcomeTitle: "🌟 Nova88-এ স্বাগতম! 🌟",
    welcomeBody: "🎉 খেলা শুরু করুন:\n✅ রেজিস্ট্রেশন ছাড়াই খেলা\n✅ দ্রুত লেনদেন\n✅ 24/7 কাস্টমার সার্ভিস",
    menu: { play: "এখনই খেলুন", referrals: "রেফারেল", support: "সোপোর্ট", rewards: "পুরস্কার", share: "শেয়ার করুন", link: "🔗 অ্যাকাউন্ট লিঙ্ক" }
  },
  id: {
    label: "🇮🇩 ID",
    welcomeTitle: "🌟 Selamat Datang di Nova88! 🌟",
    welcomeBody: "🎉 Petualangan Anda:\n✅ Tanpa Registrasi\n✅ WD Instan\n✅ Dukungan 24/7",
    menu: { play: "Main Sekarang", referrals: "Referral", support: "Dukungan", rewards: "Hadiah", share: "Bagikan", link: "🔗 Hubungkan Akun" }
  },
  vi: {
    label: "🇻🇳 VI",
    welcomeTitle: "🌟 Chào mừng đến với Nova88! 🌟",
    welcomeBody: "🎉 Hành trình của bạn:\n✅ Không cần đăng ký\n✅ Nạp & Rút tức thì\n✅ Hỗ trợ 24/7",
    menu: { play: "Chơi Ngay", referrals: "Giới thiệu", support: "Hỗ trợ", rewards: "Phần thưởng", share: "Chia sẻ", link: "🔗 Liên kết tài khoản" }
  }
};

/**
 * =======================
 * 3) HELPERS & DATABASE LOGIC
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

function getLang(ctx) {
  if (userLang.has(ctx.from?.id)) return userLang.get(ctx.from.id);
  const browserLang = ctx.from?.language_code?.split("-")[0];
  return texts[browserLang] ? browserLang : DEFAULT_LANG;
}

function L(ctx) { return texts[getLang(ctx)]; }

function languageGrid() {
  const codes = Object.keys(texts);
  const rows = [];
  for (let i = 0; i < codes.length; i += 3) {
    const trio = codes.slice(i, i + 3).map(code => 
      Markup.button.callback(texts[code].label, `lang_${code}`)
    );
    rows.push(trio);
  }
  return rows;
}

function mainMenuKeyboard(ctx, user) {
  const m = L(ctx).menu;
  const buttons = [
    [Markup.button.webApp(`🎰 🔥 ${m.play} 🔥 🎰`, GAME_URL)],
    [Markup.button.url(`🚀 ${m.share}`, `https://t.me/share/url?url=t.me/${BOT_USERNAME}`)]
  ];

  // Logic to show/hide verification buttons
  if (!user.phone) {
    buttons.push([Markup.button.contactRequest("📱 Verify Phone Number")]);
  }
  if (!user.external_username) {
    buttons.push([Markup.button.callback(m.link, "link_account")]);
  }

  buttons.push([
    Markup.button.url(`🎧 ${m.support}`, SUPPORT_URL),
    Markup.button.url(`🤝 ${m.referrals}`, REFERRAL_URL)
  ]);
  
  buttons.push([Markup.button.url(`🧧 ${m.rewards}`, CHANNEL_URL)]);
  return Markup.inlineKeyboard([...buttons, ...languageGrid()]);
}

/**
 * =======================
 * 4) BOT ACTIONS
 * =======================
 */
async function sendWelcome(ctx) {
  const user = getOrCreateUser(ctx.from.id);
  const t = L(ctx);
  const caption = `${t.welcomeTitle}\n\n🆔 Member ID: <b>${user.member_id}</b>\n👤 Web Account: <b>${user.external_username || 'Not Linked'}</b>\n\n${t.welcomeBody}\n\n🧩 Version: ${BOT_VERSION}`;

  try {
    await ctx.replyWithPhoto(BANNER_FILE, { 
      caption: caption,
      parse_mode: 'HTML',
      ...mainMenuKeyboard(ctx, user)
    });
  } catch (err) {
    console.error("❌ Send Error:", err.description || err.message); 
    await ctx.reply(caption, { parse_mode: 'HTML', ...mainMenuKeyboard(ctx, user) });
  }
}

bot.start(sendWelcome);

// Handle Account Linking
bot.action('link_account', async (ctx) => {
    userState.set(ctx.from.id, 'AWAITING_USERNAME');
    await ctx.reply("Please type your Nova88 Website Username:");
});

// Handle Phone Contact
bot.on('contact', async (ctx) => {
    const phone = ctx.message.contact.phone_number;
    db.prepare('UPDATE users SET phone = ? WHERE telegram_id = ?').run(phone, ctx.from.id.toString());
    await ctx.reply("✅ Phone number verified!");
    await sendWelcome(ctx);
});

// Handle Text Inputs (Usernames)
bot.on('text', async (ctx) => {
    if (userState.get(ctx.from.id) === 'AWAITING_USERNAME') {
        const username = ctx.message.text;
        db.prepare('UPDATE users SET external_username = ? WHERE telegram_id = ?').run(username, ctx.from.id.toString());
        userState.delete(ctx.from.id);
        await ctx.reply(`✅ Linked to account: ${username}`);
        await sendWelcome(ctx);
    }
});

// Handle Language Switches
Object.keys(texts).forEach((code) => {
  bot.action(`lang_${code}`, async (ctx) => {
    userLang.set(ctx.from.id, code);
    await ctx.answerCbQuery();
    try { await ctx.deleteMessage(); } catch (e) {}
    await sendWelcome(ctx);
  });
});

/**
 * =======================
 * 5) LAUNCH
 * =======================
 */
(async () => {
  await bot.launch({ dropPendingUpdates: true });
  console.log(`✅ Nova88 Database Bot Active: ${Object.keys(texts).length} Languages`);
})();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));