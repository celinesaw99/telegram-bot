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
const ADMIN_ID = 6674020266; 

if (!BOT_TOKEN) throw new Error("❌ BOT_TOKEN missing in .env");

const db = new Database('nova88_users.db');
db.prepare(`CREATE TABLE IF NOT EXISTS users (
    telegram_id TEXT PRIMARY KEY,
    member_id TEXT,
    referred_by TEXT,
    referral_count INTEGER DEFAULT 0,
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

const GAME_URL = "https://m.nova8805.net/en?affCode=21093";
const SUPPORT_URL = "https://direct.lc.chat/11638088/";
const REWARDS_URL = "https://t.me/Nova88_events";
const BANNER_FILE = { source: path.join(__dirname, "images", "welcomebot.jpg") };
const BOT_VERSION = "DB-LATEST-030-SHARE-CTA";

const bot = new Telegraf(BOT_TOKEN);

/**
 * =======================
 * 2) FULL LANGUAGE PACK
 * =======================
 */
const texts = {
  en: {
    title: "🌟 Welcome to Nova88 Online Casino – Where Winning Never Sleeps! 🌟",
    body: "🎉 Your Adventure Awaits:\n✅ No Registration Required – Jump right in!\n✅ Instant Deposits & Withdrawals – Cash out faster!\n✅ 24/7 Support – Day and night!\n\n🗞️ Updates: @Nova88_News\n🎁 Promotions: @Nova_Promotion\n\n🔗 Backup URLs:\n🌐 https://bit.ly/4sC7lr6\n🌐 https://bit.ly/4brAgYC\n\n🤝 Support:\n✅ @Nova88Support2 | ✅ @Nova88Support3",
    play: "🎰 🔥 PLAY NOW & WIN 🔥 🎰",
    switch: "🌐 Switch Language",
    shareCTA: "🚀 SHARE & EARN 1% 🚀",
    live: "🎧 Support",
    gift: "🎁 Rewards",
    shareMsg: "Hey! Join me on Nova88. Use my link to get instant rewards: "
  },
  cn: {
    title: "🌟 欢迎来到 Nova88 在线赌场 — 全天候赢不停！🌟",
    body: "🎉 精彩旅程即刻开启：\n✅ 无需注册 – 立即畅玩！\n✅ 秒速存款 & 提现 – 极速提款！\n✅ 24/7 全天客服 – 为您服务！\n\n🗞️ 最新动态: @Nova88_News\n🎁 促销奖励: @Nova_Promotion",
    play: "🎰 🔥 立即游戏，赢取大奖 🔥 🎰",
    switch: "🌐 切换语言",
    shareCTA: "🚀 分享好友赚 1% 🚀",
    live: "🎧 在线客服",
    gift: "🎁 领取奖励",
    shareMsg: "嘿！快来加入 Nova88。使用我的链接即可获得即时奖励："
  },
  // ... (Other languages follow the same structure)
};

/**
 * =======================
 * 3) UI LOGIC
 * =======================
 */

function getCombinedGrid(lang, tgId) {
  const shareUrl = `https://t.me/${bot.botInfo.username}?start=${tgId}`;
  
  return Markup.inlineKeyboard([
    [Markup.button.webApp(lang.play, GAME_URL)],
    [
      // Updated Button: Action-oriented text
      Markup.button.switchToChat(lang.shareCTA, `${lang.shareMsg}${shareUrl}`), 
      Markup.button.url(lang.live, SUPPORT_URL),
      Markup.button.url(lang.gift, REWARDS_URL)
    ],
    [Markup.button.callback(lang.switch, "none")], 
    [
      Markup.button.callback("🇺🇸", "lang_en"), 
      Markup.button.callback("🇨🇳", "lang_cn"), 
      Markup.button.callback("🇹🇭", "lang_th"),
      Markup.button.callback("🇮🇳", "lang_hi")
    ],
    [
      Markup.button.callback("🇧🇩", "lang_bn"), 
      Markup.button.callback("🇮🇩", "lang_id"), 
      Markup.button.callback("🇻🇳", "lang_vn")
    ]
  ]);
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

async function sendUI(ctx, langCode = 'en') {
  const user = getOrCreateUser(ctx.from.id);
  const lang = texts[langCode] || texts.en;
  const caption = `${lang.title}\n\n🆔 Member ID: <b>${user.member_id}</b>\n👥 Friends Invited: <b>${user.referral_count}</b>\n\n${lang.body}\n\n🧩 Version: ${BOT_VERSION}`;

  try {
    await ctx.replyWithPhoto(BANNER_FILE, { 
      caption: caption, 
      parse_mode: 'HTML', 
      ...getCombinedGrid(lang, ctx.from.id)
    });
  } catch (err) {
    console.error("❌ UI Error:", err.message);
  }
}

bot.start(async (ctx) => {
    const payload = ctx.startPayload;
    getOrCreateUser(ctx.from.id, (payload && payload !== ctx.from.id.toString()) ? payload : null);
    return sendUI(ctx, 'en');
});

bot.action("none", (ctx) => ctx.answerCbQuery());

Object.keys(texts).forEach((code) => {
  bot.action(`lang_${code}`, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      await sendUI(ctx, code);
    } catch (e) { await sendUI(ctx, code); }
  });
});

bot.telegram.setMyCommands([{ command: 'start', description: '🚀 Open Nova88 Menu' }]);
bot.launch().then(() => console.log("✅ Nova88 v30 Share Button CTA Online"));