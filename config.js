// config.js - Configuration for CLOUD-AI WhatsApp Bot

export default {
    // Bot Prefix for commands
    PREFIX: ".",
    
    // Bot Mode: "public" or "private"
    MODE: "public",
    
    // Session Configuration
    // Format options:
    // 1. Gifted (GZIP compressed): "BERA~[base64_gzipped_session_data]"
    // 2. Legacy Mega.nz: "CLOUD-AI~[file_id]#[decryption_key]"
    // 3. Leave empty to use QR code authentication
    SESSION_ID: "BERA~H4sIAAAAAAAAA5VUW5OqOBD+K1t5xToqt4hVU7UoqKAoKnjbOg8RAkSuEi7iKf/7FuPMmXnYnZ19Szrp7q+//rp/gSQlFM9xA4a/QJaTChW4PRZNhsEQjErPwznoABcVCAwBWp1uh3vt7JNINyeSVsY7MeOi49XjqiAWu8LKUGR6sRYz+QU8OiArzxFxvghYRKdtMupVWL9Nuv69CKSbOtUMX9JTzuIChmHW8+79klqN/QIebUREcpL4ahbgGOcomuPGRCT/JnxFhErd9WZQ3NvSithdUR+wHKXw5h8dG6JAM058D0PW+B788XzaveLoSi8JddwT3MyMrezux5VgGMTdTKmJ696F23Bq/YRPiZ9gV3NxUpCi+Tbv49XSsNP9qQ/V8Wk+WAROLE4MRWc2VI+80hw3Pok9j+729veAK4F6vG6XSHPUkcVcHHfsCN6lC+Vg7fgrKDHhat+4vnAM7c/AzfxdK+H/4T3UassRlw3UdRwL5r7aDZq9Tmi2Nnrnor/y98pd4Y2A7Yffg59uwt1hMZlVnqiGRyvratQ0hcCx0mMgHboVOgRXMzysDgftAz4qyvwrlNT1wvPGGKwvzZE4Vu23ejYH6yaR5otVpQ3qeOKvF/clf7+buNA9eN4ub7Jy33n2ZDroh7iRTrS5++wuvhijXl9zceC/vFYU4kZzwbD/6IAc+4QWOSpImrQ2ju8A5FZb7OS4eGUX8NRcVq4UNCMuQKUW7Nb3ODsrxioXFofztEbxLM6yoDqQ+gV0QJanDqYUuzNCizRvDEwp8jEFw79+dkCCb8Wzb6/Z+h3gkZwWdlJmUYrc96a+PyLHScuk2DaJM24POAfD3ocZFwVJfNrSWCYodwJS4XGACgqGHooo/l0gzrH7Zvvt3Xq5uEAkoq2odVxX53qqLtkQGnQ6lVVfHvsy+Mj23rUnLYPAXVvsQLFZYV8R+WoI9bLmg+ldSCLHVa8OXV4Fntky1vHlH4KAIfDHrMeH7k2SoJiWYzXaCiWJUijPqMLcjdNxpKkhVPWRaSwvkyiabM/nyai8NpZ6NVU23ehelq2zMF/KG4/RDGYXC+P6pc3m4oo4+HOyvqyf1UwT5kuxOZw5bjPvZmszYq/m1OaFah/MFBOFZgVNy0uuDHKRKu6OmWv3I5k5nuqot0Fh6hn+lkHQSPwZnsmX9VNP8auQiQuGgBV4OIACC6HADVn4J/1Rt/1AWfYjwQXogAS1v1uAOEoznP9xxjkCHRA93TlOZHsDTpQgL7K9NkL78D4z0duuIq9yalO2V4/g19F/C/2fEJ7ktBLrPTqfYrwtk38ZyJGnHWxVquT+stzlvD+/rBzFWWkbypyEw2wzTxYKKrEZViELHo+fHZBFqPDSPG6nOT63ReZp2QpWS7z0q/0q9zTZ97dt2RGihfwxBBaJMS1QnIFhH4qSCDmO5Z+/zDzNZogGLQM7CK82ePwNWIV8a1EHAAA=",
    
    // Auto-reaction settings
    AUTO_REACT: true,
    
    // Status auto-seen settings
    AUTO_STATUS_SEEN: true,
    AUTO_STATUS_REPLY: true,
    STATUS_READ_MSG: "✅ Auto Status Seen Bot By JAWAD-MD",
    
    // Bot Owner Information
    OWNER_NAME: "BERA",
    OWNER_NUMBER: "923184474176",
    
    // Bot Information
    BOT_NAME: "CLOUD-AI",
    VERSION: "3.0.0",
    GITHUB_REPO: "https://github.com/DEVELOPER-BERA/CLOUD-AI",
    
    // WhatsApp Channel
    WHATSAPP_CHANNEL: "https://whatsapp.com/channel/0029VajJoCoLI8YePbpsnE3q",
    
    // Media Assets
    WELCOME_IMAGE: "https://files.catbox.moe/pf270b.jpg",
    
    // Feature Toggles
    ALLOW_GROUPS: true,
    ALLOW_DM: true,
    READ_MESSAGES: true,
    READ_STATUS: true,
    
    // API Settings (if needed)
    API_KEY: "",
    API_URL: "",
    
    // Database Settings (if applicable)
    DATABASE_URL: "",
    
    // Performance Settings
    MAX_FILE_SIZE: 100, // MB
    MAX_USERS: 1000,
    
    // Security Settings
    ALLOWED_USERS: [], // Add specific numbers if in private mode
    BLOCKED_USERS: [],
    
    // Auto-delete messages (in seconds)
    AUTO_DELETE: 0, // 0 = disabled
    
    // Language Settings
    LANGUAGE: "en",
    
    // Timezone Settings
    TIMEZONE: "Asia/Karachi",
    
    // Logging Settings
    LOG_LEVEL: "info", // error, warn, info, debug, trace
    LOG_TO_FILE: false,
    
    // Update Settings
    AUTO_UPDATE: true,
    
    // Backup Settings
    AUTO_BACKUP: true,
    BACKUP_INTERVAL: 24, // hours
    
    // Maintenance Mode
    MAINTENANCE_MODE: false,
    MAINTENANCE_MESSAGE: "🤖 Bot is under maintenance. Please try again later.",
    
    // Rate Limiting
    RATE_LIMIT: true,
    MAX_REQUESTS_PER_MINUTE: 30,
    
    // Feature-specific Settings
    // AI Features
    ENABLE_AI: true,
    AI_PROVIDER: "openai", // openai, gemini, etc.
    
    // Download Features
    ALLOW_YOUTUBE_DL: true,
    ALLOW_INSTAGRAM_DL: true,
    ALLOW_TIKTOK_DL: true,
    
    // Sticker Settings
    STICKER_PACK_NAME: "CLOUD-AI",
    STICKER_AUTHOR: "BERA",
    
    // Welcome/Goodbye Messages
    WELCOME_MESSAGE: "Welcome to the group! 🤝",
    GOODBYE_MESSAGE: "Goodbye! 👋",
    
    // Anti-spam Settings
    ANTI_SPAM: true,
    ANTI_SPAM_THRESHOLD: 5,
    ANTI_SPAM_INTERVAL: 10, // seconds
    
    // Auto-reply Settings
    AUTO_REPLY: false,
    AUTO_REPLY_MESSAGE: "I'm currently busy. I'll get back to you soon! ⏳",
    
    // Session Security
    ENCRYPT_SESSION: true,
    
    // Web Server Settings
    WEB_SERVER: true,
    WEB_PORT: 3000,
    WEB_DASHBOARD: false,
    
    // Plugin Settings
    ENABLE_PLUGINS: true,
    PLUGINS_DIR: "./plugins",
    
    // Customization
    CUSTOM_RESPONSES: {
        "hello": "Hello there! How can I help you today? 😊",
        "help": "Type .help to see all available commands! 📚",
        "owner": "My owner is BERA. Contact: 923184474176 📞"
    },
    
    // Development Mode
    DEBUG_MODE: false,
    TEST_MODE: false
};

// Alternative environment-based configuration
export const config = {
    // You can also use environment variables
    get PREFIX() {
        return process.env.PREFIX || ".";
    },
    
    get MODE() {
        return process.env.MODE || "public";
    },
    
    get SESSION_ID() {
        return process.env.SESSION_ID || "";
    },
    
    get AUTO_REACT() {
        return process.env.AUTO_REACT !== "false";
    },
    
    // ... other getters for environment variables
};
