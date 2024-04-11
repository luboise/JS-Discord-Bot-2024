require("dotenv").config();

import { Collection } from "discord.js";

import * as fs from "node:fs";
import * as path from "node:path";

import { Command, CommandCollection } from "./types";

export function getCommandCollection(): CommandCollection {
    const commands: CommandCollection = new Collection();

    const foldersPath = path.join(__dirname, "commands");
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs
            .readdirSync(commandsPath)
            .filter((file) => file.endsWith(".ts"));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);

            const command = require(filePath).default as Command;
            if (!command) {throw TypeError(`Bad command found: ${command}`);}
            
            commands.set(command.data.name, command);
        }
    }

    return commands;
}
