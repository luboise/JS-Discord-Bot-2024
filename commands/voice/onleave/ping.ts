import { ChannelType, Guild, TextChannel, User } from "discord.js";
import { VoiceCommand } from "../../../types";
import { UserVCList, getUserVCData } from "../../../utils/userTracking";
import panicGetTextChannel from "../../../utils/panicGetTextChannel";
import randRange from "../../../utils/randRange";

const EARLY_THRESHOLD = 10000;
const MIN_PING_FREQUENCY = 10 * 1000;
const MAX_PING_FREQUENCY = 25 * 1000;

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

async function ghostPing(channel: TextChannel, user: User) {
    const msg = await channel.send(`${user}`);
    msg.delete();
}

const startPingLoop = async (
    channel: TextChannel,
    guild: Guild,
    user: User
) => {
    setTimeout(() => {
        const pingLoop = async () => {
            const vcData = getUserVCData(guild, user);
            if (!vcData || vcData.timeLastLeft! > 0) {
                ghostPing(channel, user);

                setTimeout(
                    pingLoop,
                    randRange(MIN_PING_FREQUENCY, MAX_PING_FREQUENCY)
                );
            }
            // else {
            //     const msg = await channel.send(`${user} 👍`);
            //     msg.delete();
            // }
        };
        pingLoop();
    }, 1000 * 60);
};

export default ping;
