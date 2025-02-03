import { ChannelType, GuildMember, User, VoiceChannel } from "discord.js";
import { VoiceCommand } from "../../../types";
import randBool from "../../../utils/randBool";

const MOVE_THRESHOLD = 0.85;

export const moveUserRecursive = async (
	member: GuildMember,
	index: number,
	voiceChannels: VoiceChannel[],
) => {
	try {
		const user = member.user;
		if (!user) return;

		//const voiceChannels = newState.channel.guild.channels.cache
		//	.filter((c) => c.type === ChannelType.GuildVoice)
		//	.sort((a, b) => a.position - b.position)
		//	.toJSON();

		if (!voiceChannels) return;

		let newIndex = index - 1 + (randBool(0.5) ? 0 : 2);
		if (newIndex < 0) newIndex = voiceChannels.length - 1;
		newIndex %= voiceChannels.length;

		const newVoiceChannel = voiceChannels[newIndex];

		await member.voice.setChannel(newVoiceChannel);

		if (randBool(MOVE_THRESHOLD)) {
			setTimeout(() => {
				moveUserRecursive(member, newIndex, voiceChannels);
			}, 350);
		}
	} catch (error) {
		console.error(error);
		return;
	}
};

const moveUser: VoiceCommand = (newState) => {
	try {
		const channelJoined = newState.channel;
		if (!channelJoined || !newState.member) return;

		if (randBool(MOVE_THRESHOLD)) {
			const voiceChannels = (
				Array.from(
					newState.channel.guild.channels.cache
						.filter((c) => c.type === ChannelType.GuildVoice)
						.values(),
				) as VoiceChannel[]
			).sort((a, b) => a.rawPosition - b.rawPosition);

			const index: number = voiceChannels.findIndex(
				(val) => val.id === channelJoined.id,
			);
			if (index == -1) return;

			moveUserRecursive(newState.member, index, voiceChannels);
		}
	} catch (error) {
		console.error(error);
		return;
	}
};

export default moveUser;
