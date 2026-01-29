import dotenv from 'dotenv';
dotenv.config();

import {
    makeWASocket,
    Browsers,
    fetchLatestBaileysVersion,
    DisconnectReason,
    useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { Handler, Callupdate, GroupUpdate } from './data/index.js';
import express from 'express';
import pino from 'pino';
import fs from 'fs';
import { File } from 'megajs';
import NodeCache from 'node-cache';
import path from 'path';
import chalk from 'chalk';
import moment from 'moment-timezone';
import axios from 'axios';
import pkg from './lib/autoreact.cjs';
import zlib from 'zlib';
import { promisify } from 'util';

const { emojis, doReact } = pkg;

// CORRECT SESSION ID (Full working version)
const config = {
    PREFIX: process.env.PREFIX || ".",
    MODE: process.env.MODE || "public",
    SESSION_ID: process.env.SESSION_ID || "BERA~H4sIAAAAAAAAA5VUW5OqOBD+K1t5xToqt4hVU7UoqKAoKnjbOg8RAkSuEi7iKf/7FuPMmXnYnZ19Szrp7q+//rp/gSQlFM9xA4a/QJaTChW4PRZNhsEQjErPwznoABcVCAwBWp1uh3vt7JNINyeSVsY7MeOi49XjqiAWu8LKUGR6sRYz+QU8OiArzxFxvghYRKdtMupVWL9Nuv69CKSbOtUMX9JTzuIChmHW8+79klqN/QIebUREcpL4ahbgGOcomuPGRCT/JnxFhErd9WZQ3NvSithdUR+wHKXw5h8dG6JAM058D0PW+B788XzaveLoSi8JddwT3MyMrezux5VgGMTdTKmJ696F23Bq/YRPiZ9gV3NxUpCi+Tbv49XSsNP9qQ/V8Wk+WAROLE4MRWc2VI+80hw3Pok9j+729veAK4F6vG6XSHPUkcVcHHfsCN6lC+Vg7fgrKDHhat+4vnAM7c/AzfxdK+H/4T3UassRlw3UdRwL5r7aDZq9Tmi2Nnrnor/y98pd4Y2A7Yffg59uwt1hMZlVnqiGRyvratQ0hcCx0mMgHboVOgRXMzysDgftAz4qy/wrlNT1wvPGGKwvzZE4Vu23ejYH6yaR5otVpQ3qeOKvF/clf7+buNA9eN4ub7Jy33n2ZDroh7iRTrS5++wuvhijXl9zceC/vFYU4kZzwbD/6IAc+4QWOSpImrQ2ju8A5FZb7OS4eGUX8NRcVq4UNCMuQKUW7Nb3ODsrxioXFofztEbxLM6yoDqQ+gV0QJanDqYUuzNCizRvDEwp8jEFw79+dkCCb8Wzb6/Z+h3gkZwWdlJmUYrc96a+PyLHScuk2DaJM24POAfD3ocZFwVJfNrSWCYodwJS4XGACgqGHooo/l0gzrH7Zvvt3Xq5uEAkoq2odVxX53qqLtkQGnQ6lVVfHvsy+Mj23rUnLYPAXVvsQLFZYV8S+WoI9bLmg+ldSCLHVa8OXV4Fntky1vHlH4KAIfDHrMeH7k2SoJiWYzXaCiWJUijPqMLcjdNxpKkhVPWRaSwvkyiabM/nyai8NpZ6NVU23ehelq2zMF/KG4/RDGYXC+P6pc3m4oo4+HOyvqyf1UwT5kuxOZw5bjPvZmszYq/m1OaFah/MFBOFZgVNy0uuDHKRKu6OmWv3I5k5nuqot0Fh6hn+lkHQSPwZnsmX9VNP8auQiQuGgBV4OIACC6HADVn4J/1Rt/1AWfYjwQXogAS1v1uAOEoznP9xxjkCHRA93TlOZHsDTpQgL7K9NkL78D4z0duuIq9yalO2V4/g19F/C/2fEJ7ktBLrPTqfYrwtk38ZyJGnHWxVquT+stzlvD+/rBzFWWkbypyEw2wzTxYKKrEZViELHo+fHZBFqPDSPG6nOT63ReZp2QpWS7z0q/0q9zTZ97dt2RGihfwxBBaJMS1QnIFhH4qSCDmO5Z+/zDzNZogGLQM7CK82ePwNWIV8a1EHAAA=",
    AUTO_REACT: process.env.AUTO_REACT !== "false",
    AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN !== "false",
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY !== "false",
    STATUS_READ_MSG: process.env.STATUS_READ_MSG || "✅ Auto Status Seen Bot By JAWAD-MD"
};

console.log("🚀 CLOUD-AI WhatsApp Bot Starting...");
console.log("📏 Session ID Length:", config.SESSION_ID.length);
console.log("✅ Starts with BERA~:", config.SESSION_ID.startsWith("BERA~"));

const prefix = config.PREFIX;
const sessionName = "session";
const app = express();
const orange = chalk.bold.hex("#FFA500");
const lime = chalk.bold.hex("#32CD32");
let useQR = false;
let initialConnection = true;
const PORT = process.env.PORT || 3000;

const MAIN_LOGGER = pino({
    timestamp: () => `,"time":"${new Date().toJSON()}"`
});
const logger = MAIN_LOGGER.child({});
logger.level = "trace";

const msgRetryCounterCache = new NodeCache();

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

async function loadGiftedSession() {
    console.log("🔄 Processing BERA session...");
    
    if (!config.SESSION_ID) {
        console.error('❌ No SESSION_ID provided!');
        return false;
    }
    
    if (config.SESSION_ID.startsWith("BERA~")) {
        console.log("✅ Valid BERA session format detected");
        
        // Extract Base64 part
        const compressedBase64 = config.SESSION_ID.substring("BERA~".length);
        
        try {
            // Decode Base64
            const compressedBuffer = Buffer.from(compressedBase64, 'base64');
            
            // Check GZIP magic bytes
            const isGzip = compressedBuffer[0] === 0x1f && compressedBuffer[1] === 0x8b;
            
            if (!isGzip) {
                console.log("⚠️ Not GZIP format, trying raw data...");
                // Try saving as raw data
                await fs.promises.writeFile(credsPath, compressedBase64);
                console.log("💾 Saved as raw Base64 data");
                return true;
            }
            
            // Decompress GZIP
            const gunzip = promisify(zlib.gunzip);
            try {
                const decompressedBuffer = await gunzip(compressedBuffer);
                const sessionData = decompressedBuffer.toString('utf-8');
                
                // Try to parse as JSON
                try {
                    JSON.parse(sessionData);
                    console.log("✅ Valid JSON session data");
                } catch (e) {
                    console.log("⚠️ Not JSON, but saving anyway");
                }
                
                await fs.promises.writeFile(credsPath, sessionData);
                console.log("✅ Session saved successfully!");
                return true;
            } catch (gzipError) {
                console.log("⚠️ GZIP decompression failed, trying raw data...");
                // Save as raw data
                await fs.promises.writeFile(credsPath, compressedBase64);
                console.log("💾 Saved as raw data");
                return true;
            }
            
        } catch (error) {
            console.error('❌ Error processing session:', error.message);
            return false;
        }
    }
    return false;
}

async function start() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log(`🤖 Using WhatsApp v${version.join('.')}`);
        
        const Matrix = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: useQR,
            browser: ["CLOUD-AI", "Chrome", "3.0"],
            auth: state,
            getMessage: async (key) => {
                return { conversation: "CLOUD-AI WhatsApp Bot" };
            }
        });

        Matrix.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;
            
            // Display QR code if available
            if (qr) {
                console.log("\n" + "=".repeat(50));
                console.log("📱 SCAN THIS QR CODE WITH WHATSAPP:");
                console.log("=".repeat(50));
                // Simple QR display
                console.log(`QR Code: ${qr.substring(0, 50)}...`);
                console.log("=".repeat(50));
                console.log("1. Open WhatsApp on your phone");
                console.log("2. Tap Menu → Linked Devices");
                console.log("3. Tap Link a Device");
                console.log("4. Scan the QR code above");
                console.log("=".repeat(50) + "\n");
            }
            
            if (connection === 'close') {
                console.log("🔌 Connection closed");
                const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
                if (shouldReconnect) {
                    console.log("🔄 Reconnecting in 3 seconds...");
                    setTimeout(start, 3000);
                }
            } else if (connection === 'open') {
                if (initialConnection) {
                    console.log(chalk.green.bold("✅ CONNECTED TO WHATSAPP SUCCESSFULLY! 🤝"));
                    
                    // Get bot info
                    const botName = Matrix.user?.name || "CLOUD-AI";
                    const botNumber = Matrix.user?.id.split(':')[0] || "Unknown";
                    
                    console.log(chalk.cyan(`🤖 Bot Name: ${botName}`));
                    console.log(chalk.cyan(`📱 Bot Number: ${botNumber}`));
                    console.log(chalk.cyan(`🎯 Prefix: ${prefix}`));
                    console.log(chalk.cyan(`🌐 Mode: ${config.MODE}`));
                    
                    // Send welcome message
                    try {
                        await Matrix.sendMessage(Matrix.user.id, { 
                            text: `🚀 *CLOUD-AI WhatsApp Bot Activated!*

✅ *Connection Status:* Online
🎯 *Command Prefix:* ${prefix}
🌐 *Bot Mode:* ${config.MODE}
📱 *Your Number:* ${botNumber}

📢 *Join our channel:*
https://whatsapp.com/channel/0029VajJoCoLI8YePbpsnE3q

⭐ *GitHub Repo:*
https://github.com/DEVELOPER-BERA/CLOUD-AI

> Bot is now ready to receive commands!
> Type ${prefix}help for available commands.

© REGARDS BERA 🤖`
                        });
                        console.log("📩 Welcome message sent to owner");
                    } catch (e) {
                        console.log("⚠️ Could not send welcome message");
                    }
                    initialConnection = false;
                } else {
                    console.log(chalk.blue("🔁 Connection reestablished"));
                }
            }
        });
        
        Matrix.ev.on('creds.update', saveCreds);

        // Load message handlers
        if (typeof Handler === 'function') {
            Matrix.ev.on("messages.upsert", async chatUpdate => await Handler(chatUpdate, Matrix, logger));
        } else {
            console.log("⚠️ Message handler not found");
        }
        
        if (typeof Callupdate === 'function') {
            Matrix.ev.on("call", async (json) => await Callupdate(json, Matrix));
        }
        
        if (typeof GroupUpdate === 'function') {
            Matrix.ev.on("group-participants.update", async (messag) => await GroupUpdate(Matrix, messag));
        }

        // Set bot mode
        Matrix.public = config.MODE === "public";
        console.log(`🔧 Bot Mode: ${Matrix.public ? 'PUBLIC 🌍' : 'PRIVATE 🔒'}`);

        // Auto-react feature
        if (config.AUTO_REACT && emojis && doReact) {
            Matrix.ev.on('messages.upsert', async (chatUpdate) => {
                try {
                    const mek = chatUpdate.messages[0];
                    if (!mek.key.fromMe && mek.message) {
                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        await doReact(randomEmoji, mek, Matrix);
                    }
                } catch (err) {
                    // Silent fail for auto-react
                }
            });
        }
        
        // Auto-status seen feature
        if (config.AUTO_STATUS_SEEN) {
            Matrix.ev.on('messages.upsert', async (chatUpdate) => {
                try {
                    const mek = chatUpdate.messages[0];
                    if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                        await Matrix.readMessages([mek.key]);
                        
                        if (config.AUTO_STATUS_REPLY) {
                            const fromJid = mek.key.participant || mek.key.remoteJid;
                            const customMessage = config.STATUS_READ_MSG;
                            await Matrix.sendMessage(fromJid, { text: customMessage }, { quoted: mek });
                        }
                    }
                } catch (err) {
                    // Silent fail for status handling
                }
            });
        }

        console.log(chalk.green.bold("\n✨ BOT IS NOW READY AND RUNNING! ✨\n"));

    } catch (error) {
        console.error('❌ Critical Error:', error.message);
        if (error.stack) {
            console.error('🔍 Stack:', error.stack.split('\n')[0]);
        }
        console.log("🔄 Restarting in 5 seconds...");
        setTimeout(start, 5000);
    }
}

async function init() {
    console.log("=".repeat(60));
    console.log(chalk.bold.cyan("🤖 CLOUD-AI WHATSAPP BOT v3.0"));
    console.log("=".repeat(60));
    
    if (fs.existsSync(credsPath)) {
        console.log("✅ Found existing session file");
        await start();
    } else {
        console.log("📝 No session file found, checking for session ID...");
        
        if (config.SESSION_ID && config.SESSION_ID.startsWith("BERA~")) {
            console.log("🔄 Loading BERA session...");
            const sessionLoaded = await loadGiftedSession();
            
            if (sessionLoaded) {
                console.log("✅ Session loaded successfully!");
                await start();
            } else {
                console.log("❌ Failed to load session, using QR authentication");
                useQR = true;
                await start();
            }
        } else {
            console.log("🔑 No valid session ID found");
            console.log("📱 QR code authentication will be used");
            useQR = true;
            await start();
        }
    }
}

// Initialize the bot
init();

// Web server
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>🤖 CLOUD-AI WhatsApp Bot</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .container {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    max-width: 500px;
                    width: 100%;
                    text-align: center;
                }
                h1 {
                    color: #333;
                    margin-bottom: 20px;
                    font-size: 2.5em;
                }
                .status {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                    text-align: left;
                }
                .status-item {
                    margin: 10px 0;
                    display: flex;
                    justify-content: space-between;
                }
                .status-label {
                    font-weight: bold;
                    color: #555;
                }
                .status-value {
                    color: #333;
                }
                .online {
                    color: #10b981;
                    font-weight: bold;
                }
                .links {
                    margin-top: 30px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .btn {
                    display: inline-block;
                    padding: 12px 24px;
                    background: #667eea;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                    transition: all 0.3s ease;
                }
                .btn:hover {
                    background: #5a67d8;
                    transform: translateY(-2px);
                }
                .github {
                    background: #333;
                }
                .github:hover {
                    background: #000;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🤖 CLOUD-AI</h1>
                <p style="color: #666; margin-bottom: 30px;">Advanced WhatsApp Bot</p>
                
                <div class="status">
                    <div class="status-item">
                        <span class="status-label">Status:</span>
                        <span class="status-value online">🟢 ONLINE</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Prefix:</span>
                        <span class="status-value">${prefix}</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Mode:</span>
                        <span class="status-value">${config.MODE}</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Port:</span>
                        <span class="status-value">${PORT}</span>
                    </div>
                </div>
                
                <div class="links">
                    <a href="https://whatsapp.com/channel/0029VajJoCoLI8YePbpsnE3q" class="btn" target="_blank">
                        📢 Join WhatsApp Channel
                    </a>
                    <a href="https://github.com/DEVELOPER-BERA/CLOUD-AI" class="btn github" target="_blank">
                        ⭐ Star on GitHub
                    </a>
                </div>
                
                <p style="margin-top: 30px; color: #888; font-size: 0.9em;">
                    © REGARDS BERA | CLOUD-AI WhatsApp Bot
                </p>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(chalk.green(`🌐 Web server running on port ${PORT}`));
    console.log(chalk.blue(`🔗 Open: http://localhost:${PORT}`));
});

// Handle process termination
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🔻 Shutting down CLOUD-AI bot...'));
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    console.error(chalk.red('⚠️ Uncaught Exception:'), error.message);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(chalk.red('⚠️ Unhandled Rejection at:'), promise, 'reason:', reason);
});
