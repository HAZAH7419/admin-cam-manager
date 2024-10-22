import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import { AppState } from './state.js'
import { CRCONWebSocketClient } from './client.js'
import { DiscordBot } from './bot.js'

// Load environment variables for the server configuration
const server = {
    rconApiKey: process.env.RCON_API_KEY,
    rconLoginHeaders: JSON.parse(process.env.RCON_LOGIN_HEADERS || "{}"),
    rconWebSocket: process.env.RCON_WEB_SOCKET,
    rconHttp: process.env.RECON_HTTP,
    token: process.env.DISCORD_TOKEN
};
  
const state = new AppState()

const client = new CRCONWebSocketClient(server, state);
client.startSocket(false);

const bot = new DiscordBot(server, state)
bot.start()