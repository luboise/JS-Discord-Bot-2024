require('dotenv').config()

import {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    SlashCommandBuilder,
} from 'discord.js'

import * as fs from 'node:fs'
import * as path from 'node:path'

import { Command, ExecutionFunction } from './types'

type CommandCollection = Collection<string, Command>;

interface Client2 extends Client {
    commands: CommandCollection
}

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] }) as Client2

client.commands = getCommandCollection()

// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient: Client<true>) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN)

function getCommandCollection(): CommandCollection {
    const commands: CommandCollection = new Collection()

    const foldersPath = path.join(__dirname, 'commands')
    const commandFolders = fs.readdirSync(foldersPath)

	console.debug("test");

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder)
        const commandFiles = fs
            .readdirSync(commandsPath)
            .filter((file) => file.endsWith('.ts'))
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file)
            const command = require(filePath) as Command;
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                commands.set(command.data.name, command)
            } else {
                console.log(
                    `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
                );
				console.debug(command);
            }
        }
    }

    return commands;
}
