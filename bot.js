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

// UPDATED ADMIN LIST
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
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

const GAME_URL = "https://m.nova8805.net/en?affCode=21093&view=h5&platform=mobile"; 
const SUPPORT_URL = "https://direct.lc.chat/11638088/";
const REWARDS_URL = "https://t.me/Nova88_events";
const BANNER_FILE = { source: path.join(__dirname, "images", "welcomebot.jpg") };

const bot = new Telegraf(BOT_TOKEN);

/**
 * =======================
 * 2) FULL LANGUAGE PACK
 * =======================
 */
const texts = {
  en: {
    welcome: "👋 Welcome! To initiate the bot, please join our official channel first:",
    title: "🌟 Welcome to Nova88 Online Casino – Where Winning Never Sleeps! 🌟",
    body: "🎉 Your Adventure Awaits:\n✅ No Registration Required!\n✅ Instant Deposits & Withdrawals!\n\n🗞️ Updates: @Nova88_News\n🎁 Promotions: @Nova_Promotion",
    play: "🎰 🔥 PLAY NOW & WIN 🔥 🎰",
    shareCTA: "🚀 SHARE & EARN 🚀",
    live: "🎧 Support",
    gift: "🎁 Rewards",
    shareMsg: "Hey! Join me on Nova88. Use my link to get instant rewards: "
  },
  cn: {
    welcome: "👋 欢迎！在使用机器人之前，请先加入我们的官方频道：",
    title: "🌟 欢迎来到 Nova88 在线赌场 — 全天候赢不停！🌟",
    body: "🎉 精彩旅程即刻开启：\n✅ 无需注册 – 立即畅玩！\n✅ 秒速存款 & 提现 – 极速提款！\n\n🗞️ 最新动态: @Nova88_News\n🎁 促销奖励: @Nova_Promotion",
    play: "🎰 🔥 立即游戏，赢取大奖 🔥 🎰",
    shareCTA: "🚀 分享赚奖励 🚀",
    live: "🎧 在线客服",
    gift: "🎁 领取奖励",
    shareMsg: "嘿！快来加入 Nova88。使用我的链接即可获得即时奖励："
  },
  th: {
    welcome: "👋 ยินดีต้อนรับ! กรุณาเข้าร่วมช่องทางการของเราก่อนเพื่อเริ่มใช้งาน:",
    title: "🌟 ยินดีต้อนรับสู่ Nova88 คาสิโนออนไลน์ – ชนะได้ตลอด 24 ชม.! 🌟",
    body: "🎉 เริ่มเล่นได้เลย:\n✅ ไม่ต้องสมัครสมาชิก!\n✅ ฝาก-ถอนรวดเร็ว!\n\n🗞️ อัปเดตล่าสุด: @Nova88_News\n🎁 โปรโมชั่น: @Nova_Promotion",
    play: "🎰 🔥 เล่นเลยตอนนี้และรับรางวัล 🔥 🎰",
    shareCTA: "🚀 แชร์และรับรางวัล 🚀",
    live: "🎧 สนับสนุน",
    gift: "🎁 รับรางวัล",
    shareMsg: "เฮ้! มาร่วมสนุกกับฉันที่ Nova88: "
  },
  hi: {
    welcome: "👋 स्वागत है! आरंभ करने के लिए, कृपया पहले हमारे आधिकारिक चैनल से जुड़ें:",
    title: "🌟 Nova88 ऑनलाइन कैसीनो में आपका स्वागत है! 🌟",
    body: "🎉 आपका रोमांच शुरू होता है:\n✅ कोई पंजीकरण आवश्यक नहीं!\n✅ तत्काल जमा और निकासी!\n\n🗞️ अपडेट: @Nova88_News\n🎁 पुरस्कार: @Nova_Promotion",
    play: "🎰 🔥 अभी खेलें और जीतें 🔥 🎰",
    shareCTA: "🚀 साझा करें और कमाएं 🚀",
    live: "🎧 सहायता",
    gift: "🎁 पुरस्कार",
    shareMsg: "अरे! Nova88 पर मेरे साथ जुड़ें: "
  },
  bn: {
    welcome: "👋 স্বাগতম! শুরু করতে, দয়া করে প্রথমে আমাদের অফিশিয়াল চ্যানেলে যোগ দিন:",
    title: "🌟 Nova88 অনলাইন ক্যাসিনোতে স্বাগতম! 🌟",
    body: "🎉 খেলা শুরু করুন:\n✅ রেজিস্ট্রেশন ছাড়াই খেলা!\n✅ দ্রুত লেনদেন!\n\n🗞️ আপডেট: @Nova88_News\n🎁 অফার: @Nova_Promotion",
    play: "🎰 🔥 এখনই খেলুন এবং জিতুন 🔥 🎰",
    shareCTA: "🚀 শেয়ার করুন এবং আয় করুন 🚀",
    live: "🎧 সাপোর্ট",
    gift: "🎁 পুরস্কার",
    shareMsg: "হেই! Nova88-এ আমার সাথে যোগ দিন: "
  },
  id: {
    welcome: "👋 Selamat datang! Untuk memulai, silakan bergabung dengan saluran resmi kami:",
    title: "🌟 Selamat Datang di Kasino Online Nova88! 🌟",
    body: "🎉 Petualangan Dimulai:\n✅ Tanpa Registrasi!\n✅ Deposit & WD Instan!\n\n🗞️ Update: @Nova88_News\n🎁 Promo: @Nova_Promotion",
    play: "🎰 🔥 MAIN SEKARANG & MENANG 🔥 🎰",
    shareCTA: "🚀 BAGIKAN & DAPATKAN 🚀",
    live: "🎧 Dukungan",
    gift: "🎁 Hadiah",
    shareMsg: "Hai! Bergabunglah dengan saya di Nova88: "
  },
  vn: {
    welcome: "👋 Chào mừng! Để bắt đầu, vui lòng tham gia kênh chính thức của chúng tôi:",
    title: "🌟 Chào mừng đến với Sòng bạc Trực tuyến Nova88! 🌟",
    body: "🎉 Hành trình bắt đầu:\n✅ Không cần đăng ký!\n✅ Nạp & Rút tức thì!\n\n🗞️ Cập nhật: @Nova88_News\n🎁 Khuyến mãi: @Nova_Promotion",
    play: "🎰 🔥 CHƠI NGAY & THẮNG LỚN 🔥 🎰",
    shareCTA: "🚀 CHIA SẺ & NHẬN THƯỞNG 🚀",
    live: "🎧 Hỗ trợ",
    gift: "🎁 Thưởng",
    shareMsg: "Chào! Hãy tham gia cùng tôi trên Nova88: "
  }
};

/**
 * =======================
 * 3) CORE LOGIC & UI
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

function getCombinedGrid(lang, tgId) {
  const shareUrl = `https://t.me/${bot.botInfo.username}?start=${tgId}`;
  return Markup.inlineKeyboard([
    [Markup.button.webApp(lang.play, GAME_URL)],
    [Markup.button.switchToChat(lang.shareCTA, `${lang.shareMsg}${shareUrl}`)],
    [
      Markup.button.url(lang.live, SUPPORT_URL),
      Markup.button.url(lang.gift, REWARDS_URL)
    ],
    [
      Markup.button.callback("🇺🇸 US", "lang_en"), 
      Markup.button.callback("🇨🇳 CN", "lang_cn"), 
      Markup.button.callback("🇹🇭 TH", "lang_th"),
      Markup.button.callback("🇮🇳 IN", "lang_hi")
    ],
    [
      Markup.button.callback("🇧🇩 BD", "lang_bn"), 
      Markup.button.callback("🇮🇩 ID", "lang_id"), 
      Markup.button.callback("🇻🇳 VN", "lang_vn")
    ]
  ]);
}

async function sendUI(ctx, langCode = 'en') {
  const user = getOrCreateUser(ctx.from.id);
  const lang = texts[langCode] || texts.en;
  const caption = `${lang.title}\n\n🆔 Member ID: <b>${user.member_id}</b>\n👥 Friends Invited: <b>${user.referral_count}</b>\n\n${lang.body}`;

  try {
    await ctx.replyWithPhoto(BANNER_FILE, { 
      caption: caption, 
      parse_mode: 'HTML', 
      ...getCombinedGrid(lang, ctx.from.id)
    });
  } catch (err) { console.error("❌ UI Error:", err.message); }
}

/**
 * =======================
 * 4) COMMANDS & ACTIONS
 * =======================
 */

bot.start(async (ctx) => {
  const isMember = await checkMembership(ctx);
  if (!isMember) {
    return ctx.reply(texts.en.welcome, 
      Markup.inlineKeyboard([
        [Markup.button.url("📢 Join Nova88 News", `https://t.me/Nova88_News`)],
        [Markup.button.callback("✅ I have joined / 🚩 已加入", "check_again")]
      ])
    );
  }
  const payload = ctx.startPayload;
  const refId = (payload && payload !== ctx.from.id.toString()) ? payload : null;
  getOrCreateUser(ctx.from.id, refId);
  return sendUI(ctx, 'en');
});

// CSV REPORT COMMAND FOR ADMINS
bot.command('admin_report', async (ctx) => {
    if (!ADMIN_IDS.includes(ctx.from.id)) return;
    try {
        const rows = db.prepare('SELECT * FROM users').all();
        if (rows.length === 0) return await ctx.reply("📊 Database is empty.");

        const headers = "Telegram ID,Member ID,Referred By,Referral Count,Join Date\n";
        const csvString = headers + rows.map(row => 
            `${row.telegram_id},${row.member_id},${row.referred_by || 'None'},${row.referral_count},${row.join_date}`
        ).join("\n");

        await ctx.replyWithDocument(
            Input.fromBuffer(Buffer.from(csvString), 'nova88_report.csv'),
            { caption: `📊 **Nova88 Report**\nTotal Users: ${rows.length}`, parse_mode: 'Markdown' }
        );
    } catch (err) { await ctx.reply("❌ Error: " + err.message); }
});

bot.action("check_again", async (ctx) => {
  const isMember = await checkMembership(ctx);
  if (isMember) {
    try { await ctx.deleteMessage(); } catch(e) {}
    return sendUI(ctx, 'en');
  } else {
    return ctx.answerCbQuery("❌ Join @Nova88_News first!", { show_alert: true });
  }
});

bot.action(/lang_(.+)/, async (ctx) => {
  const langCode = ctx.match[1];
  await ctx.answerCbQuery();
  try { await ctx.deleteMessage(); } catch(e) {}
  await sendUI(ctx, langCode);
});

bot.telegram.setMyCommands([{ command: 'start', description: '🚀 Open Nova88 Menu' }]);
bot.launch().then(() => console.log("✅ Nova88 v37 Final Build (Multi-Admin) Active"));