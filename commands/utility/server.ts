import {
    ChatInputCommandInteraction, SlashCommandBuilder
} from 'discord.js'
import { Command, ExecutionFunction } from '../../types'

const data = new SlashCommandBuilder()
    .setName('server')
    .setDescription('Provides information about the server.')

const execute: ExecutionFunction = async (
    interaction: ChatInputCommandInteraction
) => {
    await interaction.reply(
        `This server is ${interaction.guild?.name} and has ${interaction.guild?.memberCount} members.`
    )
}

const c: Command = {
    data: data,
    execute: execute,
}

export default c
