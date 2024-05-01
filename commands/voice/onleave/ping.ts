import { ChannelType, TextChannel } from "discord.js";
import { VoiceCommand } from "../../../types";
import { UserVCList, getUserVCData } from "../../../utils/userTracking";
import panicGetTextChannel from "../../../utils/panicGetTextChannel";

const EARLY_THRESHOLD = 10000;

const ping: VoiceCommand = (newState) => {
    const user = newState.member?.user;
    if (!user) return;

    const msg = `${newState.member?.toString()} left TOO EARLY!`;
    if (!msg) return;

    const vcData = getUserVCData(newState.guild, user);
    if (!vcData || !vcData.timeLastLeft) return;

    const userLeftTooEarly =
        vcData.timeLastLeft - vcData.timeLastJoined < EARLY_THRESHOLD;

    if (userLeftTooEarly) {
        panicGetTextChannel(newState.guild).send(msg);
    }
};

export default ping;
