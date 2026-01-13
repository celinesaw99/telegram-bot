require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const path = require("path");
const Database = require('better-sqlite3');

// 1. Initialize Database
const db = new Database('nova88_users.db');
db.prepare(`CREATE TABLE IF NOT EXISTS users (
    telegram_id TEXT PRIMARY KEY,
    member_id TEXT,
    phone TEXT,
    external_username TEXT,
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

const BOT_TOKEN = process.env.BOT_TOKEN;
const GAME_URL = "https://m.nova8805.net/en?affCode=21093";
const BANNER_FILE = { source: path.join(__dirname, "images", "welcomebot.jpg") };

const bot = new Telegraf(BOT_TOKEN);
const userState = new Map(); // To track if we are waiting for a username

/**
 * =======================
 * 2) DATABASE HELPERS
 * =======================
 */
function getOrCreateUser(tgId) {
    let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(tgId);
    if (!user) {
        const newMemberId = 'N88-' + Math.floor(1000 + Math.random() * 9000);
        db.prepare('INSERT INTO users (telegram_id, member_id) VALUES (?, ?)').run(tgId, newMemberId);
        user = { telegram_id: tgId, member_id: newMemberId, phone: null, external_username: null };
    }
    return user;
}

/**
 * =======================
 * 3) KEYBOARD REDESIGN
 * =======================
 */
function mainMenuKeyboard(ctx, user) {
    const buttons = [
        [Markup.button.webApp("🎰 🔥 PLAY NOW 🔥 🎰", GAME_URL)],
    ];

    // Add "Verify Phone" if missing
    if (!user.phone) {
        buttons.push([Markup.button.contactRequest("📱 Verify Phone Number")]);
    }

    // Add "Link Username" if missing
    if (!user.external_username) {
        buttons.push([Markup.button.callback("🔗 Link Nova88 Username", "link_account")]);
    }

    buttons.push([Markup.button.url("🚀 Share", `https://t.me/share/url?url=t.me/yourbot`)]);
    return Markup.inlineKeyboard(buttons);
}

/**
 * =======================
 * 4) BOT LOGIC
 * =======================
 */
bot.start(async (ctx) => {
    const user = getOrCreateUser(ctx.from.id.toString());
    const caption = `🌟 Welcome to Nova88! 🌟\n\n🆔 Your ID: ${user.member_id}\n👤 Username: ${user.external_username || 'Not Linked'}\n\n✅ Fast Withdrawals\n✅ 24/7 Support`;
    
    await ctx.replyWithPhoto(BANNER_FILE, {
        caption: caption,
        ...mainMenuKeyboard(ctx, user)
    });
});

// Capture Phone Number
bot.on('contact', async (ctx) => {
    const phone = ctx.message.contact.phone_number;
    db.prepare('UPDATE users SET phone = ? WHERE telegram_id = ?').run(phone, ctx.from.id.toString());
    await ctx.reply("✅ Phone number verified and linked!");
    const user = getOrCreateUser(ctx.from.id.toString());
    await ctx.reply("Updated Menu:", mainMenuKeyboard(ctx, user));
});

// Capture External Username
bot.action('link_account', async (ctx) => {
    userState.set(ctx.from.id, 'AWAITING_USERNAME');
    await ctx.reply("Please type your Nova88 Website Username:");
});

bot.on('text', async (ctx) => {
    if (userState.get(ctx.from.id) === 'AWAITING_USERNAME') {
        const username = ctx.message.text;
        db.prepare('UPDATE users SET external_username = ? WHERE telegram_id = ?').run(username, ctx.from.id.toString());
        userState.delete(ctx.from.id);
        await ctx.reply(`✅ Success! Your account (${username}) is now bound to your ID.`);
    }
});

bot.launch();