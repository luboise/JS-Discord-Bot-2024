import { Message, MessageType } from "discord.js";
import { MessageCommand } from "../../types";

const checkForYoure: MessageCommand = async (message: Message) =>  {
    if (
        message.type !== MessageType.Reply ||
        message.reference === null ||
        message.reference.messageId === undefined
    )
        return;

    const repliedMessage = await message.channel.messages.fetch(
        message.reference.messageId
    );

	// Prevent self replies
	if (message.member === repliedMessage.member || repliedMessage.member?.id === message.guild?.ownerId) return;

    const regex = /(you'?re)\s+/i;
	const regex2 = /^(your)\s+/i;

    let matches = message.content.match(regex);
	if (!matches) matches = message.content.match(regex2);

    if (matches && matches.index !== undefined) {
        const wantedIndex = matches.index + matches[0].length;
        const newName = message.content.substring(
            wantedIndex,
            wantedIndex + 32
        );

        if (newName.length === 0) {
            throw Error("Bad length.");
        }

		try {
			repliedMessage.member?.setNickname(newName);
        	repliedMessage.react("🤭");
        	message.react("🤯");
		} catch (e) {
			console.error(e);
			return;
		}
    }
}

export default checkForYoure;