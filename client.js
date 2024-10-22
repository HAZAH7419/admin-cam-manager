import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import WebSocket from "ws";
import fetch from "node-fetch";

const ALL_ACTIONS_TO_MONITOR = ["CHAT", "MATCH ENDED"];

function tryDatetime(obj) {
  const ret = {};
  for (const [key, value] of Object.entries(obj)) {
    try {
      ret[key] = new Date(value);
    } catch (e) {
      ret[key] = value;
    }
  }
  return ret;
}

class CRCONWebSocketClient {
  constructor(server) {
    this.server = server;
    this.ws = null; // Holds the WebSocket instance
    this.retryCount = 0; // Keeps track of retry attempts
    this.maxRetries = 5; // Set maximum retries to avoid infinite loops
    this.lastSeenId = null; // Store the last processed message ID
  }

  async startSocket(stopEvent) {
    this.stopEvent = stopEvent;

    const headers = {
      Authorization: `Bearer ${this.server.rconApiKey}`,
      ...this.server.rconLoginHeaders,
    };
    const websocketUrl = `${this.server.rconWebSocket}/ws/logs`;

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log("Already connected. No need to reconnect.");
      return; // If already connected, stop further attempts
    }

    try {
      this.ws = new WebSocket(websocketUrl, { headers });

      this.ws.on("open", () => {
        console.log(`Connected to CRCON websocket ${websocketUrl}`);
        this.retryCount = 0; // Reset retry count on successful connection
        this.ws.send(
          JSON.stringify({
            last_seen_id: this.lastSeenId,
            actions: ALL_ACTIONS_TO_MONITOR,
          })
        );
      });

      this.ws.on("message", async (data) => {
        const message = data.toString();
        try {
          await this.handleIncomingMessage(this.ws, message);
        } catch (e) {
          console.error(`Error handling message: ${message}`, e);
        }
      });

      this.ws.on("close", () => {
        console.warn("WebSocket connection closed");
        this.handleReconnection(); // Try reconnecting after close
      });

      this.ws.on("error", (err) => {
        console.error(`WebSocket error: ${err}`);
        this.handleReconnection(); // Try reconnecting after error
      });
    } catch (e) {
      console.error(`Error connecting to ${websocketUrl}`, e);
      this.handleReconnection(); // Try reconnecting after an exception
    }
  }

  handleReconnection() {
    if (this.retryCount < this.maxRetries) {
      this.retryCount += 1;
      const retryDelay = Math.min(30000, this.retryCount * 5000); // Exponential backoff
      console.log(`Attempting to reconnect in ${retryDelay / 1000} seconds...`);
      setTimeout(() => this.startSocket(this.stopEvent), retryDelay);
    } else {
      console.error(
        `Max retries reached (${this.maxRetries}). Stopping reconnection attempts.`
      );
    }
  }

  async handleIncomingMessage(ws, message) {
    const jsonObject = JSON.parse(message);
    if (jsonObject) {
      const logsBundle = jsonObject.logs || [];
      // Process logs here
      logsBundle.forEach((object) => {
        const log = object.log;
        if (log.sub_content.includes("!cam")) {
          this.handleAdminCamAccess(log.player_id_1, log.player_name_1);
        }
        // if (log.sub_content.includes("!remove")) {
        //   this.removeAllAdmins();
        // }
        // Save the latest processed log ID
        this.lastSeenId = log.id;

        if (log.action == "MATCH ENDED") {
          this.removeAllAdmins();
        }
      });
    }
  }

  async handleAdminCamAccess(steamId, playerName) {
    const headers = {
      Authorization: `Bearer ${this.server.rconApiKey}`,
      "Content-Type": "application/json",
      ...this.server.rconLoginHeaders,
    };
    try {
      const response = await fetch(`${this.server.rconHttp}/api/add_admin`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          player_id: steamId,
          description: playerName,
          role: "Spectator",
        }),
      });
      const data = await response.json();
      console.log("Admin cam access granted:", data);
    } catch (error) {
      console.error("Error granting admin cam access:", error);
    }
  }

  async removeAllAdmins() {
    const headers = {
      Authorization: `Bearer ${this.server.rconApiKey}`,
      "Content-Type": "application/json",
      ...this.server.rconLoginHeaders,
    };

    let adminList = [];

    try {
      const response = await fetch(
        `${this.server.rconHttp}/api/get_admin_ids`,
        {
          method: "GET",
          headers: headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Node-fetch automatically decompresses gzipped responses.
      adminList = await response.json();
    } catch (error) {
      console.error("Error fetching admin player IDs:", error);
    }

    for (const admin of adminList.result) {
      try {
        const response = await fetch(
          `${this.server.rconHttp}/api/remove_admin`,
          {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              player_id: admin.player_id,
            }),
          }
        );

        const data = await response.json();
        console.log(
          `Admin access removed for ${admin.playerName} (${admin.steamId}):`,
          data
        );
      } catch (error) {
        console.error(
          `Error removing admin cam access for ${admin.playerName} (${admin.steamId}):`,
          error
        );
      }
    }
  }
}

// Load environment variables for the server configuration
const server = {
  rconApiKey: process.env.RCON_API_KEY,
  rconLoginHeaders: JSON.parse(process.env.RCON_LOGIN_HEADERS || "{}"),
  rconWebSocket: process.env.RCON_WEB_SOCKET,
  rconHttp: process.env.RECON_HTTP,
};

const client = new CRCONWebSocketClient(server);
client.startSocket(false);
