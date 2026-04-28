import { ChatInputCommandInteraction } from "discord.js";
import User from "../models/User.ts";

export async function handleDaily(interaction: ChatInputCommandInteraction) {
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
    if (
      existing.lastDaily &&
      Date.now() - existing.lastDaily.getTime() < 24 * 60 * 60 * 1000
    ) {
      return interaction.reply({
        content: "⚠️ You've already claimed your daily reward today.",
        ephemeral: true,
      });
    }
    // Update username in case it changed
    existing.username = discordUser.username;

    // Example daily reward
    existing.pcash += 100;

    await existing.save();

    return interaction.reply({
      content: "✅ Daily reward claimed! You earned 100 pcash.",
    });
  } catch (error) {
    console.error("Error updating user:", error);

    return interaction.reply({
      content: "❌ An error occurred while claiming your daily reward.",
      ephemeral: true,
    });
  }
}
