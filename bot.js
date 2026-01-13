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

// URLs
const GAME_URL = "https://m.nova8805.net/en?affCode=21093";
const REFERRAL_URL = "https://m.nova88805.net/cs/join?AffId=6bl3wx9q";
const SUPPORT_URL = "https://direct.lc.chat/11638088/";
const CHANNEL_URL = "https://t.me/Nova_Promotion";
const BOT_USERNAME = "Nova88OfficialBot"; 

// Sharing Logic
const SHARE_TEXT = encodeURIComponent("Join me on Nova88! Instant withdrawals and huge rewards! 🎰");
const SHARE_URL = `https://t.me/share/url?url=https://t.me/${BOT_USERNAME}&text=${SHARE_TEXT}`;

// Image Path
const BANNER_FILE = { source: path.join(__dirname, "images", "welcomebot.jpg") };

const bot = new Telegraf(BOT_TOKEN);
const BOT_VERSION = "GRID-007-ABBR-CTA";
const DEFAULT_LANG = "en";
const userLang = new Map();

/**
 * =======================
 * 2) FULL LANGUAGE PACK (7 Languages)
 * =======================
 */
const texts = {
  en: {
    label: "🇺🇸 EN",
    welcomeTitle: "🌟 Welcome to Nova88 – Where Winning Never Sleeps! 🌟",
    welcomeBody: "🎉 Your Adventure Awaits:\n✅ No Registration Required\n✅ Instant Deposits & Withdrawals\n✅ 24/7 Support",
    menu: { play: "PLAY NOW & WIN", referrals: "Referral", support: "Support", rewards: "Rewards", share: "Share" }
  },
  zh: {
    label: "🇨🇳 ZH",
    welcomeTitle: "🌟 欢迎来到 Nova88 — 全天候赢不停！🌟",
    welcomeBody: "🎉 精彩旅程即刻开启：\n✅ 无需注册，立即畅玩\n✅ 秒速存款 & 提现\n✅ 24/7 全天客服",
    menu: { play: "立即游戏", referrals: "邀请返佣", support: "在线客服", rewards: "领取奖励", share: "分享好友" }
  },
  th: {
    label: "🇹🇭 TH",
    welcomeTitle: "🌟 ยินดีต้อนรับสู่ Nova88 – ชนะได้ตลอด 24 ชม.! 🌟",
    welcomeBody: "🎉 เริ่มเล่นได้เลย:\n✅ ไม่ต้องสมัครสมาชิก\n✅ ฝาก-ถอนรวดเร็ว\n✅ ซัพพอร์ต 24/7",
    menu: { play: "เล่นเลยตอนนี้", referrals: "แนะนำเพื่อน", support: "ซัพพอร์ต", rewards: "รับรางวัล", share: "แชร์ให้เพื่อน" }
  },
  hi: {
    label: "🇮🇳 HI",
    welcomeTitle: "🌟 Nova88 में आपका स्वागत है – जीत कभी नहीं रुकती! 🌟",
    welcomeBody: "🎉 आपका रोमांच शुरू होता है:\n✅ बिना रजिस्ट्रेशन\n✅ तुरंत डिपॉज़िट और विदड्रॉ\n✅ 24/7 सपोर्ट",
    menu: { play: "अभी खेलें", referrals: "रेफ़रल", support: "सपोर्ट", rewards: "रिवॉर्ड", share: "शेयर करें" }
  },
  bd: {
    label: "🇧🇩 BN",
    welcomeTitle: "🌟 Nova88-এ স্বাগতম – জয় কখনো থামে না! 🌟",
    welcomeBody: "🎉 খেলা শুরু করুন:\n✅ রেজিস্ট্রেশন ছাড়াই খেলা\n✅ দ্রুত লেনদেন\n✅ 24/7 কাস্টমার সার্ভিস",
    menu: { play: "এখনই খেলুন", referrals: "রেফারেল", support: "সোপোর্ট", rewards: "পুরস্কার", share: "শেয়ার করুন" }
  },
  id: {
    label: "🇮🇩 ID",
    welcomeTitle: "🌟 Selamat Datang di Nova88 – Kemenangan Tiada Henti! 🌟",
    welcomeBody: "🎉 Petualangan Anda Dimulai:\n✅ Tanpa Registrasi\n✅ Deposit & WD Instan\n✅ Dukungan 24/7",
    menu: { play: "Main Sekarang", referrals: "Referral", support: "Dukungan", rewards: "Hadiah", share: "Bagikan" }
  },
  vi: {
    label: "🇻🇳 VI",
    welcomeTitle: "🌟 Chào mừng đến với Nova88 – Thắng Lớn Mỗi Ngày! 🌟",
    welcomeBody: "🎉 Hành trình của bạn bắt đầu:\n✅ Không cần đăng ký\n✅ Nạp & Rút tức thì\n✅ Hỗ trợ 24/7",
    menu: { play: "Chơi Ngay", referrals: "Giới thiệu", support: "Hỗ trợ", rewards: "Phần thưởng", share: "Chia sẻ" }
  }
};

/**
 * =======================
 * 3) HELPERS & KEYBOARD LOGIC
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
  // 3-column abbreviated grid
  for (let i = 0; i < codes.length; i += 3) {
    const trio = codes.slice(i, i + 3).map(code => 
      Markup.button.callback(texts[code].label, `lang_${code}`)
    );
    rows.push(trio);
  }
  return rows;
}

function mainMenuKeyboard(ctx) {
  const m = L(ctx).menu;
  return Markup.inlineKeyboard([
    // PRIMARY CTA (Call to Action)
    [Markup.button.webApp(`🎰 🔥 ${m.play} 🔥 🎰`, GAME_URL)], 
    [Markup.button.url(`🚀 ${m.share}`, SHARE_URL)],
    [
      Markup.button.url(`🎧 ${m.support}`, SUPPORT_URL),
      Markup.button.url(`🤝 ${m.referrals}`, REFERRAL_URL),
    ],
    [Markup.button.url(`🧧 ${m.rewards}`, CHANNEL_URL)],
    // COMPACT LANGUAGE GRID
    ...languageGrid(),
  ]);
}

/**
 * =======================
 * 4) CORE LOGIC
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
    console.error("❌ Telegram Error:", err.description || err.message); 
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
 * 5) LAUNCH
 * =======================
 */
(async () => {
  await bot.launch({ dropPendingUpdates: true });
  console.log(`✅ Nova88 Bot Active: ${Object.keys(texts).length} Languages`);
})();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));