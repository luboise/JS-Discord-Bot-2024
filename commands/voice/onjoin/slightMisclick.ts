import { ChannelType, VoiceChannel } from "discord.js";
import { VoiceCommand } from "../../../types";
import randBool from "../../../utils/randBool";

const MOVE_THRESHOLD = 0.5;

const moveUser: VoiceCommand = (newState) => {
	try {
		const user = newState.member?.user;
		if (!user) return;

		const channelJoined = newState.channel;
		if (!channelJoined) return;

		if (randBool(MOVE_THRESHOLD)) {
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

			let newIndex = index - 1 + (randBool(0.5) ? 0 : 2);
			if (newIndex < 0) newIndex = voiceChannels.length - 1;
			newIndex %= voiceChannels.length;

			const newVoiceChannel = voiceChannels[newIndex];

			newState.member.voice.setChannel(newVoiceChannel);
		}
	} catch (error) {
		console.error(error);
		return;
	}
};

export default moveUser;
