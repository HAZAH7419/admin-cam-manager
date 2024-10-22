import { REST, Routes, SlashCommandBuilder } from 'discord.js'
import dotenv from "dotenv";
dotenv.config();

const token = process.env.DISCORD_TOKEN
const appId = process.env.DISCORD_APP_ID

const client = new REST().setToken(token)

const commands = [
    new SlashCommandBuilder()
        .setName('set-cam-value')
        .setDescription('Set a value in the config')
        .addStringOption(opt => opt.setName('name').setDescription('Name of the value').setRequired(true))
        .addStringOption(opt => opt.setName('value').setDescription('The value').setRequired(true))
]

await client.put(Routes.applicationCommands(appId), {
    body: commands.map(c => c.toJSON())
})