import { Message } from "discord.js";
import { MessageCommand } from "../../types";

const REACTION_LIST: Array<{ re: RegExp; reactions: Array<string> }> = [
    { re: /a(ct|c?k?sh)ually/i, reactions: ["🤓"] },
];

const reactOnRegex: MessageCommand = (message: Message) => {
    REACTION_LIST.forEach((reaction) => {
        if (reaction.re.test(message.content)) {
            reaction.reactions.forEach((emoji) => {
                message.react(emoji);
            });
        }
    });
};

export default reactOnRegex;
