import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export type ExecutionFunction = (interaction: ChatInputCommandInteraction) => Promise<void> | void;

export interface Command {
	data: SlashCommandBuilder;
	execute: ExecutionFunction;
}