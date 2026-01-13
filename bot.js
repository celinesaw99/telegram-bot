require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const path = require("path");

/**
 * =======================
 * 1) CONFIG & PATHS
 * =======================
 */
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("❌ BOT_TOKEN missing in .env");

const GAME_URL = "https://m.nova8805.net/en?affCode=21093";
const REFERRAL_URL = "https://m.nova88805.net/cs/join?AffId=6bl3wx9q";
const SUPPORT_URL = "https://direct.lc.chat/11638088/";
const CHANNEL_URL = "https://t.me/Nova_Promotion";
const BOT_USERNAME = "Nova88OfficialBot"; 

const SHARE_TEXT = encodeURIComponent("Join me on Nova88! Instant withdrawals and huge rewards! 🎰");
const SHARE_URL = `https://t.me/share/url?url=https://t.me/${BOT_USERNAME}&text=${SHARE_TEXT}`;

const BANNER_FILE = { source: path.join(__dirname, "images", "welcomebot.jpg") };

const bot = new Telegraf(BOT_TOKEN);
const BOT_VERSION = "VPS-2026-01-13-AUTO-LANG-GRID-006";
const DEFAULT_LANG = "en";
const userLang = new Map();

/**
 * =======================
 * 2) FULL LANGUAGE PACK
 * =======================
 */
const texts = {
  en: {
    flag: "🇺🇸", name: "English",
    welcomeTitle: "🌟 Welcome to Nova88 – Where Winning Never Sleeps! 🌟",
    welcomeBody: "🎉 Your Adventure Awaits:\n✅ No Registration Required\n✅ Instant Deposits & Withdrawals\n✅ 24/7 Support",
    chooseOption: "Please choose an option 👇",
    langSet: "Language set to English.",
    menu: { play: "🎮 Play Now 🎮", referrals: "🧑‍🤝‍🧑 Referral", support: "🛃 Support", rewards: "🧧 Rewards", share: "🚀 Share" }
  },
  zh: {
    flag: "🇨🇳", name: "简体中文",
    welcomeTitle: "🌟 欢迎来到 Nova88 — 全天候赢不停！🌟",
    welcomeBody: "🎉 精彩旅程即刻开启：\n✅ 无需注册，立即畅玩\n✅ 秒速存款 & 提现\n✅ 24/7 全天客服",
    chooseOption: "请选择操作 👇",
    langSet: "语言已切换为简体中文。",
    menu: { play: "🎮 立即游戏 🎮", referrals: "邀请返佣", support: "在线客服", rewards: "领取奖励", share: "🚀 分享给好友" }
  },
  th: {
    flag: "🇹🇭", name: "ไทย",
    welcomeTitle: "🌟 ยินดีต้อนรับสู่ Nova88 – ชนะได้ตลอด 24 ชม.! 🌟",
    welcomeBody: "🎉 เริ่มเล่นได้เลย:\n✅ ไม่ต้องสมัครสมาชิก\n✅ ฝาก-ถอนรวดเร็ว\n✅ ซัพพอร์ต 24/7",
    chooseOption: "กรุณาเลือกเมนู 👇",
    langSet: "ตั้งค่าภาษาไทยแล้ว",
    menu: { play: "🎮 เล่นเลย 🎮", referrals: "แนะนำเพื่อน", support: "ซัพพอร์ต", rewards: "รับรางวัล", share: "🚀 แชร์ให้เพื่อน" }
  },
  hi: {
    flag: "🇮🇳", name: "हिन्दी",
    welcomeTitle: "🌟 Nova88 में आपका स्वागत है – जीत कभी नहीं रुकती! 🌟",
    welcomeBody: "🎉 आपका रोमांच शुरू होता है:\n✅ बिना रजिस्ट्रेशन\n✅ तुरंत डिपॉज़िट और विदड्रॉ\n✅ 24/7 सपोर्ट",
    chooseOption: "कृपया विकल्प चुनें 👇",
    langSet: "भाषा हिंदी में सेट की गई।",
    menu: { play: "🎮 अभी खेलें 🎮", referrals: "रेफ़रल", support: "सपोर्ट", rewards: "रिवॉर्ड", share: "🚀 शेयर करें" }
  },
  bd: {
    flag: "🇧🇩", name: "বাংলা",
    welcomeTitle: "🌟 Nova88-এ স্বাগতম – জয় কখনো থামে না! 🌟",
    welcomeBody: "🎉 খেলা শুরু করুন:\n✅ রেজিস্ট্রেশন ছাড়াই খেলা\n✅ দ্রুত লেনদেন\n✅ 24/7 কাস্টমার সার্ভিস",
    chooseOption: "একটি অপশন বেছে নিন 👇",
    langSet: "ভাষা বাংলা সেট করা হয়েছে।",
    menu: { play: "🎮 এখনই খেলুন 🎮", referrals: "রেফারেল", support: "সোপোর্ট", rewards: "পুরস্কার", share: "🚀 শেয়ার করুন" }
  },
  id: {
    flag: "🇮🇩", name: "Bahasa Indo",
    welcomeTitle: "🌟 Selamat Datang di Nova88 – Kemenangan Tiada Henti! 🌟",
    welcomeBody: "🎉 Petualangan Anda Dimulai:\n✅ Tanpa Registrasi\n✅ Deposit & WD Instan\n✅ Dukungan 24/7",
    chooseOption: "Silakan pilih menu 👇",
    langSet: "Bahasa diatur ke Indonesia.",
    menu: { play: "🎮 Main Sekarang 🎮", referrals: "Referral", support: "Dukungan", rewards: "Hadiah", share: "🚀 Bagikan" }
  },
  vi: {
    flag: "🇻🇳", name: "Tiếng Việt",
    welcomeTitle: "🌟 Chào mừng đến với Nova88 – Thắng Lớn Mỗi Ngày! 🌟",
    welcomeBody: "🎉 Hành trình của bạn bắt đầu:\n✅ Không cần đăng ký\n✅ Nạp & Rút tức thì\n✅ Hỗ trợ 24/7",
    chooseOption: "Vui lòng chọn một tùy chọn 👇",
    langSet: "Ngôn ngữ đã được thiết lập sang Tiếng Việt.",
    menu: { play: "🎮 Chơi Ngay 🎮", referrals: "Giới thiệu", support: "Hỗ trợ", rewards: "Phần thưởng", share: "🚀 Chia sẻ" }
  }
};

/**
 * =======================
 * 3) HELPERS & KEYBOARDS
 * =======================
 */
function getLang(ctx) {
  if (userLang.has(ctx.from?.id)) return userLang.get(ctx.from.id);
  const browserLang = ctx.from?.language_code?.split("-")[0];
  return texts[browserLang] ? browserLang : DEFAULT_LANG;
}

function L(ctx) { return texts[getLang(ctx)]; }

function languageGrid() {
  const codes = Object.keys(texts);
  const rows = [];
  for (let i = 0; i < codes.length; i += 2) {
    const pair = codes.slice(i, i + 2).map(code => 
      Markup.button.callback(`${texts[code].flag} ${texts[code].name}`, `lang_${code}`)
    );
    rows.push(pair);
  }
  return rows;
}

function mainMenuKeyboard(ctx) {
  const m = L(ctx).menu;
  return Markup.inlineKeyboard([
    [Markup.button.webApp(m.play, GAME_URL)], 
    [Markup.button.url(m.share, SHARE_URL)],
    [
      Markup.button.url(m.support, SUPPORT_URL),
      Markup.button.url(m.referrals, REFERRAL_URL),
    ],
    [Markup.button.url(m.rewards, CHANNEL_URL)],
    ...languageGrid(),
  ]);
}

/**
 * =======================
 * 4) LOGIC & EVENTS
 * =======================
 */
async function sendWelcome(ctx) {
  const t = L(ctx);
  const caption = `${t.welcomeTitle}\n\n${t.welcomeBody}\n\n🧩 Version: ${BOT_VERSION}`;

  try {
    await ctx.replyWithPhoto(BANNER_FILE, { 
      caption: caption,
      parse_mode: 'HTML',
      ...mainMenuKeyboard(ctx)
    });
  } catch (err) {
    console.error("❌ Telegram API Error:", err.description || err.message); 
    await ctx.reply(caption, mainMenuKeyboard(ctx));
  }
}

bot.start(sendWelcome);

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
 * 5) EXECUTION
 * =======================
 */
(async () => {
  await bot.launch({ dropPendingUpdates: true });
  console.log(`✅ Nova88 Bot Active: ${Object.keys(texts).length} Languages`);
})();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));