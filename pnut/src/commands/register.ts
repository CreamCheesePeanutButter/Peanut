import { InteractionResponseType } from "discord-interactions";
import User from "../models/User.ts";
export async function handleRegister(
  req: { body: { member: { user: { id: string; username: string } } } },
  res: any,
) {
  const discordUser = req.body.member.user;

  const existing = await User.findOne({
    discordID: discordUser.id,
  } as any);

  if (existing) {
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: "⚠️ Already registered" },
    });
  }

  await User.create({
    discordID: discordUser.id,
    username: discordUser.username,
    pcash: 0,
    isAdmin: false,
  } as any);

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content: "✅ Registered successfully!" },
  });
}
