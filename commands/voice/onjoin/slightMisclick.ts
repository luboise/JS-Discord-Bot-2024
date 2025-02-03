import { ChannelType, VoiceChannel } from "discord.js";
import { VoiceCommand } from "../../../types";
import randRange from "../../../utils/randRange";

const MOVE_THRESHOLD = 0.5;

const moveUser: VoiceCommand = (newState) => {
	try {
		const user = newState.member?.user;
		if (!user) return;

		const val = randRange(0, 1);

		const channelJoined = newState.channel;
		if (!channelJoined) return;

		if (val > MOVE_THRESHOLD) {
			//const voiceChannels = newState.channel.guild.channels.cache
			//	.filter((c) => c.type === ChannelType.GuildVoice)
			//	.sort((a, b) => a.position - b.position)
			//	.toJSON();

			const voiceChannels = (
				Array.from(
					newState.channel.guild.channels.cache
						.filter((c) => c.type === ChannelType.GuildVoice)
						.values(),
				) as VoiceChannel[]
			).sort((a, b) => a.rawPosition - b.rawPosition);

			if (!voiceChannels) return;

			const index: number = voiceChannels.findIndex(
				(val) => val.id === channelJoined.id,
			);
			if (index == -1) return;

			const newVoiceChannel =
				voiceChannels[(index + 1) % voiceChannels.length];

			newState.member.voice.setChannel(newVoiceChannel);
		}
	} catch (error) {
		console.error(error);
		return;
	}
};

export default moveUser;
