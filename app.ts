require("dotenv").config();

import { recordUserJoinTime, recordUserLeaveTime } from "./utils/userTracking";

import {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	Message,
	REST,
	Routes,
} from "discord.js";

import { getCommandCollection, getCommands } from "./command-handling";

import {
	Command,
	CommandCollection,
	MessageCommand,
	VoiceCommand,
} from "./types";

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
		GatewayIntentBits.GuildVoiceStates,
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
			`No command matching ${interaction.commandName} was found.`,
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

const onMessageCommands = getCommands<MessageCommand>(["onmessage"]);
client.on(Events.MessageCreate, async (message: Message) => {
	if (message.author.bot) return;
	onMessageCommands.forEach((command) => {
		command(message);
	});
});

const onJoin = getCommands<VoiceCommand>(["voice", "onjoin"]);
const onLeave = getCommands<VoiceCommand>(["voice", "onleave"]);

enum UserVoiceEvent {
	JOINED,
	LEFT,
	OTHER,
}

client.on(Events.VoiceStateUpdate, (oldState, newState) => {
	if (!newState.member || newState.member.user.bot) return;

	let ve: UserVoiceEvent;

	if (oldState.channelId === null && newState.channelId !== null) {
		ve = UserVoiceEvent.JOINED;
	} else if (oldState.channelId !== null && newState.channelId === null) {
		ve = UserVoiceEvent.LEFT;
	} else {
		ve = UserVoiceEvent.OTHER;
	}

	if (ve === UserVoiceEvent.JOINED) {
		recordUserJoinTime(newState.guild, newState.member.user);
		onJoin.forEach((command) => {
			command(newState);
		});
	} else if (ve === UserVoiceEvent.LEFT) {
		recordUserLeaveTime(newState.guild, newState.member.user);
		onLeave.forEach((command) => {
			command(newState);
		});
	}
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

async function deployCommands(commands: CommandCollection) {
	try {
		console.log(
			`Started refreshing ${commands.size} application (/) commands.`,
		);

		// Construct and prepare an instance of the REST module
		const rest = new REST().setToken(process.env.DISCORD_TOKEN || "");

		const commandList = commands.map((command) => command?.data.toJSON());

		const guildList: Array<string> = client.guilds.cache.map(
			(guild) => guild.id,
		);

		guildList.forEach(async (guildId: string) => {
			// The put method is used to fully refresh all commands in the guild with the current set
			const data: any = await rest.put(
				Routes.applicationGuildCommands(
					process.env.APP_ID || "",
					guildId,
				),
				{ body: commandList },
			);
			console.log(
				`Successfully reloaded ${data.length} application (/) commands for guild ${guildId}.`,
			);
		});
		console.log(`Successfully reloaded application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
}
