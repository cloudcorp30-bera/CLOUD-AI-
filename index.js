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

// Configuration - replace with your actual config or use environment variables
const config = {
    PREFIX: process.env.PREFIX || ".",
    MODE: process.env.MODE || "public",
    SESSION_ID: process.env.SESSION_ID || "BERA~H4sIAAAAAAAAA5VUW5OqOBD+K1t5xToqt4hVU7UoqKAoKnjbOg8RAkSuEi7iKf/7FuPMmXnYnZ19Szrp7q+//rp/gSQlFM9xA4a/QJaTChW4PRZNhsEQjErPwznoABcVCAwBWp1uh3vt7JNINyeSVsY7MeOi49XjqiAWu8LKUGR6sRYz+QU8OiArzxFxvghYRKdtMupVWL9Nuv69CKSbOtUMX9JTzuIChmHW8+79klqN/QIebUREcpL4ahbgGOcomuPGRCT/JnxFhErd9WZQ3NvSithdUR+wHKXw5h8dG6JAM058D0PW+B788XzaveLoSi8JddwT3MyMrezux5VgGMTdTKmJ696F23Bq/YRPiZ9gV3NxUpCi+Tbv49XSsNP9qQ/V8Wk+WAROLE4MRWc2VI+80hw3Pok9j+729veAK4F6vG6XSHPUkcVcHHfsCN6lC+Vg7fgrKDHhat+4vnAM7c/AzfxdK+H/4T3UassRlw3UdRwL5r7aDZq9Tmi2Nnrnor/y98pd4Y2A7Yffg59uwt1hMZlVnqiGRyvratQ0hcCx0mMgHboVOgRXMzysDgftAz4qy/wrlNT1wvPGGKwvzZE4Vu23ejYH6yaR5otVpQ3qeOKvF/clf7+buNA9eN4ub7Jy33n2ZDroh7iRTrS5++wuvhijXl9zceC/vFYU4kZzwbD/6IAc+4QWOSpImrQ2ju8A5FZb7OS4eGUX8NRcVq4UNCMuQKUW7Nb3ODsrxioXFofztEbxLM6yoDqQ+gV0QJanDqYUuzNCizRvDEwp8jEFw79+dkCCb8Wzb6/Z+h3gkZwWdlJmUYrc96a+PyLHScuk2DaJM24POAfD3ocZFwVJfNrSWCYodwJS4XGACgqGHooo/l0gzrH7Zvvt3Xq5uEAkoq2odVxX53qqLtkQGnQ6lVVfHvsy+Mj23rUnLYPAXVvsQLFZYV8R+WoI9bLmg+ldSCLHVa8OXV4Fntky1vHlH4KAIfDHrMeH7k2SoJiWYzXaCiWJUijPqMLcjdNxpKkhVPWRaSwvkyiabM/nyai8NpZ6NVU23ehelq2zMF/KG4/RDGYXC+P6pc3m4oo4+HOyvqyf1UwT5kuxOZw5bjPvZmszYq/m1OaFah/MFBOFZgVNy0uuDHKRKu6OmWv3I5k5nuqot0Fh6hn+lkHQSPwZnsmX9VNP8auQiQuGgBV4OIACC6HADVn4J/1Rt/1AWfYjwQXogAS1v1uAOEoznP9xxjkCHRA93TlOZHsDTpQgL7K9NkL78D4z0duuIq9yalO2V4/g19F/C/2fEJ7ktBLrPTqfYrwtk38ZyJGnHWxVquT+stzlvD+/rBzFWWkbypyEw2wzTxYKKrEZViELHo+fHZBFqPDSPG6nOT63ReZp2QpWS7z0q/0q9zTZ97dt2RGihfwxBBaJMS1QnIFhH4qSCDmO5Z+/zDzNZogGLQM7CK82ePwNWIV8a1EHAAA=",
    AUTO_REACT: true,
    AUTO_STATUS_SEEN: true,
    AUTO_STATUS_REPLY: true,
    STATUS_READ_MSG: "✅ Auto Status Seen Bot By JAWAD-MD"
};

const prefix = config.PREFIX;
const sessionName = "session";
const app = express();
const orange = chalk.bold.hex("#FFA500");
const lime = chalk.bold.hex("#32CD32");
let useQR = false;
let initialConnection = true;
const PORT = process.env.PORT || 3000;

// FIXED: Correct template string
const MAIN_LOGGER = pino({
    timestamp: () => `,"time":"${new Date().toJSON()}"`
});
const logger = MAIN_LOGGER.child({});
logger.level = "trace";

const msgRetryCounterCache = new NodeCache();

const __filename = new URL(import.meta.url).pathname;
// FIXED: Correct variable name
const __dirname = path.dirname(__filename);

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

async function loadGiftedSession() {
    console.log("🔍 Checking SESSION_ID format...");
    
    if (!config.SESSION_ID) {
        console.error('❌ No SESSION_ID provided in config!');
        return false;
    }
    
    // FIXED: Changed from "Gifted~" to "BERA~" to match your session ID
    if (config.SESSION_ID.startsWith("BERA~")) {
        console.log("✅ Detected BERA session format (GZIP compressed)");
        
        // Extract Base64 part (everything after "BERA~")
        const compressedBase64 = config.SESSION_ID.substring("BERA~".length);
        console.log("📏 Compressed Base64 length:", compressedBase64.length);
        
        try {
            // Decode Base64
            const compressedBuffer = Buffer.from(compressedBase64, 'base64');
            console.log("🔢 Decoded buffer length:", compressedBuffer.length);
            
            // Check if it's GZIP compressed
            if (compressedBuffer[0] === 0x1f && compressedBuffer[1] === 0x8b) {
                console.log("✅ Detected GZIP compression");
                
                // Decompress using GZIP
                const gunzip = promisify(zlib.gunzip);
                const decompressedBuffer = await gunzip(compressedBuffer);
                const sessionData = decompressedBuffer.toString('utf-8');
                
                console.log("📄 Decompressed session data (first 200 chars):");
                console.log(sessionData.substring(0, 200));
                
                // Try to parse as JSON
                try {
                    const parsedSession = JSON.parse(sessionData);
                    console.log("✅ Successfully parsed JSON session");
                    console.log("🔑 Session keys:", Object.keys(parsedSession));
                } catch (parseError) {
                    console.log("⚠️ Session data is not JSON, saving as raw string");
                }
                
                // Save session to file
                await fs.promises.writeFile(credsPath, sessionData);
                console.log("💾 Session saved to file successfully");
                return true;
            } else {
                console.log("❌ Not a valid GZIP file (missing magic bytes)");
                return false;
            }
        } catch (error) {
            console.error('❌ Failed to process BERA session:', error.message);
            console.error('🔍 Error details:', error);
            return false;
        }
    } else {
        console.log("⚠️ SESSION_ID does not start with BERA~");
        return false;
    }
}

async function downloadLegacySession() {
    console.log("Debugging SESSION_ID:", config.SESSION_ID);

    if (!config.SESSION_ID) {
        console.error('❌ Please add your session to SESSION_ID env !!');
        return false;
    }

    const sessdata = config.SESSION_ID.split("CLOUD-AI~")[1];

    if (!sessdata || !sessdata.includes("#")) {
        console.error('❌ Invalid SESSION_ID format! It must contain both file ID and decryption key.');
        return false;
    }

    const [fileID, decryptKey] = sessdata.split("#");

    try {
        console.log("📥 Downloading Legacy Session from Mega.nz...");
        // FIXED: Correct template string
        const file = File.fromURL(`https://mega.nz/file/${fileID}#${decryptKey}`);

        const data = await new Promise((resolve, reject) => {
            file.download((err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        await fs.promises.writeFile(credsPath, data);
        console.log("✅ Legacy Session Successfully Loaded !!");
        return true;
    } catch (error) {
        console.error('❌ Failed to download legacy session data:', error);
        return false;
    }
}

async function start() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        const { version, isLatest } = await fetchLatestBaileysVersion();
        // FIXED: Correct template string
        console.log(`🤖 JAWAD-MD using WA v${version.join('.')}, isLatest: ${isLatest}`);
        
        const Matrix = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: useQR,
            browser: ["JAWAD-MD", "safari", "3.3"],
            auth: state,
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id);
                    return msg.message || undefined;
                }
                return { conversation: "cloud ai whatsapp user bot" };
            }
        });

        Matrix.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                    start();
                }
            } else if (connection === 'open') {
                if (initialConnection) {
                    console.log(chalk.green("Connected Successfully cloud Ai 🤝"));
                    Matrix.sendMessage(Matrix.user.id, { 
                        image: { url: "https://files.catbox.moe/pf270b.jpg" }, 
                        caption: `Hello there User! 🙋🏿‍♂️ 

> Simple, Straightforward, But Loaded With Features 🎉. Meet CLOUD-AI WhatsApp Bot.

Thanks for using CLOUD AI 🚩 

> Join WhatsApp Channel: ♥️  
https://whatsapp.com/channel/0029VajJoCoLI8YePbpsnE3q

- YOUR PREFIX: = ${prefix}

Don't forget to give a star to the repo ⬇️  
https://github.com/DEVELOPER-BERA/CLOUD-AI

> © REGARDS BERA`
                    });
                    initialConnection = false;
                } else {
                    console.log(chalk.blue("♪ Connection reestablished after restart."));
                }
            }
        });
        
        Matrix.ev.on('creds.update', saveCreds);

        Matrix.ev.on("messages.upsert", async chatUpdate => await Handler(chatUpdate, Matrix, logger));
        Matrix.ev.on("call", async (json) => await Callupdate(json, Matrix));
        Matrix.ev.on("group-participants.update", async (messag) => await GroupUpdate(Matrix, messag));

        if (config.MODE === "public") {
            Matrix.public = true;
        } else if (config.MODE === "private") {
            Matrix.public = false;
        }

        Matrix.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const mek = chatUpdate.messages[0];
                console.log(mek);
                if (!mek.key.fromMe && config.AUTO_REACT) {
                    console.log(mek);
                    if (mek.message) {
                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        await doReact(randomEmoji, mek, Matrix);
                    }
                }
            } catch (err) {
                console.error('Error during auto reaction:', err);
            }
        });
        
        Matrix.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const mek = chatUpdate.messages[0];
                const fromJid = mek.key.participant || mek.key.remoteJid;
                if (!mek || !mek.message) return;
                if (mek.key.fromMe) return;
                if (mek.message?.protocolMessage || mek.message?.ephemeralMessage || mek.message?.reactionMessage) return; 
                if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN) {
                    await Matrix.readMessages([mek.key]);
                    
                    if (config.AUTO_STATUS_REPLY) {
                        const customMessage = config.STATUS_READ_MSG || '✅ Auto Status Seen Bot By JAWAD-MD';
                        await Matrix.sendMessage(fromJid, { text: customMessage }, { quoted: mek });
                    }
                }
            } catch (err) {
                console.error('Error handling messages.upsert event:', err);
            }
        });

    } catch (error) {
        console.error('Critical Error:', error);
        process.exit(1);
    }
}

async function init() {
    if (fs.existsSync(credsPath)) {
        console.log("✅ Existing session file found, loading it...");
        await start();
    } else {
        console.log("📝 No existing session file, checking config.SESSION_ID...");
        
        // FIXED: Changed from "Gifted~" to "BERA~"
        if (config.SESSION_ID && config.SESSION_ID.startsWith("BERA~")) {
            console.log("📥 Attempting to load BERA session (GZIP compressed)...");
            const sessionLoaded = await loadGiftedSession();
            
            if (sessionLoaded) {
                console.log("✅ BERA session loaded successfully!");
                await start();
            } else {
                console.log("❌ Failed to load BERA session, falling back to QR code.");
                useQR = true;
                await start();
            }
        } else if (config.SESSION_ID && config.SESSION_ID.includes("CLOUD-AI~")) {
            console.log("📥 Attempting to load legacy Mega.nz session...");
            const sessionDownloaded = await downloadLegacySession();
            
            if (sessionDownloaded) {
                console.log("✅ Legacy session downloaded, starting bot.");
                await start();
            } else {
                console.log("❌ Failed to download legacy session, using QR code.");
                useQR = true;
                await start();
            }
        } else {
            console.log("🔒 No valid session found in config, QR code will be printed for authentication.");
            useQR = true;
            await start();
        }
    }
}

init();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    // FIXED: Correct template string
    console.log(`Server is running on port ${PORT}`);
});
