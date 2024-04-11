require("dotenv").config();

import { Collection, REST } from "discord.js";

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

            let command: Command;

            import(filePath)
                .then((module) => {
                    command = module.default as Command;
                    if (!command) throw TypeError;

                    commands.set(command.data.name, command);
                })
                .catch((error) => {
                    console.error(error);
                });

            // Set a new item in the Collection with the key as the command name and the value as the exported module
            // if (command) {
            //     commands.set(command.data.name, command);
            // } else {
            //     console.log(
            //         `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            //     );
            //     // console.log(command);
            // }
        }
    }

    return commands;
}
