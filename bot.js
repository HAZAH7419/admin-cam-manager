import { Client, Events, GatewayIntentBits } from "discord.js";

export class DiscordBot {
  constructor(config, state) {
    this.config = config;

    // AppState
    this.state = state;

    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });

    this.client.once(Events.ClientReady, (ready) => {
      console.info(`Bot is ready - ${ready.user.tag}`);
    });

    this.client.on(Events.InteractionCreate, (action) => {
      if (action.isChatInputCommand()) {
        if (action.commandName === "admin-cam-script") {
          const value = action.options.getString("enable", true);
          let message;

          // validate...

          console.info(`updating flag: ${value}`);
          this.state.flags.set("enable", value);

          message =
            value === "false"
              ? "Admin cam script is disabled"
              : "Admin cam script is enabled";

          action.reply({ content: message, ephemeral: true });
        } else if (action.commandName === "add-streamer") {
          const id = action.options.getString("id", true);

          this.state.addStreamer(id);

          action.reply({ content: "streamer added", ephemeral: true });
        }
      }
    });
  }

  async start() {
    await this.client.login(this.config.token);
  }
}
