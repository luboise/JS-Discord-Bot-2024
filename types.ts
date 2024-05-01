import {
    ChatInputCommandInteraction,
    Collection,
    Message,
    SlashCommandBuilder,
    VoiceState,
} from "discord.js";

export type ExecutionFunction = (
    interaction: ChatInputCommandInteraction
) => Promise<void> | void;

export type Command =
    | {
          data: SlashCommandBuilder;
          execute: ExecutionFunction;
      }
    | undefined;

export type CommandCollection = Collection<string, Command>;

export type MessageCommand = (message: Message) => void;
export type VoiceCommand = (newState: VoiceState) => void;
