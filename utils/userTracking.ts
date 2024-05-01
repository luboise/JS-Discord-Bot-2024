import { Guild, User } from "discord.js";

interface VoiceChannelData {
    user: User;
    timeLastJoined: number;
    timeLastLeft?: number;
}

export const UserVCList: Record<GuildUserCombo, VoiceChannelData> = {};

function getGUC(
    guild: Guild | string,
    user: User | string
): GuildUserCombo | null {
    const guildID = guild instanceof Guild ? guild.id : guild;
    const userID = user instanceof User ? user.id : user;

    const guc: GuildUserCombo = `${guildID}#${userID}`;
    if (!ValidGuildUserCombo(guc)) return null;

    return guc;
}

type GuildUserCombo = `${string}#${string}`;
export const ValidGuildUserCombo = (guc: GuildUserCombo) => {
    return guc.match(/^[0-9]+#[0-9]+$/);
};

function recordUserJoinTime(guild: Guild, user: User): void {
    const guc = getGUC(guild, user);
    if (!guc) return;

    const vcData: VoiceChannelData = { user: user, timeLastJoined: Date.now() };
    UserVCList[guc] = vcData;
}

function recordUserLeaveTime(guild: Guild, user: User): void {
    const vcData = getUserVCData(guild, user);
    if (!vcData) return;

    vcData.timeLastLeft = Date.now();
}

function deleteUserFromDB(guc: GuildUserCombo): boolean {
    if (!(guc in UserVCList)) return false;

    delete UserVCList[guc];
    return true;
}

function getUserVCData(guild: Guild, user: User): VoiceChannelData | null {
    const guc = getGUC(guild, user);
    if (guc && guc in UserVCList) return UserVCList[guc];

    return null;
}

export {
    // UserVCList,
    recordUserJoinTime,
    recordUserLeaveTime,
    deleteUserFromDB,
    getUserVCData,
};
