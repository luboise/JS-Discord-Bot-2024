import { ChannelType, Guild, TextChannel } from "discord.js";

function panicGetTextChannel(g: Guild): TextChannel {
    return g.channels.cache
        .filter((chnl) => chnl.type == ChannelType.GuildText)
        .at(0) as TextChannel;
}

export default panicGetTextChannel;
