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
const BOT_VERSION = "DB-REPORT-009-FINAL";

const bot = new Telegraf(BOT_TOKEN);
const userState = new Map();

/**
 * =======================
 * 2) KEYBOARDS (FIXED)
 * =======================
 */

// 1. INLINE KEYBOARD (Attached to the photo)
function inlineMenu(ctx, user) {
  const buttons = [
    [Markup.button.webApp("🎰 🔥 PLAY NOW 🔥 🎰", GAME_URL)],
    [Markup.button.callback("🔗 Link Nova88 Account", "link_account")]
  ];
  return Markup.inlineKeyboard(buttons);
}

// 2. REPLY KEYBOARD (At the bottom of the screen)
function replyMenu(user) {
  const buttons = [];
  
  // Phone Request MUST be here, not in inline
  if (!user.phone) {
    buttons.push([Markup.button.contactRequest("📱 Verify My Phone Number")]);
  }
  
  buttons.push(["🇺🇸 EN", "🇨🇳 ZH", "🇹🇭 TH"]);
  buttons.push(["🇮🇳 HI", "🇧🇩 BN", "🇮🇩 ID", "🇻🇳 VI"]);
  
  return Markup.keyboard(buttons).resize().oneTime(false);
}

/**
 * =======================
 * 3) LOGIC
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

async function sendWelcome(ctx) {
  const user = getOrCreateUser(ctx.from.id);
  const caption = `🌟 Welcome to Nova88! 🌟\n\n🆔 ID: <b>${user.member_id}</b>\n👤 Web: <b>${user.external_username || 'Not Linked'}</b>\n\n🧩 Version: ${BOT_VERSION}`;

  try {
    await ctx.replyWithPhoto(BANNER_FILE, { 
      caption, 
      parse_mode: 'HTML', 
      ...inlineMenu(ctx, user) 
    });
    // Send the bottom keyboard separately to avoid the crash
    await ctx.reply("Select an option below to verify or change language 👇", replyMenu(user));
  } catch (err) {
    console.error("Crash prevented:", err.message);
  }
}

bot.start(sendWelcome);

bot.on('contact', async (ctx) => {
    db.prepare('UPDATE users SET phone = ? WHERE telegram_id = ?').run(ctx.message.contact.phone_number, ctx.from.id.toString());
    await ctx.reply("✅ Phone verified!");
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
        await ctx.reply("✅ Account linked!");
        return sendWelcome(ctx);
    }
    
    // Handle Language buttons from the bottom keyboard
    if (["🇺🇸 EN", "🇨🇳 ZH", "🇹🇭 TH", "🇮🇳 HI", "🇧🇩 BN", "🇮🇩 ID", "🇻🇳 VI"].includes(text)) {
        await ctx.reply(`Language changed to ${text}`);
        return sendWelcome(ctx);
    }
});

bot.launch().then(() => console.log("✅ Bot Fixed and Running"));