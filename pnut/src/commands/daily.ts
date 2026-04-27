import { InteractionResponseType } from "discord-interactions";
import User from "../models/User.ts";

export async function handleDaily(
  req: {
    body: {
      member?: { user?: { id: string; username: string } };
      user?: { id: string; username: string };
    };
  },
  res: any,
) {
  const discordUser = req.body.member?.user || req.body.user;

  if (!discordUser?.id) {
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: "❌ Could not identify your Discord account." },
    });
  }

  try {
    const existing = await User.findOne({
      discordID: discordUser.id,
    });

    if (!existing) {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "⚠️ You need to register first using /register.",
        },
      });
    }

    existing.username = discordUser.username;

    // Example daily reward:
    existing.pcash += 100;

    await existing.save();
  } catch (error) {
    console.error("Error updating user:", error);

    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "❌ An error occurred while claiming your daily reward.",
      },
    });
  }

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: "✅ Daily reward claimed! You earned 100 pcash.",
    },
  });
}
