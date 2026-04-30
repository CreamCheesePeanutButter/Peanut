import { ChatInputCommandInteraction, AttachmentBuilder } from "discord.js";
import User from "../models/User.ts";
import path from "path";

export async function handleCash(interaction: ChatInputCommandInteraction) {
  const discordUser = interaction.user;

  if (!discordUser?.id) {
    return interaction.reply({
      content: "❌ Could not identify your Discord account.",
      ephemeral: true,
    });
  }

  try {
    const existing = await User.findOne({
      discordId: discordUser.id,
    });

    if (!existing) {
      return interaction.reply({
        content: "⚠️ You need to register first using /register.",
        ephemeral: true,
      });
    }

    existing.username = discordUser.username;
    await existing.save();

    // Local image path
    const imagePath = path.join(
      process.cwd(),
      "src",
      "res",
      "mahiru_sleep.png",
    );

    const attachment = new AttachmentBuilder(imagePath, {
      name: "mahiru_sleep.png",
    });

    return interaction.reply({
      content: `💰 ${existing.username}, you have ${existing.pcash} pcash.`,
      embeds: [
        {
          title: "Cash Balance",
          description: `You have **${existing.pcash}** pcash.`,
          image: {
            url: "attachment://mahiru_sleep.png",
          },
          color: 0x57f287,
        },
      ],
      files: [attachment],
    });
  } catch (error) {
    console.error("Error checking user cash:", error);

    return interaction.reply({
      content: "❌ An error occurred while checking your cash balance.",
      ephemeral: true,
    });
  }
}
