import { Message } from "discord.js";
import { MessageCommand } from "../../types";

const checkForIm: MessageCommand = (message: Message) => {
    try {
		if (message.member?.id === message.guild?.ownerId) return;

        const regex = /(i'?m\s+)/i;
        const regex2 = /(i\s+am\s+)/i;

        const matches =
            message.content.match(regex) || message.content.match(regex2);

        if (matches && matches.index !== undefined) {
            const wantedIndex = matches.index + matches[0].length;
            let newName = message.content.substring(wantedIndex);

            if (newName.length === 0) {
                throw Error("Bad length.");
            } else if (newName.length > 32) {
				newName = newName.slice(0, 31);
			}

            message.member?.setNickname(newName);
            message.react("👍");
        }
    } catch (e) {
        console.error(e);
        return;
    }
}

export default checkForIm;