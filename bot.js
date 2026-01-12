require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");

/**
 * =======================
 * 1) CONFIG
 * =======================
 */
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  throw new Error("❌ BOT_TOKEN is missing. Put BOT_TOKEN=... in .env");
}

const GAME_URL = "https://m.nova88106.net/en";
const REFERRAL_URL = "https://www.nova88mas102.com/join?AffId=x1oa5vws";
const SUPPORT_URL = "https://t.me/Nova88Support2";
const GROUP_URL = "https://t.me/nova88my";
const CHANNEL_URL = "https://t.me/nova88official";

// Local banner file (relative to /opt/telegram-bot)
const BANNER_FILE = { source: "images/startbanner.jpg" };

// Create bot AFTER token exists
const bot = new Telegraf(BOT_TOKEN);

/**
 * =======================
 * 2) LANGUAGE PACK
 * =======================
 */
const DEFAULT_LANG = "en";
const userLang = new Map(); // userId -> lang code

const texts = {
  en: {
    flag: "🇺🇸",
    name: "English",
    welcomeTitle: "🔥 Welcome to Nova88 Online Casino 🔥",
    welcomeBody:
      "✅ No registration required\n" +
      "✅ Fast deposit & withdrawal\n" +
      "✅ 24/7 support",
    chooseOption: "Please choose an option 👇",
    langSet: "Your language has been set to English.",
    menu: {
      play: "🎮 Play now",
      referrals: "🎀 Referrals",
      support: "🤝 Support",
      promo: "🎁 Promotions",
      channel: "📣 Channel",
      group: "👥 Group",
      back: "⬅ Back to main menu",
      restart: "↩️ Restart bot",
    },
    supportMsg: `
👩‍💼 Nova88 Support

If you need help with:
• Bonus / Promotion
• Account issues

Please contact our support:
    `.trim(),
    sections: {
      promo: `
🎁 *Latest Promotions*

• 150% Welcome Bonus for new players  
• 10% Daily Reload Bonus  
• Weekly Cashback up to 8%  
• Live Casino & Slot Tournaments  

📌 T&C apply. Check full details on website or ask support.
      `.trim(),
    },
  },

  zh: {
    flag: "🇨🇳",
    name: "简体中文",
    welcomeTitle: "🔥 欢迎来到 Nova88 线上娱乐城 🔥",
    welcomeBody:
      "✅ 无需注册，无需提供身份证\n" +
      "✅ 存提款快速、安全\n" +
      "✅ 24/7 客服为您服务",
    chooseOption: "请选择操作 👇",
    langSet: "您的语言已设置为简体中文。",
    menu: {
      play: "🎮 立即开始",
      referrals: "🎀 邀请好友",
      support: "🤝 在线客服",
      promo: "🎁 优惠活动",
      channel: "📣 官方频道",
      group: "👥 官方群组",
      back: "⬅ 返回主菜单",
      restart: "↩️ 重新开始",
    },
    supportMsg: `
👩‍💼 Nova88 客服

如需协助：
• 红利 / 优惠活动
• 账户相关问题

请联系在线客服：
    `.trim(),
    sections: {
      promo: `
🎁 *最新优惠活动*

• 新玩家 150% 欢迎红利  
• 每日 10% 存送红利  
• 每周返水高达 8%  
• 真人 & 老虎机锦标赛  

📌 具体条款请参阅官网或咨询客服。
      `.trim(),
    },
  },

  vi: {
    flag: "🇻🇳",
    name: "Tiếng Việt",
    welcomeTitle: "🔥 Chào mừng đến Nova88 casino online 🔥",
    welcomeBody:
      "✅ Không cần đăng ký phức tạp\n" +
      "✅ Nạp / rút tiền nhanh chóng\n" +
      "✅ Hỗ trợ 24/7",
    chooseOption: "Vui lòng chọn chức năng 👇",
    langSet: "Ngôn ngữ của bạn đã được đặt thành Tiếng Việt.",
    menu: {
      play: "🎮 Chơi ngay",
      referrals: "🎀 Giới thiệu bạn bè",
      support: "🤝 Hỗ trợ",
      promo: "🎁 Khuyến mãi",
      channel: "📣 Kênh chính thức",
      group: "👥 Nhóm chính thức",
      back: "⬅ Quay lại menu chính",
      restart: "↩️ Khởi động lại bot",
    },
    supportMsg: `
👩‍💼 Hỗ trợ Nova88

Nếu bạn cần hỗ trợ:
• Bonus / Khuyến mãi
• Vấn đề tài khoản

Vui lòng liên hệ hỗ trợ:
    `.trim(),
    sections: {
      promo: `
🎁 *Khuyến mãi mới nhất*

• Thưởng chào mừng 150% cho thành viên mới  
• Thưởng nạp lại hằng ngày 10%  
• Hoàn trả hàng tuần lên đến 8%  
• Giải đấu Live Casino & Slot  

📌 Điều khoản áp dụng. Xem chi tiết trên web hoặc hỏi hỗ trợ.
      `.trim(),
    },
  },

  hi: {
    flag: "🇮🇳",
    name: "हिन्दी",
    welcomeTitle: "🔥 Nova88 ऑनलाइन कसीनो में आपका स्वागत है 🔥",
    welcomeBody:
      "✅ रजिस्ट्रेशन की ज़रूरत नहीं\n" +
      "✅ तेज जमा और निकासी\n" +
      "✅ 24/7 ग्राहक सहायता",
    chooseOption: "कृपया एक विकल्प चुनें 👇",
    langSet: "आपकी भाषा हिंदी में सेट कर दी गई है।",
    menu: {
      play: "🎮 अभी खेलें",
      referrals: "🎀 रेफ़रल",
      support: "🤝 सपोर्ट",
      promo: "🎁 प्रोमोशन",
      channel: "📣 ऑफ़िशियल चैनल",
      group: "👥 ऑफ़िशियल ग्रुप",
      back: "⬅ मुख्य मेनू पर वापस",
      restart: "↩️ बॉट रीस्टार्ट",
    },
    supportMsg: `
👩‍💼 Nova88 सपोर्ट

अगर आपको मदद चाहिए:
• बोनस / प्रोमोशन
• अकाउंट से जुड़ी समस्या

कृपया सपोर्ट से संपर्क करें:
    `.trim(),
    sections: {
      promo: `
🎁 *ताज़ा प्रोमोशन*

• नए खिलाड़ियों के लिए 150% वेलकम बोनस  
• 10% डेली रीलोड बोनस  
• साप्ताहिक कैशबैक 8% तक  
• लाइव कसीनो और स्लॉट टूर्नामेंट  

📌 नियम और शर्तें लागू। विस्तार के लिए वेबसाइट या सपोर्ट से पूछें।
      `.trim(),
    },
  },

  ms: {
    flag: "🇲🇾",
    name: "Bahasa Melayu",
    welcomeTitle: "🔥 Selamat datang ke Nova88 kasino dalam talian 🔥",
    welcomeBody:
      "✅ Tiada pendaftaran diperlukan\n" +
      "✅ Deposit & pengeluaran pantas\n" +
      "✅ Sokongan 24/7",
    chooseOption: "Sila pilih pilihan anda 👇",
    langSet: "Bahasa anda telah ditetapkan ke Bahasa Melayu.",
    menu: {
      play: "🎮 Main sekarang",
      referrals: "🎀 Rujukan",
      support: "🤝 Sokongan",
      promo: "🎁 Promosi",
      channel: "📣 Saluran rasmi",
      group: "👥 Kumpulan rasmi",
      back: "⬅ Kembali ke menu utama",
      restart: "↩️ Mula semula bot",
    },
    supportMsg: `
👩‍💼 Sokongan Nova88

Jika anda perlukan bantuan:
• Bonus / Promosi
• Isu akaun

Sila hubungi sokongan:
    `.trim(),
    sections: {
      promo: `
🎁 *Promosi Terkini*

• Bonus Selamat Datang 150% untuk pemain baru  
• Bonus Reload Harian 10%  
• Rebat Mingguan sehingga 8%  
• Tournament Live Casino & Slot  

📌 T&C terpakai. Rujuk laman web atau tanya sokongan.
      `.trim(),
    },
  },

  bd: {
    flag: "🇧🇩",
    name: "বাংলা",
    welcomeTitle: "🔥 Nova88 অনলাইন ক্যাসিনোতে স্বাগতম 🔥",
    welcomeBody:
      "✅ কোনো রেজিস্ট্রেশন প্রয়োজন নেই\n" +
      "✅ দ্রুত ডিপোজিট ও উইথড্র\n" +
      "✅ 24/7 সাপোর্ট",
    chooseOption: "অনুগ্রহ করে একটি অপশন নির্বাচন করুন 👇",
    langSet: "আপনার ভাষা বাংলা সেট করা হয়েছে।",
    menu: {
      play: "🎮 এখনই খেলুন",
      referrals: "🎀 রেফারেল",
      support: "🤝 সাপোর্ট",
      promo: "🎁 প্রোমোশন",
      channel: "📣 অফিসিয়াল চ্যানেল",
      group: "👥 অফিসিয়াল গ্রুপ",
      back: "⬅ মূল মেনুতে ফিরুন",
      restart: "↩️ বট রিস্টার্ট",
    },
    supportMsg: `
👩‍💼 Nova88 সাপোর্ট

যদি আপনার সাহায্য প্রয়োজন হয়:
• বোনাস / প্রোমোশন
• অ্যাকাউন্ট সংক্রান্ত সমস্যা

অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন:
    `.trim(),
    sections: {
      promo: `
🎁 *সর্বশেষ প্রোমোশন*

• নতুন খেলোয়াড়দের জন্য 150% ওয়েলকাম বোনাস  
• 10% ডেইলি রিলোড বোনাস  
• সাপ্তাহিক ক্যাশব্যাক সর্বোচ্চ 8%  
• লাইভ ক্যাসিনো ও স্লট টুর্নামেন্ট  

📌 শর্ত প্রযোজ্য। বিস্তারিত জানতে ওয়েবসাইট বা সাপোর্টে জিজ্ঞেস করুন।
      `.trim(),
    },
  },

  id: {
    flag: "🇮🇩",
    name: "Bahasa Indonesia",
    welcomeTitle: "🔥 Selamat datang di Nova88 kasino online 🔥",
    welcomeBody:
      "✅ Tidak perlu registrasi rumit\n" +
      "✅ Deposit & penarikan cepat\n" +
      "✅ Dukungan 24/7",
    chooseOption: "Silakan pilih menu 👇",
    langSet: "Bahasa Anda telah diatur ke Bahasa Indonesia.",
    menu: {
      play: "🎮 Main sekarang",
      referrals: "🎀 Referral",
      support: "🤝 Support",
      promo: "🎁 Promo",
      channel: "📣 Channel resmi",
      group: "👥 Grup resmi",
      back: "⬅ Kembali ke menu utama",
      restart: "↩️ Restart bot",
    },
    supportMsg: `
👩‍💼 Support Nova88

Jika Anda butuh bantuan:
• Bonus / Promo
• Masalah akun

Silakan hubungi support:
    `.trim(),
    sections: {
      promo: `
🎁 *Promo Terbaru*

• Bonus Selamat Datang 150% untuk member baru  
• Bonus Reload Harian 10%  
• Cashback Mingguan sampai 8%  
• Turnamen Live Casino & Slot  

📌 S&K berlaku. Lihat di website atau tanya support.
      `.trim(),
    },
  },
};

/**
 * =======================
 * 3) LANGUAGE HELPERS
 * =======================
 */
function getLang(ctx) {
  const id = ctx.from?.id;
  if (!id) return DEFAULT_LANG;
  return userLang.get(id) || DEFAULT_LANG;
}

function L(ctx) {
  const lang = getLang(ctx);
  return texts[lang] || texts[DEFAULT_LANG];
}

/**
 * =======================
 * 4) KEYBOARDS
 * =======================
 */
function backKeyboard(ctx) {
  const m = L(ctx).menu;
  return Markup.inlineKeyboard([[Markup.button.callback(m.back, "menu_main")]]);
}

function languageKeyboardRows() {
  const preferredOrder = ["en", "zh", "vi", "hi", "ms", "bd", "id"];
  const codes = Object.keys(texts);

  codes.sort((a, b) => {
    const ia = preferredOrder.indexOf(a);
    const ib = preferredOrder.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });

  const buttons = codes.map((code) => {
    const lang = texts[code];
    const label = `${lang.flag} ${lang.name}`;
    return Markup.button.callback(label, `lang_${code}`);
  });

  const perRow = 3; // change to 4 if you want fewer rows
  const rows = [];
  for (let i = 0; i < buttons.length; i += perRow) {
    rows.push(buttons.slice(i, i + perRow));
  }
  return rows;
}

function mainMenuKeyboard(ctx) {
  const m = L(ctx).menu;

  const baseRows = [
    [Markup.button.webApp(m.play, { url: GAME_URL })],
    [Markup.button.callback(m.promo, "menu_promo")],
    [Markup.button.callback(m.restart, "menu_restart")],
    [
      Markup.button.url(m.support, SUPPORT_URL),
      Markup.button.url(m.referrals, REFERRAL_URL),
    ],
    [
      Markup.button.url(m.channel, CHANNEL_URL),
      Markup.button.url(m.group, GROUP_URL),
    ],
  ];

  return Markup.inlineKeyboard([...baseRows, ...languageKeyboardRows()]);
}

/**
 * =======================
 * 5) WELCOME / START
 * =======================
 */
async function sendWelcome(ctx) {
  const t = L(ctx);

  try {
    await ctx.replyWithPhoto(BANNER_FILE, {
      caption: `${t.welcomeTitle}\n\n${t.welcomeBody}`,
    });
  } catch (err) {
    console.error("Banner error:", err);
    await ctx.reply(`${t.welcomeTitle}\n\n${t.welcomeBody}`);
  }

  await ctx.reply(t.chooseOption, mainMenuKeyboard(ctx));
}

/**
 * =======================
 * 6) MENU ACTIONS
 * =======================
 */
bot.start(async (ctx) => {
  await sendWelcome(ctx);
});

bot.command("menu", async (ctx) => {
  const t = L(ctx);
  await ctx.reply(t.chooseOption, mainMenuKeyboard(ctx));
});

bot.command("support", (ctx) => {
  const t = L(ctx);
  ctx.reply(
    t.supportMsg,
    Markup.inlineKeyboard([[Markup.button.url(t.menu.support, SUPPORT_URL)]])
  );
});

bot.action("menu_main", async (ctx) => {
  await ctx.answerCbQuery();
  const t = L(ctx);
  await ctx.reply(t.chooseOption, mainMenuKeyboard(ctx));
});

bot.action("menu_restart", async (ctx) => {
  await ctx.answerCbQuery();
  await sendWelcome(ctx);
});

bot.action("menu_promo", async (ctx) => {
  await ctx.answerCbQuery();
  const t = L(ctx);
  await ctx.reply(t.sections.promo, {
    parse_mode: "Markdown",
    ...backKeyboard(ctx),
  });
});

/**
 * =======================
 * 7) LANGUAGE SWITCH (auto)
 * =======================
 */
function setLanguage(code) {
  return async (ctx) => {
    const lang = texts[code];
    if (!lang) return;

    userLang.set(ctx.from.id, code);
    await ctx.answerCbQuery(`${lang.flag} ${lang.name} selected`);
    await ctx.reply(lang.langSet);
    await sendWelcome(ctx);
  };
}

Object.keys(texts).forEach((code) => {
  bot.action(`lang_${code}`, setLanguage(code));
});

/**
 * =======================
 * 8) OPTIONAL: Remove chat menu button
 * =======================
 * If you WANT to remove the bottom-left "menu button", run this once:
 * await bot.telegram.setChatMenuButton(undefined, { type: "default" });
 *
 * If you WANT to set it to your web app (kept here):
 */
async function setGlobalChatMenuButton() {
  try {
    await bot.telegram.setChatMenuButton(undefined, {
      type: "web_app",
      text: "🎮 Play now",
      web_app: { url: GAME_URL },
    });
  } catch (err) {
    console.error("setChatMenuButton error:", err);
  }
}

/**
 * =======================
 * 9) START BOT
 * =======================
 */
(async () => {
  await setGlobalChatMenuButton(); // comment this out if you don't want the chat menu button
  await bot.launch({ dropPendingUpdates: true });
  console.log("✅ Nova88 bot started (auto language buttons)");
})();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
