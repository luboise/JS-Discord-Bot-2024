import { ChannelType, TextChannel } from "discord.js";
import { VoiceCommand } from "../../types";

const trackJoin: VoiceCommand = (newState) => {
    const msg = `${newState.member?.toString()} joined.`;
    if (!msg) return;

    const channel = newState.guild.channels.cache
        .filter((chnl) => chnl.type == ChannelType.GuildText)
        .at(0) as TextChannel;

    channel.send(msg);
};

export default trackJoin;
