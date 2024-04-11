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

import { getCommandCollection } from "./command-handling";

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

function checkForIm(message: Message) {
    try {
        const regex = /(i'?m\s+)/i;
        const regex2 = /(i\s+am\s+)/i;

        const matches =
            message.content.match(regex) || message.content.match(regex2);

		console.log(matches);

        if (matches && matches.index !== undefined) {
            const wantedIndex = matches.index + matches[0].length;
            let newName = message.content.substring(wantedIndex);

            if (newName.length === 0) {
                throw Error("Bad length.");
            } else if (newName.length > 32) {
				newName = newName.slice(0, 31);
			}

            message.member?.setNickname(newName);
            message.react("👍");
        }
    } catch (e) {
        console.error(e);
        return;
    }
}

async function checkForYoure(message: Message) {
    if (
        message.type !== MessageType.Reply ||
        message.reference === null ||
        message.reference.messageId === undefined
    )
        return;

    const repliedMessage = await message.channel.messages.fetch(
        message.reference.messageId
    );

	// Prevent self replies
	if (message.member === repliedMessage.member) return;

    const regex = /(you'?re)\s+/i;
	const regex2 = /^(your)\s+/i;

    const matches = message.content.match(regex) || message.content.match(regex2);

    if (matches && matches.index !== undefined) {
        const wantedIndex = matches.index + matches[0].length;
        const newName = message.content.substring(
            wantedIndex,
            wantedIndex + 32
        );

        if (newName.length === 0) {
            throw Error("Bad length.");
        }

        repliedMessage.member?.setNickname(newName);
        repliedMessage.react("🤭");
        message.react("🤯");
    }
}

client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return;
    try {
        checkForIm(message);
        checkForYoure(message);
    } catch (e) {
        console.error(e);
    }
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
