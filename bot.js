import { Client, Events, GatewayIntentBits } from 'discord.js'

export class DiscordBot {
    constructor(config, state) {
        this.config = config

        // AppState
        this.state = state

        this.client = new Client({ intents: [GatewayIntentBits.Guilds] })
    
        this.client.once(Events.ClientReady, (ready) => {
            console.info(`Bot is ready - ${ready.user.tag}`)
        })
    
        this.client.on(Events.InteractionCreate, (action) => {
            if (action.isChatInputCommand()) {
                if (action.commandName === 'set-cam-value') {
                    const name = action.options.getString('name', true)
                    const value = action.options.getString('value', true)
    
                    // validate...
    
                    console.info(`updating flag: ${name}=${value}`)
                    this.state.flags.set(name, value)

                    action.reply({ content: "value updated", ephemeral: true })
                } else if (action.commandName === 'add-streamer') {
                    const id = action.options.getString('id', true)

                    this.state.addStreamer(id)

                    action.reply({ content: 'streamer added', ephemeral: true })
                }
            }
        })
    }

    async start() {
        await this.client.login(this.config.token)
    }
}
