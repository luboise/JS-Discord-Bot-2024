require("dotenv").config();

import { Collection } from "discord.js";

import * as fs from "node:fs";
import * as path from "node:path";

import {
    Command,
    CommandCollection,
    MessageCommand,
    VoiceCommand,
} from "./types";

export function getCommandCollection(): CommandCollection {
    const commands: CommandCollection = new Collection();

    const foldersPath = path.join(__dirname, "commands", "active");
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs
            .readdirSync(commandsPath)
            .filter((file) => file.endsWith(".ts"));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);

            const command = require(filePath).default as Command;
            if (!command) {
                throw TypeError(`Bad command found: ${command}`);
            }

            commands.set(command.data.name, command);
        }
    }

    return commands;
}

export function getOnMessageCommands(): Array<MessageCommand> {
    const commands: Array<MessageCommand> = [];

    const commandFolder = path.join(__dirname, "commands", "onmessage");

    const commandFiles = fs
        .readdirSync(commandFolder)
        .filter((file) => file.endsWith(".ts"));
    for (const file of commandFiles) {
        const filePath = path.join(commandFolder, file);

        const command = require(filePath).default as MessageCommand;
        if (!command) {
            throw TypeError(`Bad command found: ${command}`);
        }

        commands.push(command);
    }

    return commands;
}

export function getOnJoinCommands(): Array<VoiceCommand> {
    const commands: Array<VoiceCommand> = [];

    const commandFolder = path.join(__dirname, "commands", "voice", "onjoin");

    const commandFiles = fs
        .readdirSync(commandFolder)
        .filter((file) => file.endsWith(".ts"));
    for (const file of commandFiles) {
        const filePath = path.join(commandFolder, file);

        const command = require(filePath).default as VoiceCommand;
        if (!command) {
            throw TypeError(`Bad command found: ${command}`);
        }

        commands.push(command);
    }

    return commands;
}

export function getOnLeaveCommands(): Array<VoiceCommand> {
    const commands: Array<VoiceCommand> = [];

    const commandFolder = path.join(__dirname, "commands", "voice", "onleave");

    const commandFiles = fs
        .readdirSync(commandFolder)
        .filter((file) => file.endsWith(".ts"));
    for (const file of commandFiles) {
        const filePath = path.join(commandFolder, file);

        const command = require(filePath).default as VoiceCommand;
        if (!command) {
            throw TypeError(`Bad command found: ${command}`);
        }

        commands.push(command);
    }

    return commands;
}
