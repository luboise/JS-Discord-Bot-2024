import { Message } from "discord.js";
import { MessageCommand } from "../../types";
import normaliseWhiteSpace from "../../utils/normaliseWhiteSpace";

const checkForQuestion: MessageCommand = async (message: Message) => {
    if (!message.content) return;

    const messageText = normaliseWhiteSpace(message.content);

    const regex = /(why|how) do(es)? ([^\.\?]+)[^\.\?]?$/i;
    const matches = messageText.match(regex);

    if (!matches || matches.index === undefined) return;

    const question = messageText.replaceAll("?", "%3F").replaceAll(" ", "+");
    const reply = `https://letmegooglethat.com/?q=${question}`;

    if (reply && reply.length) {
        message.reply(reply);
    } else
        console.log(
            "Unable to send empty message for original message: ",
            message.content
        );
};

export default checkForQuestion;
