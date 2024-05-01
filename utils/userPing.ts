import { User } from "discord.js";

function userPing(user: User | string): string {
    return `<@${user instanceof User ? user.id : user}>`;
}

export default userPing;
