require("dotenv").config();

import {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    Message,
    MessageFlags,
    MessageType,
    REST,
    Routes,
} from "discord.js";

import { getCommandCollection, getOnMessageCommands } from "./command-handling";

import { Command, CommandCollection } from "./types";

declare module "discord.js" {
    interface Client {
        commands: Collection<string, Command>;
    }
}

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
    ],
});

const commands = getCommandCollection();

client.commands = commands;

// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient: Client<true>) => {
    console.log("Client ready. Deploying commands now...");
    deployCommands(commands);
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(
            `No command matching ${interaction.commandName} was found.`
        );
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    }
});

const onMessageCommands = getOnMessageCommands();
client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return;
    onMessageCommands.forEach((command)=>{command(message)})
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

async function deployCommands(commands: CommandCollection) {
    try {
        console.log(
            `Started refreshing ${commands.size} application (/) commands.`
        );

        // Construct and prepare an instance of the REST module
        const rest = new REST().setToken(process.env.DISCORD_TOKEN || "");

        const commandList = commands.map((command) => command?.data.toJSON());

        const guildList: Array<string> = client.guilds.cache.map(
            (guild) => guild.id
        );

        guildList.forEach(async (guildId: string) => {
            // The put method is used to fully refresh all commands in the guild with the current set
            const data: any = await rest.put(
                Routes.applicationGuildCommands(
                    process.env.APP_ID || "",
                    guildId
                ),
                { body: commandList }
            );
            console.log(
                `Successfully reloaded ${data.length} application (/) commands for guild ${guildId}.`
            );
        });
        console.log(`Successfully reloaded application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
}
