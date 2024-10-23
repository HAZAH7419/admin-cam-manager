import { REST, Routes, SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.DISCORD_TOKEN;
const appId = process.env.DISCORD_APP_ID;

const client = new REST().setToken(token);

const commands = [
  new SlashCommandBuilder()
    .setName("admin-cam-script")
    .setDescription("Set a value in the config")
    .addStringOption((opt) =>
      opt
        .setName("enable")
        .setDescription("Name of the value")
        .setRequired(true)
        .addChoices(
          { name: "True", value: "true" },
          { name: "False", value: "false" }
        )
    ),
];

await client.put(Routes.applicationCommands(appId), {
  body: commands.map((c) => c.toJSON()),
});
