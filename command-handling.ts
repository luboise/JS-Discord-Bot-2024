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

export function getCommands<T>(commandPath: string | Array<string>): Array<T> {
    const commands: Array<T> = [];

    const commandFolder: string = Array.isArray(commandPath)
        ? commandPath.reduce(
              (a, b) => path.join(a, b),
              path.join(__dirname, "commands")
          )
        : commandPath;

    const commandFiles = fs
        .readdirSync(commandFolder)
        .filter((file) => file.endsWith(".ts"));
    for (const file of commandFiles) {
        const filePath = path.join(commandFolder, file);

        const command = require(filePath).default as T;
        if (!command) {
            throw TypeError(`Bad command found: ${command}`);
        }

        commands.push(command);
    }

    return commands;
}
