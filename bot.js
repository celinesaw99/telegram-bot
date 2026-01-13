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
const ADMIN_ID = 6674020266; // Your verified Admin ID

if (!BOT_TOKEN) throw new Error("❌ BOT_TOKEN missing in .env");

// Initialize Database with Referral Tracking
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
const BOT_VERSION = "DB-LATEST-029-STABLE";

const bot = new Telegraf(BOT_TOKEN);

/**
 * =======================
 * 2) FULL LANGUAGE PACK
 * =======================
 */
const texts = {
  en: {
    title: "🌟 Welcome to Nova88 Online Casino – Where Winning Never Sleeps! 🌟",
    body: "🎉 Your Adventure Awaits:\n✅ No Registration Required – Jump right in and start playing!\n✅ Instant Deposits & Withdrawals – Enjoy cashing out faster than ever!\n✅ 24/7 Support – We're here for you, day and night!\n\n🗞️ Latest update: @Nova88_News\n🎁 More rewards & promotion: @Nova_Promotion\n\n🔗 Backup URLs:\n🌐 https://bit.ly/4sC7lr6\n🌐 https://bit.ly/4brAgYC\n\n🤝 Customer Support:\n✅ @Nova88Support2\n✅ @Nova88Support3\n✅ @Nova88Support4",
    play: "🎰 🔥 PLAY NOW & WIN 🔥 🎰",
    switch: "🌐 Switch Language",
    ref: "👥 Referral (Earn 1%)",
    live: "🎧 Support",
    gift: "🎁 Rewards",
    shareMsg: "Hey! Join me on Nova88. Use my link to get instant rewards: "
  },
  cn: {
    title: "🌟 欢迎来到 Nova88 在线赌场 — 全天候赢不停！🌟",
    body: "🎉 精彩旅程即刻开启：\n✅ 无需注册 – 立即畅玩！\n✅ 秒速存款 & 提现 – 享受前所未有的极速提款！\n✅ 24/7 全天客服 – 我们全天候为您服务！\n\n🗞️ 最新动态: @Nova88_News\n🎁 更多奖励与促销: @Nova_Promotion\n\n🔗 备用链接:\n🌐 https://bit.ly/4sC7lr6\n🌐 https://bit.ly/4brAgYC\n\n🤝 客服支持:\n✅ @Nova88Support2\n✅ @Nova88Support3\n✅ @Nova88Support4",
    play: "🎰 🔥 立即游戏，赢取大奖 🔥 🎰",
    switch: "🌐 切换语言",
    ref: "👥 推荐奖励 (赚1%)",
    live: "🎧 在线客服",
    gift: "🎁 领取奖励",
    shareMsg: "嘿！快来加入 Nova88。使用我的链接即可获得即时奖励："
  },
  th: {
    title: "🌟 ยินดีต้อนรับสู่ Nova88 คาสิโนออนไลน์ – ชนะได้ตลอด 24 ชม.! 🌟",
    body: "🎉 เริ่มเล่นได้เลย:\n✅ ไม่ต้องสมัครสมาชิก – เริ่มเล่นได้ทันที!\n✅ ฝาก-ถอนรวดเร็ว – รับเงินไวกว่าที่เคย!\n✅ ซัพพอร์ต 24/7 – เราอยู่เคียงข้างคุณทั้งวันทั้งคืน!\n\n🗞️ อัปเดตล่าสุด: @Nova88_News\n🎁 โปรโมชั่นและรางวัลเพิ่มเติม: @Nova_Promotion\n\n🔗 ลิงก์สำรอง:\n🌐 https://bit.ly/4sC7lr6\n🌐 https://bit.ly/4brAgYC\n\n🤝 ฝ่ายบริการลูกค้า:\n✅ @Nova88Support2\n✅ @Nova88Support3\n✅ @Nova88Support4",
    play: "🎰 🔥 เล่นเลยตอนนี้และรับรางวัล 🔥 🎰",
    switch: "🌐 เปลี่ยนภาษา",
    ref: "👥 แนะนำเพื่อน (รับ 1%)",
    live: "🎧 สนับสนุน",
    gift: "🎁 รับรางวัล",
    shareMsg: "เฮ้! มาร่วมสนุกกับฉันที่ Nova88 ใช้ลิงก์ของฉันเพื่อรับรางวัลทันที: "
  },
  hi: {
    title: "🌟 Nova88 ऑनलाइन कैसीनो में आपका स्वागत है – जीत कभी नहीं रुकती! 🌟",
    body: "🎉 आपका रोमांच शुरू होता है:\n✅ कोई पंजीकरण आवश्यक नहीं – सीधे खेल शुरू करें!\n✅ तत्काल जमा और निकासी – पहले से कहीं तेज़ कैश आउट का आनंद लें!\n✅ 24/7 सहायता – हम आपके लिए दिन-रात यहाँ हैं!\n\n🗞️ नवीनतम अपडेट: @Nova88_News\n🎁 अधिक पुरस्कार और प्रमोशन: @Nova_Promotion\n\n🔗 बैकअप URL:\n🌐 https://bit.ly/4sC7lr6\n🌐 https://bit.ly/4brAgYC\n\n🤝 ग्राहक सहायता:\n✅ @Nova88Support2\n✅ @Nova88Support3\n✅ @Nova88Support4",
    play: "🎰 🔥 अभी खेलें और जीतें 🔥 🎰",
    switch: "🌐 भाषा बदलें",
    ref: "👥 रेफरल (1% कमाएं)",
    live: "🎧 सहायता",
    gift: "🎁 पुरस्कार",
    shareMsg: "अरे! Nova88 पर मेरे साथ जुड़ें। तत्काल पुरस्कार पाने के लिए मेरे लिंक का उपयोग करें: "
  },
  bn: {
    title: "🌟 Nova88 অনলাইন ক্যাসিনোতে স্বাগতম – জয় কখনো থামে না! 🌟",
    body: "🎉 খেলা শুরু করুন:\n✅ রেজিস্ট্রেশন ছাড়াই খেলা – সরাসরি খেলায় যোগ দিন!\n✅ দ্রুত লেনদেন – আগের চেয়ে দ্রুত টাকা তুলুন!\n✅ 24/7 কাস্টমার সার্ভিস – আমরা আপনার জন্য দিনরাত আছি!\n\n🗞️ সর্বশেষ আপডেট: @Nova88_News\n🎁 আরও পুরস্কার এবং অফার: @Nova_Promotion\n\n🔗 ব্যাকআপ লিঙ্ক:\n🌐 https://bit.ly/4sC7lr6\n🌐 https://bit.ly/4brAgYC\n\n🤝 কাস্টমার সাপোর্ট:\n✅ @Nova88Support2\n✅ @Nova88Support3\n✅ @Nova88Support4",
    play: "🎰 🔥 এখনই খেলুন এবং জিতুন 🔥 🎰",
    switch: "🌐 ভাষা পরিবর্তন করুন",
    ref: "👥 রেফারেল (১% আয়)",
    live: "🎧 সাপোর্ট",
    gift: "🎁 পুরস্কার",
    shareMsg: "হেই! Nova88-এ আমার সাথে যোগ দিন। তাৎক্ষণিক পুরস্কার পেতে আমার লিঙ্কটি ব্যবহার করুন: "
  },
  id: {
    title: "🌟 Selamat Datang di Kasino Online Nova88 – Kemenangan Tiada Henti! 🌟",
    body: "🎉 Petualangan Anda Dimulai:\n✅ Tanpa Registrasi – Langsung main sekarang!\n✅ Deposit & WD Instan – Nikmati penarikan lebih cepat!\n✅ Dukungan 24/7 – Kami di sini untuk Anda, siang dan malam!\n\n🗞️ Update terbaru: @Nova88_News\n🎁 Lebih banyak promo: @Nova_Promotion\n\n🔗 URL Cadangan:\n🌐 https://bit.ly/4sC7lr6\n🌐 https://bit.ly/4brAgYC\n\n🤝 Layanan Pelanggan:\n✅ @Nova88Support2\n✅ @Nova88Support3\n✅ @Nova88Support4",
    play: "🎰 🔥 MAIN SEKARANG & MENANG 🔥 🎰",
    switch: "🌐 Pilih Bahasa",
    ref: "👥 Referensi (Bonus 1%)",
    live: "🎧 Dukungan",
    gift: "🎁 Hadiah",
    shareMsg: "Hai! Bergabunglah dengan saya di Nova88. Gunakan tautan saya untuk mendapatkan hadiah instan: "
  },
  vn: {
    title: "🌟 Chào mừng đến với Sòng bạc Trực tuyến Nova88 – Thắng Lớn Mỗi Ngày! 🌟",
    body: "🎉 Hành trình của bạn bắt đầu:\n✅ Không cần đăng ký – Tham gia và chơi ngay!\n✅ Nạp & Rút tức thì – Rút tiền nhanh hơn bao giờ hết!\n✅ Hỗ trợ 24/7 – Chúng tôi luôn bên bạn, ngày và đêm!\n\n🗞️ Cập nhật mới nhất: @Nova88_News\n🎁 Thêm phần thưởng & khuyến mãi: @Nova_Promotion\n\n🔗 URL dự phòng:\n🌐 https://bit.ly/4sC7lr6\n🌐 https://bit.ly/4brAgYC\n\n🤝 Hỗ trợ khách hàng:\n✅ @Nova88Support2\n✅ @Nova88Support3\n✅ @Nova88Support4",
    play: "🎰 🔥 CHƠI NGAY & THẮNG LỚN 🔥 🎰",
    switch: "🌐 Đổi ngôn ngữ",
    ref: "👥 Giới thiệu (Nhận 1%)",
    live: "🎧 Hỗ trợ",
    gift: "🎁 Thưởng",
    shareMsg: "Chào! Hãy tham gia cùng tôi trên Nova88. Sử dụng liên kết của tôi để nhận thưởng ngay lập tức: "
  }
};

/**
 * =======================
 * 3) CORE LOGIC
 * =======================
 */

function getOrCreateUser(tgId, referrerId = null) {
    let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(tgId.toString());
    if (!user) {
        const mid = 'N88-' + Math.floor(10000 + Math.random() * 90000);
        db.prepare('INSERT INTO users (telegram_id, member_id, referred_by) VALUES (?, ?, ?)').run(tgId.toString(), mid, referrerId);
        
        // If referred by someone, increment their count
        if (referrerId && referrerId !== tgId.toString()) {
            db.prepare('UPDATE users SET referral_count = referral_count + 1 WHERE telegram_id = ?').run(referrerId);
        }
        user = { telegram_id: tgId.toString(), member_id: mid, referral_count: 0 };
    }
    return user;
}

function getCombinedGrid(lang, tgId) {
  // Generate unique shareable link
  const shareUrl = `https://t.me/${bot.botInfo.username}?start=${tgId}`;
  
  return Markup.inlineKeyboard([
    [Markup.button.webApp(lang.play, GAME_URL)],
    [
      Markup.button.switchToChat(lang.ref, `${lang.shareMsg}${shareUrl}`), // Opens friend list with pre-filled link
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

async function sendUI(ctx, langCode = 'en') {
  const user = getOrCreateUser(ctx.from.id);
  const lang = texts[langCode] || texts.en;
  
  // Display Member ID and current Referral count
  const caption = `${lang.title}\n\n🆔 Member ID: <b>${user.member_id}</b>\n👥 Total Referrals: <b>${user.referral_count}</b>\n\n${lang.body}\n\n🧩 Version: ${BOT_VERSION}`;

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

bot.start(async (ctx) => {
    const payload = ctx.startPayload; // Deep link referrer ID
    const refId = (payload && payload !== ctx.from.id.toString()) ? payload : null;
    getOrCreateUser(ctx.from.id, refId);
    return sendUI(ctx, 'en');
});

bot.command('admin_report', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return ctx.reply("⛔ Unauthorized.");
    
    const total = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const top = db.prepare('SELECT * FROM users WHERE referral_count > 0 ORDER BY referral_count DESC LIMIT 10').all();
    
    let report = `📊 <b>Nova88 Admin Report</b>\n\nTotal Registered: ${total}\n\n🏆 <b>Top Referrers:</b>`;
    top.forEach(u => report += `\n🆔 ${u.telegram_id} | 👥 ${u.referral_count} refs`);
    
    ctx.reply(report, { parse_mode: 'HTML' });
});

bot.action("none", (ctx) => ctx.answerCbQuery());

Object.keys(texts).forEach((code) => {
  bot.action(`lang_${code}`, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      await sendUI(ctx, code);
    } catch (e) {
      await sendUI(ctx, code);
    }
  });
});

bot.telegram.setMyCommands([
  { command: 'start', description: '🚀 Open Nova88 Menu' },
  { command: 'admin_report', description: '📊 View Statistics (Admin Only)' }
]);

bot.launch().then(() => console.log("✅ Nova88 v29 Tracking & Referral System Active"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));