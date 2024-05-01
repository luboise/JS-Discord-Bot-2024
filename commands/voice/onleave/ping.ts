import { ChannelType, Guild, TextChannel, User } from "discord.js";
import { VoiceCommand } from "../../../types";
import { UserVCList, getUserVCData } from "../../../utils/userTracking";
import panicGetTextChannel from "../../../utils/panicGetTextChannel";

const EARLY_THRESHOLD = 10000;
const PING_FREQUENCY = 1000;

const ping: VoiceCommand = (newState) => {
    const user = newState.member?.user;
    if (!user) return;

    const msg = `${user} left TOO EARLY!`;
    if (!msg) return;

    const vcData = getUserVCData(newState.guild, user);
    if (!vcData || !vcData.timeLastLeft) return;

    const userLeftTooEarly =
        vcData.timeLastLeft - vcData.timeLastJoined < EARLY_THRESHOLD;

    if (userLeftTooEarly) {
        const channel = panicGetTextChannel(newState.guild);
        startPingLoop(channel, newState.guild, user);
    }
};

const startPingLoop = async (
    channel: TextChannel,
    guild: Guild,
    user: User
) => {
    channel.send(`${user} OI`);

    const pingLoop = async () => {
        const vcData = getUserVCData(guild, user);
        if (!vcData || vcData.timeLastLeft! > 0) {
            channel.send(`${user}`);
            setTimeout(pingLoop, PING_FREQUENCY);
        } else {
            channel.send(`${user} 👍`);
        }
    };

    setTimeout(pingLoop, PING_FREQUENCY);
};

export default ping;
