import { Message } from "discord.js";
import { MessageCommand } from "../../types";
import userPing from "../../utils/userPing";

// require("dotenv").config();

const reactToPing: MessageCommand = (message: Message) => {
    if (
        message.content != userPing(process.env.APP_ID || "") ||
        !message.member
    ) {
        return false;
    }

    message.reply(`${message.member.user}`);
};

export default reactToPing;
