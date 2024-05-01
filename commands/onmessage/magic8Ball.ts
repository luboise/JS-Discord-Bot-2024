import { Message } from "discord.js";
import { MessageCommand } from "../../types";

const REACTIONS = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful.",
];

const magic8Ball: MessageCommand = (message: Message) => {
    const response = `${
        REACTIONS[Math.floor(Math.random() * REACTIONS.length)]
    }`;
    if (message.content.endsWith("?")) {
        message.reply(`🎱 ～ "${response}"`);
    }
};

export default magic8Ball;
