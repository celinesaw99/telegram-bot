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

// Initialize Database
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
const BOT_VERSION = "DB-LATEST-031-AUTO-PUSH";

const bot = new Telegraf(BOT_TOKEN);

/**
 * =======================
 * 2) FULL LANGUAGE PACK
 * =======================
 */
const texts = {
  en: {
    title: "🌟 Welcome to Nova88 Online Casino – Where Winning Never Sleeps! 🌟",
    body: "🎉 Your Adventure Awaits:\n✅ No Registration Required!\n✅ Instant Deposits & Withdrawals!\n✅ 24/7 Support!\n\n🗞️ Updates: @Nova88_News\n🎁 Promotions: @Nova_Promotion\n\n🔗 Backup URLs:\n🌐 https://bit.ly/4sC7lr6\n🌐 https://bit.ly/4brAgYC\n\n🤝 Support:\n✅ @Nova88Support2 | ✅ @Nova88Support3",
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
  th: {
    title: "🌟 ยินดีต้อนรับสู่ Nova88 คาสิโนออนไลน์ – ชนะได้ตลอด 24 ชม.! 🌟",
    body: "🎉 เริ่มเล่นได้เลย:\n✅ ไม่ต้องสมัครสมาชิก – เริ่มเล่นได้ทันที!\n✅ ฝาก-ถอนรวดเร็ว – รับเงินไวกว่าที่เคย!\n\n🗞️ อัปเดตล่าสุด: @Nova88_News\n🎁 โปรโมชั่น: @Nova_Promotion",
    play: "🎰 🔥 เล่นเลยตอนนี้และรับรางวัล 🔥 🎰",
    switch: "🌐 เปลี่ยนภาษา",
    shareCTA: "🚀 แชร์และรับ 1% 🚀",
    live: "🎧 สนับสนุน",
    gift: "🎁 รับรางวัล",
    shareMsg: "เฮ้! มาร่วมสนุกกับฉันที่ Nova88: "
  },
  hi: {
    title: "🌟 Nova88 ऑनलाइन कैसीनो में आपका स्वागत है – जीत कभी नहीं रुकती! 🌟",
    body: "🎉 आपका रोमांच शुरू होता है:\n✅ कोई पंजीकरण आवश्यक नहीं!\n✅ तत्काल जमा और निकासी!\n\n🗞️ अपडेट: @Nova88_News\n🎁 पुरस्कार: @Nova_Promotion",
    play: "🎰 🔥 अभी खेलें और जीतें 🔥 🎰",
    switch: "🌐 भाषा बदलें",
    shareCTA: "🚀 साझा करें और 1% कमाएं 🚀",
    live: "🎧 सहायता",
    gift: "🎁 पुरस्कार",
    shareMsg: "अरे! Nova88 पर मेरे साथ जुड़ें: "
  },
  bn: {
    title: "🌟 Nova88 অনলাইন ক্যাসিনোতে স্বাগতম – জয় কখনো থামে না! 🌟",
    body: "🎉 খেলা শুরু করুন:\n✅ রেজিস্ট্রেশন ছাড়াই খেলা!\n✅ দ্রুত লেনদেন!\n\n🗞️ আপডেট: @Nova88_News\n🎁 অফার: @Nova_Promotion",
    play: "🎰 🔥 এখনই খেলুন এবং জিতুন 🔥 🎰",
    switch: "🌐 ভাষা পরিবর্তন করুন",
    shareCTA: "🚀 শেয়ার করুন এবং ১% আয় করুন 🚀",
    live: "🎧 সাপোর্ট",
    gift: "🎁 পুরস্কার",
    shareMsg: "হেই! Nova88-এ আমার সাথে যোগ দিন: "
  },
  id: {
    title: "🌟 Selamat Datang di Kasino Online Nova88 – Kemenangan Tiada Henti! 🌟",
    body: "🎉 Petualangan Anda Dimulai:\n✅ Tanpa Registrasi!\n✅ Deposit & WD Instan!\n\n🗞️ Update: @Nova88_News\n🎁 Promo: @Nova_Promotion",
    play: "🎰 🔥 MAIN SEKARANG & MENANG 🔥 🎰",
    switch: "🌐 Pilih Bahasa",
    shareCTA: "🚀 BAGIKAN & DAPATKAN 1% 🚀",
    live: "🎧 Dukungan",
    gift: "🎁 Hadiah",
    shareMsg: "Hai! Bergabunglah dengan saya di Nova88: "
  },
  vn: {
    title: "🌟 Chào mừng đến với Sòng bạc Trực tuyến Nova88 – Thắng Lớn Mỗi Ngày! 🌟",
    body: "🎉 Hành trình của bạn bắt đầu:\n✅ Không cần đăng ký!\n✅ Nạp & Rút tức thì!\n\n🗞️ Cập nhật: @Nova88_News\n🎁 Khuyến mãi: @Nova_Promotion",
    play: "🎰 🔥 CHƠI NGAY & THẮNG LỚN 🔥 🎰",
    switch: "🌐 Đổi ngôn ngữ",
    shareCTA: "🚀 CHIA SẺ & NHẬN 1% 🚀",
    live: "🎧 Hỗ trợ",
    gift: "🎁 Thưởng",
    shareMsg: "Chào! Hãy tham gia cùng tôi trên Nova88: "
  }
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

/**
 * =======================
 * 4) COMMANDS & ACTIONS
 * =======================
 */

// This handles the "START" button click
bot.start(async (ctx) => {
    const payload = ctx.startPayload;
    const refId = (payload && payload !== ctx.from.id.toString()) ? payload : null;
    getOrCreateUser(ctx.from.id, refId);
    return sendUI(ctx, 'en');
});

bot.command('admin_report', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const total = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const top = db.prepare('SELECT * FROM users WHERE referral_count > 0 ORDER BY referral_count DESC LIMIT 5').all();
    let report = `📊 <b>Nova88 Report</b>\nTotal: ${total}\n\n🏆 <b>Top Refs:</b>`;
    top.forEach(u => report += `\n🆔 ${u.telegram_id} | 👥 ${u.referral_count}`);
    ctx.reply(report, { parse_mode: 'HTML' });
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
bot.launch().then(() => console.log("✅ Nova88 v31 Online - Auto-Push Fixed"));